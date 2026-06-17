import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { login } from '../api/auth'
import { getOrders, updateOrderStatus, createGoods, updateGoods, deleteGoods } from '../api/admin'
import { getGoodsList } from '../api/goods'
import type { Goods, Order } from '../types'

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED'] as const
const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  CONFIRMED: '확인',
  SHIPPED: '배송',
  CANCELLED: '취소',
}

const EMPTY_GOODS = { name: '', description: '', price: 0, stock: 0, imageUrl: '' }

export default function AdminPage() {
  const token = localStorage.getItem('token')
  const [isLoggedIn, setIsLoggedIn] = useState(!!token)

  if (!isLoggedIn) return <LoginForm onSuccess={() => setIsLoggedIn(true)} />
  return <AdminPanel onLogout={() => { localStorage.removeItem('token'); setIsLoggedIn(false) }} />
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await login(username, password)
      localStorage.setItem('token', token)
      onSuccess()
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-80 space-y-4">
        <h1 className="text-white text-xl tracking-[0.2em] text-center mb-8">ADMIN</h1>
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <input
          className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-white/30 placeholder-white/30"
          placeholder="아이디"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-white/30 placeholder-white/30"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-white text-black text-sm tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : '로그인'}
        </button>
      </form>
    </div>
  )
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'orders' | 'goods'>('orders')

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-xl tracking-[0.2em]">ADMIN</h1>
        <button
          onClick={onLogout}
          className="text-white/40 text-xs tracking-widest hover:text-white/70 transition-colors"
        >
          로그아웃
        </button>
      </div>

      <div className="flex gap-6 mb-8 border-b border-white/10 pb-4">
        {(['orders', 'goods'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs tracking-widest transition-colors ${tab === t ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            {t === 'orders' ? '주문 목록' : '굿즈 관리'}
          </button>
        ))}
      </div>

      {tab === 'orders' ? <OrdersTab /> : <GoodsTab />}
    </div>
  )
}

function OrdersTab() {
  const queryClient = useQueryClient()
  const { data: orders = [], isLoading } = useQuery<Order[]>('admin-orders', getOrders)
  const statusMutation = useMutation(
    ({ id, status }: { id: number; status: string }) => updateOrderStatus(id, status),
    { onSuccess: () => queryClient.invalidateQueries('admin-orders') }
  )

  if (isLoading) return <p className="text-white/30 text-sm">불러오는 중...</p>
  if (orders.length === 0) return <p className="text-white/20 text-sm">주문 없음</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/40 text-xs tracking-widest border-b border-white/10">
            <th className="text-left pb-3">ID</th>
            <th className="text-left pb-3">상품</th>
            <th className="text-left pb-3">구매자</th>
            <th className="text-left pb-3">수량</th>
            <th className="text-left pb-3">금액</th>
            <th className="text-left pb-3">상태</th>
            <th className="text-left pb-3">주문일</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b border-white/5 text-white/70">
              <td className="py-3">{order.id}</td>
              <td className="py-3">{order.goodsName}</td>
              <td className="py-3">
                <span>{order.buyerName}</span>
                <span className="text-white/30 text-xs ml-2">{order.buyerEmail}</span>
              </td>
              <td className="py-3">{order.quantity}</td>
              <td className="py-3">{order.totalPrice.toLocaleString()}원</td>
              <td className="py-3">
                <select
                  value={order.status}
                  onChange={e => statusMutation.mutate({ id: order.id, status: e.target.value })}
                  className="bg-white/5 border border-white/10 text-white text-xs px-2 py-1 outline-none"
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s} value={s} className="bg-[#111]">{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </td>
              <td className="py-3 text-white/40 text-xs">
                {new Date(order.createdAt).toLocaleDateString('ko-KR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GoodsTab() {
  const queryClient = useQueryClient()
  const { data: goodsList = [], isLoading } = useQuery<Goods[]>('goods', getGoodsList)
  const [editing, setEditing] = useState<Goods | null>(null)
  const [form, setForm] = useState(EMPTY_GOODS)
  const [showForm, setShowForm] = useState(false)

  const createMutation = useMutation(
    () => createGoods(form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goods')
        setForm(EMPTY_GOODS)
        setShowForm(false)
      },
    }
  )

  const updateMutation = useMutation(
    () => updateGoods(editing!.id, form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goods')
        setEditing(null)
        setForm(EMPTY_GOODS)
      },
    }
  )

  const deleteMutation = useMutation(
    (id: number) => deleteGoods(id),
    { onSuccess: () => queryClient.invalidateQueries('goods') }
  )

  const openEdit = (goods: Goods) => {
    setEditing(goods)
    setForm({ name: goods.name, description: goods.description, price: goods.price, stock: goods.stock, imageUrl: goods.imageUrl })
    setShowForm(false)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_GOODS)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateMutation.mutate()
    else createMutation.mutate()
  }

  const handleCancel = () => {
    setEditing(null)
    setShowForm(false)
    setForm(EMPTY_GOODS)
  }

  const isFormOpen = showForm || !!editing

  if (isLoading) return <p className="text-white/30 text-sm">불러오는 중...</p>

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="text-xs tracking-widest text-white/60 border border-white/20 px-4 py-2 hover:text-white hover:border-white/40 transition-colors"
        >
          + 새 굿즈
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border border-white/10 bg-white/5 space-y-3">
          <h3 className="text-white text-xs tracking-widest mb-4">{editing ? '굿즈 수정' : '굿즈 등록'}</h3>
          {[
            { key: 'name', placeholder: '상품명', type: 'text' },
            { key: 'description', placeholder: '설명', type: 'text' },
            { key: 'price', placeholder: '가격', type: 'number' },
            { key: 'stock', placeholder: '재고', type: 'number' },
            { key: 'imageUrl', placeholder: '이미지 URL', type: 'text' },
          ].map(({ key, placeholder, type }) => (
            <input
              key={key}
              type={type}
              placeholder={placeholder}
              value={(form as any)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
              className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-white/30 placeholder-white/30"
            />
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createMutation.isLoading || updateMutation.isLoading}
              className="flex-1 py-2 bg-white text-black text-sm tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 border border-white/20 text-white/50 text-sm tracking-widest hover:text-white/80 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {goodsList.map(goods => (
          <div
            key={goods.id}
            className="flex items-center justify-between border border-white/10 px-4 py-3 text-sm"
          >
            <div className="flex items-center gap-4">
              <span className="text-white">{goods.name}</span>
              <span className="text-white/40">{goods.price.toLocaleString()}원</span>
              <span className="text-white/30 text-xs">재고 {goods.stock}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openEdit(goods)}
                className="text-white/40 text-xs hover:text-white/70 transition-colors"
              >
                수정
              </button>
              <button
                onClick={() => { if (confirm(`'${goods.name}' 삭제할까요?`)) deleteMutation.mutate(goods.id) }}
                className="text-red-400/50 text-xs hover:text-red-400 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
