import { useSeason } from '../context/SeasonContext';

const currentMonth = new Date().getMonth();
const isCurrentlySummer = currentMonth >= 4 && currentMonth <= 8;

const hours = {
  city: [
    { day: 'Ponedeljak – Četvrtak', open: '08:00', close: '23:00' },
    { day: 'Petak', open: '08:00', close: '01:00' },
    { day: 'Subota', open: '09:00', close: '01:00' },
    { day: 'Nedeljom', open: '10:00', close: '22:00' },
  ],
  beach: [
    { day: 'Ponedeljak – Četvrtak', open: '10:00', close: '00:00' },
    { day: 'Petak', open: '10:00', close: '02:00' },
    { day: 'Subota', open: '09:00', close: '03:00' },
    { day: 'Nedeljom', open: '09:00', close: '00:00' },
  ],
};

const today = new Date().getDay(); // 0=Sun, 1=Mon...
const todayLabel = today === 0 ? 'Nedeljom' : today >= 5 ? (today === 5 ? 'Petak' : 'Subota') : 'Ponedeljak – Četvrtak';

function MapEmbed({ isBeach }: { isBeach: boolean }) {
  return (
    <div className={`relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden ${
      isBeach ? 'border border-[#00a896]/20' : 'border border-[#d4af37]/20'
    }`}>
      {/* Stylized SVG map */}
      <div className={`absolute inset-0 ${isBeach ? 'bg-[#0a2820]' : 'bg-[#1a110b]'}`}>
        <svg viewBox="0 0 400 300" className="w-full h-full" style={{ filter: 'saturate(0.7)' }}>
          {/* Background */}
          <rect width="400" height="300" fill={isBeach ? '#0a2820' : '#1a110b'} />

          {/* Grid lines (streets) */}
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="300" stroke={isBeach ? '#1a4a3a' : '#2a1a0e'} strokeWidth="1" />
          ))}
          {[40, 80, 120, 160, 200, 240, 280].map(y => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={isBeach ? '#1a4a3a' : '#2a1a0e'} strokeWidth="1" />
          ))}

          {/* Main roads */}
          <rect x="0" y="135" width="400" height="8" fill={isBeach ? '#1a4a3a' : '#2d1d0f'} />
          <rect x="195" y="0" width="10" height="300" fill={isBeach ? '#1a4a3a' : '#2d1d0f'} />

          {/* Sava River */}
          <path
            d="M 0 240 Q 80 230 160 245 Q 240 260 320 250 Q 360 245 400 255"
            stroke={isBeach ? '#00a896' : '#1a4a8a'}
            strokeWidth="24"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 0 240 Q 80 230 160 245 Q 240 260 320 250 Q 360 245 400 255"
            stroke={isBeach ? '#02d3b4' : '#2060bb'}
            strokeWidth="10"
            fill="none"
            opacity="0.4"
          />

          {/* City center block */}
          <rect x="160" y="100" width="60" height="50" rx="4" fill={isBeach ? '#0d3d30' : '#2a1a0e'} opacity="0.8" />
          <rect x="130" y="90" width="45" height="35" rx="3" fill={isBeach ? '#0d3d30' : '#2a1a0e'} opacity="0.6" />
          <rect x="215" y="105" width="40" height="40" rx="3" fill={isBeach ? '#0d3d30' : '#2a1a0e'} opacity="0.6" />

          {/* Kuzminska 1 pin (city location) */}
          <circle cx="190" cy="128" r="12" fill={isBeach ? '#ffffff22' : '#d4af37'} opacity={isBeach ? 0.3 : 0.9}>
            <animate attributeName="r" values={isBeach ? "8;8;8" : "10;14;10"} dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="190" cy="128" r="6" fill={isBeach ? '#ffffff' : '#d4af37'} opacity={isBeach ? 0.3 : 1} />
          <text x="205" y="118" fill={isBeach ? '#ffffff44' : '#d4af37'} fontSize="9" fontWeight="bold" opacity={isBeach ? 0.5 : 1}>Kuzminska 1</text>

          {/* Beach pin (Brioni) */}
          <circle cx="280" cy="238" r="12" fill={isBeach ? '#00a896' : '#ffffff22'} opacity={isBeach ? 1 : 0.3}>
            <animate attributeName="r" values={isBeach ? "10;15;10" : "8;8;8"} dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="238" r="6" fill={isBeach ? '#ffffff' : '#ffffff'} opacity={isBeach ? 1 : 0.3} />
          <text x="295" y="228" fill={isBeach ? '#00a896' : '#ffffff44'} fontSize="9" fontWeight="bold" opacity={isBeach ? 1 : 0.4}>Brioni Beach</text>

          {/* You are here label */}
          <text
            x="200"
            y="285"
            textAnchor="middle"
            fill={isBeach ? '#00a896' : '#d4af37'}
            fontSize="11"
            fontWeight="bold"
            opacity="0.8"
          >
            {isBeach ? '🌊 Brioni Plaža, Sava' : '☕ Kuzminska 1, SM'}
          </text>
        </svg>
      </div>

      {/* Overlay label */}
      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider ${
        isBeach ? 'bg-[#00a896]/90 text-white' : 'bg-[#d4af37]/90 text-[#1a110b]'
      }`}>
        {isBeach ? '🌊 Brioni Beach' : '☕ Kuzminska 1'}
      </div>

      <div className={`absolute bottom-4 right-4`}>
        <a
          href={isBeach
            ? 'https://maps.google.com/?q=Brioni+Bech+Sremska+Mitrovica'
            : 'https://maps.google.com/?q=Kuzminska+1+Sremska+Mitrovica'
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
            isBeach ? 'bg-[#00a896]/20 text-[#00a896] border border-[#00a896]/30' : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
          }`}
        >
          Otvori u Google Maps →
        </a>
      </div>
    </div>
  );
}

