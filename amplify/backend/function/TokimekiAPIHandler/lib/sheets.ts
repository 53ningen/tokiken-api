import { Artist } from './actions/artist'
import { Credit } from './actions/credit'
import { Record } from './actions/record'
import { RecordEdition } from './actions/recordEdition'
import { Song } from './actions/song'
import { Track } from './actions/track'
import { apiKey } from './index'

const songSheetId = '13Y4wbnnfY23aPUnB6n4KELVfElu1z3j5OUE9gRy9EBU'
const useCache = true
const cache = new Map<string, object>()

interface SheetValuesResponse {
  range: string
  majorDimension: string
  values: string[][]
}

export const listRecords = async () => {
  const cacheKey = 'Records'
  if (useCache && cache.has(cacheKey)) {
    console.log('RECORDS_CACHE_HIT: true')
    return cache.get(cacheKey) as Record[]
  }
  const range = 'Record!A1:F200'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${songSheetId}/values/${range}?key=${apiKey}`
  const f = await fetch(url)
  const res = (await f.json()) as SheetValuesResponse
  const [columnNames, ...data] = res.values
  const records = data.map((d) => {
    var obj: any = {}
    for (let i = 0; i < columnNames.length; i++) {
      obj[columnNames[i]] = d[i] || ''
    }
    return obj as Record
  })
  cache.set(cacheKey, records)
  console.log('RECORDS_CACHE_HIT: false')
  return records
}

export const listRecordEditions = async (recordId?: string): Promise<RecordEdition[]> => {
  const cacheKey = 'RecordEditions'
  if (useCache && cache.has(cacheKey)) {
    const editions = cache.get(cacheKey) as RecordEdition[]
    console.log('RECORD_EDITIONS_CACHE_HIT: true')
    return recordId ? editions.filter((r) => r.recordId === recordId) : editions
  }
  const range = 'RecordEdition!A1:K300'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${songSheetId}/values/${range}?key=${apiKey}`
  const f = await fetch(url)
  const res = (await f.json()) as SheetValuesResponse
  const [columnNames, ...data] = res.values
  const editions = data.map((d) => {
    var obj: any = {}
    for (let i = 0; i < columnNames.length; i++) {
      obj[columnNames[i]] = d[i] || ''
    }
    return obj as RecordEdition
  })
  cache.set(cacheKey, editions)
  console.log('RECORD_EDITIONS_CACHE_HIT: false')
  return recordId ? editions.filter((r) => r.recordId === recordId) : editions
}

export const listTracks = async (catalogNumber?: string) => {
  const cacheKey = 'Tracks'
  if (useCache && cache.has(cacheKey)) {
    const tracks = cache.get(cacheKey) as Track[]
    console.log('TRACKS_CACHE_HIT: true')
    return catalogNumber ? tracks.filter((t) => t.catalogNumber === catalogNumber) : tracks
  }
  const range = 'Track!A1:I500'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${songSheetId}/values/${range}?key=${apiKey}`
  const f = await fetch(url)
  const res = (await f.json()) as SheetValuesResponse
  const [columnNames, ...data] = res.values
  const tracks = data.map((d) => {
    var obj: any = {}
    for (let i = 0; i < columnNames.length; i++) {
      obj[columnNames[i]] = d[i] || ''
    }
    return obj as Track
  })
  cache.set(cacheKey, tracks)
  console.log('TRACKS_CACHE_HIT: false')
  return catalogNumber ? tracks.filter((t) => t.catalogNumber === catalogNumber) : tracks
}

export const listSongs = async () => {
  const cacheKey = 'Songs'
  if (useCache && cache.has(cacheKey)) {
    const songs = cache.get(cacheKey) as Song[]
    console.log('SONGS_CACHE_HIT: true')
    return songs
  }
  const range = 'Song!A1:H200'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${songSheetId}/values/${range}?key=${apiKey}`
  const f = await fetch(url)
  const res = (await f.json()) as SheetValuesResponse
  const [columnNames, ...data] = res.values
  const songs = data.map((d) => {
    var obj: any = {}
    for (let i = 0; i < columnNames.length; i++) {
      obj[columnNames[i]] = d[i] || ''
    }
    return obj as Song
  })
  cache.set(cacheKey, songs)
  console.log('SONGS_CACHE_HIT: false')
  return songs
}

export const listArtists = async () => {
  const cacheKey = 'Artists'
  if (useCache && cache.has(cacheKey)) {
    const artists = cache.get(cacheKey) as Artist[]
    console.log('ARTISTS_CACHE_HIT: true')
    return artists
  }
  const range = 'Artist!A1:M300'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${songSheetId}/values/${range}?key=${apiKey}`
  const f = await fetch(url)
  const res = (await f.json()) as SheetValuesResponse
  const [columnNames, ...data] = res.values
  const artists = data.map((d) => {
    var obj: any = {}
    for (let i = 0; i < columnNames.length; i++) {
      obj[columnNames[i]] = d[i] || ''
    }
    return obj as Artist
  })
  cache.set(cacheKey, artists)
  console.log('ARTISTS_CACHE_HIT: false')
  return artists
}

export const listCredits = async () => {
  const cacheKey = 'Credits'
  if (useCache && cache.has(cacheKey)) {
    const credits = cache.get(cacheKey) as Credit[]
    console.log('CREDITS_CACHE_HIT: true')
    return credits
  }
  const range = 'Credit!A1:H1000'
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${songSheetId}/values/${range}?key=${apiKey}`
  const f = await fetch(url)
  const res = (await f.json()) as SheetValuesResponse
  const [columnNames, ...data] = res.values
  const credits = data.map((d) => {
    var obj: any = {}
    for (let i = 0; i < columnNames.length; i++) {
      obj[columnNames[i]] = d[i] || ''
    }
    return obj as Credit
  })
  cache.set(cacheKey, credits)
  console.log('CREDITS_CACHE_HIT: false')
  return credits
}
