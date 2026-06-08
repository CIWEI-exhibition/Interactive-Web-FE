import apiClient from './client'
import type { ApiResponse, Artist } from '../types'

export const getArtists = async (): Promise<Artist[]> => {
  const { data } = await apiClient.get<ApiResponse<Artist[]>>('/artists')
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to fetch artists')
  return data.data
}

export const getArtist = async (id: number): Promise<Artist> => {
  const { data } = await apiClient.get<ApiResponse<Artist>>(`/artists/${id}`)
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to fetch artist')
  return data.data
}
