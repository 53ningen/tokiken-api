import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import fetch from 'cross-fetch'
import { getArtistAction, listArtistsAction } from './actions/artist'
import { listArtistCreditsAction, listSongCreditsAction } from './actions/credit'
import { getRecordAction } from './actions/record'
import { getRecordEditionAction, listRecordEditionsAction } from './actions/recordEdition'
import { getSongAction, listSongsAction } from './actions/song'
import { listTracksAction } from './actions/track'

global.fetch = fetch

export let apiKey: string | undefined = undefined

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event: APIGatewayEvent, _: Context): Promise<APIGatewayProxyResult> {
  const { path, httpMethod } = event
  const paths = path.split('/')
  console.log(`PATH: ${path}`)
  apiKey = await loadApiKey()

  // OPTIONS *
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({}),
    }
  }
  // invalid path
  if (paths.length <= 1 || paths[0] !== '') {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `internal server error` }),
    }
  }

  switch (paths[1]) {
    case 'songs':
      return await songsHandler(httpMethod, paths)
    case 'artists':
      return await artistHandler(httpMethod, paths)
    case 'records':
      return await recordHandler(httpMethod, paths)
    case 'editions':
      return await editionHandler(httpMethod, paths)
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `resource not found` }),
      }
  }
}

const songsHandler = async (method: string, paths: string[]) => {
  if (paths.length === 2 && method === 'GET') {
    // GET /songs
    return await listSongsAction()
  }
  const songId = decodeURI(paths[2])
  if (paths.length === 3 && method === 'GET') {
    // GET /songs/[songId]
    return await getSongAction(songId)
  }
  if (paths.length === 4 && method === 'GET' && paths[3] === 'credits') {
    // GET /songs/[songId]/credits
    return await listSongCreditsAction(songId)
  }
  return {
    statusCode: 404,
    body: 'resource not found',
  }
}

const artistHandler = async (method: string, paths: string[]) => {
  if (paths.length === 2 && method === 'GET') {
    // GET /artists
    return await listArtistsAction()
  }
  const artistId = decodeURI(paths[2])

  if (paths.length === 3 && method === 'GET') {
    // GET /artists/[artistId]
    return await getArtistAction(artistId)
  }
  if (paths.length === 4 && method === 'GET' && paths[3] === 'credits') {
    // GET /artists/[artistId]/credits
    return await listArtistCreditsAction(artistId)
  }
  return {
    statusCode: 404,
    body: 'resource not found',
  }
}

const recordHandler = async (method: string, paths: string[]) => {
  if (paths.length === 2 && method === 'GET') {
    // GET /records
    return await listRecordEditionsAction()
  }
  if (paths.length === 3 && method === 'GET') {
    // GET /records/[recordId]
    const recordId = decodeURI(paths[2])
    return await getRecordAction(recordId)
  }
  return {
    statusCode: 404,
    body: 'resource not found',
  }
}

const editionHandler = async (method: string, paths: string[]) => {
  if (paths.length === 2 && method === 'GET') {
    // GET /editions
    return await listRecordEditionsAction()
  }
  const catalogNumber = decodeURI(paths[2])
  if (paths.length === 3 && method === 'GET') {
    // GET /editions/[catalogNumber]
    return await getRecordEditionAction(catalogNumber)
  }
  if (paths.length === 4 && method === 'GET' && paths[3] === 'tracks') {
    // GET /editions/[catalogNumber]/tracks
    return await listTracksAction(catalogNumber)
  }
  return {
    statusCode: 404,
    body: 'resource not found',
  }
}

const loadApiKey = async () => {
  if (!apiKey) {
    const { Parameters } = await new AWS.SSM().getParameters({ Names: ['SHEET_API_KEY'].map((secretName) => process.env[secretName]), WithDecryption: true }).promise()
    console.log('API_KEY_CACHE_HIT: false')
    return Parameters[0]?.Value
  } else {
    console.log('API_KEY_CACHE_HIT: true')
  }
  return apiKey
}
