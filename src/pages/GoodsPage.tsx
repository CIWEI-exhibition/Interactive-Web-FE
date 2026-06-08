import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { getGoodsList } from '../api/goods'
import { createOrder } from '../api/orders'
import type { Goods } from '../types'

export default function GoodsPage() {
  const { data: goodsList = [], isLoading } = useQuery<Goods[]>('goods', getGoodsList)
  const [selected, setSelected] = useState<Goods | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [ordered, setOrdered] = useState(false)

  const orderMutation = useMutation(createOrder, {
    onSuccess: () => {
      setOrdered(true)
    },
  })

  const openModal = (goods: Goods) => {
    setSelected(goods)
    setQuantity(1)
    setBuyerName('')
    setBuyerEmail('')
    setOrdered(false)
  }

  const closeModal = () => setSelected(null)

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !buyerName.trim() || !buyerEmail.trim()) return
    orderMutation.mutate({
      goodsId: selected.id,
      quantity,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
    })
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-4xl font-thin tracking-[0.2em] text-white mb-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          GOODS SHOP
        </motion.h1>
        <p className="text-white/40 text-center text-sm tracking-widest mb-12">
          AQUAURORE 굿즈를 만나보세요
        </p>

        {isLoading ? (
          <div className="text-white/30 text-center text-sm tracking-widest">불러오는 중...</div>
        ) : goodsList.length === 0 ? (
          <div className="text-white/20 text-center text-sm tracking-widest mt-20">
            준비 중인 굿즈가 없습니다.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {goodsList.map((goods, i) => (
              <motion.div
                key={goods.id}
                className="cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openModal(goods)}
              >
                <div className="aspect-square bg-white/5 border border-white/10 mb-3 overflow-hidden group-hover:border-white/30 transition-colors flex items-center justify-center">
                  {goods.imageUrl ? (
                    <img
                      src={goods.imageUrl}
                      alt={goods.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-white/20 text-sm">이미지 없음</span>
                  )}
                </div>
                <p className="text-white text-sm tracking-wide">{goods.name}</p>
                <p className="text-white/50 text-sm mt-1">
                  {goods.price.toLocaleString()}원
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {goods.stock > 0 ? `재고 ${goods.stock}개` : '품절'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-[#111] border border-white/10 p-8 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {ordered ? (
                <div className="text-center py-8">
                  <p className="text-white text-2xl tracking-widest mb-4">주문 완료</p>
                  <p className="text-white/50 text-sm mb-8">확인 메일을 보내드렸습니다.</p>
                  <button
                    onClick={closeModal}
                    className="px-8 py-2 border border-white/20 text-white/70 text-sm tracking-widest hover:text-white transition-colors"
                  >
                    닫기
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-4 mb-6">
                    <div className="w-24 h-24 bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {selected.imageUrl ? (
                        <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white/20 text-xs">없음</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-white tracking-wide mb-1">{selected.name}</h2>
                      <p className="text-white/40 text-xs mb-2">{selected.description}</p>
                      <p className="text-white/70 text-sm">{selected.price.toLocaleString()}원</p>
                    </div>
                  </div>

                  <form onSubmit={handleOrder} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-sm w-16">수량</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="text-white w-6 text-center text-sm">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(selected.stock, q + 1))}
                          className="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white/30 text-xs ml-auto">
                        합계 {(selected.price * quantity).toLocaleString()}원
                      </span>
                    </div>

                    <input
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-white/30 placeholder-white/30"
                      placeholder="이름"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                    />
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-white/30 placeholder-white/30"
                      placeholder="이메일"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                    />

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={orderMutation.isLoading || selected.stock === 0}
                        className="flex-1 py-2 bg-white text-black text-sm tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50"
                      >
                        {orderMutation.isLoading ? '처리 중...' : selected.stock === 0 ? '품절' : '주문하기'}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 py-2 border border-white/20 text-white/50 text-sm tracking-widest hover:text-white/80 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
