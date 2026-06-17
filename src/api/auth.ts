import apiClient from './client'
import type { ApiResponse } from '../types'

export const login = async (username: string, password: string): Promise<string> => {
  const { data } = await apiClient.post<ApiResponse<{ token: string }>>('/auth/login', {
    username,
    password,
  })
  if (!data.success || !data.data) throw new Error(data.error ?? '로그인 실패')
  return data.data.token
}
