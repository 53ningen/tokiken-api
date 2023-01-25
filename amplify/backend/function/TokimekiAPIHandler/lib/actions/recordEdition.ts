import { listRecordEditions } from '../sheets'
import { RecordType } from './record'

// GET /editions/[catalogNumber]
export const getRecordEditionAction = async (catalogNumber: string) => {
  const editions = await listRecordEditions()
  const edition = editions.find((s) => s.catalogNumber === catalogNumber)
  if (edition) {
    const res = toResponse(edition)
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `record edition: ${catalogNumber} not found` }),
    }
  }
}

// GET /editions
export const listRecordEditionsAction = async () => {
  const editions = await listRecordEditions()
  const res = editions.map((e) => toResponse(e))
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

export interface RecordEdition {
  catalogNumber: string
  editionReleaseDate: string
  recordId: string
  recordName: string
  editionName: string
  editionPrice: string
  editionASIN: string
  recordType: RecordType
  recordLabel: string
  editionCoverUrl: string
  editionProductUrl: string
}

export interface RecordEditionResponse {
  catalogNumber: string
  recordId: string
  releaseDate: string
  name: string
  price: string
  asin?: string
  type: RecordType
  label: string
}

export const toResponse = (r: RecordEdition): RecordEditionResponse => {
  return {
    catalogNumber: r.catalogNumber,
    recordId: r.recordId,
    releaseDate: r.editionReleaseDate,
    name: r.recordName,
    price: r.editionPrice,
    asin: r.editionASIN,
    type: r.recordType,
    label: r.recordLabel,
  }
}
