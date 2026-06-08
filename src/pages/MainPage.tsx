import { motion } from 'framer-motion'

export default function MainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.h1
        className="text-6xl font-thin tracking-[0.3em] text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        AQUAURORE
      </motion.h1>
    </div>
  )
}
