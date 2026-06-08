import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { getMemos, createMemo, deleteMemo } from '../api/memos'
import type { Memo } from '../types'

const COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa']

export default function MemoPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState(COLORS[0])

  const { data: memos = [], isLoading } = useQuery<Memo[]>('memos', getMemos)

  const createMutation = useMutation(createMemo, {
    onSuccess: () => {
      queryClient.invalidateQueries('memos')
      setNickname('')
      setContent('')
      setColor(COLORS[0])
      setIsFormOpen(false)
    },
  })

  const deleteMutation = useMutation(deleteMemo, {
    onSuccess: () => queryClient.invalidateQueries('memos'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim() || !content.trim()) return
    createMutation.mutate({ nickname: nickname.trim(), content: content.trim(), color })
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-4xl font-thin tracking-[0.2em] text-white mb-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          MEMO BOARD
        </motion.h1>
        <p className="text-white/40 text-center text-sm tracking-widest mb-10">
          나의 이야기를 남겨보세요
        </p>

        <div className="flex justify-center mb-10">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-3 border border-white/30 text-white/70 text-sm tracking-widest hover:border-white/60 hover:text-white transition-colors"
          >
            + 포스트잇 남기기
          </button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
            >
              <motion.form
                className="bg-[#1a1a1a] border border-white/10 p-8 w-full max-w-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
              >
                <h2 className="text-white text-lg tracking-widest mb-6">포스트잇 작성</h2>

                <div className="flex gap-2 mb-4">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-sm transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        outline: color === c ? '2px solid white' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>

                <input
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 mb-3 outline-none focus:border-white/30 placeholder-white/30"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                />
                <textarea
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 mb-4 outline-none focus:border-white/30 placeholder-white/30 resize-none"
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  maxLength={200}
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={createMutation.isLoading}
                    className="flex-1 py-2 bg-white text-black text-sm tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isLoading ? '저장 중...' : '남기기'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-2 border border-white/20 text-white/50 text-sm tracking-widest hover:text-white/80 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="text-white/30 text-center text-sm tracking-widest">불러오는 중...</div>
        ) : memos.length === 0 ? (
          <div className="text-white/20 text-center text-sm tracking-widest mt-20">
            아직 포스트잇이 없어요. 첫 번째로 남겨보세요!
          </div>
        ) : (
          <motion.div
            className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {memos.map((memo) => (
                <motion.div
                  key={memo.id}
                  className="break-inside-avoid p-4 text-black text-sm group relative"
                  style={{ backgroundColor: memo.color || COLORS[0] }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <p className="font-semibold text-xs mb-2 opacity-70">{memo.nickname}</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{memo.content}</p>
                  <button
                    onClick={() => deleteMutation.mutate(memo.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 hover:!opacity-100 text-black text-xs transition-opacity"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
