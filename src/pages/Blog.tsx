import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


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
  Guide:           'bg-indigo-100 text-indigo-700',
  Rankings:        'bg-amber-100 text-amber-700',
  Tutorial:        'bg-teal-100 text-teal-700',
  'Local Guide':   'bg-blue-100 text-blue-700',
  Deals:           'bg-green-100 text-green-700',
  Troubleshooting: 'bg-red-100 text-red-700',
  Gaming:          'bg-violet-100 text-violet-700',
  WFH:             'bg-orange-100 text-orange-700',
  Report:          'bg-cyan-100 text-cyan-700',
  History:         'bg-rose-100 text-rose-700',
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

  return (
    <div className="min-h-full bg-slate-50 font-sans">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
            <HugeIconPicker name="book01Icon" size={14} />
            Speed Pro Blog
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            ISP Insights &<br />
            <span className="text-indigo-300">Internet Guides</span>
          </h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-xl">
            Expert advice on internet providers, speed tips, and ISP comparisons for Mirpur & Dhaka. Updated monthly with real data.
          </p>
          {/* Search */}
          <div className="mt-8 relative max-w-md">
            <HugeIconPicker name="search01Icon" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-indigo-300 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon:'book01Icon', label: 'Articles', val: posts.length.toString() },
            { icon:'trendUp01Icon', label: 'Topics', val: `${categories.length - 1}` },
            { icon:'zapIcon',       label: 'Updated', val: 'May 2026' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-sm">
              <s.icon size={18} className="text-indigo-600 mx-auto mb-1.5" />
              <p className="text-lg font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeCategory === c
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="group block bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
          >
            <div className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <span className="text-indigo-200 bg-indigo-900/30 p-4 rounded-3xl backdrop-blur-sm">
                  <HugeIconPicker name={featured.iconName} size={48} />
                </span>
                <span className="text-xs font-bold uppercase bg-white/20 text-white px-3 py-1 rounded-xl">{featured.category}</span>
              </div>
              <h2 className="text-xl md:text-3xl font-black mb-3 leading-tight group-hover:text-indigo-200 transition-colors">
                {featured.title}
              </h2>
              <p className="text-indigo-200 text-sm mb-6 line-clamp-2">{featured.metaDescription}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-indigo-200 text-xs font-bold">
                  <span className="flex items-center gap-1"><HugeIconPicker name="time01Icon" size={12} /> {featured.readTime} min read</span>
                  <span>{new Date(featured.publishDate).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-xs font-black">
                  Read Article <HugeIconPicker name="arrowRight01Icon" size={14} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map(post => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all hover:-translate-y-0.5 flex flex-col"
              >
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 flex items-center justify-between">
                  <span className="text-indigo-600 bg-white p-3 rounded-2xl shadow-sm border border-indigo-50">
                    <HugeIconPicker name={post.iconName} size={32} />
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${CATEGORY_COLORS[post.category] || 'bg-slate-100 text-slate-600'}`}>
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-black text-sm text-slate-900 mb-2 leading-tight group-hover:text-indigo-700 transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                    {post.metaDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                      <HugeIconPicker name="time01Icon" size={11} />
                      {post.readTime} min
                    </div>
                    <div className="flex gap-1">
                      {post.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                          <HugeIconPicker name="tag01Icon" size={8} className="inline mr-0.5" />{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <HugeIconPicker name="book01Icon" size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No articles found for "{search}"</p>
          </div>
        )}

        {/* Speed Pro CTA */}
        <div className="bg-gradient-to-r from-teal-600 to-indigo-600 rounded-[1.5rem] p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg">Ready to test your ISP?</h3>
            <p className="text-teal-200 text-sm mt-1">Free internet speed test — no sign-up required</p>
          </div>
          <Link to="/" className="shrink-0 bg-white text-teal-700 font-black text-sm px-6 py-3 rounded-2xl hover:bg-teal-50 transition-colors flex items-center gap-2">
            Run Speed Test <HugeIconPicker name="zapIcon" size={16} className="fill-teal-600 text-teal-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
