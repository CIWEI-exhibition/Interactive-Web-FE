import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import MainPage from './pages/MainPage'
import ArtistPage from './pages/ArtistPage'
import ArtworkDetailPage from './pages/ArtworkDetailPage'

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
        </Routes>
      </main>
    </>
  )
}

export default App
