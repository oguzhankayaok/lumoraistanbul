'use client'

// ============================================================
// SENKRON ISTANBUL — Tek Dosya Versiyon
// Space Istanbul benzeri minimal, beyaz, profesyonel tasarım
// İlanlar ve iletişim bilgileri BOŞ — kendin ekleyeceksin
// ============================================================

import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Menu, X, ChevronDown, ChevronRight, ChevronLeft,
  MapPin, Maximize2, BedDouble, Heart, Phone, Mail,
  Instagram, Youtube, Linkedin, ArrowUpRight, SlidersHorizontal,
  Building2, Home, Trees, Briefcase
} from 'lucide-react'

// ============================================================
// TYPES
// ============================================================
type PropertyType = 'sale' | 'rent'
type PropertyCategory = 'apartment' | 'villa' | 'land' | 'commercial'
type Lang = 'tr' | 'en'
type Page = 'home' | 'properties' | 'about' | 'contact' | 'favorites' | 'detail'

interface Property {
  id: string
  title: string
  location: string
  district: string
  price: string          // "₺ 12.500.000" ya da "İletişime geçiniz" — sen dolduracaksın
  type: PropertyType
  category: PropertyCategory
  rooms: string          // "3+1" gibi
  m2: number
  floor?: string
  image: string          // Unsplash veya kendi görselin
  featured: boolean
  badge?: string         // "YENİ", "ÖZEL" vb.
}

// ============================================================
// ★★★ BURAYA KENDİ İLANLARINI EKLE ★★★
// Aşağıdaki dizi şu an boş. Her ilan için bir obje ekle.
// Örnek format yorum olarak bırakıldı.
// ============================================================
const PROPERTIES: Property[] = [
  // {
  //   id: '1',
  //   title: 'Beşiktaş Boğaz Manzaralı Lüks Daire',
  //   location: 'Sinanpaşa, Beşiktaş',
  //   district: 'Beşiktaş',
  //   price: '₺ 45.000.000',
  //   type: 'sale',
  //   category: 'apartment',
  //   rooms: '4+1',
  //   m2: 220,
  //   floor: '8. Kat',
  //   image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  //   featured: true,
  //   badge: 'ÖZEL',
  // },
]

// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
  tr: {
    nav: {
      sale: 'SATILIK', rent: 'KİRALIK', projects: 'PROJELER',
      about: 'HAKKIMIZDA', contact: 'İLETİŞİM', favorites: 'Favoriler',
    },
    hero: {
      tag: 'Lüks Gayrimenkul Danışmanlığı',
      title: 'İstanbul\'un En\nSeçkin Mülkleri',
      subtitle: 'Uzman danışmanlarımızla hayalinizdeki mülkü birlikte buluyoruz.',
    },
    search: {
      residential: 'KONUT', commercial: 'İŞYERİ', land: 'ARSA',
      sale: 'Satılık', rent: 'Kiralık',
      type: 'Mülk Tipi', location: 'Konum veya ilçe ara...',
      minPrice: 'Min Fiyat', maxPrice: 'Max Fiyat',
      minM2: 'Min m²', maxM2: 'Max m²',
      search: 'ARA',
    },
    featured: 'ÖNE ÇIKANLAR',
    viewAll: 'Tümünü Gör',
    noResults: 'Henüz ilan eklenmedi.',
    noResultsSub: 'İlanlarınızı page.tsx dosyasındaki PROPERTIES dizisine ekleyebilirsiniz.',
    about: {
      tag: 'HAKKIMIZDA',
      title: 'İstanbul\'da\nLüks Gayrimenkul\nDanışmanlığı',
      p1: 'Yılların deneyimi ve uzman kadromuzla İstanbul\'un en prestijli bölgelerinde gayrimenkul danışmanlığı hizmeti sunuyoruz.',
      p2: 'Satılık ve kiralık konut, villa, arsa ve ticari mülklerde müşterilerimize en doğru yatırım kararlarını vermeleri için rehberlik ediyoruz.',
    },
    contact: {
      tag: 'İLETİŞİM',
      title: 'Bizimle\nİletişime Geçin',
      name: 'Ad Soyad', email: 'E-posta', phone: 'Telefon',
      message: 'Mesajınız', send: 'GÖNDER',
      sending: 'GÖNDERİLİYOR...',
      success: 'Mesajınız iletildi. En kısa sürede dönüş yapacağız.',
    },
    footer: {
      desc: 'İstanbul\'un lüks gayrimenkul danışmanlık firması.',
      links: 'Hızlı Bağlantılar', contact: 'İletişim',
      rights: 'Tüm hakları saklıdır.',
    },
    sale: 'Satılık', rent: 'Kiralık',
    detail: 'İncele', back: '← Portföy',
    inquiry: 'Bilgi Al', whatsapp: 'WhatsApp',
    fav: 'Favorilere Ekle', unfav: 'Favorilerden Çıkar',
    favPage: 'FAVORİLERİM',
    noFav: 'Henüz favori eklemediniz.',
    lang: 'EN',
  },
  en: {
    nav: {
      sale: 'FOR SALE', rent: 'FOR RENT', projects: 'PROJECTS',
      about: 'ABOUT', contact: 'CONTACT', favorites: 'Favorites',
    },
    hero: {
      tag: 'Luxury Real Estate Advisory',
      title: 'Istanbul\'s Most\nExclusive Properties',
      subtitle: 'Together with our expert consultants, we find the property of your dreams.',
    },
    search: {
      residential: 'RESIDENTIAL', commercial: 'COMMERCIAL', land: 'LAND',
      sale: 'For Sale', rent: 'For Rent',
      type: 'Property Type', location: 'Search location or district...',
      minPrice: 'Min Price', maxPrice: 'Max Price',
      minM2: 'Min m²', maxM2: 'Max m²',
      search: 'SEARCH',
    },
    featured: 'FEATURED',
    viewAll: 'View All',
    noResults: 'No listings added yet.',
    noResultsSub: 'You can add your listings to the PROPERTIES array in page.tsx.',
    about: {
      tag: 'ABOUT US',
      title: 'Luxury Real Estate\nAdvisory\nin Istanbul',
      p1: 'With years of experience and our expert team, we provide real estate consultancy in Istanbul\'s most prestigious neighborhoods.',
      p2: 'We guide our clients in making the right investment decisions for residential, villa, land and commercial properties.',
    },
    contact: {
      tag: 'CONTACT',
      title: 'Get in\nTouch With Us',
      name: 'Full Name', email: 'Email', phone: 'Phone',
      message: 'Your Message', send: 'SEND',
      sending: 'SENDING...',
      success: 'Your message has been received. We will get back to you shortly.',
    },
    footer: {
      desc: 'Istanbul\'s luxury real estate advisory firm.',
      links: 'Quick Links', contact: 'Contact',
      rights: 'All rights reserved.',
    },
    sale: 'For Sale', rent: 'For Rent',
    detail: 'View', back: '← Portfolio',
    inquiry: 'Inquire', whatsapp: 'WhatsApp',
    fav: 'Add to Favorites', unfav: 'Remove',
    favPage: 'MY FAVORITES',
    noFav: 'You have no favorites yet.',
    lang: 'TR',
  },
}

// ============================================================
// CONTEXT
// ============================================================
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'tr', setLang: () => {} })
function useLang() { return useContext(LangCtx) }

// ============================================================
// FAVORITES HOOK
// ============================================================
function useFavorites() {
  const [favs, setFavs] = useState<string[]>([])
  useEffect(() => {
    try { const s = localStorage.getItem('senkron_favs'); if (s) setFavs(JSON.parse(s)) } catch {}
  }, [])
  const toggle = useCallback((id: string) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem('senkron_favs', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])
  return { favs, toggle, isFav: (id: string) => favs.includes(id) }
}

// ============================================================
// UTILS
// ============================================================
function cn(...c: (string | false | undefined | null)[]) { return c.filter(Boolean).join(' ') }

