import { listSongs } from '../sheets'

// GET /songs/[songId]
export const getSongAction = async (songId: string) => {
  const songs = await listSongs()
  const song = songs.find((s) => s.songId === songId)
  if (song) {
    const res = toResponse(song)
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `song: ${songId} not found` }),
    }
  }
}

// GET /songs
export const listSongsAction = async () => {
  const songs = await listSongs()
  const res = songs.map((s) => toResponse(s))
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

export interface Song {
  songId: string
  songName: string
  songKana: string
  songJASRACCode: string
  songISWCCode: string
}

export interface SongResponse {
  id: string
  name: string
  kana: string
  jasracCode?: string
  iswcCode?: string
}

export const toResponse = (s: Song): SongResponse => {
  return {
    id: s.songId,
    name: s.songName,
    kana: s.songKana,
    jasracCode: getValue(s.songJASRACCode),
    iswcCode: getValue(s.songISWCCode),
  }
}

const getValue = (s: string) => {
  return s && s !== '' ? s : undefined
}
