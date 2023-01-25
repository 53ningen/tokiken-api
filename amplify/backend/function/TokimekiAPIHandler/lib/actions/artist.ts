import { listArtists } from '../sheets'

/**  GET /artists/[artistId] */
export const getArtistAction = async (artistId: string) => {
  const artists = await listArtists()
  const artist = artists.find((a) => a.artistId === artistId)
  if (artist) {
    const res = toResponse(artist)
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `artist: ${artistId} not found` }),
    }
  }
}

/** GET /artists */
export const listArtistsAction = async () => {
  const artists = await listArtists()
  const res = artists.map((a) => toResponse(a))
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

export interface Artist {
  artistId: string
  artistName: string
  artistKana: string
  artistWikipediaSlug: string
  artistTwitter: string
  artistInstagram: string
  artistTikTok: string
  artistWebsite: string
  artistMusicCount: string
  artistArrangementCount: string
  artistLyricsCount: string
  artistProduceCount: string
  artistDanceCount: string
}

export interface ArtistResponse {
  id: string
  name: string
  kana: string
  wikipediaSlug?: string
  twitter?: string
  instagram?: string
  tikTok?: string
  website?: string
  musicCount: number
  arrangementCount: number
  lyricsCount: number
  produceCount: number
  danceCount: number
}

export const toResponse = (a: Artist): ArtistResponse => {
  return {
    id: a.artistId,
    name: a.artistName,
    kana: a.artistKana,
    wikipediaSlug: getValue(a.artistWikipediaSlug),
    twitter: getValue(a.artistTwitter),
    instagram: getValue(a.artistInstagram),
    tikTok: getValue(a.artistTikTok),
    website: getValue(a.artistWebsite),
    musicCount: parseInt(a.artistMusicCount),
    arrangementCount: parseInt(a.artistArrangementCount),
    lyricsCount: parseInt(a.artistLyricsCount),
    produceCount: parseInt(a.artistProduceCount),
    danceCount: parseInt(a.artistDanceCount),
  }
}

const getValue = (s: string) => {
  return s && s !== '' ? s : undefined
}
