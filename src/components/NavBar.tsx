import { Link, useLocation } from 'react-router-dom'

const REACT_NAV = [
  { path: '/', label: 'EXHIBITION' },
]

export default function NavBar() {
  const { pathname } = useLocation()
  const isAdmin = !!localStorage.getItem('token')

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-5 flex items-center justify-between"
      style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(10,10,10,0.7)' }}
    >
      <Link to="/" className="text-white text-sm tracking-[0.3em] font-thin hover:text-white/70 transition-colors">
        AQUAURORE
      </Link>
      <ul className="flex items-center gap-8">
        {REACT_NAV.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`text-xs tracking-widest transition-colors ${
                pathname === item.path ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <a href="/Goods_Page/goods.html" className="text-xs tracking-widest text-white/40 hover:text-white/70 transition-colors">
            GOODS
          </a>
        </li>
        <li>
          <a href="/Community_Page/note.html" className="text-xs tracking-widest text-white/40 hover:text-white/70 transition-colors">
            MEMO
          </a>
        </li>
        {isAdmin && (
          <li>
            <Link
              to="/admin"
              className={`text-xs tracking-widest transition-colors ${
                pathname === '/admin' ? 'text-white' : 'text-white/20 hover:text-white/50'
              }`}
            >
              ADMIN
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
