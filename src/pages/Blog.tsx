import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

import HugeIconPicker from '../components/HugeIconPicker';

interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  tags: string[];
  readTime: number;
  publishDate: string;
  iconName: string;
  heroKeyword: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Guide:           'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Rankings:        'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Tutorial:        'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'Local Guide':   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Deals:           'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Troubleshooting: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Gaming:          'bg-violet-500/10 text-violet-400 border-violet-500/20',
  WFH:             'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Report:          'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  History:         'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/data/blog-posts.json')
      .then(r => r.json())
      .then(d => setPosts(d.posts || []));
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scale = useTransform(heroScroll, [0, 1], [1, 1.2]);
  const y = useTransform(heroScroll, [0, 1], [0, 200]);
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500/30 selection:text-teal-900">
      
      {/* 1. DARK HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[90vh] pt-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity }} className="max-w-screen-2xl mx-auto w-full z-10 text-white relative pointer-events-none text-center">
          <div className="inline-flex items-center justify-center gap-2 text-teal-400 text-xs font-black uppercase tracking-widest mb-6 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-sm">
            <HugeIconPicker name="book01Icon" size={16} /> Speed Pro Blog
          </div>
          <h1 className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter mb-8 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white">
            ISP INSIGHTS & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">GUIDES</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto font-medium tracking-tight mb-16 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            Expert advice on internet providers, speed tips, and ISP comparisons for Mirpur & Dhaka. Updated monthly with real data.
          </p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto group pointer-events-auto">
            <HugeIconPicker name="search01Icon" size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH ARTICLES…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-slate-500 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all shadow-2xl"
            />
          </div>
        </motion.div>
        
        <motion.div style={{ scale, y }} className="absolute inset-0 z-0 overflow-hidden bg-slate-950 origin-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[150px] z-10 mix-blend-screen" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[150px] z-10 -translate-x-1/2 mix-blend-screen" />
        </motion.div>
      </section>

      {/* 2. LIGHT STATS & TABS SECTION */}
      <section className="relative z-20 bg-white py-16 px-6 border-b border-slate-200 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-6 w-full lg:w-auto shrink-0">
            {[
              { icon:'book01Icon', label: 'Articles', val: posts.length.toString() },
              { icon:'trendUp01Icon', label: 'Topics', val: `${categories.length - 1}` },
              { icon:'zapIcon',       label: 'Updated', val: 'May 2026' },
            ].map((s, idx) => (
              <div key={s.label} className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200 text-center shadow-sm">
                <HugeIconPicker name={s.icon} size={24} className={`mx-auto mb-3 transition-colors ${idx === 0 ? 'text-teal-600' : idx === 1 ? 'text-indigo-600' : 'text-emerald-600'}`} />
                <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{s.val}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Category tabs */}
          <div className="flex-1 flex gap-3 flex-wrap justify-center lg:justify-end">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                  activeCategory === c
                    ? 'bg-teal-500 text-white border-teal-500 shadow-[0_5px_15px_rgba(20,184,166,0.3)]'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIGHT BG, DARK CARDS CONTENT SECTION */}
      <section className="relative bg-slate-50 py-24 px-6 pb-40">
        <div className="max-w-screen-2xl mx-auto space-y-12">
          
          {/* Featured post */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Link
                to={`/blog/${featured.slug}`}
                className="group block bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(20,184,166,0.2)] hover:border-teal-500/50 transition-all hover:-translate-y-2 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-10 md:p-16 relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-10">
                    <span className="text-teal-400 bg-white/5 border border-white/10 p-6 rounded-[2rem] shadow-inner group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-colors">
                      <HugeIconPicker name={featured.iconName} size={64} className="drop-shadow-[0_0_15px_currentColor]" />
                    </span>
                    <span className={`text-xs font-black uppercase tracking-widest border px-4 py-2 rounded-xl ${CATEGORY_COLORS[featured.category] || 'bg-white/5 border-white/10 text-white'}`}>{featured.category}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight group-hover:text-teal-400 transition-colors uppercase tracking-tighter text-white max-w-4xl">
                    {featured.title}
                  </h2>
                  <p className="text-slate-400 font-bold tracking-wide text-lg md:text-xl mb-12 line-clamp-2 uppercase max-w-3xl">
                    {featured.metaDescription}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10 pt-8">
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2"><HugeIconPicker name="time01Icon" size={16} className="text-teal-500" /> {featured.readTime} MIN READ</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <span>{new Date(featured.publishDate).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-teal-500/10 border border-teal-500/30 group-hover:bg-teal-500 group-hover:text-slate-950 group-hover:border-teal-500 text-teal-400 transition-colors px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest w-full sm:w-auto justify-center">
                      Read Article <HugeIconPicker name="arrowRight01Icon" size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Post grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post, i) => (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-teal-500/50 hover:shadow-[0_15px_40px_rgba(20,184,166,0.15)] transition-all hover:-translate-y-2 flex flex-col h-full shadow-2xl"
                  >
                    <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/5 group-hover:bg-teal-500/10 transition-colors">
                      <span className="text-slate-300 bg-white/5 p-4 rounded-[1.5rem] shadow-inner border border-white/10 group-hover:text-teal-400 group-hover:border-teal-500/50 transition-colors">
                        <HugeIconPicker name={post.iconName} size={32} />
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-lg ${CATEGORY_COLORS[post.category] || 'bg-white/5 border-white/10 text-white'}`}>
                        {post.category}
                      </span>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="font-black text-xl text-white mb-4 leading-snug group-hover:text-teal-400 transition-colors uppercase tracking-wider line-clamp-3">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8 line-clamp-3 flex-1">
                        {post.metaDescription}
                      </p>
                      <div className="flex flex-col gap-5">
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-white/5 border border-white/10 text-slate-400 rounded-lg">
                              <HugeIconPicker name="tag01Icon" size={12} className="inline mr-1 text-teal-500" />{t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest pt-5 border-t border-white/10">
                          <HugeIconPicker name="time01Icon" size={14} className="text-teal-500" />
                          {post.readTime} MIN READ
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 shadow-xl">
              <HugeIconPicker name="book01Icon" size={64} className="mx-auto mb-6 text-slate-300 drop-shadow-sm" />
              <p className="font-black text-slate-500 uppercase tracking-widest text-lg">No articles found for "{search}"</p>
            </div>
          )}

        </div>
      </section>

      {/* 4. DARK FOOTER CTA */}
      <section className="bg-slate-950 py-24 px-6 border-t border-slate-800">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-gradient-to-br from-teal-900/40 to-slate-900 border border-teal-500/30 rounded-[3rem] p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_0_50px_rgba(20,184,166,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
            <div className="absolute -right-10 -top-10 opacity-20 text-teal-400 pointer-events-none group-hover:scale-110 transition-transform duration-700"><HugeIconPicker name="zapIcon" size={200}/></div>
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="font-black text-4xl md:text-5xl uppercase tracking-tighter text-white drop-shadow-md mb-4">Ready to test your ISP?</h3>
              <p className="text-teal-400 text-sm md:text-base font-black uppercase tracking-widest drop-shadow-[0_0_10px_currentColor]">Free internet speed test — no sign-up required</p>
            </div>
            <Link to="/" className="shrink-0 bg-teal-500 text-slate-950 font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-teal-400 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] relative z-10 group-hover:-translate-y-1">
              Run Speed Test <HugeIconPicker name="zapIcon" size={20} className="fill-slate-950" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
