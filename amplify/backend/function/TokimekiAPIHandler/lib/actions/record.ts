import { listRecords } from '../sheets'

// GET /records/[recordId]
export const getRecordAction = async (recordId: string) => {
  const records = await listRecords()
  const record = records.find((s) => s.recordId === recordId)
  if (record) {
    const res = toResponse(record)
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `record: ${recordId} not found` }),
    }
  }
}

// GET /records
export const listRecordsAction = async () => {
  const records = await listRecords()
  const res = records.map((r) => toResponse(r))
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

export type RecordType = 'SINGLE' | 'ALBUM' | 'MINI_ALBUM'

export interface Record {
  recordId: string
  recordName: string
  recordType: RecordType
  recordLabel: string
  recordProductUrl: string
  recordAppleMusicId: string
}

export interface RecordResponse {
  id: string
  name: string
  type: RecordType
  productUrl?: string
  appleMusicId?: string
}
export const toResponse = (r: Record): RecordResponse => {
  return {
    id: r.recordId,
    name: r.recordName,
    type: r.recordType,
    productUrl: getValue(r.recordProductUrl),
    appleMusicId: getValue(r.recordAppleMusicId),
  }
}

const getValue = (s: string) => {
  return s && s !== '' ? s : undefined
}