function HoursTable({ isBeach }: { isBeach: boolean }) {
  const data = isBeach ? hours.beach : hours.city;

  return (
    <div className="space-y-2">
      {data.map(({ day, open, close }) => {
        const isToday = day === todayLabel || (todayLabel === 'Petak' && day === 'Petak') || (todayLabel === 'Subota' && day === 'Subota');
        return (
          <div
            key={day}
            className={`flex items-center justify-between py-2.5 px-4 rounded-xl transition-all duration-300 ${
              isToday
                ? isBeach
                  ? 'bg-[#00a896]/15 border border-[#00a896]/25'
                  : 'bg-[#d4af37]/15 border border-[#d4af37]/25'
                : isBeach
                  ? 'bg-[#0a2820]/40 border border-transparent'
                  : 'bg-[#1a110b]/40 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              {isToday && (
                <span className={`w-1.5 h-1.5 rounded-full ${isBeach ? 'bg-[#00a896]' : 'bg-[#d4af37]'} animate-pulse`} />
              )}
              <span className={`text-sm ${
                isToday
                  ? isBeach ? 'text-[#00a896] font-semibold' : 'text-[#d4af37] font-semibold'
                  : isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'
              }`}>
                {day}
                {isToday && <span className="ml-2 text-xs opacity-70">(danas)</span>}
              </span>
            </div>
            <span className={`text-sm font-mono font-medium ${
              isToday
                ? isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'
                : isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'
            }`}>
              {open} – {close}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ContactPage() {
  const { isBeach } = useSeason();

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-700 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      {/* Header */}
      <div className={`py-16 px-6 text-center relative overflow-hidden ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
          <span className="text-[15vw] font-display font-bold">KONTAKT</span>
        </div>
        <div className="relative z-10">
          <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            Pronađi nas
          </span>
          <h1 className={`mt-3 text-5xl lg:text-6xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
            Kontakt
          </h1>
          <p className={`mt-4 max-w-md mx-auto text-sm leading-relaxed ${isBeach ? 'text-white/55' : 'text-[#f5e6c8]/55'}`}>
            Rezerviši sto, pronađi nas na mapi, ili nas kontaktiraj direktno. Uvek smo tu za tebe!
          </p>
        </div>
      </div>

      {/* Currently active notice */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${
          isBeach
            ? 'bg-[#00a896]/10 border border-[#00a896]/20'
            : 'bg-[#d4af37]/10 border border-[#d4af37]/20'
        }`}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isBeach ? 'bg-[#00a896]' : 'bg-emerald-400'}`} />
          </span>
          <div>
            <span className={`text-sm font-semibold ${isBeach ? 'text-[#00a896]' : 'text-emerald-400'}`}>
              Trenutno aktivna lokacija:{' '}
            </span>
            <span className={`text-sm ${isBeach ? 'text-white/80' : 'text-[#f5e6c8]/80'}`}>
              {isBeach ? 'Brioni Beach, Plaža Sava – Letnja sezona' : 'Kuzminska 1, Sremska Mitrovica – Zimska sezona'}
            </span>
          </div>
          {!isCurrentlySummer && isBeach && (
            <span className={`ml-auto text-xs px-2 py-1 rounded-lg bg-orange-500/20 text-orange-400`}>
              Ručno odabrano
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left column – Info */}
          <div className="space-y-8">
            {/* Map */}
            <div>
              <h2 className={`text-xl font-display font-bold mb-4 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                Lokacija
              </h2>
              <MapEmbed isBeach={isBeach} />
              
              {/* Active location card */}
              <div className={`p-4 rounded-xl mt-4 flex items-center gap-4 ${
                isBeach
                  ? 'bg-[#0a2820] border border-[#00a896]/30 ring-1 ring-[#00a896]/20'
                  : 'bg-[#1a110b] border border-[#d4af37]/30 ring-1 ring-[#d4af37]/20'
              }`}>
                <div className="text-2xl">{isBeach ? '🌊' : '☕'}</div>
                <div>
                  <div className={`font-semibold text-sm ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                    {isBeach ? 'Brioni Beach' : 'City Bar'}
                  </div>
                  <div className={`text-xs mt-0.5 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                    {isBeach ? 'Plaža Sava' : 'Kuzminska 1'}, Sremska Mitrovica
                  </div>
                </div>
                <div className={`ml-auto text-xs flex items-center gap-1.5 ${isBeach ? 'text-emerald-400' : 'text-emerald-400'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Otvoreno
                </div>
              </div>
            </div>

            {/* Working hours */}
            <div>
              <h2 className={`text-xl font-display font-bold mb-4 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                Radno Vreme
              </h2>
              <HoursTable isBeach={isBeach} />
            </div>

            {/* Contact info */}
            <div>
              <h2 className={`text-xl font-display font-bold mb-4 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                Kontakt Informacije
              </h2>
              <div className="space-y-3">
                {[
                  { icon: '📞', label: 'Telefon', value: '+381 22 XXX XXX', href: 'tel:+38122XXXXXX' },
                  { icon: '📸', label: 'Instagram', value: '@capannabar', href: 'https://instagram.com/capannabar' },
                ].map(({ icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group hover:scale-[1.02] ${
                      isBeach
                        ? 'bg-[#0a2820]/60 border border-[#00a896]/10 hover:border-[#00a896]/30'
                        : 'bg-[#1a110b]/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className={`text-xs tracking-wider uppercase ${isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}`}>
                        {label}
                      </div>
                      <div className={`text-sm font-medium mt-0.5 group-hover:translate-x-0.5 transition-transform ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                        {value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column – Reservation CTA */}
          <div>
            <div className={`rounded-2xl p-8 ${
              isBeach
                ? 'bg-[#041410] border border-[#00a896]/15'
                : 'bg-[#0a0705] border border-[#d4af37]/15'
            }`}>
              <h2 className={`text-xl font-display font-bold mb-2 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                Rezerviši Mesto
              </h2>
              <p className={`text-sm mb-8 leading-relaxed ${isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'}`}>
                Najbrži način da rezervišeš sto je poziv ili poruka na Instagramu – javljamo se odmah.
              </p>

              <div className="space-y-4">
                <a
                  href="tel:+38122XXXXXX"
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group ${
                    isBeach
                      ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40'
                      : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] text-[#1a110b] shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                  }`}
                >
                  <span className="text-3xl">📞</span>
                  <div className="flex-1">
                    <div className="text-xs tracking-widest uppercase font-semibold opacity-80">Pozovi nas</div>
                    <div className="text-lg font-display font-bold mt-0.5">+381 22 XXX XXX</div>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>

                <a
                  href="https://instagram.com/capannabar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group ${
                    isBeach
                      ? 'bg-[#0a2820]/60 border-[#00a896]/30 hover:border-[#00a896]/60'
                      : 'bg-[#1a110b]/60 border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  <span className="text-3xl">📸</span>
                  <div className="flex-1">
                    <div className={`text-xs tracking-widest uppercase font-semibold ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                      Pošalji DM
                    </div>
                    <div className={`text-lg font-display font-bold mt-0.5 ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                      @capannabar
                    </div>
                  </div>
                  <span className={`text-xl group-hover:translate-x-1 transition-transform duration-300 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>→</span>
                </a>
              </div>

              <p className={`text-center text-xs mt-8 ${isBeach ? 'text-white/25' : 'text-[#f5e6c8]/25'}`}>
                Javi nam broj gostiju, datum i lokaciju (☕ City ili 🌊 Beach) – sredićemo ostalo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