// ============================================================
// TOAST
// ============================================================
type ToastItem = { id: number; msg: string }
let _listeners: ((t: ToastItem[]) => void)[] = []
let _toasts: ToastItem[] = []
let _n = 0
function toast(msg: string) {
  const id = ++_n
  _toasts = [..._toasts, { id, msg }]
  _listeners.forEach(l => l([..._toasts]))
  setTimeout(() => { _toasts = _toasts.filter(t => t.id !== id); _listeners.forEach(l => l([..._toasts])) }, 3500)
}
function Toast() {
  const [items, setItems] = useState<ToastItem[]>([])
  useEffect(() => { _listeners.push(setItems); return () => { _listeners = _listeners.filter(l => l !== setItems) } }, [])
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {items.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="bg-neutral-900 text-white text-sm px-6 py-3 tracking-wide pointer-events-auto">
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, onNav }: { page: Page; onNav: (p: Page, sub?: string) => void }) {
  const { lang, setLang } = useLang()
  const t = T[lang]
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = page === 'home'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: t.nav.sale, page: 'properties' as Page, sub: 'sale' },
    { label: t.nav.rent, page: 'properties' as Page, sub: 'rent' },
    { label: t.nav.about, page: 'about' as Page },
    { label: t.nav.contact, page: 'contact' as Page },
  ]

  const navBg = scrolled || !isHome

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      navBg ? 'bg-white border-b border-neutral-200' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <button onClick={() => onNav('home')} className="flex flex-col leading-none group">
          <span className={cn('text-xl font-black tracking-[0.15em] transition-colors',
            navBg ? 'text-neutral-900' : 'text-white')}>SENKRON</span>
          <span className={cn('text-[9px] tracking-[0.45em] font-medium transition-colors',
            navBg ? 'text-neutral-400' : 'text-white/60')}>ISTANBUL</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <button key={l.label} onClick={() => onNav(l.page, l.sub)}
              className={cn('text-[11px] font-semibold tracking-[0.18em] transition-colors hover:opacity-60',
                navBg ? 'text-neutral-800' : 'text-white')}>
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden lg:flex items-center gap-5">
          <button onClick={() => onNav('favorites')}
            className={cn('text-[11px] font-semibold tracking-[0.15em] transition-colors hover:opacity-60',
              navBg ? 'text-neutral-600' : 'text-white/80')}>
            ♥ {t.nav.favorites}
          </button>
          <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className={cn('text-[11px] font-semibold tracking-[0.18em] border px-3 py-1.5 transition-colors hover:opacity-70',
              navBg ? 'border-neutral-300 text-neutral-600' : 'border-white/40 text-white/80')}>
            {t.lang}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
          {mobileOpen
            ? <X size={22} className={navBg ? 'text-neutral-900' : 'text-white'} />
            : <Menu size={22} className={navBg ? 'text-neutral-900' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-neutral-200">
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map(l => (
                <button key={l.label} onClick={() => { onNav(l.page, l.sub); setMobileOpen(false) }}
                  className="text-left text-sm font-semibold tracking-[0.15em] text-neutral-800 hover:text-neutral-500 transition-colors">
                  {l.label}
                </button>
              ))}
              <div className="flex items-center gap-4 pt-2 border-t border-neutral-100">
                <button onClick={() => { onNav('favorites'); setMobileOpen(false) }}
                  className="text-sm font-semibold tracking-wider text-neutral-600">♥ {t.nav.favorites}</button>
                <button onClick={() => { setLang(lang === 'tr' ? 'en' : 'tr') }}
                  className="text-sm font-semibold tracking-wider border border-neutral-300 px-3 py-1 text-neutral-600">
                  {t.lang}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection({ onNav }: { onNav: (p: Page, sub?: string) => void }) {
  const { lang } = useLang()
  const t = T[lang]
  const [tab, setTab] = useState<'residential' | 'commercial' | 'land'>('residential')
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale')
  const [search, setSearch] = useState('')

  const handleSearch = () => onNav('properties')

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&q=85)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-white/60 text-[11px] tracking-[0.5em] font-medium uppercase mb-6">
          {t.hero.tag}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="text-white text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-10 whitespace-pre-line">
          {t.hero.title}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/60 text-base md:text-lg mb-12 font-light">
          {t.hero.subtitle}
        </motion.p>

        {/* Search box */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-neutral-200">
            {(['residential', 'commercial', 'land'] as const).map(tb => (
              <button key={tb} onClick={() => setTab(tb)}
                className={cn('flex-1 py-4 text-[11px] font-bold tracking-[0.2em] transition-colors',
                  tab === tb ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-800')}>
                {t.search[tb]}
              </button>
            ))}
          </div>

          {/* Sale / Rent toggle */}
          <div className="flex gap-1 px-6 pt-5">
            {(['sale', 'rent'] as const).map(lt => (
              <button key={lt} onClick={() => setListingType(lt)}
                className={cn('px-5 py-2 text-[11px] font-bold tracking-[0.15em] transition-colors',
                  listingType === lt ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-700')}>
                {t.search[lt]}
              </button>
            ))}
          </div>

          {/* Search inputs */}
          <div className="flex flex-col md:flex-row gap-0 px-6 pb-6 pt-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.search.location}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-4 py-3.5 border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors bg-neutral-50" />
            </div>
            <button onClick={handleSearch}
              className="md:ml-3 mt-3 md:mt-0 bg-neutral-900 hover:bg-neutral-700 text-white px-10 py-3.5 text-[11px] font-bold tracking-[0.25em] transition-colors whitespace-nowrap flex items-center justify-center gap-2">
              <Search size={14} /> {t.search.search}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-white/40 cursor-pointer" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="w-px h-8 bg-white/30" />
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================================
// PROPERTY CARD
// ============================================================
function PropertyCard({ prop, onNav, idx = 0 }: { prop: Property; onNav: (p: Page, id?: string) => void; idx?: number }) {
  const { lang } = useLang()
  const t = T[lang]
  const { isFav, toggle } = useFavorites()
  const fav = isFav(prop.id)

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: idx * 0.07, duration: 0.5 }}
      className="group bg-white border border-neutral-200 hover:border-neutral-400 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
      onClick={() => onNav('detail', prop.id)}>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img src={prop.image} alt={prop.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('text-[9px] font-bold tracking-[0.2em] px-2.5 py-1',
            prop.type === 'sale' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border border-neutral-300')}>
            {prop.type === 'sale' ? t.sale.toUpperCase() : t.rent.toUpperCase()}
          </span>
          {prop.badge && (
            <span className="text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 bg-amber-500 text-white">
              {prop.badge}
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button onClick={e => { e.stopPropagation(); toggle(prop.id) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
          <Heart size={14} className={fav ? 'fill-red-500 text-red-500' : 'text-neutral-500'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-neutral-600 transition-colors line-clamp-2">
            {prop.title}
          </h3>
          <ArrowUpRight size={16} className="text-neutral-400 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex items-center gap-1 mb-4">
          <MapPin size={11} className="text-neutral-400 shrink-0" />
          <span className="text-[12px] text-neutral-500 tracking-wide">{prop.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-[11px] text-neutral-500 mb-4 pb-4 border-b border-neutral-100">
          {prop.rooms && (
            <span className="flex items-center gap-1"><BedDouble size={12} /> {prop.rooms}</span>
          )}
          <span className="flex items-center gap-1"><Maximize2 size={12} /> {prop.m2} m²</span>
          {prop.floor && <span>{prop.floor}</span>}
        </div>

        <div className="flex items-center justify-between">
          <p className="font-black text-neutral-900 text-lg tracking-tight">{prop.price}</p>
          <button onClick={e => { e.stopPropagation(); onNav('detail', prop.id) }}
            className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors border border-neutral-200 hover:border-neutral-600 px-3 py-1.5">
            {t.detail.toUpperCase()}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// FEATURED SECTION (Homepage)
// ============================================================
function FeaturedSection({ onNav }: { onNav: (p: Page, id?: string) => void }) {
  const { lang } = useLang()
  const t = T[lang]
  const featured = PROPERTIES.filter(p => p.featured)

  return (
    <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] font-bold tracking-[0.5em] text-neutral-400 mb-3">{t.featured}</p>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 leading-tight">
            {lang === 'tr' ? <>Öne Çıkan<br />İlanlar</> : <>Featured<br />Listings</>}
          </h2>
        </div>
        <button onClick={() => onNav('properties')}
          className="hidden md:flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors group">
          {t.viewAll}
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {featured.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-neutral-300">
          <Building2 size={32} className="text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 font-medium">{t.noResults}</p>
          <p className="text-neutral-400 text-sm mt-1">{t.noResultsSub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((p, i) => (
            <PropertyCard key={p.id} prop={p} onNav={onNav} idx={i} />
          ))}
        </div>
      )}

      <div className="md:hidden mt-8 text-center">
        <button onClick={() => onNav('properties')}
          className="text-[11px] font-bold tracking-[0.2em] border border-neutral-300 px-8 py-3 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors">
          {t.viewAll.toUpperCase()}
        </button>
      </div>
    </section>
  )
}

// ============================================================
// STATS BAND
// ============================================================
function StatsBand() {
  const { lang } = useLang()
  const stats = lang === 'tr'
    ? [{ n: '20+', l: 'Yıllık Deneyim' }, { n: '2.500+', l: 'Satılan Mülk' }, { n: '₺50B+', l: 'İşlem Hacmi' }, { n: '98%', l: 'Müşteri Memnuniyeti' }]
    : [{ n: '20+', l: 'Years Experience' }, { n: '2,500+', l: 'Properties Sold' }, { n: '₺50B+', l: 'Transaction Volume' }, { n: '98%', l: 'Client Satisfaction' }]

  return (
    <div className="bg-neutral-900 py-14 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(s => (
          <div key={s.n} className="text-center">
            <p className="text-white text-3xl md:text-4xl font-black mb-1">{s.n}</p>
            <p className="text-neutral-400 text-[11px] tracking-[0.25em] font-medium uppercase">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// CATEGORY LINKS
// ============================================================
function CategoryLinks({ onNav }: { onNav: (p: Page) => void }) {
  const { lang } = useLang()
  const cats = lang === 'tr'
    ? [
        { icon: Home, label: 'Satılık Daire', sub: 'sale' },
        { icon: Building2, label: 'Kiralık Daire', sub: 'rent' },
        { icon: Trees, label: 'Villa & Müstakil', sub: 'sale' },
        { icon: Briefcase, label: 'Ticari Mülkler', sub: 'sale' },
      ]
    : [
        { icon: Home, label: 'Apartments for Sale', sub: 'sale' },
        { icon: Building2, label: 'Apartments for Rent', sub: 'rent' },
        { icon: Trees, label: 'Villas & Houses', sub: 'sale' },
        { icon: Briefcase, label: 'Commercial Properties', sub: 'sale' },
      ]

  return (
    <section className="py-16 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map(c => (
          <button key={c.label} onClick={() => onNav('properties')}
            className="group flex flex-col items-center gap-3 p-8 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 transition-all duration-300">
            <c.icon size={24} className="text-neutral-400 group-hover:text-white transition-colors" />
            <span className="text-[12px] font-bold tracking-[0.1em] text-neutral-700 group-hover:text-white transition-colors text-center">
              {c.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

// ============================================================
// ABOUT SECTION
// ============================================================
function AboutSection() {
  const { lang } = useLang()
  const t = T[lang]

  return (
    <section id="about" className="py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-[10px] font-bold tracking-[0.5em] text-neutral-400 mb-5">{t.about.tag}</p>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 leading-tight mb-8 whitespace-pre-line">
            {t.about.title}
          </h2>
          <div className="space-y-4 text-neutral-600 leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          className="relative">
          <div className="aspect-[4/5] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85"
              alt="Istanbul" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-neutral-900 text-white p-8 w-48">
            <p className="text-4xl font-black">20+</p>
            <p className="text-[10px] tracking-[0.2em] text-neutral-400 mt-1 uppercase">
              {lang === 'tr' ? 'Yıllık\nDeneyim' : 'Years of\nExperience'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// CONTACT SECTION
// ============================================================
function ContactSection() {
  const { lang } = useLang()
  const t = T[lang]
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.name || !form.email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    toast(t.contact.success)
    setForm({ name: '', email: '', phone: '', message: '' })
    setLoading(false)
  }

  return (
    <section id="contact" className="py-28 bg-neutral-50 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-[10px] font-bold tracking-[0.5em] text-neutral-400 mb-5">{t.contact.tag}</p>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 leading-tight mb-10 whitespace-pre-line">
            {t.contact.title}
          </h2>

          {/* Contact info — BURAYA KENDİ BİLGİLERİNİ EKLE */}
          <div className="space-y-5">
            {/* Adres */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} className="text-neutral-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-0.5">
                  {lang === 'tr' ? 'ADRES' : 'ADDRESS'}
                </p>
                {/* ↓ BURAYA KENDİ ADRESİNİ YAZ */}
                <p className="text-neutral-700 text-sm">Adresinizi buraya ekleyin</p>
              </div>
            </div>
            {/* Telefon */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={16} className="text-neutral-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-0.5">
                  {lang === 'tr' ? 'TELEFON' : 'PHONE'}
                </p>
                {/* ↓ BURAYA KENDİ TELEFONUNU YAZ */}
                <p className="text-neutral-700 text-sm">Telefon numaranızı ekleyin</p>
              </div>
            </div>
            {/* E-posta */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={16} className="text-neutral-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-0.5">
                  {lang === 'tr' ? 'E-POSTA' : 'EMAIL'}
                </p>
                {/* ↓ BURAYA KENDİ E-POSTANI YAZ */}
                <p className="text-neutral-700 text-sm">E-posta adresinizi ekleyin</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3 mt-10">
            {[Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#"
                className="w-10 h-10 border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 flex items-center justify-center transition-all group">
                <Icon size={15} className="text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-white border border-neutral-200 p-8 md:p-10">
          <div className="space-y-5">
            {[
              { key: 'name', label: t.contact.name, type: 'text' },
              { key: 'email', label: t.contact.email, type: 'email' },
              { key: 'phone', label: t.contact.phone, type: 'tel' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-2">{f.label.toUpperCase()}</label>
                <input type={f.type} value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-2">{t.contact.message.toUpperCase()}</label>
              <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 focus:outline-none focus:border-neutral-800 transition-colors resize-none" />
            </div>
            <button onClick={submit} disabled={loading}
              className="w-full py-4 bg-neutral-900 hover:bg-neutral-700 disabled:opacity-50 text-white text-[11px] font-bold tracking-[0.3em] transition-colors">
              {loading ? t.contact.sending : t.contact.send}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ onNav }: { onNav: (p: Page) => void }) {
  const { lang } = useLang()
  const t = T[lang]
  const year = new Date().getFullYear()
  const links = [
    { label: t.nav.sale, page: 'properties' as Page },
    { label: t.nav.rent, page: 'properties' as Page },
    { label: t.nav.about, page: 'about' as Page },
    { label: t.nav.contact, page: 'contact' as Page },
  ]

  return (
    <footer className="bg-neutral-900 text-neutral-400 py-16 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="text-white text-2xl font-black tracking-[0.15em]">SENKRON</p>
              <p className="text-neutral-500 text-[9px] tracking-[0.45em] font-medium">ISTANBUL</p>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500">{t.footer.desc}</p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 border border-neutral-700 hover:border-neutral-400 flex items-center justify-center transition-colors group">
                  <Icon size={14} className="text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-5">{t.footer.links.toUpperCase()}</p>
            <ul className="space-y-3">
              {links.map(l => (
                <li key={l.label}>
                  <button onClick={() => onNav(l.page)}
                    className="text-sm text-neutral-500 hover:text-white transition-colors tracking-wide">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact placeholder */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 mb-5">{t.footer.contact.toUpperCase()}</p>
            <ul className="space-y-3 text-sm text-neutral-500">
              {/* ↓ BURAYA KENDİ BİLGİLERİNİ EKLE */}
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> Adresiniz</li>
              <li className="flex items-center gap-2"><Phone size={14} /> Telefonunuz</li>
              <li className="flex items-center gap-2"><Mail size={14} /> E-postanız</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-600 tracking-wider">
            © {year} Senkron Istanbul. {t.footer.rights}
          </p>
          <div className="flex gap-5">
            {['KVKK', lang === 'tr' ? 'Gizlilik' : 'Privacy', lang === 'tr' ? 'Kullanım Şartları' : 'Terms'].map(l => (
              <button key={l} className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors tracking-wide">{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ onNav }: { onNav: (p: Page, sub?: string) => void }) {
  return (
    <>
      <HeroSection onNav={onNav} />
      <CategoryLinks onNav={onNav} />
      <FeaturedSection onNav={onNav} />
      <StatsBand />
      <AboutSection />
      <ContactSection />
    </>
  )
}

// ============================================================
// PROPERTIES PAGE
// ============================================================
function PropertiesPage({ onNav, initialType }: { onNav: (p: Page, id?: string) => void; initialType?: string }) {
  const { lang } = useLang()
  const t = T[lang]
  const [type, setType] = useState<'' | 'sale' | 'rent'>(initialType === 'sale' ? 'sale' : initialType === 'rent' ? 'rent' : '')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'' | PropertyCategory>('')

  const cats: { value: '' | PropertyCategory; label: string }[] = [
    { value: '', label: lang === 'tr' ? 'Tümü' : 'All' },
    { value: 'apartment', label: lang === 'tr' ? 'Daire' : 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: lang === 'tr' ? 'Ticari' : 'Commercial' },
    { value: 'land', label: lang === 'tr' ? 'Arsa' : 'Land' },
  ]

  const filtered = PROPERTIES.filter(p => {
    if (type && p.type !== type) return false
    if (category && p.category !== category) return false
    if (search) {
      const q = search.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q) && !p.district.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Page header */}
      <div className="bg-neutral-900 py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.5em] text-neutral-400 mb-3">
            {lang === 'tr' ? 'PORTFÖY' : 'PORTFOLIO'}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            {lang === 'tr' ? 'Tüm İlanlar' : 'All Listings'}
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-neutral-200 sticky top-[72px] z-30 px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          {/* Type toggle */}
          <div className="flex">
            {[{ v: '' as const, l: lang === 'tr' ? 'Tümü' : 'All' }, { v: 'sale' as const, l: t.sale }, { v: 'rent' as const, l: t.rent }].map(o => (
              <button key={o.v} onClick={() => setType(o.v)}
                className={cn('px-4 py-2 text-[11px] font-bold tracking-[0.15em] border transition-colors',
                  type === o.v ? 'bg-neutral-900 text-white border-neutral-900' : 'text-neutral-500 border-neutral-200 hover:border-neutral-400')}>
                {o.l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Category */}
          <select value={category} onChange={e => setCategory(e.target.value as '' | PropertyCategory)}
            className="px-4 py-2 text-[11px] font-bold tracking-[0.1em] border border-neutral-200 text-neutral-600 focus:outline-none focus:border-neutral-800 bg-white">
            {cats.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t.search.location}
              className="w-full pl-8 pr-4 py-2 text-sm border border-neutral-200 focus:outline-none focus:border-neutral-800 transition-colors" />
          </div>

          <p className="text-[11px] text-neutral-400 ml-auto font-medium">
            {filtered.length} {lang === 'tr' ? 'ilan' : 'listings'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {filtered.length === 0 ? (
          <div className="py-32 text-center">
            <Building2 size={40} className="text-neutral-200 mx-auto mb-5" />
            <p className="text-neutral-500 font-medium text-lg">{t.noResults}</p>
            <p className="text-neutral-400 text-sm mt-2 max-w-md mx-auto">{t.noResultsSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => <PropertyCard key={p.id} prop={p} onNav={onNav} idx={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// DETAIL PAGE
// ============================================================
function DetailPage({ propertyId, onNav }: { propertyId: string; onNav: (p: Page, id?: string) => void }) {
  const { lang } = useLang()
  const t = T[lang]
  const { isFav, toggle } = useFavorites()
  const [imgIdx, setImgIdx] = useState(0)
  const prop = PROPERTIES.find(p => p.id === propertyId)

  if (!prop) return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-neutral-400 text-lg mb-6">{lang === 'tr' ? 'İlan bulunamadı.' : 'Listing not found.'}</p>
        <button onClick={() => onNav('properties')} className="text-sm font-bold tracking-[0.2em] border border-neutral-300 px-6 py-3 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors">
          {t.back.toUpperCase()}
        </button>
      </div>
    </div>
  )

  const fav = isFav(prop.id)
  const related = PROPERTIES.filter(p => p.id !== prop.id && p.category === prop.category).slice(0, 3)

  return (
    <div className="min-h-screen pt-[72px]">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-4">
        <button onClick={() => onNav('properties')}
          className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2">
          <ChevronLeft size={14} /> {t.back.toUpperCase()}
        </button>
      </div>

      {/* Main image */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
        <div className="relative aspect-[21/9] overflow-hidden bg-neutral-100">
          <AnimatePresence mode="wait">
            <motion.img key={imgIdx}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
          </AnimatePresence>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={cn('text-[9px] font-bold tracking-[0.2em] px-3 py-1.5',
              prop.type === 'sale' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border border-white')}>
              {prop.type === 'sale' ? t.sale.toUpperCase() : t.rent.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 leading-tight mb-3">{prop.title}</h1>
            <div className="flex items-center gap-2 mb-8">
              <MapPin size={14} className="text-neutral-400" />
              <span className="text-neutral-500 text-sm">{prop.location}</span>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {prop.rooms && (
                <div className="border border-neutral-200 p-5 text-center">
                  <BedDouble size={18} className="text-neutral-400 mx-auto mb-2" />
                  <p className="font-black text-neutral-900 text-xl">{prop.rooms}</p>
                  <p className="text-[10px] tracking-[0.2em] text-neutral-400 font-bold uppercase mt-0.5">
                    {lang === 'tr' ? 'Oda' : 'Rooms'}
                  </p>
                </div>
              )}
              <div className="border border-neutral-200 p-5 text-center">
                <Maximize2 size={18} className="text-neutral-400 mx-auto mb-2" />
                <p className="font-black text-neutral-900 text-xl">{prop.m2}</p>
                <p className="text-[10px] tracking-[0.2em] text-neutral-400 font-bold uppercase mt-0.5">m²</p>
              </div>
              {prop.floor && (
                <div className="border border-neutral-200 p-5 text-center">
                  <Building2 size={18} className="text-neutral-400 mx-auto mb-2" />
                  <p className="font-black text-neutral-900 text-xl">{prop.floor}</p>
                  <p className="text-[10px] tracking-[0.2em] text-neutral-400 font-bold uppercase mt-0.5">
                    {lang === 'tr' ? 'Kat' : 'Floor'}
                  </p>
                </div>
              )}
            </div>

            {/* Description placeholder */}
            <div className="border-t border-neutral-200 pt-8">
              <h2 className="font-black text-neutral-900 text-xl mb-4">
                {lang === 'tr' ? 'Açıklama' : 'Description'}
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed italic">
                {lang === 'tr' ? '— İlan açıklaması PROPERTIES dizisine description alanı ekleyerek buraya gelecek. —'
                  : '— Listing description will appear here. Add a description field to the PROPERTIES array. —'}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-neutral-900 text-white p-8 sticky top-[100px]">
              <p className="font-black text-3xl mb-1">{prop.price}</p>
              {prop.type === 'rent' && (
                <p className="text-neutral-400 text-xs mb-6">/ {lang === 'tr' ? 'aylık' : 'monthly'}</p>
              )}
              <div className="space-y-3 mt-6">
                {/* WhatsApp butonu — numaranı ekle */}
                <a href={`https://wa.me/90XXXXXXXXXX?text=${encodeURIComponent(prop.title + ' hakkında bilgi almak istiyorum.')}`}
                  target="_blank" rel="noreferrer"
                  className="w-full py-3.5 bg-white text-neutral-900 text-[11px] font-bold tracking-[0.25em] hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                  <Phone size={14} /> {t.whatsapp.toUpperCase()}
                </a>
                <button onClick={() => toggle(prop.id)}
                  className={cn('w-full py-3.5 border text-[11px] font-bold tracking-[0.2em] transition-colors flex items-center justify-center gap-2',
                    fav ? 'border-red-400 text-red-400 hover:bg-red-900' : 'border-neutral-600 text-neutral-400 hover:border-white hover:text-white')}>
                  <Heart size={14} className={fav ? 'fill-red-400' : ''} />
                  {fav ? t.unfav.toUpperCase() : t.fav.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-black text-2xl text-neutral-900 mb-8">
              {lang === 'tr' ? 'Benzer İlanlar' : 'Similar Listings'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => <PropertyCard key={p.id} prop={p} onNav={onNav} idx={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// FAVORITES PAGE
// ============================================================
function FavoritesPage({ onNav }: { onNav: (p: Page, id?: string) => void }) {
  const { lang } = useLang()
  const t = T[lang]
  const { favs } = useFavorites()
  const items = PROPERTIES.filter(p => favs.includes(p.id))

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="bg-neutral-900 py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.5em] text-neutral-400 mb-3">♥</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">{t.favPage}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        {items.length === 0 ? (
          <div className="py-32 text-center">
            <Heart size={40} className="text-neutral-200 mx-auto mb-5" />
            <p className="text-neutral-500">{t.noFav}</p>
            <button onClick={() => onNav('properties')} className="mt-6 text-[11px] font-bold tracking-[0.2em] border border-neutral-300 px-8 py-3 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors">
              {t.viewAll.toUpperCase()}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => <PropertyCard key={p.id} prop={p} onNav={onNav} idx={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [lang, setLang] = useState<Lang>('tr')
  const [page, setPage] = useState<Page>('home')
  const [detailId, setDetailId] = useState<string>()
  const [propType, setPropType] = useState<string>()

  useEffect(() => {
    try { const s = localStorage.getItem('senkron_lang') as Lang | null; if (s) setLang(s) } catch {}
  }, [])

  const handleSetLang = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem('senkron_lang', l) } catch {}
  }

  const navigate = (p: Page | string, idOrSub?: string) => {
    if (p === 'detail' && idOrSub) {
      setDetailId(idOrSub)
      setPage('detail')
    } else if (p === 'properties') {
      setPropType(idOrSub)
      setPage('properties')
    } else if (p === 'about') {
      setPage('home')
      setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else if (p === 'contact') {
      setPage('home')
      setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      setPage(p as Page)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <LangCtx.Provider value={{ lang, setLang: handleSetLang }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', system-ui, sans-serif; background: #ffffff; color: #171717; -webkit-font-smoothing: antialiased; }
        ::selection { background: #171717; color: #ffffff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4d4d4; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .whitespace-pre-line { white-space: pre-line; }
      `}</style>

      <div className="min-h-screen bg-white text-neutral-900">
        <Navbar page={page} onNav={navigate} />

        <AnimatePresence mode="wait">
          <motion.div key={page + (detailId || '')}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>
            {page === 'home' && <HomePage onNav={navigate} />}
            {page === 'properties' && <PropertiesPage onNav={navigate} initialType={propType} />}
            {page === 'detail' && detailId && <DetailPage propertyId={detailId} onNav={navigate} />}
            {page === 'favorites' && <FavoritesPage onNav={navigate} />}
          </motion.div>
        </AnimatePresence>

        <Footer onNav={navigate} />
        <Toast />
      </div>
    </LangCtx.Provider>
  )
}
