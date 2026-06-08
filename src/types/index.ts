export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}

export interface Artist {
  id: number
  name: string
  email: string
  bio: string
  profileImageUrl: string
}

export interface Artwork {
  id: number
  title: string
  description: string
  imageUrl: string
  displayOrder: number
  artistId: number
  artistName: string
}

export interface Goods {
  id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
}

export interface Memo {
  id: number
  nickname: string
  content: string
  color: string
  createdAt: string
}

export interface Order {
  id: number
  goodsId: number
  goodsName: string
  quantity: number
  totalPrice: number
  buyerName: string
  buyerEmail: string
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED'
  createdAt: string
}
