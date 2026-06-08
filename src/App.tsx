import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import MainPage from './pages/MainPage'
import ArtistPage from './pages/ArtistPage'
import ArtworkDetailPage from './pages/ArtworkDetailPage'
import GoodsPage from './pages/GoodsPage'
import MemoPage from './pages/MemoPage'

function App() {
  return (
    <>
      <NavBar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
          <Route path="/goods" element={<GoodsPage />} />
          <Route path="/memo" element={<MemoPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
