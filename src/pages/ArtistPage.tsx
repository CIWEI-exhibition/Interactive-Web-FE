import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { getArtists } from '../api/artists'
import { getArtworks } from '../api/artworks'
import type { Artist, Artwork } from '../types'

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>()
  const artistId = Number(id)

  const { data: artists = [] } = useQuery<Artist[]>('artists', getArtists)
  const artist = artists.find((a) => a.id === artistId)

  const { data: artworks = [], isLoading } = useQuery<Artwork[]>(
    ['artworks', artistId],
    () => getArtworks(artistId),
    { enabled: !!artistId }
  )

  if (!artist && artists.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm tracking-widest mb-4">작가를 찾을 수 없습니다.</p>
          <Link to="/" className="text-white/60 text-xs tracking-widest hover:text-white underline">
            홈으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-white/30 text-xs tracking-widest hover:text-white/60 transition-colors mb-12 inline-block"
        >
          ← 돌아가기
        </Link>

        {artist && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-8">
              <div className="w-24 h-24 border border-white/10 flex-shrink-0 overflow-hidden bg-white/5">
                {artist.profileImageUrl ? (
                  <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl font-thin">
                    {artist.name[0]}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-thin tracking-[0.2em] text-white mb-3">{artist.name}</h1>
                {artist.bio && (
                  <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line max-w-xl">{artist.bio}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <h2 className="text-white/40 text-xs tracking-[0.3em] mb-8">WORKS</h2>

          {isLoading ? (
            <div className="text-white/30 text-sm tracking-widest">불러오는 중...</div>
          ) : artworks.length === 0 ? (
            <div className="text-white/20 text-sm tracking-widest">등록된 작품이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {artworks.map((artwork, i) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to={`/artwork/${artwork.id}`} className="group block">
                    <div className="aspect-square bg-white/5 border border-white/10 mb-3 overflow-hidden group-hover:border-white/30 transition-colors flex items-center justify-center">
                      {artwork.imageUrl ? (
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-white/20 text-xs">이미지 없음</span>
                      )}
                    </div>
                    <p className="text-white text-sm tracking-wide group-hover:text-white/70 transition-colors">
                      {artwork.title}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
