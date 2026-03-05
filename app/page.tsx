'use client'

// ============================================================
// LUMORA ISTANBUL — Tek Dosya Versiyon
// Tüm component'lar, hook'lar, tipler ve veriler bu dosyada.
// Sadece bu dosya + package.json + tailwind.config.js gerekli.
// ============================================================

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MapPin, Maximize2, BedDouble, ArrowUpRight, ArrowRight,
  ChevronDown, Search, SlidersHorizontal, Moon, Sun, Globe, Menu, X,
  Phone, Mail, Send, Instagram, Facebook, ChevronLeft, ChevronRight,
  Star, MessageCircle
} from 'lucide-react'

// ============================================================
// TYPES
// ============================================================
type PropertyType = 'sale' | 'rent'
type PropertyCategory = 'apartment' | 'villa' | 'commercial' | 'land'
type Lang = 'tr' | 'en'

interface Property {
  id: string
  slug: string
  title: string
  description: string
  price: number
  city: string
  district: string
  neighborhood: string
  rooms: number
  m2: number
  type: PropertyType
  category: PropertyCategory
  featured: boolean
  images: string[]
  latitude: number | null
  longitude: number | null
  created_at: string
  view_count?: number
}

// ============================================================
// TRANSLATIONS
// ============================================================
const translations = {
  tr: {
    nav: { home: 'Ana Sayfa', properties: 'Gayrimenkuller', about: 'Hakkımızda', contact: 'İletişim' },
    hero: {
      tagline: "İstanbul'un En Seçkin Gayrimenkulleri",
      subtitle: 'Lüks yaşamın kapılarını aralıyoruz. Hayalinizdeki evi bulmanız için buradayız.',
      cta_explore: 'Keşfet',
      cta_contact: 'Bize Ulaşın',
    },
    filter: {
      all: 'Tümü', sale: 'Satılık', rent: 'Kiralık', city: 'Şehir',
      district: 'İlçe', type: 'Tip', category: 'Kategori',
      search: 'Ara...', apply: 'Filtrele', reset: 'Sıfırla',
      minPrice: 'Min Fiyat', maxPrice: 'Max Fiyat',
    },
    property: {
      rooms: 'Oda', m2: 'm²', featured: 'Öne Çıkan', details: 'Detayları Gör',
      whatsapp: 'WhatsApp İletişim', inquiry: 'Bilgi Al', share: 'Paylaş',
      favorite: 'Favorilere Ekle', map: 'Haritada Göster', related: 'Benzer İlanlar',
      price: 'Fiyat', location: 'Konum',
    },
    inquiry: {
      title: 'Bilgi Talep Edin', name: 'Ad Soyad', phone: 'Telefon',
      message: 'Mesajınız', send: 'Gönder',
      success: 'Talebiniz alındı. En kısa sürede dönüş yapacağız.',
    },
    footer: { tagline: "İstanbul'un lüks gayrimenkul uzmanı", rights: 'Tüm hakları saklıdır.' },
    categories: { apartment: 'Daire', villa: 'Villa', commercial: 'Ticari', land: 'Arsa' },
    featured: 'Öne Çıkan İlanlar',
    viewAll: 'Tümünü Gör',
    loading: 'Yükleniyor...',
    noResults: 'Sonuç bulunamadı.',
  },
  en: {
    nav: { home: 'Home', properties: 'Properties', about: 'About', contact: 'Contact' },
    hero: {
      tagline: "Istanbul's Most Distinguished Properties",
      subtitle: 'We open the doors to luxury living. We are here to help you find your dream home.',
      cta_explore: 'Explore',
      cta_contact: 'Contact Us',
    },
    filter: {
      all: 'All', sale: 'For Sale', rent: 'For Rent', city: 'City',
      district: 'District', type: 'Type', category: 'Category',
      search: 'Search...', apply: 'Apply', reset: 'Reset',
      minPrice: 'Min Price', maxPrice: 'Max Price',
    },
    property: {
      rooms: 'Rooms', m2: 'm²', featured: 'Featured', details: 'View Details',
      whatsapp: 'WhatsApp', inquiry: 'Inquire', share: 'Share',
      favorite: 'Add to Favorites', map: 'Show on Map', related: 'Similar Properties',
      price: 'Price', location: 'Location',
    },
    inquiry: {
      title: 'Request Information', name: 'Full Name', phone: 'Phone',
      message: 'Your Message', send: 'Send',
      success: 'Your request has been received. We will get back to you shortly.',
    },
    footer: { tagline: "Istanbul's luxury real estate expert", rights: 'All rights reserved.' },
    categories: { apartment: 'Apartment', villa: 'Villa', commercial: 'Commercial', land: 'Land' },
    featured: 'Featured Properties',
    viewAll: 'View All',
    loading: 'Loading...',
    noResults: 'No results found.',
  },
}

// ============================================================
// UTILS
// ============================================================
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency', currency: 'TRY', maximumFractionDigits: 0,
  }).format(price)
}

