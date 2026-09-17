-- Atomic write path for a completed assessment submission.
--
-- Scoring itself happens in trusted Next.js server code (lib/scoring.ts),
-- never in the browser or in SQL — this function only persists an
-- already-computed result. Wrapping the lead + responses + scores insert in
-- one function call means a failure partway through (e.g. a constraint
-- violation) rolls back the entire submission instead of leaving an
-- orphaned lead with missing responses/scores.
create or replace function submit_assessment(
  p_name text,
  p_whatsapp_number text,
  p_email text,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_responses jsonb,           -- [{ "question_id": "q1", "selected_option": "A" }, ...]
  p_scores jsonb,               -- [{ "pattern_name": "overthinking", "score_value": 18 }, ...]
  p_primary_pattern pattern_id,
  p_secondary_pattern pattern_id
)
returns uuid
language plpgsql
as $$
declare
  v_lead_id uuid;
  v_response jsonb;
  v_score jsonb;
begin
  insert into leads (
    name, whatsapp_number, email,
    utm_source, utm_medium, utm_campaign,
    assessment_completed, primary_pattern, secondary_pattern
  )
  values (
    p_name, p_whatsapp_number, p_email,
    p_utm_source, p_utm_medium, p_utm_campaign,
    true, p_primary_pattern, p_secondary_pattern
  )
  returning id into v_lead_id;

  for v_response in select * from jsonb_array_elements(p_responses)
  loop
    insert into responses (lead_id, question_id, selected_option)
    values (v_lead_id, v_response ->> 'question_id', v_response ->> 'selected_option');
  end loop;

  for v_score in select * from jsonb_array_elements(p_scores)
  loop
    insert into scores (lead_id, pattern_name, score_value)
    values (v_lead_id, (v_score ->> 'pattern_name')::pattern_id, (v_score ->> 'score_value')::integer);
  end loop;

  return v_lead_id;
end;
$$;

-- Postgres grants EXECUTE on new functions to PUBLIC by default — revoke
-- that and grant only to service_role, since this must never be callable
-- directly from the browser (anon key) or a signed-in user's session
-- (authenticated key), only from server-side code via the service-role key.
revoke execute on function submit_assessment(
  text, text, text, text, text, text, jsonb, jsonb, pattern_id, pattern_id
) from public, anon, authenticated;

grant execute on function submit_assessment(
  text, text, text, text, text, text, jsonb, jsonb, pattern_id, pattern_id
) to service_role;
