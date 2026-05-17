/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Zap,
  Leaf,
  Thermometer,
  Box as BoxIcon,
  ExternalLink,
  Palette
} from 'lucide-react';

// Tracking helper
const trackClick = (id: string, label: string) => {
  console.log(`[Tracking] Click detected: ${id} (${label})`);
  // Log to GTM dataLayer if available
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'cta_click',
      cta_id: id,
      cta_label: label
    });
  }
};

const themes = [
  { id: '', name: 'Midnight Neon' },
  { id: 'theme-monochrome', name: 'Gallery Monochrome' },
  { id: 'theme-sunset', name: 'Sunset Clay' }
];

// CTA Button Component
const CTAButton = ({ 
  id, 
  label, 
  variant = 'primary', 
  className = '' 
}: { 
  id: string, 
  label: string, 
  variant?: 'primary' | 'secondary' | 'outline',
  className?: string 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold transition-all duration-300 rounded-full group overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-brand-primary text-brand-primary-content hover:opacity-90 shadow-lg shadow-brand-primary/20",
    secondary: "bg-brand-secondary text-white hover:opacity-90 shadow-lg shadow-brand-secondary/20",
    outline: "border-2 border-brand-border text-brand-text hover:border-brand-primary"
  };

  return (
    <button
      id={id}
      onClick={() => trackClick(id, label)}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {label}
        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <motion.div
        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
        whileHover={{ scale: 1.5 }}
      />
    </button>
  );
};

// FAQ Component
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = `faq-${question.substring(0, 10)}`;

  return (
    <div className="border-b border-brand-border">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) trackClick(id, "FAQ Open");
        }}
        className="flex items-center justify-between w-full py-6 text-left focus:outline-none group"
      >
        <span className="text-xl font-bold transition-colors group-hover:text-brand-primary">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 opacity-50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-lg opacity-80 leading-relaxed text-brand-text">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Comparison Card Component
