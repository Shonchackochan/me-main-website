import logo from '../../assets/logo.jpeg'

function Footer() {
  return (
    <footer className="bg-[#3d1a10] px-6 pt-4 pb-3">
      <div className="px-10">

        <div className="flex items-center mb-3">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="Mind Empowered Logo"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <span className="text-sm font-semibold text-white block">Mind Empowered</span>
              <span className="text-[10px] text-[#c9a090] tracking-widest block">#MeForYouth</span>
            </div>
          </div>

          <p className="text-[11px] text-[#9a6a5a] leading-relaxed mx-auto text-center flex-1 px-10">
            Illuminating minds, transforming lives. Championing the cause of mental health through awareness, education, and advocacy.
          </p>
        </div>

        <div className="border-t border-white/10 pt-2">
          <p className="text-[11px] text-[#9a6a5a] text-center m-0">
            © 2026 Mind Empowered. All rights reserved. — Illuminating minds. Transforming lives.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer