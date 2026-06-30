import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSeason } from '../context/SeasonContext';

export default function Navbar() {
  const { toggleSeason, isBeach } = useSeason();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Početna' },
    { to: '/meni', label: 'Cenovnik' },
    { to: '/galerija', label: 'Galerija' },
    { to: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isBeach
            ? 'bg-[#0d2b26]/95 backdrop-blur-lg shadow-lg shadow-teal-900/20'
            : 'bg-[#0f0a06]/95 backdrop-blur-lg shadow-lg shadow-amber-900/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-500 ${
            isBeach
              ? 'bg-gradient-to-br from-[#00a896] to-[#ff4e50] text-white shadow-lg shadow-teal-500/30'
              : 'bg-gradient-to-br from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-500/30'
          }`}>
            C
          </div>
          <div>
            <span className={`font-display font-bold text-lg tracking-wider transition-colors duration-500 ${
              isBeach ? 'text-white' : 'text-[#f5e6c8]'
            }`}>
              CAPANNA
            </span>
            <div className={`text-xs tracking-[0.2em] uppercase transition-colors duration-500 ${
              isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'
            }`}>
              Bar
            </div>
          </div>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium tracking-widest uppercase transition-all duration-300 relative group ${
                  isActive
                    ? isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'
                    : isBeach ? 'text-white/70 hover:text-white' : 'text-[#f5e6c8]/70 hover:text-[#f5e6c8]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  } ${isBeach ? 'bg-[#00a896]' : 'bg-[#d4af37]'}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Season Toggle + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Season Toggle */}
          <button
            onClick={toggleSeason}
            className="relative flex items-center gap-2 group"
            aria-label="Toggle season mode"
          >
            <span className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 hidden sm:block ${
              isBeach ? 'text-white/50' : 'text-[#d4af37]'
            }`}>
              {isBeach ? '' : 'City'}
            </span>
            
            {/* Toggle track */}
            <div className={`relative w-14 h-7 rounded-full transition-all duration-500 border ${
              isBeach
                ? 'bg-gradient-to-r from-[#00a896] to-[#02d3b4] border-[#00a896]/50 shadow-lg shadow-teal-500/30'
                : 'bg-gradient-to-r from-[#8B5E3C] to-[#d4af37] border-[#d4af37]/50 shadow-lg shadow-amber-500/30'
            }`}>
              {/* Toggle thumb */}
              <div className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-500 flex items-center justify-center text-sm ${
                isBeach
                  ? 'translate-x-7 bg-white'
                  : 'translate-x-0.5 bg-white'
              }`}>
                {isBeach ? '🌊' : '☕'}
              </div>
            </div>
            
            <span className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 hidden sm:block ${
              isBeach ? 'text-[#00a896]' : 'text-white/50'
            }`}>
              {isBeach ? 'Beach' : ''}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            } ${isBeach ? 'bg-white' : 'bg-[#f5e6c8]'}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            } ${isBeach ? 'bg-white' : 'bg-[#f5e6c8]'}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            } ${isBeach ? 'bg-white' : 'bg-[#f5e6c8]'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 overflow-hidden ${
        menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      } ${isBeach ? 'bg-[#0d2b26]/98' : 'bg-[#0f0a06]/98'} backdrop-blur-xl`}>
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium tracking-widest uppercase py-2 border-b transition-all duration-300 ${
                  isActive
                    ? isBeach
                      ? 'text-[#00a896] border-[#00a896]/30'
                      : 'text-[#d4af37] border-[#d4af37]/30'
                    : isBeach
                      ? 'text-white/70 border-white/10'
                      : 'text-[#f5e6c8]/70 border-[#f5e6c8]/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
