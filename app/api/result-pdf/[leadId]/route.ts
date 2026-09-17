import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { getPublicResult } from '@/lib/result'
import { getPatternById } from '@/lib/patterns'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Renders the actual /assessment/result/[leadId] page (the same one users
 * see in-browser) through a headless Chromium and prints it to PDF, rather
 * than building a separate PDF layout with a JS PDF library. That was tried
 * first with @react-pdf/renderer — its fontkit text-shaping engine crashes
 * on real Devanagari content (a known limitation with Indic mark/anchor
 * positioning, not something fixable by swapping fonts). A real browser
 * already shapes that text correctly, since that's exactly what renders the
 * web page's Hindi content today — so reusing it here sidesteps the whole
 * class of bug and stays visually identical to the page by construction.
 */
export async function GET(request: Request, { params }: { params: { leadId: string } }) {
  const { searchParams, origin } = new URL(request.url)
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en'

  const result = await getPublicResult(params.leadId)
  if (!result) {
    return NextResponse.json({ error: 'Result not found' }, { status: 404 })
  }
  const primary = getPatternById(result.primaryPattern)
  const secondary = getPatternById(result.secondaryPattern)
  if (!primary || !secondary) {
    return NextResponse.json({ error: 'Result not found' }, { status: 404 })
  }

  const targetUrl = `${origin}/assessment/result/${params.leadId}?lang=${lang}`

  let browser
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 900, height: 1200 })
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 20000 })
    // The language/theme providers apply their client-side state a tick
    // after mount (see LanguageContext/ThemeProvider) — networkidle0 alone
    // can land just before that, so wait for the heading text itself.
    await page.waitForSelector('h1', { timeout: 5000 })

    const pdfBuffer = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: { top: '24px', bottom: '24px', left: '0px', right: '0px' },
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="relationship-pattern-result.pdf"',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (err) {
    console.error('result-pdf: rendering failed', err)
    return NextResponse.json({ error: 'Could not generate PDF' }, { status: 500 })
  } finally {
    await browser?.close()
  }
}
