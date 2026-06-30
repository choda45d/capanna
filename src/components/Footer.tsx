import { Link } from 'react-router-dom';
import { useSeason } from '../context/SeasonContext';

export default function Footer() {
  const { isBeach } = useSeason();

  return (
    <footer className={`border-t py-12 px-6 transition-colors duration-700 ${
      isBeach
        ? 'bg-[#041410] border-[#00a896]/10'
        : 'bg-[#0a0705] border-[#d4af37]/10'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                isBeach
                  ? 'bg-gradient-to-br from-[#00a896] to-[#ff4e50] text-white'
                  : 'bg-gradient-to-br from-[#d4af37] to-[#a07f20] text-[#1a110b]'
              }`}>
                C
              </div>
              <div>
                <div className={`font-display font-bold text-xl tracking-wider ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                  CAPANNA
                </div>
                <div className={`text-xs tracking-[0.3em] uppercase ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                  Bar
                </div>
              </div>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs ${isBeach ? 'text-white/40' : 'text-[#f5e6c8]/40'}`}>
              Premium kafa i kokteli. Gradski lounge zimi, beach bar leti — uvek Capanna.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/capannabar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @capannabar"
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all duration-300 hover:scale-110 ${
                  isBeach
                    ? 'bg-[#0a2820] border border-[#00a896]/15 hover:border-[#00a896]/40'
                    : 'bg-[#1a110b] border border-[#d4af37]/15 hover:border-[#d4af37]/40'
                }`}
              >
                📸
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className={`text-xs tracking-[0.3em] uppercase font-semibold mb-4 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
              Navigacija
            </div>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Početna' },
                { to: '/meni', label: 'Cenovnik' },
                { to: '/galerija', label: 'Galerija' },
                { to: '/kontakt', label: 'Kontakt' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${
                      isBeach ? 'text-white/40 hover:text-[#00a896]' : 'text-[#f5e6c8]/40 hover:text-[#d4af37]'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Location */}
          <div>
            <div className={`text-xs tracking-[0.3em] uppercase font-semibold mb-4 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
              Lokacija
            </div>
            <div>
              <div className={`text-sm font-medium ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {isBeach ? '🌊 Brioni Beach' : '☕ City Bar'}
              </div>
              <div className={`text-xs mt-1 ${isBeach ? 'text-[#00a896]/70' : 'text-[#d4af37]/70'}`}>
                {isBeach ? 'Plaža Sava' : 'Kuzminska 1'}
              </div>
              <div className={`text-xs ${isBeach ? 'text-white/40' : 'text-[#f5e6c8]/40'}`}>
                Sremska Mitrovica
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isBeach ? 'border-[#00a896]/10' : 'border-[#d4af37]/10'
        }`}>
          <div className={`text-xs ${isBeach ? 'text-white/20' : 'text-[#f5e6c8]/20'}`}>
            © {new Date().getFullYear()} Capanna Bar · Sremska Mitrovica · Sva prava zadržana
          </div>
          <div className={`text-xs flex items-center gap-2 ${isBeach ? 'text-[#00a896]/40' : 'text-[#d4af37]/40'}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
            {isBeach ? 'Letnja sezona aktiva' : 'Zimska sezona aktivna'}
          </div>
        </div>
      </div>
    </footer>
  );
}
