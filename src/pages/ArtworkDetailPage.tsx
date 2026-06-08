import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { getArtwork } from '../api/artworks'
import type { Artwork } from '../types'

export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: artwork, isLoading, isError } = useQuery<Artwork>(
    ['artwork', id],
    () => getArtwork(Number(id)),
    { enabled: !!id }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/30 text-sm tracking-widest">불러오는 중...</p>
      </div>
    )
  }

  if (isError || !artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm tracking-widest mb-4">작품을 찾을 수 없습니다.</p>
          <Link to="/" className="text-white/60 text-xs tracking-widest hover:text-white underline">
            홈으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to={artwork.artistId ? `/artist/${artwork.artistId}` : '/'}
          className="text-white/30 text-xs tracking-widest hover:text-white/60 transition-colors mb-12 inline-block"
        >
          ← {artwork.artistName ?? '돌아가기'}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {artwork.imageUrl && (
            <div className="w-full mb-8 border border-white/10 overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full object-contain max-h-[70vh]"
              />
            </div>
          )}

          <h1 className="text-3xl font-thin tracking-[0.2em] text-white mb-2">{artwork.title}</h1>
          {artwork.artistName && (
            <p className="text-white/40 text-sm tracking-widest mb-6">{artwork.artistName}</p>
          )}
          {artwork.description && (
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{artwork.description}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
