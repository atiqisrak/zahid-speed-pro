import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Share2, Zap, CheckCircle, ChevronRight, ExternalLink } from 'lucide-react';

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
  coverEmoji: string;
  heroKeyword: string;
  content: ContentBlock[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Guide: 'bg-indigo-600', Rankings: 'bg-amber-500', Tutorial: 'bg-teal-600',
  'Local Guide': 'bg-blue-600', Deals: 'bg-green-600', Troubleshooting: 'bg-red-600',
  Gaming: 'bg-violet-600', WFH: 'bg-orange-600', Report: 'bg-cyan-600', History: 'bg-rose-600',
};

function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case 'h2':
      return <h2 key={idx} className="text-xl font-black text-slate-900 mt-8 mb-3">{block.text}</h2>;
    case 'p':
      return <p key={idx} className="text-slate-600 leading-relaxed text-sm">{block.text}</p>;
    case 'table':
      return (
        <div key={idx} className="overflow-x-auto rounded-2xl border border-slate-100 my-4">
          <table className="w-full text-xs">
            <thead className="bg-indigo-600 text-white">
              <tr>{block.headers.map((h, i) => <th key={i} className="text-left px-4 py-3 font-black uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {block.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {row.map((cell, ci) => <td key={ci} className="px-4 py-3 font-medium text-slate-700">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'steps':
      return (
        <div key={idx} className="my-4 space-y-3">
          {block.items.map((step, si) => (
            <div key={si} className="flex gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{si + 1}</div>
              <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      );
    case 'faq':
      return (
        <div key={idx} className="my-6 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Frequently Asked Questions</h3>
          {block.items.map((item, fi) => (
            <div key={fi} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="font-black text-sm text-slate-900">{item.q}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed ml-6">{item.a}</p>
            </div>
          ))}
        </div>
      );
    case 'cta':
      return (
        <div key={idx} className="my-6">
          <Link to={block.href}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-black text-sm px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-teal-500/20"
          >
            <Zap size={16} className="fill-white" />
            {block.text}
            <ChevronRight size={16} />
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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold text-sm">Loading article…</p>
        </div>
      </div>
    );
  }

  const related = allPosts.filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t)))).slice(0, 3);
  const catColor = CATEGORY_COLORS[post.category] || 'bg-indigo-600';

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-full bg-slate-50 font-sans">
      {/* Hero */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-900 to-violet-900 text-white`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-6">
            <Link to="/blog" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Blog
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">{post.category}</span>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <span className="text-6xl md:text-7xl">{post.coverEmoji}</span>
            <span className={`${catColor} text-white text-[10px] font-black uppercase px-3 py-1 rounded-xl tracking-wider mt-2`}>{post.category}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black leading-tight mb-4">{post.title}</h1>
          <p className="text-indigo-200 text-sm mb-6">{post.metaDescription}</p>
          <div className="flex items-center gap-4 text-indigo-300 text-xs font-bold flex-wrap">
            <span className="flex items-center gap-1.5"><Clock size={12} />{post.readTime} min read</span>
            <span>{new Date(post.publishDate).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto">
              {copied ? '✅ Copied!' : <><Share2 size={12} />Share</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article content */}
          <article className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
              {post.content.map((block, idx) => renderBlock(block, idx))}
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm">
                  <Tag size={11} />{tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Speed Pro widget */}
            <div className="bg-gradient-to-br from-teal-600 to-indigo-600 text-white rounded-2xl p-5">
              <Zap size={24} className="fill-white text-white mb-3" />
              <h3 className="font-black mb-1">Test Your Speed</h3>
              <p className="text-teal-200 text-xs mb-4">Free — no sign-up needed</p>
              <Link to="/" className="block w-full text-center bg-white text-teal-700 font-black text-sm py-2.5 rounded-xl hover:bg-teal-50 transition-colors">
                Run Speed Test →
              </Link>
            </div>

            {/* Compare ISPs */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-black text-sm mb-3">Compare ISP Plans</h3>
              <p className="text-slate-500 text-xs mb-4">Find the best internet plan for your area and budget</p>
              <Link to="/packages" className="flex items-center justify-between text-sm font-black text-indigo-600 hover:text-indigo-700">
                View All Plans <ExternalLink size={14} />
              </Link>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="font-black text-sm mb-4 uppercase tracking-wider text-slate-400">Related Articles</h3>
                <div className="space-y-3">
                  {related.map(rp => (
                    <Link key={rp.slug} to={`/blog/${rp.slug}`}
                      className="flex items-start gap-3 group hover:bg-slate-50 rounded-xl p-2 -mx-2 transition-colors"
                    >
                      <span className="text-2xl shrink-0">{rp.coverEmoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 leading-tight line-clamp-2 transition-colors">{rp.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1"><Clock size={9} />{rp.readTime} min</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* BTRC info */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-800 mb-1">ISP Problem?</p>
              <p className="text-[10px] text-amber-700 mb-2">File a complaint with BTRC if your ISP isn't delivering advertised speeds</p>
              <a href="tel:16996" className="text-xs font-black text-amber-600 hover:underline">📞 BTRC Hotline: 16996</a>
            </div>
          </aside>
        </div>

        {/* Back to blog */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700">
            <ArrowLeft size={16} /> Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
