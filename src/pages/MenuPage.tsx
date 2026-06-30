import { useState, useRef, useEffect } from 'react';
import { useSeason } from '../context/SeasonContext';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import Footer from '../components/Footer';

interface MenuItem {
  name: string;
  price: string;
  desc?: string;
  ingredients?: string;
  allergens?: string;
  badge?: string;
  emoji?: string;
}

interface MenuCategory {
  id: string;
  label: string;
  emoji: string;
  season: 'city' | 'beach' | 'both';
  items: MenuItem[];
}

const cityMenu: MenuCategory[] = [
  {
    id: 'kafa',
    label: 'Kafa',
    emoji: '☕',
    season: 'city',
    items: [
      { name: 'Espresso', price: '180 din', desc: 'Dvostruki Arabica blend', ingredients: 'Arabica 100%, fine grind', allergens: 'Nema', badge: 'Bestseller', emoji: '☕' },
      { name: 'Cappuccino', price: '230 din', desc: 'Kremasto mleko, savršena pena', ingredients: 'Espresso, steamed milk', allergens: 'Mleko', emoji: '🥛' },
      { name: 'Flat White', price: '250 din', desc: 'Australijski stil, dvostruki shot', ingredients: 'Double espresso, microfoam', allergens: 'Mleko', badge: 'Premium', emoji: '☕' },
      { name: 'Irish Coffee', price: '580 din', desc: 'Jameson whiskey, kafa, šlag', ingredients: 'Espresso, Jameson, whipped cream, brown sugar', allergens: 'Mleko, gluten', badge: 'Signature', emoji: '🥃' },
      { name: 'Affogato', price: '320 din', desc: 'Vanila sladoled sa espressom', ingredients: 'Espresso, vanilla ice cream', allergens: 'Mleko, jaja', emoji: '🍨' },
      { name: 'Cold Brew', price: '280 din', desc: '24h hladna ekstrakcija', ingredients: 'Cold brew concentrate, water', allergens: 'Nema', emoji: '🧊' },
    ],
  },
  {
    id: 'zestina',
    label: 'Žestina',
    emoji: '🥃',
    season: 'city',
    items: [
      { name: 'Jameson', price: '350 din', desc: 'Irski whiskey 40ml', allergens: 'Gluten', badge: 'Top Izbor', emoji: '🥃' },
      { name: 'Jack Daniels', price: '380 din', desc: 'Tennessee whiskey 40ml', allergens: 'Gluten', emoji: '🥃' },
      { name: 'Hendricks Gin', price: '420 din', desc: 'Premium Scottish gin 40ml', allergens: 'Nema', badge: 'Premium', emoji: '🫙' },
      { name: 'Grey Goose Vodka', price: '450 din', desc: 'French premium vodka 40ml', allergens: 'Nema', emoji: '🫙' },
      { name: 'Aperol Spritz', price: '480 din', desc: 'Aperol, prosecco, soda, narandža', allergens: 'Sumpor-dioksid', badge: 'Popularno', emoji: '🍊' },
      { name: 'Negroni', price: '550 din', desc: 'Gin, Campari, vermouth', allergens: 'Sumpor-dioksid', emoji: '🍸' },
    ],
  },
  {
    id: 'pivo',
    label: 'Pivo',
    emoji: '🍺',
    season: 'both',
    items: [
      { name: 'Jelen Točeno', price: '200 din', desc: '0.4l / točeno', allergens: 'Gluten, ječam', badge: 'Draft', emoji: '🍺' },
      { name: 'Corona Extra', price: '280 din', desc: '0.33l boca', allergens: 'Gluten', emoji: '🍺' },
      { name: 'Heineken', price: '260 din', desc: '0.33l boca', allergens: 'Gluten', emoji: '🍺' },
      { name: 'Paulaner Weizen', price: '320 din', desc: 'Nemačko pšenično', allergens: 'Gluten, pšenica', badge: 'Craft', emoji: '🍺' },
    ],
  },
  {
    id: 'bezalkoholna',
    label: 'Bezalkoholna',
    emoji: '🥤',
    season: 'both',
    items: [
      { name: 'Limonada Domaća', price: '250 din', desc: 'Svež limun, menta, med', allergens: 'Nema', badge: 'Fresh', emoji: '🍋' },
      { name: 'Coca-Cola', price: '180 din', desc: '0.25l', allergens: 'Nema', emoji: '🥤' },
      { name: 'Sok od Jabuke', price: '180 din', desc: '0.2l, prirodni', allergens: 'Nema', emoji: '🍎' },
      { name: 'San Pellegrino', price: '200 din', desc: 'Mineralna voda 0.25l', allergens: 'Nema', emoji: '💧' },
    ],
  },
];

const beachMenu: MenuCategory[] = [
  {
    id: 'kokteli',
    label: 'Kokteli',
    emoji: '🍹',
    season: 'beach',
    items: [
      { name: 'Mojito', price: '520 din', desc: 'Havana Club, svež limun, menta, soda', ingredients: 'Havana Club 3y, lime, mint, sugar, soda water', allergens: 'Nema', badge: 'Bestseller', emoji: '🍹' },
      { name: 'Sex on the Beach', price: '540 din', desc: 'Vodka, Malibu, ananas, breskva', ingredients: 'Vodka, Malibu, pineapple juice, peach schnapps', allergens: 'Nema', badge: 'Signature', emoji: '🏖️' },
      { name: 'Piña Colada', price: '560 din', desc: 'Kokos rum, svež ananas, kokos krem', ingredients: 'White rum, coconut cream, pineapple', allergens: 'Nema', emoji: '🍍' },
      { name: 'Capanna Sunrise', price: '580 din', desc: 'Naš signature koktel – tekila, tequila sunrise twist', ingredients: 'Tequila, orange juice, grenadine, lime', allergens: 'Nema', badge: '🌟 Naš Specijalitet', emoji: '🌅' },
      { name: 'Tropical Storm', price: '560 din', desc: 'Mango, kokos, rum, paprika twist', ingredients: 'White rum, mango, coconut water, chili', allergens: 'Nema', emoji: '🌀' },
      { name: 'Hugo Spritz', price: '500 din', desc: 'Elderflower, prosecco, menta, limun', ingredients: 'Prosecco, elderflower syrup, soda, mint', allergens: 'Sumpor-dioksid', emoji: '🌸' },
      { name: 'Frozen Strawberry Daiquiri', price: '540 din', desc: 'Rum, jagoda, limun – blended', ingredients: 'White rum, fresh strawberry, lime, sugar', allergens: 'Nema', badge: 'Frozen', emoji: '🍓' },
      { name: 'Blue Lagoon', price: '520 din', desc: 'Vodka, Curaçao, limunada', ingredients: 'Vodka, Blue Curaçao, lemonade', allergens: 'Nema', emoji: '💙' },
    ],
  },
  {
    id: 'smoothie',
    label: 'Smoothie & Lemonada',
    emoji: '🍋',
    season: 'beach',
    items: [
      { name: 'Svež Mango Smoothie', price: '380 din', desc: 'Svež mango, jogurt, med', allergens: 'Mleko', badge: 'Fresh', emoji: '🥭' },
      { name: 'Tropski Smoothie', price: '380 din', desc: 'Ananas, kokos voda, banana', allergens: 'Nema', emoji: '🍍' },
      { name: 'Lemonade Capanna', price: '280 din', desc: 'Domaća limonada sa mentom i bobicastim voćem', allergens: 'Nema', badge: 'Bestseller', emoji: '🍋' },
      { name: 'Watermelon Mint Fresh', price: '300 din', desc: 'Lubenica, menta, limun, soda', allergens: 'Nema', emoji: '🍉' },
      { name: 'Strawberry Lemonade', price: '290 din', desc: 'Sveže jagode, limun, med', allergens: 'Nema', emoji: '🍓' },
    ],
  },
  {
    id: 'iced',
    label: 'Iced Coffee',
    emoji: '🧊',
    season: 'beach',
    items: [
      { name: 'Iced Latte', price: '300 din', desc: 'Espresso, mleko na ledu', allergens: 'Mleko', badge: 'Top Prodaja', emoji: '🥛' },
      { name: 'Cold Brew Tonic', price: '340 din', desc: 'Cold brew, tonic voda, citrus', allergens: 'Nema', badge: 'Premium', emoji: '✨' },
      { name: 'Iced Matcha Latte', price: '350 din', desc: 'Japanski matcha, kokosovo mleko, led', allergens: 'Nema', emoji: '🍵' },
      { name: 'Frappuccino', price: '320 din', desc: 'Espresso blended sa ledom i mlekom', allergens: 'Mleko', emoji: '🥤' },
    ],
  },
  {
    id: 'pivo',
    label: 'Pivo',
    emoji: '🍺',
    season: 'both',
    items: [
      { name: 'Corona + Limun', price: '300 din', desc: '0.33l, serviran sa svežim limunom', allergens: 'Gluten', badge: 'Beach Classic', emoji: '🍺' },
      { name: 'Heineken', price: '270 din', desc: '0.33l boca, hladna', allergens: 'Gluten', emoji: '🍺' },
      { name: 'Točeno Draft', price: '220 din', desc: '0.4l, savski hlad', allergens: 'Gluten', emoji: '🍺' },
    ],
  },
];