const ComparisonCard = ({ 
  title, 
  image, 
  features, 
  price, 
  type 
}: { 
  title: string, 
  image: string, 
  features: string[], 
  price: string,
  type: string
}) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-brand-surface rounded-3xl overflow-hidden shadow-xl border border-brand-border group cursor-pointer"
      onClick={() => trackClick(`card-${type}`, title)}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-brand-bg/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-brand-text">
          {type}
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <ul className="space-y-3 mb-8">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-brand-text/70 italic text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-6 border-t border-brand-border">
          <span className="text-sm opacity-50 uppercase tracking-tighter font-bold">Estimated Cost</span>
          <span className="text-2xl font-black text-brand-primary font-display italic">{price}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTheme, setActiveTheme] = useState('');

  // Apply theme to document body
  useEffect(() => {
    document.body.className = activeTheme;
  }, [activeTheme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative font-sans">
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className="bg-brand-surface/80 backdrop-blur border border-brand-border p-2 rounded-full hidden md:flex items-center gap-2">
          <Palette className="w-4 h-4 ml-2 opacity-50" />
          {themes.map(theme => (
            <button
              key={theme.name}
              onClick={() => setActiveTheme(theme.id)}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${
                activeTheme === theme.id ? 'bg-brand-text text-brand-bg' : 'hover:bg-brand-surface-alt text-brand-text'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator for analysis */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Floating CTA for persistence tracking */}
      <AnimatePresence>
        {scrollProgress > 0.2 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:block"
          >
            <div className="bg-brand-inverse/90 backdrop-blur-xl p-2 rounded-full shadow-2xl flex items-center gap-4">
              <p className="pl-6 pr-2 text-brand-inverse-text font-bold text-sm">あなたにぴったりのヤモリは？</p>
              <CTAButton id="cta-floating" label="今すぐ診断" className="px-6 py-2 text-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/public/images/leopard_gecko_hero_1779006098556.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105 blur-[2px] opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg/50 to-brand-bg" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Leaf className="w-3 h-3" />
              Reptile Life for Beginners
            </div>
            <h1 className="text-7xl md:text-9xl font-display font-black leading-[0.85] mb-8 text-balance text-brand-text">
              はじめての<br/>
              <span className="text-brand-primary italic">レスタイルズ</span><br/>
              日記。
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl text-brand-text/70 leading-relaxed mb-12">
              静かな夜の、小さな相棒。実際に飼育してわかった「リアルな魅力」と「正しい始め方」をプロの視点で網羅。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <CTAButton id="cta-top" label="無料でガイドを読む" />
              <button 
                onClick={() => trackClick('cta-secondary-hero', 'Check Kit')}
                className="flex items-center gap-3 px-8 py-4 font-extrabold text-brand-text hover:text-brand-primary transition-colors"
                id="cta-hero-sub"
              >
                必要なセットを見る
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] [writing-mode:vertical-rl]">Scroll Down</span>
          <div className="w-px h-12 bg-brand-text" />
        </motion.div>
      </section>

      {/* Facts Grid */}
      <section className="py-32 bg-brand-surface border-y border-brand-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Zap, title: "音が出ない", desc: "夜行性ですが極めて静か。一人暮らしやマンションでも騒音トラブルの心配はありません。" },
              { icon: Thermometer, title: "匂いがない", desc: "適切な環境管理をすれば、特有の臭いはゼロ。インテリアの邪魔にならないペットです。" },
              { icon: BoxIcon, title: "場所を取らない", desc: "中型ケージが1つあれば、場所を最小限に。デスクの横でも飼育可能です。" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group"
              >
                <div className="w-16 h-16 bg-brand-surface-alt flex items-center justify-center rounded-3xl mb-8 transition-colors group-hover:bg-brand-primary group-hover:text-brand-primary-content text-brand-text">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display italic text-brand-text">{item.title}</h3>
                <p className="text-brand-text/60 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section (Heatmap focus) */}
      <section className="py-32 bg-brand-bg relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-5xl md:text-7xl font-display font-black mb-8 text-brand-text">どっちの、ヤモリ？</h2>
            <p className="text-lg text-brand-text/70 font-medium">初心者に人気の2大巨頭。あなたのライフスタイルに合わせて。どっちが気になりますか？</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <ComparisonCard 
              type="Desert Type"
              title="ヒョウモントカゲモドキ"
              image="/public/images/leopard_gecko_hero_1779006098556.png"
              features={["地上を歩くのが得意", "豊富なカラーバリエーション", "乾燥した環境を好む"]}
              price="¥5,000 〜"
            />
            <ComparisonCard 
              type="Forest Type"
              title="クレステッドゲッコウ"
              image="/public/images/crested_gecko_hero_1779006116703.png"
              features={["壁を登ることができる", "昆虫なしの専用フードで飼育可能", "湿度が高い環境を好む"]}
              price="¥15,000 〜"
            />
          </div>

          <div className="mt-16 text-center flex flex-col items-center justify-center gap-4">
            <CTAButton id="cta-middle" label="失敗しない種類選びガイドを無料で手に入れる" variant="secondary" />
          </div>
        </div>
      </section>

      {/* Ambiguous Path Section (Analysis focus) */}
      <section className="py-32 bg-brand-inverse text-brand-inverse-text relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-display font-black mb-10 leading-tight">
                「なんとなく」で<br/>
                始めないために。
              </h2>
              <p className="text-xl opacity-80 mb-12 font-medium leading-relaxed">
                命を預かる責任。でも、恐れる必要はありません。正しい順序で学べば、誰でも一生のパートナーになれます。
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => trackClick('path-equipment', 'Equipment Path')}
                className="bg-brand-inverse-text/5 border border-brand-inverse-text/10 p-10 rounded-[40px] cursor-pointer hover:bg-brand-inverse-text/10 transition-colors group relative overflow-hidden"
                id="path-box-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <Thermometer className="w-20 h-20" />
                </div>
                <Thermometer className="w-10 h-10 mb-8" />
                <h4 className="text-2xl font-bold mb-4">機材を揃える</h4>
                <p className="text-sm opacity-50 font-medium">何が必要か。必要最低限の機材リストをチェックする。</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => trackClick('path-care', 'Care Path')}
                className="bg-brand-inverse-text/5 border border-brand-inverse-text/10 p-10 rounded-[40px] cursor-pointer hover:bg-brand-inverse-text/10 transition-colors group relative overflow-hidden"
                id="path-box-2"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <Heart className="w-20 h-20" />
                </div>
                <Heart className="w-10 h-10 mb-8" />
                <h4 className="text-2xl font-bold mb-4">飼育法を知る</h4>
                <p className="text-sm opacity-50 font-medium">毎日のルーティンやエサのやり方をゼロから学ぶ。</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Highlight */}
      <section className="py-32 bg-brand-surface">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <img 
                src="/public/images/reptile_starter_kit_1779006131449.png" 
                alt="Starter Kit" 
                className="rounded-[60px] shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl z-0" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-secondary/20 rounded-full blur-3xl z-0" />
            </motion.div>
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-display font-black mb-10 italic text-brand-primary decoration-brand-primary/30 underline-offset-8">必要なのは、これだけ。</h2>
              <div className="space-y-6 mb-16">
                {[
                  { name: "ガラスケージ", desc: "45cm程度のものが標準的です" },
                  { name: "パネルヒーター", desc: "底面から体を温めるために必須です" },
                  { name: "隠れ家 (シェルター)", desc: "安心できる暗い場所を作ります" },
                  { name: "水入れ", desc: "脱皮を助け、水分補給に必要です" },
                  { name: "ピンセット", desc: "安全にエサを与えるための必須アイテム" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 items-start bg-brand-bg p-4 rounded-2xl border border-brand-border hover:border-brand-primary/50 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary shrink-0 mt-1" />
                    <div>
                      <span className="text-xl font-bold block mb-1 text-brand-text">{item.name}</span>
                      <span className="text-sm opacity-50 font-medium text-brand-text">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <CTAButton id="cta-bottom" label="おすすめ飼育セット一覧を見る" variant="outline" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-brand-bg">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20 italic">
            <h2 className="text-5xl font-display font-black mb-6 underline decoration-brand-primary/30 text-brand-text">よくある不安と質問</h2>
            <p className="text-brand-text/60 text-lg">初めての方が必ず抱く疑問。解決してすっきり始めませんか？</p>
          </div>
          <div className="space-y-2 bg-brand-surface p-8 md:p-12 rounded-[50px] shadow-xl border border-brand-border">
            <FAQItem 
              question="旅行に行っても大丈夫？" 
              answer="成体のヤモリであれば、適切な環境（温度管理・水）があれば2〜3日程度の留守は問題ありません。ただし、幼体のうちは毎日の給餌が必要です。"
            />
            <FAQItem 
              question="生き餌（虫）は絶対ですか？" 
              answer="人工飼料だけで飼育可能な種類や個体が増えています。虫が苦手な方は、レオパドライなどの人工飼料に慣れている個体を選びましょう。"
            />
            <FAQItem 
              question="なつきますか？" 
              answer="犬や猫のように甘えることはありませんが、飼育者に慣れて手の上で大人しくしてくれる（ベタ慣れ）ようにはなります。"
            />
            <FAQItem 
              question="電気代はどのくらい？" 
              answer="パネルヒーターのみなら月数百円。冬場に保温器具をフル活用しても月1,000円〜2,000円程度。非常にリーズナブルです。"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-inverse text-brand-inverse-text pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-24">
            <div className="max-w-md">
              <h3 className="text-4xl font-display font-black italic mb-8 tracking-tighter">REPTILES LAB.</h3>
              <p className="text-lg opacity-60 leading-relaxed font-medium">
                「はじめてのレスタイルズ日記」は、爬虫類との豊かな暮らしを提案するクリエイティブ・ラボが運営しています。小さな命との出会いが、あなたの日常を少しだけ豊かにしますように。
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 w-full lg:w-auto">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 mb-8 font-sans">Menu</p>
                <ul className="space-y-6 text-sm font-bold">
                  <li><a href="#" onClick={() => trackClick('footer-link', 'About')} className="hover:text-brand-primary transition-colors block underline decoration-transparent hover:decoration-brand-inverse-text/20 underline-offset-4">サイトについて</a></li>
                  <li><a href="#" onClick={() => trackClick('footer-link', 'Guidelines')} className="hover:text-brand-primary transition-colors block underline decoration-transparent hover:decoration-brand-inverse-text/20 underline-offset-4">飼育ガイドライン</a></li>
                  <li><a href="#" onClick={() => trackClick('footer-link', 'Safety')} className="hover:text-brand-primary transition-colors block underline decoration-transparent hover:decoration-brand-inverse-text/20 underline-offset-4">安全への取り組み</a></li>
                  <li><a href="#" onClick={() => trackClick('footer-link', 'Inquiry')} className="hover:text-brand-primary transition-colors block underline decoration-transparent hover:decoration-brand-inverse-text/20 underline-offset-4">お問い合わせ</a></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 mb-8 font-sans">Contact</p>
                <p className="text-base font-bold flex items-center gap-3 group cursor-pointer hover:text-brand-primary transition-colors">
                  keigo.so119@gmail.com
                  <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-brand-inverse-text/10 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
            <p className="text-[10px] font-black tracking-[0.5em] uppercase font-sans">© 2026 レスタイルズラボ. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-12 text-[10px] font-black tracking-[0.4em] uppercase font-sans">
              <a href="#" className="hover:opacity-100 hover:text-brand-primary transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:opacity-100 hover:text-brand-primary transition-colors">TERMS OF SERVICE</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
