import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/', label: 'EXHIBITION' },
  { path: '/goods', label: 'GOODS' },
  { path: '/memo', label: 'MEMO' },
]

export default function NavBar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-5 flex items-center justify-between"
      style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(10,10,10,0.7)' }}
    >
      <Link to="/" className="text-white text-sm tracking-[0.3em] font-thin hover:text-white/70 transition-colors">
        AQUAURORE
      </Link>
      <ul className="flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
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
      </ul>
    </nav>
  )
}
