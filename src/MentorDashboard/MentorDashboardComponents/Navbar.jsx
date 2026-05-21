import { useState } from 'react'
import logo from '../../assets/logo.jpeg'

const navItems = [
  { id: 'home',     icon: 'ti-home',     label: 'Home',     badge: false },
  { id: 'calendar', icon: 'ti-calendar', label: 'Calendar', badge: true  },
  { id: 'globe',    icon: 'ti-world',    label: 'Globe',    badge: false },
  { id: 'logout',   icon: 'ti-logout',   label: 'Sign out', badge: false },
]

function Navbar() {
  const [active, setActive] = useState('home')

  return (
    <nav className="bg-[#3d1a10] flex items-center justify-between px-6 h-14">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Mind Empowered Logo"
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <span className="text-sm font-semibold text-white block">Mind Empowered</span>
          <span className="text-[10px] text-[#c9a090] tracking-widest block">#MEFORYOUTH</span>
        </div>
      </div>

      <div className="flex gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            aria-label={item.label}
            onClick={() => setActive(item.id)}
            className={`w-9 h-9 rounded-lg border-none cursor-pointer flex items-center justify-center text-[#e8d0c5] relative transition-all
              ${active === item.id ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <i className={`ti ${item.icon} text-lg`} />
            {item.badge && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e85d2a] border-2 border-[#3d1a10]" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navbar