function MenuItemCard({ item, isBeach }: { item: MenuItem; isBeach: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl transition-all duration-300 overflow-hidden ${
        isBeach
          ? 'bg-[#0a2820]/60 border border-[#00a896]/10 hover:border-[#00a896]/30'
          : 'bg-[#1a110b]/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
      }`}
    >
      <div
        className="flex items-start justify-between p-4 cursor-pointer gap-3"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{item.emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-semibold text-sm ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                {item.name}
              </span>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider ${
                  isBeach
                    ? 'bg-[#00a896]/20 text-[#00a896]'
                    : 'bg-[#d4af37]/20 text-[#d4af37]'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
            {item.desc && (
              <p className={`text-xs mt-1 ${isBeach ? 'text-white/50' : 'text-[#f5e6c8]/50'}`}>{item.desc}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`font-bold text-sm ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
            {item.price}
          </span>
          {(item.ingredients || item.allergens) && (
            <span className={`text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''} ${isBeach ? 'text-white/30' : 'text-[#f5e6c8]/30'}`}>
              ▾
            </span>
          )}
        </div>
      </div>

      {/* Accordion expanded content */}
      {(item.ingredients || item.allergens) && (
        <div className={`overflow-hidden transition-all duration-400 ${expanded ? 'max-h-40' : 'max-h-0'}`}>
          <div className={`px-4 pb-4 pt-0 border-t text-xs space-y-2 ${isBeach ? 'border-[#00a896]/10' : 'border-[#d4af37]/10'}`}>
            {item.ingredients && (
              <div className="flex items-start gap-2 mt-3">
                <span className={isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}>Sastojci:</span>
                <span className={isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}>{item.ingredients}</span>
              </div>
            )}
            {item.allergens && (
              <div className="flex items-start gap-2">
                <span className={isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}>Alergeni:</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  item.allergens === 'Nema'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-orange-500/10 text-orange-400'
                }`}>
                  {item.allergens}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  const { isBeach } = useSeason();
  const [activeTab, setActiveTab] = useState('');
  const [showQR, setShowQR] = useState(false);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const currentMenu = isBeach ? beachMenu : cityMenu;

  // Reset tab when season changes
  useEffect(() => {
    setActiveTab(currentMenu[0].id);
  }, [isBeach]);

  // Initialize active tab
  useEffect(() => {
    if (!activeTab && currentMenu.length > 0) {
      setActiveTab(currentMenu[0].id);
    }
  }, [currentMenu, activeTab]);

  const activeCategory = currentMenu.find(c => c.id === activeTab) || currentMenu[0];

  // Slide indicator
  useEffect(() => {
    if (!tabsRef.current || !indicatorRef.current) return;
    const activeBtn = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    if (!activeBtn) return;
    const containerRect = tabsRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    indicatorRef.current.style.left = `${btnRect.left - containerRect.left}px`;
    indicatorRef.current.style.width = `${btnRect.width}px`;
  }, [activeTab, isBeach]);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://capannabar.rs/meni';

  return (
    <div className={`min-h-screen transition-colors duration-700 pt-20 ${isBeach ? 'bg-[#071a17]' : 'bg-[#0f0a06]'}`}>
      {/* Hero header */}
      <div className={`relative py-16 px-6 overflow-hidden ${isBeach ? 'bg-[#041410]' : 'bg-[#0a0705]'}`}>
        <div className={`absolute inset-0 ${
          isBeach
            ? 'bg-gradient-to-br from-[#00a896]/8 via-transparent to-[#ff4e50]/5'
            : 'bg-gradient-to-br from-[#d4af37]/8 via-transparent to-[#8B5E3C]/5'
        }`} />
        
        {/* Decorative background text */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none ${
          isBeach ? 'text-[#00a896]/4' : 'text-[#d4af37]/4'
        }`}>
          <span className="text-[20vw] font-display font-bold">MENU</span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
              {isBeach ? '🌊 Beach Mode Aktivan' : '☕ City Mode Aktivan'}
            </span>
            <h1 className={`mt-2 text-5xl lg:text-6xl font-display font-bold leading-none ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
              {isBeach ? 'Kokteli &' : 'Kafa &'}
              <br />
              <span className={isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}>
                {isBeach ? 'Osveženja' : 'Napici'}
              </span>
            </h1>
            <p className={`mt-4 max-w-md text-sm leading-relaxed ${isBeach ? 'text-white/60' : 'text-[#f5e6c8]/60'}`}>
              {isBeach
                ? 'Svaki koktel je pažljivo kreiran od svežih, tropskih sastojaka. Letnji raj u čaši.'
                : 'Premium kafa, craft pića i fini napici za svaki momenat dana.'}
            </p>
          </div>

          {/* QR Code Button */}
          <div className="flex-shrink-0 relative">
            <button
              onClick={() => setShowQR(p => !p)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isBeach
                  ? 'border-[#00a896]/30 text-[#00a896] hover:bg-[#00a896]/10'
                  : 'border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3z" />
              </svg>
              <span className="text-sm font-medium">QR Meni</span>
            </button>

            {/* QR Popup */}
            {showQR && (
              <div className={`mt-3 p-4 rounded-2xl border absolute z-20 shadow-2xl ${
                isBeach
                  ? 'bg-[#0a2820] border-[#00a896]/20'
                  : 'bg-[#1a110b] border-[#d4af37]/20'
              }`}>
                <div className="text-center mb-3">
                  <div className={`text-xs tracking-wider uppercase font-medium mb-1 ${isBeach ? 'text-[#00a896]' : 'text-[#d4af37]'}`}>
                    Skeniraj za meni
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg">
                  <QRCode value={pageUrl} size={140} />
                </div>
                <div className={`mt-2 text-center text-xs ${isBeach ? 'text-white/40' : 'text-[#f5e6c8]/40'}`}>
                  Otvara se u {isBeach ? 'Beach' : 'City'} modu
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Filter tabs */}
        <div
          ref={tabsRef}
          className={`relative flex flex-wrap gap-2 p-1.5 rounded-2xl mb-10 ${
            isBeach ? 'bg-[#0a2820]/80' : 'bg-[#1a110b]/80'
          }`}
        >
          {/* Sliding indicator */}
          <div
            ref={indicatorRef}
            className={`absolute top-1.5 h-[calc(100%-12px)] rounded-xl transition-all duration-400 pointer-events-none ${
              isBeach
                ? 'bg-gradient-to-r from-[#00a896] to-[#02c8b3] shadow-lg shadow-teal-500/20'
                : 'bg-gradient-to-r from-[#d4af37] to-[#a07f20] shadow-lg shadow-amber-500/20'
            }`}
            style={{ left: 0, width: 0 }}
          />
          {currentMenu.map(cat => (
            <button
              key={cat.id}
              data-tab={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${
                activeTab === cat.id
                  ? isBeach ? 'text-white' : 'text-[#1a110b]'
                  : isBeach ? 'text-white/50 hover:text-white/80' : 'text-[#f5e6c8]/50 hover:text-[#f5e6c8]/80'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === cat.id
                  ? isBeach ? 'bg-white/20 text-white' : 'bg-[#1a110b]/20 text-[#1a110b]'
                  : isBeach ? 'bg-white/10 text-white/40' : 'bg-white/5 text-[#f5e6c8]/40'
              }`}>
                {cat.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Category heading */}
        {activeCategory && (
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{activeCategory.emoji}</span>
              <div>
                <h2 className={`text-2xl font-display font-bold ${isBeach ? 'text-white' : 'text-[#f5e6c8]'}`}>
                  {activeCategory.label}
                </h2>
                <p className={`text-sm mt-1 ${isBeach ? 'text-[#00a896]/70' : 'text-[#d4af37]/70'}`}>
                  {activeCategory.items.length} stavki
                </p>
              </div>
            </div>
            <div className={`mt-4 h-px ${isBeach ? 'bg-gradient-to-r from-[#00a896]/30 to-transparent' : 'bg-gradient-to-r from-[#d4af37]/30 to-transparent'}`} />
          </div>
        )}

        {/* Menu items grid */}
        {activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCategory.items.map((item, i) => (
              <MenuItemCard key={i} item={item} isBeach={isBeach} />
            ))}
          </div>
        )}

        {/* Allergen notice */}
        <div className={`mt-12 p-4 rounded-xl text-xs ${isBeach ? 'bg-[#0a2820]/50 text-white/40' : 'bg-[#1a110b]/50 text-[#f5e6c8]/40'}`}>
          <strong className={isBeach ? 'text-[#00a896]/60' : 'text-[#d4af37]/60'}>Napomena o alergenima:</strong>{' '}
          Za više informacija o alergenima i sastojcima, pitajte naše osoblje. Sve cene su u dinarima (RSD) i uključuju PDV. Cene su podložne promeni.
        </div>
      </div>
      <Footer />
    </div>
  );
}
