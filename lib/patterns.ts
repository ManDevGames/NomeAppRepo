import patternsData from '@/data/patterns.json'
import type { Pattern, PatternId } from '@/types'

const patterns = patternsData.patterns as unknown as Pattern[]

export function getPatternById(id: PatternId): Pattern | undefined {
  return patterns.find((p) => p.id === id)
}

export function getAllPatterns(): Pattern[] {
  return patterns
}
