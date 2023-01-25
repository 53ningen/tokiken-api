import { listCredits } from '../sheets'

type CreditRole = 'Vocal' | 'Music' | 'Arrangement' | 'Lyrics' | 'Produce' | 'Dance' | 'Others'
type SongArtistSource = 'BOOKLET' | 'JASRAC' | 'EXTERNAL'

// GET /songs/[songId]/credits
export const listSongCreditsAction = async (songId: string) => {
  const allCredits = await listCredits()
  const credits = allCredits.filter((a) => a.songId === songId)
  const res = credits.map((c) => toResponse(c))
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

// GET /artists/[artistId]/credits
export const listArtistCreditsAction = async (artistId: string) => {
  const allCredits = await listCredits()
  const credits = allCredits.filter((a) => a.artistId === artistId)
  const res = credits.map((c) => toResponse(c))
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}

export interface Credit {
  songId: string
  songName: string
  creditRole: CreditRole
  artistId: string
  creditName: string
  creditTitle: string
  creditSource: SongArtistSource
  creditSourceUrl: string
}

export interface CreditResponse {
  songId: string
  role: CreditRole
  artistId: string
  name: string
  title?: string
  source?: SongArtistSource
  sourceUrl?: string
}

export const toResponse = (c: Credit): CreditResponse => {
  return {
    songId: c.songId,
    role: c.creditRole,
    artistId: c.artistId,
    name: c.creditName,
    title: getValue(c.creditTitle),
    source: getValue(c.creditSource) as SongArtistSource | undefined,
    sourceUrl: getValue(c.creditSourceUrl),
  }
}

const getValue = (s: string) => {
  return s && s !== '' ? s : undefined
}
