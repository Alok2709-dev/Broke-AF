// Parser stubs — implement format-specific logic and confidence heuristics here
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import pdf from 'pdf-parse'

export async function parseCSV(buffer: Buffer) {
  const text = buffer.toString('utf-8')
  const results = Papa.parse(text, { header: true })
  return { type: 'csv', rows: results.data }
}

export async function parseXLSX(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet)
  return { type: 'xlsx', rows }
}

export async function parsePDF(buffer: Buffer) {
  // pdf-parse returns text; advanced parsing (tables) must be added
  const data = await pdf(buffer)
  return { type: 'pdf', text: data.text }
}

export async function runOCR(buffer: Buffer) {
  // Placeholder: lazy-load tesseract when needed
  // const Tesseract = await import('tesseract.js')
  return { text: 'ocr not implemented' }
}
