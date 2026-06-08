import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getMemos, createMemo, deleteMemo } from '../api/memos'
import type { Memo } from '../types'

const NOTE_COLORS = ['#bcc7e2', '#aab7d9', '#96a6cf', '#8192c3']

function getNoteColor(index: number): string {
  if (index % 3 === 0) return '#8192c3'
  if (index % 2 === 0) return '#aab7d9'
  return '#bcc7e2'
}

function getNoteRotation(index: number): string {
  if (index % 3 === 0) return 'rotate(1deg)'
  if (index % 2 === 0) return 'rotate(2deg)'
  return 'rotate(-1deg)'
}

export default function MemoPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState(NOTE_COLORS[0])

  const { data: memos = [], isLoading } = useQuery<Memo[]>('memos', getMemos)

  const createMutation = useMutation(createMemo, {
    onSuccess: () => {
      queryClient.invalidateQueries('memos')
      setNickname('')
      setContent('')
      setColor(NOTE_COLORS[0])
      setIsFormOpen(false)
    },
  })

  const deleteMutation = useMutation(deleteMemo, {
    onSuccess: () => queryClient.invalidateQueries('memos'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    createMutation.mutate({
      nickname: nickname.trim() || '익명',
      content: content.trim(),
      color,
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#dbdbdb',
      fontFamily: "'IBM Plex Sans KR', sans-serif",
      paddingBottom: '60px',
      overflowX: 'hidden',
    }}>
      {/* 설명 */}
      <div style={{ textAlign: 'center', paddingTop: '60px' }}>
        <h1 style={{ marginTop: '5%', marginBottom: 0, fontFamily: "'IBM Plex Sans KR', sans-serif" }}>
          Below The Surface
        </h1>
        <p style={{ marginTop: '0.3%', fontSize: '1rem' }}>
          '속마음'이라는 뜻으로, 나를 비롯한 사람들의 속마음을 들여다볼 수 있는 공간입니다.
        </p>
        <p style={{ marginTop: '0.3%', fontSize: '1rem' }}>
          익명으로 이루어진 공간에서 누군가에게 쉽게 털어놓지 못한 나만의 아픔을 적거나, 자신에게 위로의 한마디를 적어보세요.
        </p>
        <p style={{ marginTop: '0.3%', fontSize: '1rem' }}>
          '포스트잇 붙이기'를 눌러 메시지를 작성한 후, OK 버튼을 눌러 포스트잇을 붙여보세요.
        </p>
      </div>

      {/* 포스트잇 붙이기 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '4%', marginTop: '1.5%' }}>
        <button
          onClick={() => setIsFormOpen(true)}
          style={{
            padding: '0.5rem 1.5rem',
            border: 0,
            cursor: 'pointer',
            fontFamily: "'IBM Plex Sans KR', sans-serif",
            fontSize: '1rem',
            backgroundColor: '#fff',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          포스트잇 붙이기
        </button>
      </div>

      {/* 작성 폼 */}
      {isFormOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}
          onClick={() => setIsFormOpen(false)}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              width: 300, padding: '2rem',
              border: '2px solid #222', backgroundColor: '#fff',
              fontFamily: "'IBM Plex Sans KR', sans-serif",
            }}
          >
            {/* 색상 선택 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              {NOTE_COLORS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 24, height: 24, backgroundColor: c, border: 'none',
                    cursor: 'pointer', outline: color === c ? '2px solid #333' : 'none',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', width: '100%' }}>
              <label style={{ flex: '0 0 auto', width: 60, fontWeight: 'bold' }}>닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={16}
                placeholder="익명"
                style={{ flex: 1, border: '2px solid #222', borderRadius: 0, fontSize: '1rem', padding: '2px 6px', fontFamily: "'IBM Plex Sans KR', sans-serif" }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '1rem', width: '100%' }}>
              <label style={{ flex: '0 0 auto', width: 60, fontWeight: 'bold', paddingTop: 4 }}>메시지</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={150}
                placeholder="Message"
                style={{ flex: 1, height: 60, border: '2px solid #222', borderRadius: 0, fontSize: '1rem', fontFamily: "'IBM Plex Sans KR', sans-serif", resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 4, marginTop: '3rem', width: '100%' }}>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                style={{
                  flex: 1, height: 40, border: 0, borderRadius: 0,
                  color: '#fff', backgroundColor: '#5970ac',
                  fontFamily: "'IBM Plex Sans KR', sans-serif",
                  cursor: 'pointer', fontSize: '1rem',
                }}
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                style={{
                  flex: 1, height: 40, border: 0, borderRadius: 0,
                  color: '#fff', backgroundColor: '#5970ac',
                  fontFamily: "'IBM Plex Sans KR', sans-serif",
                  cursor: 'pointer', fontSize: '1rem',
                }}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 포스트잇 목록 */}
      {isLoading ? (
        <p style={{ textAlign: 'center', marginTop: '3rem' }}>불러오는 중...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0 0 0', display: 'flex', flexWrap: 'wrap' }}>
          {memos.map((memo, i) => (
            <li
              key={memo.id}
              style={{
                display: 'block',
                float: 'left',
                margin: 30,
                padding: '15px 15px 50px 15px',
                width: 200,
                height: 200,
                border: '1px solid #bfbfbf',
                backgroundColor: memo.color || getNoteColor(i),
                color: 'black',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                transform: getNoteRotation(i),
                transition: 'all 0.5s ease-in',
                overflow: 'hidden',
                cursor: 'default',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'rotate(5deg)'
                e.currentTarget.style.boxShadow = '5px 5px 6px rgba(0,0,0,0.4)'
                e.currentTarget.style.zIndex = '10'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = getNoteRotation(i)
                e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.4)'
                e.currentTarget.style.zIndex = '1'
              }}
            >
              {memo.nickname && (
                <p style={{ fontFamily: "'IBM Plex Sans KR', sans-serif", fontSize: '0.8rem', fontWeight: 'bold', marginBottom: 4, color: '#444' }}>
                  {memo.nickname}
                </p>
              )}
              <span style={{ fontFamily: "'IBM Plex Sans KR', sans-serif", fontSize: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {memo.content}
              </span>
              <button
                onClick={() => deleteMutation.mutate(memo.id)}
                style={{
                  position: 'absolute', bottom: 8, right: 8,
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: '0.75rem', color: '#666',
                  opacity: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
