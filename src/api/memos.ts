import apiClient from './client'
import type { ApiResponse, Memo } from '../types'

export const getMemos = async (): Promise<Memo[]> => {
  const { data } = await apiClient.get<ApiResponse<Memo[]>>('/memos')
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to fetch memos')
  return data.data
}

export const createMemo = async (payload: { nickname: string; content: string; color: string }): Promise<Memo> => {
  const { data } = await apiClient.post<ApiResponse<Memo>>('/memos', payload)
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to create memo')
  return data.data
}

export const deleteMemo = async (id: number): Promise<void> => {
  await apiClient.delete(`/memos/${id}`)
}
