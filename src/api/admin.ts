import apiClient from './client'
import type { ApiResponse, Goods, Order } from '../types'

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<ApiResponse<Order[]>>('/admin/orders')
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed')
  return data.data
}

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  const { data } = await apiClient.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status })
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed')
  return data.data
}

export const createGoods = async (payload: Omit<Goods, 'id'>): Promise<Goods> => {
  const { data } = await apiClient.post<ApiResponse<Goods>>('/admin/goods', payload)
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed')
  return data.data
}

export const updateGoods = async (id: number, payload: Omit<Goods, 'id'>): Promise<Goods> => {
  const { data } = await apiClient.put<ApiResponse<Goods>>(`/admin/goods/${id}`, payload)
  if (!data.success || !data.data) throw new Error(data.error ?? 'Failed')
  return data.data
}

export const deleteGoods = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/goods/${id}`)
}