const CATEGORY_LABELS: Record<string, { tr: string; en: string }> = {
  apartment: { tr: 'Daire', en: 'Apartment' },
  villa: { tr: 'Villa', en: 'Villa' },
  commercial: { tr: 'Ticari', en: 'Commercial' },
  land: { tr: 'Arsa', en: 'Land' },
}

const TYPE_LABELS: Record<string, { tr: string; en: string }> = {
  sale: { tr: 'Satılık', en: 'For Sale' },
  rent: { tr: 'Kiralık', en: 'For Rent' },
}

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa']

// ============================================================
// PLACEHOLDER DATA
// ============================================================
const PROPERTIES: Property[] = [
  {
    id: '1', slug: 'besiktas-luxury-bosphorus-view-apartment',
    title: 'Beşiktaş Boğaz Manzaralı Lüks Daire',
    description: "Boğaz'ın eşsiz manzarasına sahip, tamamen yenilenmiş 4+1 lüks daire. Amerikan mutfak, akıllı ev sistemi, özel otopark. Beşiktaş'ın kalbinde, her türlü ulaşım imkanına yakın.",
    price: 45000000, city: 'İstanbul', district: 'Beşiktaş', neighborhood: 'Sinanpaşa',
    rooms: 4, m2: 220, type: 'sale', category: 'apartment', featured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90',
    ],
    latitude: 41.0422, longitude: 29.0083, created_at: '2024-01-15T10:00:00Z', view_count: 342,
  },
  {
    id: '2', slug: 'sariyer-ultra-luxury-villa-bosphorus',
    title: 'Sarıyer Boğaz Kıyısı Ultra Lüks Villa',
    description: "Boğaz kıyısında, 1200 m² arsa üzerine kurulu, 6 yatak odalı ultra lüks villa. Özel havuz, tekne bağlama iskelesi, akıllı ev sistemi, panoramik manzara terası.",
    price: 280000000, city: 'İstanbul', district: 'Sarıyer', neighborhood: 'Bebek',
    rooms: 6, m2: 650, type: 'sale', category: 'villa', featured: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=90',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=1200&q=90',
    ],
    latitude: 41.0853, longitude: 29.0554, created_at: '2024-01-20T10:00:00Z', view_count: 891,
  },
  {
    id: '3', slug: 'kadikoy-modern-3plus1-apartment',
    title: 'Kadıköy Modern 3+1 Daire',
    description: "Kadıköy merkezde, yürüme mesafesinde her şey. Yeni bina, 3+1, ebeveyn banyolu, balkonlu, asansörlü, kapalı otopark.",
    price: 18500000, city: 'İstanbul', district: 'Kadıköy', neighborhood: 'Moda',
    rooms: 3, m2: 145, type: 'sale', category: 'apartment', featured: true,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=90',
    ],
    latitude: 40.9847, longitude: 29.0286, created_at: '2024-02-01T10:00:00Z', view_count: 224,
  },
  {
    id: '4', slug: 'sisli-prime-office-commercial',
    title: 'Şişli Prime Lokasyon Ofis',
    description: "Şişli'nin en prestijli noktasında, A+ sınıfı ofis katı. 24 saat güvenlik, merkezi sistem, konferans salonları, resepsiyon hizmeti.",
    price: 95000, city: 'İstanbul', district: 'Şişli', neighborhood: 'Mecidiyeköy',
    rooms: 0, m2: 380, type: 'rent', category: 'commercial', featured: false,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=90',
    ],
    latitude: 41.0631, longitude: 28.9965, created_at: '2024-02-10T10:00:00Z', view_count: 156,
  },
  {
    id: '5', slug: 'atasehir-brand-new-2plus1-rent',
    title: 'Ataşehir Sıfır 2+1 Kiralık Daire',
    description: "Ataşehir'de sıfır binada, 2+1, eşyalı/eşyasız seçenekli, metro yakını, güvenlikli site içinde.",
    price: 35000, city: 'İstanbul', district: 'Ataşehir', neighborhood: 'İçerenköy',
    rooms: 2, m2: 95, type: 'rent', category: 'apartment', featured: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=90',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=90',
    ],
    latitude: 40.9857, longitude: 29.1233, created_at: '2024-02-15T10:00:00Z', view_count: 189,
  },
  {
    id: '6', slug: 'beyoglu-historic-building-investment',
    title: 'Beyoğlu Tarihi Bina Yatırım Fırsatı',
    description: "Beyoğlu'nda, İstiklal Caddesi'ne yürüme mesafesinde, komple bina. Restore edilmiş tarihi Rum binası, 8 bağımsız bölüm, yüksek kira getirisi.",
    price: 120000000, city: 'İstanbul', district: 'Beyoğlu', neighborhood: 'Cihangir',
    rooms: 8, m2: 520, type: 'sale', category: 'commercial', featured: true,
    images: [
      'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1200&q=90',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=1200&q=90',
    ],
    latitude: 41.0333, longitude: 28.9774, created_at: '2024-03-01T10:00:00Z', view_count: 567,
  },
  {
    id: '7', slug: 'nisantasi-penthouse-luxury',
    title: 'Nişantaşı Penthouse Lüks Daire',
    description: "Nişantaşı'nın kalbinde, 360 derece şehir manzaralı penthouse. 3 kat, özel havuz, çatı terası, eşyalı.",
    price: 85000000, city: 'İstanbul', district: 'Şişli', neighborhood: 'Nişantaşı',
    rooms: 5, m2: 420, type: 'sale', category: 'apartment', featured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=90',
    ],
    latitude: 41.0493, longitude: 28.9928, created_at: '2024-03-10T10:00:00Z', view_count: 445,
  },
  {
    id: '8', slug: 'maltepe-sea-view-apartment',
    title: 'Maltepe Deniz Manzaralı 2+1',
    description: "Maltepe sahilinde, deniz manzaralı, 2+1 kiralık daire. Yeni bina, ebeveyn banyolu, geniş balkon.",
    price: 28000, city: 'İstanbul', district: 'Maltepe', neighborhood: 'Cevizli',
    rooms: 2, m2: 110, type: 'rent', category: 'apartment', featured: false,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90',
    ],
    latitude: 40.9345, longitude: 29.1353, created_at: '2024-03-15T10:00:00Z', view_count: 98,
  },
]

