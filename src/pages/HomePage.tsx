import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useLang } from '../hooks/useLang';

interface Category {
  id: string;
  name: string;
  image_url: string | null;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { t, lang } = useLang();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const filteredCategories = useMemo(() => {
    if (!query) return categories;
    return categories.filter((category) =>
      category.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
  }, [categories, query]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await supabase.schema('public').from('categories').select('*');
      if (res.data) setCategories(res.data);
      setLoaded(true);
    }
    fetchCategories();
  }, []);

  return (
    <main className="pt-20 lg:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      {/* Hero Section */}
      <section className="relative mb-10 sm:mb-16 overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb w-[500px] h-[500px] bg-gold -top-40 -end-40" />
        <div className="orb w-[300px] h-[300px] bg-primary -bottom-20 -start-20" />
        <div className="orb w-[150px] h-[150px] bg-gold/40 top-1/3 end-1/3 animate-float" />

        <div className="relative z-10 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6 sm:mb-8 animate-fade-in-up">
              {t('home.title')}
              <span className="block bg-clip-text text-transparent bg-gold-gradient mt-2">
                {lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              {t('home.subtitle')}
            </p>

            {/* Decorative gold line */}
            <div className="mt-10 flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <div className="h-[2px] w-16 bg-gold-gradient rounded-full" />
              <span className="text-xs font-bold text-gold-dark tracking-widest uppercase">
                {filteredCategories.length} {lang === 'ar' ? 'مجموعات' : 'Collections'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {query && (
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <p className="text-sm text-on-surface-variant">
            {lang === 'ar' ? `نتائج البحث عن “${query}”` : `Search results for “${query}”`}
          </p>
          <Link to="/" className="text-sm font-bold text-gold-dark hover:text-primary transition-colors">
            {lang === 'ar' ? 'مسح البحث' : 'Clear search'}
          </Link>
        </div>
      )}

      {/* Categories Grid */}
      <section aria-live="polite" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 sm:gap-5">
        {loaded && filteredCategories.length > 0 ? (
          filteredCategories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`group relative overflow-hidden rounded-2xl bg-surface-container-lowest card-premium gradient-border opacity-0 animate-fade-in-up stagger-${Math.min(idx + 1, 8)} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/35 ${
                idx === 0 ? 'md:col-span-2 md:row-span-2' : idx === 1 ? 'md:col-span-2' : ''
              }`}
              style={{ animationFillMode: 'forwards' }}
            >
              <div className={`w-full overflow-hidden ${idx === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : idx === 1 ? 'aspect-[4/5] sm:aspect-square md:aspect-video' : 'aspect-[4/5] sm:aspect-square'}`}>
                <img
                  alt={cat.name}
                  src={cat.image_url || 'https://via.placeholder.com/400'}
                  loading="lazy"
                  decoding="async"
                  sizes={idx === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw'}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />

              {/* Content */}
              <div className={`absolute bottom-0 start-0 p-6 w-full ${idx === 0 ? 'p-8' : ''}`}>
                <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div>
                    {idx === 0 && (
                      <span className="inline-block px-3 py-1 rounded-full bg-gold/90 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                        {lang === 'ar' ? 'مميز' : 'Featured'}
                      </span>
                    )}
                    <h2 className={`font-bold tracking-tight text-white ${idx === 0 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                      {cat.name}
                    </h2>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold group-hover:text-primary transition-all duration-300 border border-white/20">
                    <span className="material-symbols-outlined text-white group-hover:text-primary text-[18px] rtl-flip">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-gold/10 to-transparent" />
            </Link>
          ))
        ) : loaded ? (
          <div className="col-span-full py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/50 mb-4 block">category</span>
            <p className="text-on-surface-variant text-sm">{t('home.no_categories')}</p>
          </div>
        ) : (
          // Skeleton loading
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : i === 1 ? 'md:col-span-2' : ''
              }`}
            >
              <div className={`shimmer w-full ${i === 0 ? 'aspect-[4/5] md:h-full min-h-[400px]' : i === 1 ? 'aspect-video' : 'aspect-square'}`} />
            </div>
          ))
        )}
      </section>
    </main>
  );
}
