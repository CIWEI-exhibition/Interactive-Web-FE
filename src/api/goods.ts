import apiClient from './client'
import type { ApiResponse, Goods } from '../types'

export const getGoodsList = async (): Promise<Goods[]> => {
  const { data } = await apiClient.get<ApiResponse<Goods[]>>('/goods')
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to fetch goods')
  return data.data
}

export const getGoods = async (id: number): Promise<Goods> => {
  const { data } = await apiClient.get<ApiResponse<Goods>>(`/goods/${id}`)
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to fetch goods')
  return data.data
}