// ============================================================
// HOOKS
// ============================================================
interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: typeof translations.tr
}

const LangContext = createContext<LangContextType>({
  lang: 'tr', setLang: () => {}, t: translations.tr,
})

function useLang() { return useContext(LangContext) }

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumora_favorites')
      if (stored) setFavorites(JSON.parse(stored))
    } catch {}
  }, [])
  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      try { localStorage.setItem('lumora_favorites', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])
  return { favorites, toggle, isFavorite }
}

// ============================================================
// TOAST
// ============================================================
interface Toast { id: number; message: string; type: 'success' | 'error' }

let toastListeners: ((toasts: Toast[]) => void)[] = []
let toastList: Toast[] = []
let toastCounter = 0

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const id = ++toastCounter
  toastList = [...toastList, { id, message, type }]
  toastListeners.forEach(l => l([...toastList]))
  setTimeout(() => {
    toastList = toastList.filter(t => t.id !== id)
    toastListeners.forEach(l => l([...toastList]))
  }, 3500)
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(() => {
    toastListeners.push(setToasts)
    return () => { toastListeners = toastListeners.filter(l => l !== setToasts) }
  }, [])
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
            className={cn(
              'px-5 py-4 text-sm font-body tracking-wide border pointer-events-auto',
              t.type === 'success'
                ? 'bg-stone-950 text-white border-gold-500'
                : 'bg-red-950 text-white border-red-500'
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ onNavigate, currentPage }: { onNavigate: (p: string) => void; currentPage: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const { lang, setLang, t } = useLang()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  const navLinks = [
    { page: 'home', label: t.nav.home },
    { page: 'properties', label: t.nav.properties },
    { page: 'about', label: t.nav.about },
    { page: 'contact', label: t.nav.contact },
    { page: 'favorites', label: '♥' },
  ]

  const isHero = currentPage === 'home'

  return (
    <motion.header
      initial={{ y: -80 }} animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled || !isHero
          ? 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-md shadow-sm border-b border-stone-200 dark:border-stone-800'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-yellow-600 rotate-45 flex items-center justify-center transition-transform group-hover:rotate-0 duration-500">
              <div className="w-3 h-3 bg-yellow-600 rotate-45" />
            </div>
            <div className="flex flex-col text-left">
              <span className={cn('font-serif text-xl font-semibold tracking-wider leading-none transition-colors',
                scrolled || !isHero ? 'text-stone-900 dark:text-stone-100' : 'text-white')}>LUMORA</span>
              <span className={cn('text-[10px] tracking-[0.25em] uppercase transition-colors font-sans',
                scrolled || !isHero ? 'text-yellow-600' : 'text-yellow-400')}>ISTANBUL</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <button key={l.page} onClick={() => onNavigate(l.page)}
                className={cn(
                  'font-sans text-sm tracking-widest uppercase transition-colors hover:text-yellow-500',
                  currentPage === l.page ? 'text-yellow-500' : '',
                  scrolled || !isHero ? 'text-stone-700 dark:text-stone-300' : 'text-white/90'
                )}>
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans tracking-wider uppercase border rounded-full transition-all',
                scrolled || !isHero
                  ? 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-yellow-500 hover:text-yellow-500'
                  : 'border-white/30 text-white/80 hover:border-yellow-400 hover:text-yellow-400'
              )}>
              <Globe size={12} />
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>

            {mounted && (
              <button onClick={() => setDark(!dark)}
                className={cn('p-2 rounded-full transition-colors',
                  scrolled || !isHero ? 'text-stone-600 dark:text-stone-400 hover:text-yellow-500' : 'text-white/80 hover:text-yellow-400'
                )}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={cn('md:hidden p-2 transition-colors',
                scrolled || !isHero ? 'text-stone-700 dark:text-stone-300' : 'text-white')}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(l => (
                <button key={l.page} onClick={() => { onNavigate(l.page); setMobileOpen(false) }}
                  className="font-sans text-sm tracking-widest uppercase text-stone-700 dark:text-stone-300 hover:text-yellow-500 transition-colors py-2 border-b border-stone-100 dark:border-stone-800 text-left">
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ============================================================
// HERO
// ============================================================
function Hero({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { t } = useLang()
  const words = t.hero.tagline.split(' ')
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-yellow-500/5 blur-3xl" />
      </div>
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-stone-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="font-sans text-[10px] text-yellow-400 tracking-[0.5em] uppercase mb-8 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-yellow-500/60" />Est. 2024<span className="w-12 h-px bg-yellow-500/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white leading-none mb-6">
            {words.slice(0, 2).join(' ')}<br />
            <span className="italic text-yellow-400">{words.slice(2).join(' ')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-sans text-stone-400 text-lg max-w-xl mx-auto mt-8 mb-12 leading-relaxed">
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('properties')}
              className="group relative px-10 py-4 bg-yellow-600 text-white font-sans text-sm tracking-widest uppercase overflow-hidden hover:bg-yellow-500 transition-colors">
              {t.hero.cta_explore}
            </button>
            <button onClick={() => onNavigate('contact')}
              className="px-10 py-4 border border-white/30 text-white font-sans text-sm tracking-widest uppercase hover:border-yellow-500 hover:text-yellow-400 transition-all">
              {t.hero.cta_contact}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-24 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { num: '500+', label: 'Satılan Mülk' },
            { num: '12+', label: 'Yıllık Deneyim' },
            { num: '98%', label: 'Müşteri Memnuniyeti' },
          ].map(s => (
            <div key={s.num} className="text-center">
              <p className="font-serif text-3xl text-yellow-400 font-medium">{s.num}</p>
              <p className="font-sans text-[10px] text-stone-500 tracking-widest uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-500">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================================
// FILTER BAR
// ============================================================
function FilterBar({ onSearch }: { onSearch: (filters: Record<string, string>) => void }) {
  const { t } = useLang()
  const [type, setType] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  const handleSearch = () => onSearch({ type, city, category, search })

  return (
    <section className="relative z-20 -mt-10 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-stone-900 shadow-2xl border border-stone-100 dark:border-stone-800 p-8">
          <div className="flex gap-1 mb-8 border-b border-stone-100 dark:border-stone-800">
            {[{ value: '', label: t.filter.all }, { value: 'sale', label: t.filter.sale }, { value: 'rent', label: t.filter.rent }].map(o => (
              <button key={o.value} onClick={() => setType(o.value)}
                className={cn(
                  'px-6 py-3 font-sans text-sm tracking-widest uppercase transition-all border-b-2 -mb-px',
                  type === o.value
                    ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                    : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                )}>{o.label}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="font-sans text-xs tracking-widest uppercase text-stone-400 mb-2 block">{t.filter.search}</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Beşiktaş, villa, Boğaz..."
                  className="w-full pl-10 pr-4 py-3 border border-stone-200 dark:border-stone-700 bg-transparent font-sans text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-yellow-500 transition-colors"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
            </div>

            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-stone-400 mb-2 block">{t.filter.city}</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-sans text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-yellow-500 transition-colors">
                <option value="">{t.filter.all}</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-stone-400 mb-2 block">{t.filter.category}</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-sans text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-yellow-500 transition-colors">
                <option value="">{t.filter.all}</option>
                <option value="apartment">Daire</option>
                <option value="villa">Villa</option>
                <option value="commercial">Ticari</option>
                <option value="land">Arsa</option>
              </select>
            </div>

            <button onClick={handleSearch}
              className="md:col-span-4 w-full py-4 bg-stone-900 dark:bg-yellow-600 text-white font-sans text-sm tracking-widest uppercase hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors flex items-center justify-center gap-3">
              <SlidersHorizontal size={16} />
              {t.filter.apply}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// PROPERTY CARD
// ============================================================
function PropertyCard({ property, index = 0, onNavigate }: { property: Property; index?: number; onNavigate: (p: string, id?: string) => void }) {
  const { toggle, isFavorite } = useFavorites()
  const { lang } = useLang()
  const fav = isFavorite(property.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white dark:bg-stone-900 overflow-hidden border border-stone-200 dark:border-stone-800 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={property.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn('font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-medium',
            property.type === 'sale' ? 'bg-stone-900 text-white' : 'bg-yellow-600 text-white')}>
            {TYPE_LABELS[property.type][lang]}
          </span>
          {property.featured && (
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-medium bg-white text-stone-900">
              ★ {lang === 'tr' ? 'Öne Çıkan' : 'Featured'}
            </span>
          )}
        </div>

        <button onClick={e => { e.stopPropagation(); toggle(property.id) }}
          className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-stone-900/90 rounded-full transition-all hover:scale-110">
          <Heart size={15} className={cn('transition-colors', fav ? 'fill-red-500 text-red-500' : 'text-stone-500')} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100 leading-tight line-clamp-2 group-hover:text-yellow-600 transition-colors">
            {property.title}
          </h3>
          <button onClick={() => onNavigate('detail', property.id)}
            className="shrink-0 p-1.5 border border-stone-200 dark:border-stone-700 text-stone-400 hover:border-yellow-500 hover:text-yellow-500 transition-all">
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={12} className="text-yellow-500 shrink-0" />
          <span className="font-sans text-xs text-stone-500 dark:text-stone-400 tracking-wide">
            {property.district}, {property.city}
          </span>
        </div>

        <div className="flex items-center gap-4 py-4 border-t border-b border-stone-100 dark:border-stone-800 mb-4">
          {property.rooms > 0 && (
            <div className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-stone-400" />
              <span className="font-sans text-xs text-stone-600 dark:text-stone-400">{property.rooms}+1</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Maximize2 size={14} className="text-stone-400" />
            <span className="font-sans text-xs text-stone-600 dark:text-stone-400">{property.m2} m²</span>
          </div>
          <span className="font-sans text-[10px] tracking-widest uppercase text-stone-400">
            {CATEGORY_LABELS[property.category][lang]}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100">
              {formatPrice(property.price)}
            </p>
            {property.type === 'rent' && (
              <p className="font-sans text-xs text-stone-400">/ {lang === 'tr' ? 'aylık' : 'monthly'}</p>
            )}
          </div>
          <button onClick={() => onNavigate('detail', property.id)}
            className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-yellow-600 dark:hover:bg-yellow-500 dark:hover:text-white transition-colors">
            {lang === 'tr' ? 'Detay' : 'Details'}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

// ============================================================
// FEATURED PROPERTIES
// ============================================================
function FeaturedProperties({ onNavigate }: { onNavigate: (p: string, id?: string) => void }) {
  const { t } = useLang()
  const featured = PROPERTIES.filter(p => p.featured).slice(0, 6)

  return (
    <section className="py-28 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-yellow-500 mb-4">— {t.featured}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 font-light">
            Seçkin<br /><span className="italic text-yellow-500">İlanlar</span>
          </h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <button onClick={() => onNavigate('properties')}
            className="group flex items-center gap-3 font-sans text-sm tracking-widest uppercase text-stone-600 dark:text-stone-400 hover:text-yellow-500 transition-colors">
            {t.viewAll}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  )
}

// ============================================================
// ABOUT SECTION
// ============================================================
function AboutSection() {
  return (
    <section id="about" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-yellow-500 mb-4">— Hakkımızda</p>
            <h2 className="font-serif text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 font-light mb-8 leading-tight">
              İstanbul'un<br /><span className="italic text-yellow-500">Lüks Uzmanı</span>
            </h2>
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              12 yılı aşkın deneyimimizle İstanbul'un en prestijli bölgelerinde lüks gayrimenkul hizmetleri sunuyoruz.
              Boğaz kıyısı villalarından Beşiktaş'ın kalbi dairelerine kadar, her bütçeye ve zevke uygun portföyümüzle yanınızdayız.
            </p>
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
              Uzman danışman kadromuz, yatırım değeri yüksek mülkleri titizlikle seçer ve size en doğru rehberliği sunar.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-stone-200 dark:border-stone-800">
              {[{ num: '500+', label: 'Satışlar' }, { num: '₺50B+', label: 'Hacim' }, { num: '12+', label: 'Yıl' }].map(s => (
                <div key={s.num}>
                  <p className="font-serif text-3xl text-yellow-500 font-medium">{s.num}</p>
                  <p className="font-sans text-xs text-stone-500 tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=90"
                alt="Luxury property" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-yellow-600 p-8 text-white">
              <p className="font-serif text-4xl font-semibold">98%</p>
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-yellow-100">Müşteri Memnuniyeti</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CONTACT SECTION
// ============================================================
function ContactSection() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    showToast(t.inquiry.success)
    setForm({ name: '', phone: '', message: '' })
    setLoading(false)
  }

  return (
    <section id="contact" className="py-28 bg-stone-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-yellow-500 mb-4">— İletişim</p>
            <h2 className="font-serif text-5xl text-white font-light mb-8 leading-tight">
              Hayalinizdeki<br /><span className="italic text-yellow-400">Evi Bulalım</span>
            </h2>
            <p className="font-sans text-stone-400 leading-relaxed mb-12">
              Uzman danışmanlarımız, İstanbul'un en prestijli bölgelerinde size en uygun gayrimenkulü bulmak için hazır.
            </p>
            <div className="space-y-6">
              {[
                { icon: Phone, label: '+90 500 123 45 67', href: 'tel:+905001234567' },
                { icon: Mail, label: 'info@lumoraisanbul.com', href: 'mailto:info@lumoraisanbul.com' },
                { icon: MapPin, label: 'Beşiktaş, İstanbul', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-stone-700 group-hover:border-yellow-500 flex items-center justify-center transition-colors">
                    <Icon size={16} className="text-stone-500 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <span className="font-sans text-stone-400 group-hover:text-yellow-400 transition-colors">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-stone-900 border border-stone-800 p-10">
            <h3 className="font-serif text-2xl text-white mb-8">{t.inquiry.title}</h3>
            <div className="space-y-5">
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-stone-500 mb-2 block">{t.inquiry.name}</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-white font-sans text-sm focus:outline-none focus:border-yellow-500 transition-colors" />
              </div>
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-stone-500 mb-2 block">{t.inquiry.phone}</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-white font-sans text-sm focus:outline-none focus:border-yellow-500 transition-colors" />
              </div>
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-stone-500 mb-2 block">{t.inquiry.message}</label>
                <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-white font-sans text-sm focus:outline-none focus:border-yellow-500 transition-colors resize-none" />
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-sans text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-3">
                <Send size={16} />
                {loading ? '...' : t.inquiry.send}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { t } = useLang()
  const year = new Date().getFullYear()
  return (
    <footer className="bg-stone-950 text-stone-300 mt-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-yellow-600 rotate-45 flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-600 rotate-45" />
              </div>
              <div>
                <div className="font-serif text-xl font-semibold text-white tracking-wider">LUMORA</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-yellow-500">ISTANBUL</div>
              </div>
            </div>
            <p className="font-sans text-sm leading-relaxed text-stone-400 max-w-xs">
              {t.footer.tagline}. İstanbul'un en prestijli bölgelerinde lüks gayrimenkul hizmetleri.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {[Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 border border-stone-700 rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-white text-lg mb-6">Bağlantılar</h4>
            <ul className="space-y-3">
              {[
                { page: 'home', label: t.nav.home },
                { page: 'properties', label: t.nav.properties },
                { page: 'about', label: t.nav.about },
                { page: 'contact', label: t.nav.contact },
              ].map(l => (
                <li key={l.page}>
                  <button onClick={() => onNavigate(l.page)}
                    className="font-sans text-sm text-stone-400 hover:text-yellow-500 transition-colors tracking-wide">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-lg mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                <span className="font-sans text-sm text-stone-400">Beşiktaş, İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-yellow-500 shrink-0" />
                <a href="tel:+905001234567" className="font-sans text-sm text-stone-400 hover:text-yellow-500 transition-colors">+90 500 123 45 67</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-yellow-500 shrink-0" />
                <a href="mailto:info@lumoraisanbul.com" className="font-sans text-sm text-stone-400 hover:text-yellow-500 transition-colors">info@lumoraisanbul.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-stone-600 tracking-wider">
            © {year} Lumora Istanbul. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            {['Gizlilik Politikası', 'Kullanım Şartları'].map(label => (
              <button key={label} className="font-sans text-xs text-stone-600 hover:text-yellow-500 transition-colors tracking-wider">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// PROPERTIES PAGE
// ============================================================
function PropertiesPage({ onNavigate, initialFilters }: { onNavigate: (p: string, id?: string) => void; initialFilters: Record<string, string> }) {
  const { t, lang } = useLang()
  const [filters, setFilters] = useState(initialFilters)

  const filtered = PROPERTIES.filter(p => {
    if (filters.type && p.type !== filters.type) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.city && p.city !== filters.city) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.district.toLowerCase().includes(q) && !p.neighborhood.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-stone-950 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-yellow-500 mb-4">— {t.nav.properties}</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-light">
            Tüm <span className="italic text-yellow-400">İlanlar</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div className="col-span-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="text" value={filters.search || ''} onChange={e => setFilters({ ...filters, search: e.target.value })}
                  placeholder={t.filter.search}
                  className="w-full pl-10 pr-4 py-3 border border-stone-200 dark:border-stone-700 bg-transparent font-sans text-sm focus:outline-none focus:border-yellow-500" />
              </div>
            </div>
            {[
              { key: 'type', options: [{ value: '', label: t.filter.all }, { value: 'sale', label: t.filter.sale }, { value: 'rent', label: t.filter.rent }] },
              { key: 'category', options: [{ value: '', label: t.filter.all }, { value: 'apartment', label: 'Daire' }, { value: 'villa', label: 'Villa' }, { value: 'commercial', label: 'Ticari' }, { value: 'land', label: 'Arsa' }] },
              { key: 'city', options: [{ value: '', label: t.filter.all }, ...CITIES.map(c => ({ value: c, label: c }))] },
            ].map(({ key, options }) => (
              <select key={key} value={(filters as Record<string, string>)[key] || ''}
                onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                className="px-4 py-3 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-sans text-sm focus:outline-none focus:border-yellow-500">
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ))}
          </div>
        </div>

        <p className="font-sans text-sm text-stone-500 mb-8">
          {filtered.length} {lang === 'tr' ? 'ilan bulundu' : 'properties found'}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-stone-400">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// PROPERTY DETAIL PAGE
// ============================================================
function PropertyDetailPage({ propertyId, onNavigate }: { propertyId: string; onNavigate: (p: string, id?: string) => void }) {
  const { t, lang } = useLang()
  const { toggle, isFavorite } = useFavorites()
  const [currentImg, setCurrentImg] = useState(0)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const property = PROPERTIES.find(p => p.id === propertyId)
  if (!property) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="font-serif text-2xl text-stone-400 mb-6">İlan bulunamadı.</p>
        <button onClick={() => onNavigate('properties')} className="px-6 py-3 bg-yellow-600 text-white font-sans text-sm tracking-widest uppercase">
          Geri Dön
        </button>
      </div>
    </div>
  )

  const related = PROPERTIES.filter(p => p.id !== property.id && p.category === property.category).slice(0, 3)
  const fav = isFavorite(property.id)

  const handleInquiry = async () => {
    if (!form.name || !form.phone) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    showToast(t.inquiry.success)
    setForm({ name: '', phone: '', message: '' })
    setInquiryOpen(false)
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        <button onClick={() => onNavigate('properties')}
          className="flex items-center gap-2 font-sans text-sm text-stone-500 hover:text-yellow-500 transition-colors mb-8">
          <ChevronLeft size={16} /> {lang === 'tr' ? 'Tüm İlanlar' : 'All Properties'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-stone-100 dark:bg-stone-900">
          <AnimatePresence mode="wait">
            <motion.img key={currentImg}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              src={property.images[currentImg]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {property.images.length > 1 && (
            <>
              <button onClick={() => setCurrentImg(i => (i - 1 + property.images.length) % property.images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentImg(i => (i + 1) % property.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white transition-colors">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)}
                    className={cn('w-2 h-2 rounded-full transition-all', i === currentImg ? 'bg-yellow-500 w-6' : 'bg-white/60')} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-4">
              <span className={cn('font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5',
                property.type === 'sale' ? 'bg-stone-900 text-white' : 'bg-yellow-600 text-white')}>
                {TYPE_LABELS[property.type][lang]}
              </span>
              {property.featured && (
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-yellow-100 text-yellow-700">
                  ★ {lang === 'tr' ? 'Öne Çıkan' : 'Featured'}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-light text-stone-900 dark:text-stone-100 mb-4 leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 mb-8">
              <MapPin size={14} className="text-yellow-500" />
              <span className="font-sans text-stone-500">{property.neighborhood}, {property.district}, {property.city}</span>
            </div>

            <div className="grid grid-cols-3 gap-6 p-6 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 mb-8">
              {property.rooms > 0 && (
                <div className="text-center">
                  <BedDouble size={20} className="text-yellow-500 mx-auto mb-2" />
                  <p className="font-serif text-2xl text-stone-900 dark:text-stone-100">{property.rooms}+1</p>
                  <p className="font-sans text-xs text-stone-500 uppercase tracking-widest">{t.property.rooms}</p>
                </div>
              )}
              <div className="text-center">
                <Maximize2 size={20} className="text-yellow-500 mx-auto mb-2" />
                <p className="font-serif text-2xl text-stone-900 dark:text-stone-100">{property.m2}</p>
                <p className="font-sans text-xs text-stone-500 uppercase tracking-widest">m²</p>
              </div>
              <div className="text-center">
                <Star size={20} className="text-yellow-500 mx-auto mb-2" />
                <p className="font-serif text-2xl text-stone-900 dark:text-stone-100">{CATEGORY_LABELS[property.category][lang]}</p>
                <p className="font-sans text-xs text-stone-500 uppercase tracking-widest">{t.filter.category}</p>
              </div>
            </div>

            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100 mb-4">
              {lang === 'tr' ? 'Açıklama' : 'Description'}
            </h2>
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">{property.description}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-stone-950 p-8 text-white sticky top-24">
              <p className="font-serif text-3xl font-light mb-1">{formatPrice(property.price)}</p>
              {property.type === 'rent' && (
                <p className="font-sans text-xs text-stone-400 mb-6">/ {lang === 'tr' ? 'aylık' : 'monthly'}</p>
              )}
              <div className="space-y-3 mt-6">
                <button onClick={() => setInquiryOpen(true)}
                  className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-sans text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={16} /> {t.property.inquiry}
                </button>
                <a href={`https://wa.me/905001234567?text=${encodeURIComponent(`${property.title} hakkında bilgi almak istiyorum.`)}`}
                  target="_blank" rel="noreferrer"
                  className="w-full py-4 border border-stone-700 hover:border-yellow-500 text-stone-300 hover:text-yellow-400 font-sans text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
                  <Phone size={16} /> {t.property.whatsapp}
                </a>
                <button onClick={() => toggle(property.id)}
                  className={cn('w-full py-4 border font-sans text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2',
                    fav ? 'border-red-500 text-red-400' : 'border-stone-700 text-stone-400 hover:border-red-400 hover:text-red-400')}>
                  <Heart size={16} className={fav ? 'fill-red-500' : ''} />
                  {fav ? (lang === 'tr' ? 'Favorilerden Çıkar' : 'Remove Favorite') : t.property.favorite}
                </button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 mb-8">
              {t.property.related}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {inquiryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setInquiryOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-stone-900 w-full max-w-md p-8 border border-stone-200 dark:border-stone-800"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">{t.inquiry.title}</h3>
                <button onClick={() => setInquiryOpen(false)} className="text-stone-400 hover:text-stone-700"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder={t.inquiry.name} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 bg-transparent font-sans text-sm focus:outline-none focus:border-yellow-500 dark:text-white" />
                <input type="tel" placeholder={t.inquiry.phone} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 bg-transparent font-sans text-sm focus:outline-none focus:border-yellow-500 dark:text-white" />
                <textarea rows={4} placeholder={t.inquiry.message} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 bg-transparent font-sans text-sm focus:outline-none focus:border-yellow-500 resize-none dark:text-white" />
                <button onClick={handleInquiry} disabled={loading}
                  className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-sans text-sm tracking-widest uppercase transition-colors">
                  {loading ? '...' : t.inquiry.send}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// FAVORITES PAGE
// ============================================================
function FavoritesPage({ onNavigate }: { onNavigate: (p: string, id?: string) => void }) {
  const { lang, t } = useLang()
  const { favorites } = useFavorites()
  const favProperties = PROPERTIES.filter(p => favorites.includes(p.id))

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-stone-950 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-yellow-500 mb-4">— Favoriler</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-light">
            {lang === 'tr' ? 'Favori' : 'Favorite'} <span className="italic text-yellow-400">İlanlar</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {favProperties.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={40} className="text-stone-300 mx-auto mb-6" />
            <p className="font-serif text-2xl text-stone-400 mb-6">
              {lang === 'tr' ? 'Henüz favori eklenmedi.' : 'No favorites yet.'}
            </p>
            <button onClick={() => onNavigate('properties')}
              className="px-8 py-4 bg-yellow-600 text-white font-sans text-sm tracking-widest uppercase hover:bg-yellow-500 transition-colors">
              {t.viewAll}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favProperties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ onNavigate }: { onNavigate: (p: string, id?: string) => void }) {
  return (
    <main className="min-h-screen">
      <Hero onNavigate={onNavigate} />
      <FilterBar onSearch={f => onNavigate('properties')} />
      <FeaturedProperties onNavigate={onNavigate} />
      <AboutSection />
      <ContactSection />
    </main>
  )
}

// ============================================================
// ROOT APP — SPA Router
// ============================================================
export default function App() {
  const [page, setPage] = useState('home')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>()
  const [propertyFilters, setPropertyFilters] = useState<Record<string, string>>({})
  const [lang, setLang] = useState<Lang>('tr')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumora_lang') as Lang | null
      if (stored === 'en' || stored === 'tr') setLang(stored)
    } catch {}
  }, [])

  const handleSetLang = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem('lumora_lang', l) } catch {}
  }

  const navigate = (p: string, id?: string) => {
    if (p === 'detail' && id) {
      setSelectedPropertyId(id)
      setPage('detail')
    } else if (p === 'about') {
      setPage('home')
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else if (p === 'contact') {
      setPage('home')
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      setPage(p)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Jost', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
        .font-sans { font-family: 'Jost', system-ui, sans-serif !important; }

        /* Tailwind dark mode helper */
        .dark body { background: #0c0a09; color: #f5f5f4; }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4941a; border-radius: 3px; }
        ::selection { background: #d4941a; color: white; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <Navbar onNavigate={navigate} currentPage={page} />

        <AnimatePresence mode="wait">
          <motion.div key={page + selectedPropertyId}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}>
            {page === 'home' && <HomePage onNavigate={navigate} />}
            {page === 'properties' && <PropertiesPage onNavigate={navigate} initialFilters={propertyFilters} />}
            {page === 'detail' && selectedPropertyId && <PropertyDetailPage propertyId={selectedPropertyId} onNavigate={navigate} />}
            {page === 'favorites' && <FavoritesPage onNavigate={navigate} />}
          </motion.div>
        </AnimatePresence>

        <Footer onNavigate={navigate} />
        <ToastContainer />
      </div>
    </LangContext.Provider>
  )
}
