'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Menu, X, ChevronDown, ChevronRight, ChevronLeft,
  MapPin, Maximize2, BedDouble, Heart, Phone, Mail,
  Instagram, Youtube, Linkedin, ArrowUpRight,
  Building2, Home, Trees, Briefcase
} from 'lucide-react'

// ============================================================
// DATA & TYPES
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
  price: string
  type: PropertyType
  category: PropertyCategory
  rooms: string
  m2: number
  floor?: string
  image: string
  featured: boolean
}

const PROPERTIES: Property[] = [] // İlanlar buraya eklenecek

const T = {
  tr: {
    nav: { sale: 'SATILIK', rent: 'KİRALIK', about: 'HAKKIMIZDA', contact: 'İLETİŞİM', favorites: 'Favoriler' },
    hero: { tag: 'Lüks Gayrimenkul Danışmanlığı', title: 'Senkron\nGayrimenkul', subtitle: 'İstanbul\'un en seçkin bölgelerinde, hayalinizdeki mülkü birlikte buluyoruz.' },
    about: { title: 'İstanbul\'da Profesyonel Gayrimenkul Çözümleri', p1: 'Senkron Gayrimenkul olarak, İstanbul\'un en prestijli bölgelerinde hizmet sunuyoruz.', p2: 'Güven ve şeffaflık ilkelerimizle, yatırımlarınızda size en doğru rehberliği sağlıyoruz.' },
    contact: { title: 'Bizimle İletişime Geçin', success: 'Mesajınız iletildi.' },
    footer: { rights: 'Tüm hakları saklıdır.' },
    lang: 'EN'
  },
  en: {
    nav: { sale: 'FOR SALE', rent: 'FOR RENT', about: 'ABOUT', contact: 'CONTACT', favorites: 'Favorites' },
    hero: { tag: 'Luxury Real Estate Advisory', title: 'Senkron\nReal Estate', subtitle: 'We find the property of your dreams in Istanbul\'s most exclusive areas.' },
    about: { title: 'Professional Real Estate Solutions in Istanbul', p1: 'As Senkron Real Estate, we serve in Istanbul\'s most prestigious neighborhoods.', p2: 'We guide your investments with our principles of trust and transparency.' },
    contact: { title: 'Get in Touch', success: 'Message sent.' },
    footer: { rights: 'All rights reserved.' },
    lang: 'TR'
  }
}

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'tr', setLang: () => {} })

// ============================================================
// COMPONENTS
// ============================================================

function Navbar({ page, onNav }: { page: Page; onNav: (p: Page) => void }) {
  const { lang, setLang } = useContext(LangCtx)
  const [scrolled, setScrolled] = useState(false)
  const isHome = page === 'home'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled || !isHome ? 'bg-white border-b border-neutral-200 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button onClick={() => onNav('home')} className="flex flex-col text-left">
          <span className={`text-xl font-black tracking-widest ${scrolled || !isHome ? 'text-neutral-900' : 'text-white'}`}>SENKRON</span>
          <span className={`text-[9px] tracking-[0.3em] font-medium ${scrolled || !isHome ? 'text-neutral-400' : 'text-white/60'}`}>GAYRİMENKUL</span>
        </button>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8">
            {['sale', 'rent', 'about', 'contact'].map((item) => (
              <button key={item} onClick={() => onNav(item as Page)} className={`text-[11px] font-bold tracking-widest hover:opacity-50 transition-opacity ${scrolled || !isHome ? 'text-neutral-800' : 'text-white'}`}>
                {(T[lang].nav as any)[item]}
              </button>
            ))}
          </nav>
          <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className={`text-[10px] border px-2 py-1 font-bold ${scrolled || !isHome ? 'border-neutral-300 text-neutral-600' : 'border-white/40 text-white'}`}>
            {T[lang].lang}
          </button>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>('tr')
  const [page, setPage] = useState<Page>('home')

  const navigate = (p: Page) => {
    if (p === 'about' || p === 'contact') {
      setPage('home');
      setTimeout(() => document.getElementById(p)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      setPage(p);
    }
    window.scrollTo(0,0);
  }

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap');
        body { font-family: 'Outfit', sans-serif; margin: 0; }
      `}</style>
      <Navbar page={page} onNav={navigate} />
      {page === 'home' ? (
        <>
          <section className="relative h-screen flex items-center justify-center text-center text-white px-6 bg-neutral-900">
            <div className="absolute inset-0 opacity-40">
                <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80" className="w-full h-full object-cover" alt="Istanbul" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <p className="text-[10px] tracking-[0.5em] uppercase mb-4 text-white/60">{T[lang].hero.tag}</p>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">{T[lang].hero.title}</h1>
              <p className="text-lg font-light mb-10 text-white/80">{T[lang].hero.subtitle}</p>
              <button onClick={() => navigate('properties')} className="bg-white text-neutral-900 px-10 py-4 text-[11px] font-bold tracking-widest hover:bg-neutral-200 transition-colors">PORTFÖYÜ İNCELE</button>
            </div>
          </section>
          <section id="about" className="py-32 px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-8">{T[lang].about.title}</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">{T[lang].about.p1}</p>
            <p className="text-neutral-600 leading-relaxed">{T[lang].about.p2}</p>
          </section>
          <section id="contact" className="py-32 bg-neutral-50 px-6 text-center">
            <h2 className="text-3xl font-black mb-12">{T[lang].contact.title}</h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div><p className="text-[10px] font-bold text-neutral-400 mb-2 tracking-widest">TELEFON</p><p className="font-medium">Telefon numaranız</p></div>
              <div><p className="text-[10px] font-bold text-neutral-400 mb-2 tracking-widest">E-POSTA</p><p className="font-medium">E-posta adresiniz</p></div>
              <div><p className="text-[10px] font-bold text-neutral-400 mb-2 tracking-widest">ADRES</p><p className="font-medium">İstanbul, Türkiye</p></div>
            </div>
          </section>
        </>
      ) : (
        <div className="pt-40 pb-32 px-6 text-center min-h-screen">
          <h1 className="text-4xl font-black mb-6">Portföy</h1>
          <p className="text-neutral-500">En seçkin ilanlarımız yakında burada olacak.</p>
        </div>
      )}
      <footer className="bg-white border-t border-neutral-100 py-12 px-6 text-center">
        <p className="text-lg font-black tracking-widest mb-1">SENKRON</p>
        <p className="text-[9px] text-neutral-400 tracking-widest mb-6">GAYRİMENKUL DANIŞMANLIĞI</p>
        <p className="text-[10px] text-neutral-400">© 2026 Senkron Istanbul. {T[lang].footer.rights}</p>
      </footer>
    </LangCtx.Provider>
  )
}
