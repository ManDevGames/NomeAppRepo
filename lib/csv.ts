/**
 * Minimal RFC 4180-ish CSV serializer. A field is quoted whenever it
 * contains a comma, double quote, or newline; embedded double quotes are
 * escaped by doubling them.
 */
function escapeCsvField(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCsv(headers: string[], rows: (string | number | boolean | null)[][]): string {
  const lines = [headers.map(escapeCsvField).join(',')]
  for (const row of rows) {
    lines.push(row.map(escapeCsvField).join(','))
  }
  // CRLF per RFC 4180, and a leading UTF-8 BOM so Excel opens the file
  // without mangling non-ASCII (Hindi) text.
  return '﻿' + lines.join('\r\n')
}
