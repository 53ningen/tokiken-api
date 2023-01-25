import { listTracks } from '../sheets'

// GET /editions/[catalogNumber]/tracks
export const listTracksAction = async (catalogNumber: string) => {
  const allTracks = await listTracks()
  const tracks = allTracks.filter((t) => t.catalogNumber === catalogNumber)
  const res = tracks.map((t) => toResponse(t))
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

export interface Track {
  catalogNumber: string
  recordName: string
  editionName: string
  disc: string
  track: string
  trackType: string
  songId: string
  SongName: string
  trackName: string
}

export interface TrackResponse {
  catalogNumber: string
  disc: number
  track: number
  songId?: string
  trackName?: string
}

export const toResponse = (t: Track): TrackResponse => {
  return {
    catalogNumber: t.catalogNumber,
    disc: parseInt(t.disc),
    track: parseInt(t.track),
    songId: getValue(t.songId),
    trackName: getValue(t.trackName),
  }
}

const getValue = (s: string) => {
  return s && s !== '' ? s : undefined
}
