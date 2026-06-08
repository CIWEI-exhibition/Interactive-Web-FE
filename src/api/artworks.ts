import apiClient from './client'
import type { ApiResponse, Artwork } from '../types'

export const getArtworks = async (artistId?: number): Promise<Artwork[]> => {
  const params = artistId ? { artistId } : {}
  const { data } = await apiClient.get<ApiResponse<Artwork[]>>('/artworks', { params })
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to fetch artworks')
  return data.data
}

export const getArtwork = async (id: number): Promise<Artwork> => {
  const { data } = await apiClient.get<ApiResponse<Artwork>>(`/artworks/${id}`)
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to fetch artwork')
  return data.data
}
