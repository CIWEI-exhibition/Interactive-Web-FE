import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import MainPage from './pages/MainPage'
import ArtistPage from './pages/ArtistPage'
import ArtworkDetailPage from './pages/ArtworkDetailPage'
import MemoPage from './pages/MemoPage'
import AdminPage from './pages/AdminPage'

function App() {
  const { pathname } = useLocation()
  const showNav = pathname !== '/'

  return (
    <>
      {showNav && <NavBar />}
      <main className={showNav ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
          <Route path="/memo" element={<MemoPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
