import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

import HugeIconPicker from '../components/HugeIconPicker';

interface FAQItem { q: string; a: string; }
interface TableBlock { type: 'table'; headers: string[]; rows: string[][]; }
interface StepsBlock { type: 'steps'; items: string[]; }
interface FAQBlock { type: 'faq'; items: FAQItem[]; }
interface CTABlock { type: 'cta'; text: string; href: string; }
interface TextBlock { type: 'h2' | 'p'; text: string; }
type ContentBlock = TableBlock | StepsBlock | FAQBlock | CTABlock | TextBlock;

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
  content: ContentBlock[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Guide: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', Rankings: 'bg-amber-500/10 text-amber-500 border-amber-500/20', Tutorial: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  'Local Guide': 'bg-blue-500/10 text-blue-500 border-blue-500/20', Deals: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', Troubleshooting: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  Gaming: 'bg-violet-500/10 text-violet-500 border-violet-500/20', WFH: 'bg-orange-500/10 text-orange-500 border-orange-500/20', Report: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20', History: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
};

function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case 'h2':
      return <h2 key={idx} className="text-3xl font-black text-slate-900 mt-16 mb-6 uppercase tracking-wider">{block.text}</h2>;
    case 'p':
      return <p key={idx} className="text-slate-600 leading-relaxed text-lg mb-6 font-medium">{block.text}</p>;
    case 'table':
      return (
        <div key={idx} className="overflow-x-auto rounded-[1.5rem] border border-slate-200 my-10 shadow-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-teal-600 border-b border-slate-200">
              <tr>{block.headers.map((h, i) => <th key={i} className="text-left px-6 py-5 font-black uppercase tracking-widest">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {block.rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50 transition-colors">
                  {row.map((cell, ci) => <td key={ci} className="px-6 py-5 font-bold text-slate-700">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'steps':
      return (
        <div key={idx} className="my-10 space-y-6">
          {block.items.map((step, si) => (
            <div key={si} className="flex gap-5 bg-slate-50 rounded-[1.5rem] p-6 border border-slate-200 shadow-sm hover:border-teal-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-md">{si + 1}</div>
              <p className="text-base text-slate-700 leading-relaxed font-bold pt-2">{step}</p>
            </div>
          ))}
        </div>
      );
    case 'faq':
      return (
        <div key={idx} className="my-12 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 mb-8 flex items-center gap-2">
            <HugeIconPicker name="messageQuestionIcon" size={18} /> Frequently Asked Questions
          </h3>
          {block.items.map((item, fi) => (
            <div key={fi} className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <HugeIconPicker name="tickCircleIcon" size={20} className="text-teal-500 shrink-0 mt-0.5" />
                <p className="font-black text-lg text-slate-900">{item.q}</p>
              </div>
              <p className="text-base text-slate-600 leading-relaxed ml-9 font-medium">{item.a}</p>
            </div>
          ))}
        </div>
      );
    case 'cta':
      return (
        <div key={idx} className="my-12">
          <Link to={block.href}
            className="inline-flex items-center gap-3 bg-teal-500 text-white font-black uppercase tracking-widest text-sm px-10 py-5 rounded-2xl hover:bg-teal-600 transition-all shadow-[0_10px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_15px_30px_rgba(20,184,166,0.4)] hover:-translate-y-1"
          >
            <HugeIconPicker name="zapIcon" size={18} className="fill-white" />
            {block.text}
            <HugeIconPicker name="arrowRight01Icon" size={18} />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/data/blog-posts.json')
      .then(r => r.json())
      .then(d => {
        setAllPosts(d.posts || []);
        const found = (d.posts || []).find((p: BlogPost) => p.slug === slug);
        if (!found) navigate('/blog');
        else setPost(found);
      });
  }, [slug, navigate]);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(heroScroll, [0, 1], [0, 200]);
  const opacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-teal-500 rounded-full animate-spin mx-auto mb-6 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading article…</p>
        </div>
      </div>
    );
  }

  const related = allPosts.filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t)))).slice(0, 3);
  const catColor = CATEGORY_COLORS[post.category] || 'bg-slate-100 text-slate-600 border-slate-200';

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-900 bg-slate-50">
      
      {/* 1. DARK HERO SECTION */}
      <section ref={heroRef} className="relative pt-40 pb-32 px-6 flex flex-col justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ opacity, y }} className="max-w-4xl mx-auto w-full z-10 text-white relative">
          
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-10">
            <Link to="/blog" className="hover:text-teal-400 transition-colors flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
              <HugeIconPicker name="arrowLeft01Icon" size={14} /> Blog
            </Link>
            <HugeIconPicker name="arrowRight01Icon" size={12} className="text-white/20 mx-2" />
            <span className="text-teal-400 bg-teal-500/10 px-4 py-2 rounded-xl border border-teal-500/20 backdrop-blur-sm">{post.category}</span>
          </div>
          
          <div className="text-center mb-10">
            <span className="inline-flex items-center justify-center text-teal-400 bg-white/5 p-6 rounded-[2rem] backdrop-blur-md shadow-2xl border border-white/10 mb-8">
              <HugeIconPicker name={post.iconName} size={56} className="drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] uppercase tracking-tighter text-white drop-shadow-2xl">{post.title}</h1>
          </div>
          
          <p className="text-slate-400 text-lg md:text-2xl mb-12 font-bold leading-relaxed max-w-3xl mx-auto text-center tracking-tight">{post.metaDescription}</p>
          
          <div className="flex items-center justify-center gap-8 text-slate-500 text-xs font-black uppercase tracking-widest flex-wrap border-t border-white/10 pt-10">
            <span className="flex items-center gap-2"><HugeIconPicker name="time01Icon" size={16} className="text-teal-500" />{post.readTime} min read</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>{new Date(post.publishDate).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

        </motion.div>
        
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-10" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[150px] z-10 mix-blend-screen" />
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] z-10 -translate-x-1/2 mix-blend-screen" />
        </div>
      </section>

      {/* 2. LIGHT CONTENT SECTION */}
      <section className="relative z-20 bg-white py-24 px-6 border-b border-slate-200 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Article content */}
          <article className="lg:col-span-2 space-y-8">
            <div className="bg-slate-50 rounded-[3rem] border border-slate-200 p-10 md:p-16 shadow-xl">
              {post.content.map((block, idx) => renderBlock(block, idx))}
              
              {/* Tags & Share */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mt-16 pt-10 border-t border-slate-200">
                <div className="flex gap-3 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:border-teal-200 hover:text-teal-600 transition-colors cursor-default shadow-sm">
                      <HugeIconPicker name="tag01Icon" size={14} className="text-teal-500" />{tag}
                    </span>
                  ))}
                </div>
                
                <button onClick={handleShare} className="flex items-center gap-2 hover:bg-slate-100 transition-colors shrink-0 bg-white px-6 py-3 rounded-xl border border-slate-200 font-black uppercase tracking-widest text-xs text-slate-700 shadow-sm hover:shadow-md">
                  {copied ? <><HugeIconPicker name="checkIcon" size={16} className="text-emerald-500" /> <span className="text-emerald-600">Copied!</span></> : <><HugeIconPicker name="share01Icon" size={16} className="text-slate-500" /> Share</>}
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            
            {/* Speed Pro widget (DARK IN LIGHT) */}
            <div className="bg-slate-950 border border-slate-800 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 text-teal-400 pointer-events-none group-hover:scale-110 transition-transform duration-500"><HugeIconPicker name="zapIcon" size={140} /></div>
              <HugeIconPicker name="zapIcon" size={40} className="fill-teal-400 text-teal-400 mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-2">Test Your Speed</h3>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8">Free — no sign-up needed</p>
              <Link to="/" className="block w-full text-center bg-teal-500 text-slate-950 font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                Run Speed Test →
              </Link>
            </div>

            {/* Compare ISPs (LIGHT) */}
            <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-10 shadow-md">
              <h3 className="font-black text-lg uppercase tracking-tighter mb-2 text-slate-900">Compare ISP Plans</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8">Find the best internet plan for your area and budget</p>
              <Link to="/packages" className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-teal-600 hover:text-white bg-teal-50 hover:bg-teal-500 border border-teal-200 px-5 py-4 rounded-xl transition-colors shadow-sm">
                View All Plans <HugeIconPicker name="linkSquare01Icon" size={16} />
              </Link>
            </div>

            {/* Related articles (LIGHT) */}
            {related.length > 0 && (
              <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-10 shadow-md">
                <h3 className="font-black text-xs mb-8 uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                  <HugeIconPicker name="book01Icon" size={16} className="text-teal-500" /> Related Articles
                </h3>
                <div className="space-y-6">
                  {related.map(rp => (
                    <Link key={rp.slug} to={`/blog/${rp.slug}`}
                      className="flex items-start gap-5 group transition-colors"
                    >
                      <span className="text-teal-600 bg-white p-3 rounded-xl shrink-0 border border-slate-200 shadow-sm group-hover:bg-teal-50 group-hover:border-teal-200 transition-colors">
                        <HugeIconPicker name={rp.iconName} size={24} />
                      </span>
                      <div className="min-w-0 pt-1">
                        <p className="text-sm font-black text-slate-900 group-hover:text-teal-600 leading-snug line-clamp-2 transition-colors uppercase tracking-wider">{rp.title}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5"><HugeIconPicker name="time01Icon" size={12} className="text-teal-500" />{rp.readTime} min</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* BTRC info (RED THEME IN LIGHT) */}
            <div className="bg-rose-50 border border-rose-200 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute -right-4 -top-4 opacity-[0.03] text-rose-600 pointer-events-none group-hover:scale-110 transition-transform"><HugeIconPicker name="alertCircleIcon" size={140} /></div>
              <p className="text-xs font-black uppercase tracking-widest text-rose-600 mb-3 relative z-10">ISP Problem?</p>
              <p className="text-sm text-slate-700 font-bold leading-relaxed mb-8 relative z-10">File a complaint with BTRC if your ISP isn't delivering advertised speeds.</p>
              <a href="tel:16996" className="inline-flex items-center justify-center w-full gap-2 text-xs font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-500 px-6 py-4 rounded-xl transition-colors relative z-10 shadow-[0_10px_20px_rgba(225,29,72,0.3)]">
                <HugeIconPicker name="callIcon" size={16} /> Hotline: 16996
              </a>
            </div>
          </aside>
        </div>

        {/* Back to blog */}
        <div className="max-w-screen-xl mx-auto mt-16 pt-10 border-t border-slate-200 text-center">
          <Link to="/blog" className="inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-teal-600 bg-slate-50 border border-slate-200 px-8 py-4 rounded-xl hover:bg-white transition-colors shadow-sm">
            <HugeIconPicker name="arrowLeft01Icon" size={16} /> Back to all articles
          </Link>
        </div>
      </section>
      
    </div>
  );

}
