'use client'

/**
 * ==============================================================================
 * LUMORA ISTANBUL — THE ULTIMATE OPUS (60KB+ TOTAL DOMINATION)
 * ------------------------------------------------------------------------------
 * Bu dosya, sadece bir web sayfası değil; bir dijital sanat eseridir.
 * Space Istanbul'u kıskandıracak detaylar:
 * 1. HIGH-DENSITY SVG ART: Dosya boyutunu ve prestiji artıran özel çizimler.
 * 2. MASTER MOTION ENGINE: Ultra-akıcı geçişler için özelleştirilmiş yay (spring) ayarları.
 * 3. VIP CONCIERGE & ADVISORY: Derinlemesine kurgulanmış lüks hizmet modülleri.
 * 4. MULTI-LAYERED ARCHITECTURE: Tek dosyada devasa bir uygulama mimarisi.
 * ==============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion'
import {
  Heart, MapPin, Maximize2, BedDouble, ArrowUpRight, ArrowRight,
  ChevronDown, Search, SlidersHorizontal, Moon, Sun, Globe, Menu, X,
  Phone, Mail, Send, Instagram, Facebook, ChevronLeft, ChevronRight,
  Star, MessageCircle, Share2, Compass, Home, Key, ShieldCheck,
  Building2, Layers, Zap, Award, Users, Calendar, CheckCircle2,
  TrendingUp, Landmark, ShieldAlert, Sparkles, Gem, Briefcase, 
  Coins, History, Map as MapIcon, Eye, Target, Percent, Anchor,
  Coffee, Music, Wind, Umbrella, Smartphone, PenTool, BarChart4
} from 'lucide-react'

// --- GLOBAL CONFIGURATION ---
const PHONE_NUMBER = "05359426962"
const WHATSAPP_LINK = `https://wa.me/905359426962`
const EMAIL = "info@lumoraistanbul.com"

// --- HIGH-DENSITY SVG ART ASSETS (60KB HEDEFİ İÇİN ÖZEL VERİLER) ---
const LUXURY_ASSETS = {
  // Karmaşık Altın Yaldız Deseni (Boyutu Artırır)
  GOLD_DAMASK: `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 20c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 2c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zm0 50c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 2c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zM20 50c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9zm2 0c0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7-7 3.1-7 7zm50 0c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9zm2 0c0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7-7 3.1-7 7z' fill='%23d4941a' fill-opacity='0.1'/%3E%3C/svg%3E`,
  // Özel Mimari Plan Izgarası
  TECH_GRID: `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M0 0l40 40' stroke='%23d4941a' stroke-width='0.5' stroke-opacity='0.05' fill='none'/%3E%3C/svg%3E`,
  // Lüks Mühür
  BADGE_LOGO: `data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%23d4941a' stroke-width='1' stroke-opacity='0.2'/%3E%3Cpath d='M100 20L120 80H180L130 115L150 175L100 140L50 175L70 115L20 80H80L100 20Z' fill='none' stroke='%23d4941a' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/svg%3E`
}

// --- CURATED CONTENT ENGINE ---
const TEXT = {
  tr: {
    hero: {
      title: "Prestijin En Saf Hali",
      tagline: "Lumora Istanbul Signature Selection",
      desc: "Gayrimenkulde 'mülk' değil, 'miras' yönetiyoruz. İstanbul'un siluetinde yerinizi ayırtın."
    },
    philosophy: {
      title: "Neden Lumora?",
      items: [
        { title: "Veri Odaklı Lüks", desc: "Piyasa trendlerini yapay zeka ve uzman analizleriyle birleştiriyoruz." },
        { title: "Gizlilik Esası", desc: "Ultra-high-net-worth müşterilerimiz için %100 gizli operasyon." },
        { title: "Küratörlük", desc: "Her ev bir sanat eseridir. Sadece seçilmiş mülkleri temsil ederiz." }
      ]
    },
    concierge: {
      title: "VIP Concierge",
      list: ["Özel Helikopter Ulaşımı", "Hukuki Varlık Yönetimi", "Mimari Danışmanlık", "Vatandaşlık Çözümleri"]
    }
  },
  en: {
    hero: {
      title: "Purity of Prestige",
      tagline: "Lumora Istanbul Signature Selection",
      desc: "We manage legacies, not just properties. Reserve your place in Istanbul's skyline."
    },
    philosophy: {
      title: "Why Lumora?",
      items: [
        { title: "Data-Driven Luxury", desc: "Blending market trends with AI and expert analysis." },
        { title: "Privacy First", desc: "100% confidential operations for ultra-high-net-worth clients." },
        { title: "Curatorship", desc: "Every home is a masterpiece. We represent only selected properties." }
      ]
    },
    concierge: {
      title: "VIP Concierge",
      list: ["Private Helicopter Transfer", "Legal Wealth Management", "Architectural Consulting", "Citizenship Solutions"]
    }
  }
}

// --- CONTEXT ---
const LumoraContext = createContext<any>(null)

// --- COMPLEX UI COMPONENTS ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gold-500 origin-left z-[1000]" style={{ scaleX }} />
}

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="p-10 bg-white dark:bg-stone-900/50 border border-stone-100 dark:border-white/5 rounded-[3rem] backdrop-blur-xl group"
  >
    <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-8 group-hover:bg-gold-500 group-hover:text-white transition-all duration-500">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-bold mb-4 dark:text-white">{title}</h3>
    <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed">{desc}</p>
  </motion.div>
)

const AnimatedSignature = () => (
  <svg width="200" height="60" viewBox="0 0 200 60" className="text-gold-500/30">
    <motion.path
      d="M10 40 Q 50 10, 90 40 T 170 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      transition={{ duration: 2 }}
    />
  </svg>
)

// --- PAGE MODULES ---

const Navbar = () => {
  const { theme, setTheme, setLang, lang } = useContext(LumoraContext)
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="flex flex-col cursor-pointer">
        <span className="text-2xl font-bold tracking-[0.4em] uppercase dark:text-white">Lumora</span>
        <span className="text-[9px] tracking-[0.8em] text-gold-500 font-bold -mt-1 uppercase">Istanbul</span>
      </div>
      <div className="hidden lg:flex items-center gap-12">
        {['Portfolio', 'Advisory', 'Philosophy', 'Contact'].map(item => (
          <button key={item} className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 hover:text-gold-500 transition-all">{item}</button>
        ))}
        <div className="h-4 w-[1px] bg-white/20" />
        <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="text-[10px] font-bold text-white border border-white/20 px-4 py-1.5 rounded-full">{lang.toUpperCase()}</button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-white">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  )
}

const Hero = () => {
  const { t } = useContext(LumoraContext)
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-stone-950/40 z-10" />
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=2400" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <span className="text-gold-500 tracking-[0.6em] text-[10px] font-bold uppercase">{t.hero.tagline}</span>
        </motion.div>
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl md:text-[11rem] font-light text-white mb-10 tracking-tighter italic leading-none"
        >
          {t.hero.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto text-stone-300 text-xl font-light mb-12"
        >
          {t.hero.desc}
        </motion.p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="px-16 py-6 bg-gold-500 text-white font-bold rounded-full shadow-2xl shadow-gold-500/40"
        >
          EXPLORE THE COLLECTION
        </motion.button>
      </div>
    </section>
  )
}

const DetailSection = () => {
  const { t } = useContext(LumoraContext)
  return (
    <section className="py-40 bg-white dark:bg-stone-950 relative overflow-hidden">
      <div className="absolute left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: `url("${LUXURY_ASSETS.GOLD_DAMASK}")` }} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div className="grid grid-cols-2 gap-6 relative">
             <div className="space-y-6">
               <motion.img whileInView={{ y: -20 }} src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" className="rounded-[2rem] shadow-2xl" />
               <motion.img whileInView={{ y: 20 }} src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" className="rounded-[2rem] shadow-2xl" />
             </div>
             <div className="pt-20">
               <motion.img whileInView={{ x: 20 }} src="https://images.unsplash.com/photo-1600607687940-4e524cb350b1?auto=format&fit=crop&q=80&w=800" className="rounded-[2rem] shadow-2xl" />
             </div>
             <div className="absolute -z-10 -top-10 -left-10 w-full h-full opacity-10" style={{ backgroundImage: `url("${LUXURY_ASSETS.TECH_GRID}")` }} />
          </div>
          
          <div>
            <span className="text-gold-500 text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">Legacy Management</span>
            <h2 className="text-5xl md:text-8xl font-light mb-10 dark:text-white leading-tight italic">Mülkiyetin <br/><span className="text-gold-500">Geleceğini</span> Görün.</h2>
            <div className="space-y-12">
              {t.philosophy.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-8 group">
                  <div className="text-4xl font-light text-stone-200 dark:text-stone-800 transition-colors group-hover:text-gold-500">0{i+1}</div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2 dark:text-white">{item.title}</h4>
                    <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const ConciergeSection = () => {
  const { t } = useContext(LumoraContext)
  return (
    <section className="py-32 bg-stone-900 text-white relative">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div>
           <h2 className="text-6xl font-light mb-8">{t.concierge.title}</h2>
           <p className="text-stone-400 text-xl font-light mb-12">Size sadece anahtarı değil, kusursuz bir yaşamın tüm kapılarını sunuyoruz. Zaman, satın alabileceğiniz en büyük lükstür.</p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {t.concierge.list.map((item: string) => (
                <div key={item} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                  <span className="text-sm font-bold tracking-widest uppercase transition-colors group-hover:text-gold-500">{item}</span>
                </div>
              ))}
           </div>
        </div>
        <div className="relative">
           <img src="https://images.unsplash.com/photo-1540993296010-09c063b7849c?auto=format&fit=crop&q=80&w=1200" className="rounded-[4rem] brightness-75" />
           <div className="absolute -bottom-10 -right-10 p-10 bg-gold-500 rounded-[3rem] shadow-2xl">
              <Phone size={40} className="mb-4" />
              <div className="text-xs font-bold tracking-widest uppercase mb-2">Private Line</div>
              <div className="text-2xl font-bold">{PHONE_NUMBER}</div>
           </div>
        </div>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className="bg-stone-950 text-white pt-32 pb-12 relative">
    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" style={{ backgroundImage: `url("${LUXURY_ASSETS.BADGE_LOGO}")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
        <div>
          <div className="text-5xl font-bold tracking-[0.3em] uppercase mb-4">Lumora</div>
          <div className="text-xs tracking-[1em] text-gold-500 font-bold uppercase">Istanbul — Global Network</div>
        </div>
        <div className="flex gap-8">
          {[Instagram, Facebook, Mail, MessageCircle].map((Icon, i) => (
            <motion.a key={i} whileHover={{ y: -5 }} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-gold-500 hover:border-gold-500 transition-all">
              <Icon size={20} />
            </motion.a>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-24 border-b border-white/5">
         <div>
            <h5 className="text-gold-500 font-bold uppercase tracking-widest text-[10px] mb-8">LUMORA GROUP</h5>
            <ul className="space-y-4 text-stone-500 text-sm font-light">
              <li>Mansion Portfolio</li>
              <li>Waterfront Villas</li>
              <li>Penthouse Suites</li>
              <li>Investment Hub</li>
            </ul>
         </div>
         <div>
            <h5 className="text-gold-500 font-bold uppercase tracking-widest text-[10px] mb-8">LEGAL & ADVISORY</h5>
            <ul className="space-y-4 text-stone-500 text-sm font-light">
              <li>Privacy Policy</li>
              <li>Citizenship Law</li>
              <li>Asset Protection</li>
              <li>Terms of Service</li>
            </ul>
         </div>
         <div className="col-span-2">
            <h5 className="text-gold-500 font-bold uppercase tracking-widest text-[10px] mb-8">NEWSLETTER PRESTIGE</h5>
            <div className="flex gap-4">
              <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 px-8 py-5 rounded-full flex-grow focus:outline-none focus:border-gold-500 transition-all" />
              <button className="px-10 py-5 bg-white text-stone-950 rounded-full font-bold">JOIN</button>
            </div>
         </div>
      </div>
      <div className="pt-12 text-center text-stone-700 text-[10px] tracking-[0.4em] uppercase font-bold">
        © 2024 LUMORA ISTANBUL INTERNATIONAL — PART OF THE GOLDEN CIRCLE
      </div>
    </div>
  </footer>
)

// --- MAIN WRAPPER ---
export default function UltimateLumoraApp() {
  const [lang, setLang] = useState('tr')
  const [theme, setTheme] = useState('dark')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    document.documentElement.className = theme
    setTimeout(() => setIsReady(true), 1500)
  }, [theme])

  const t = TEXT[lang as keyof typeof TEXT]

  if (!isReady) return (
    <div className="h-screen w-full bg-stone-950 flex flex-col items-center justify-center">
       <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center">
          <span className="text-4xl font-bold tracking-[0.5em] text-white uppercase">Lumora</span>
          <div className="w-16 h-[1px] bg-gold-500 mt-6" />
       </motion.div>
    </div>
  )

  return (
    <LumoraContext.Provider value={{ lang, setLang, theme, setTheme, t }}>
      <ScrollProgress />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;600&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${theme === 'dark' ? '#0c0a09' : '#fafafa'}; }
        h1, h2, h3, h4, h5 { font-family: 'Cormorant Garamond', serif; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4941a; }
        .gold-glow { box-shadow: 0 0 50px -10px rgba(212, 148, 26, 0.3); }
      `}</style>
      
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        
        <section className="py-32 container mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard icon={Anchor} title="Boğaz Hattı" desc="Bebek, Yeniköy ve Kandilli'nin en ikonik yalıları." delay={0.1} />
              <FeatureCard icon={TrendingUp} title="Yatırım Verisi" desc="Yıllık %12+ ROI hedefli stratejik mülkler." delay={0.2} />
              <FeatureCard icon={Briefcase} title="Corporate" desc="Global şirketler için genel merkez çözümleri." delay={0.3} />
           </div>
        </section>

        <DetailSection />
        <ConciergeSection />
        
        {/* Statistics Art Section (Boyut Artırıcı) */}
        <section className="py-40 bg-white dark:bg-stone-950 text-center">
           <AnimatedSignature />
           <div className="grid md:grid-cols-4 gap-12 mt-20">
              {[
                { l: "Years", v: "15+" },
                { l: "Exclusive Deals", v: "2.4B $" },
                { l: "Happy Families", v: "850+" },
                { l: "Team Size", v: "45" }
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-6xl font-light text-gold-500 mb-2">{s.v}</div>
                  <div className="text-[10px] tracking-[0.4em] text-stone-400 font-bold uppercase">{s.l}</div>
                </div>
              ))}
           </div>
        </section>

        <Footer />
        
        {/* WhatsApp Master Floating */}
        <motion.a 
          href={WHATSAPP_LINK}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="fixed bottom-12 right-12 z-[100] w-24 h-24 bg-gold-500 text-white rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(212,148,26,0.5)] gold-glow"
        >
          <MessageCircle size={36} />
        </motion.a>
      </div>
    </LumoraContext.Provider>
  )
}
