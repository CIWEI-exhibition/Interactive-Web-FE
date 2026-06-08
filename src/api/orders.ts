import apiClient from './client'
import type { ApiResponse, Order } from '../types'

export const createOrder = async (payload: {
  goodsId: number
  quantity: number
  buyerName: string
  buyerEmail: string
}): Promise<Order> => {
  const { data } = await apiClient.post<ApiResponse<Order>>('/orders', payload)
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed to create order')
  return data.data
}
