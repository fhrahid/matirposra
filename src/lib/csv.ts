// Minimal dependency-free CSV utilities for product import/export.

export const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

// Parse a CSV string into an array of row objects keyed by the header row.
// Handles quoted fields, escaped double-quotes ("") and commas/newlines inside quotes.
export function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  // Normalise line endings and strip a leading UTF-8 BOM if present.
  const input = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  // Flush the final field/row.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const records: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    // Skip blank lines.
    if (rows[r].length === 1 && rows[r][0].trim() === "") continue;
    const record: Record<string, string> = {};
    headers.forEach((header, c) => {
      record[header] = (rows[r][c] ?? "").trim();
    });
    records.push(record);
  }

  return records;
}

// Escape a single CSV cell value.
function escapeCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Build a CSV string from an array of objects given an ordered list of columns.
export function buildCSV(columns: string[], records: Record<string, unknown>[]): string {
  const lines = [columns.join(",")];
  for (const record of records) {
    lines.push(columns.map((col) => escapeCell(record[col])).join(","));
  }
  return lines.join("\n");
}
