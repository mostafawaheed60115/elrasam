import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useLang } from '../contexts/LanguageContext';

export default function CategoryProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const { t, lang } = useLang();

  useEffect(() => {
    async function fetchData() {
      const [{ data: pData }, { data: cData }] = await Promise.all([
        supabase.schema('public').from('products').select('*').eq('category_id', id),
        supabase.schema('public').from('categories').select('name').eq('id', id).single()
      ]);
      if (pData) setProducts(pData);
      if (cData) setCategoryName(cData.name);
      setLoaded(true);
    }
    fetchData();
  }, [id]);

  return (
    <main className="pt-24 pb-20 px-5 md:px-10 max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="mb-16 relative">
        {/* Decorative orb */}
        <div className="orb w-[400px] h-[400px] bg-gold -top-32 end-0" />

        <div className="relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8 group"
          >
            <span className="material-symbols-outlined text-[18px] rtl-flip group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform">
              arrow_back
            </span>
            {t('cat.back')}
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-gold-dark">
              {t('cat.badge')}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary leading-[1.1] mb-6 max-w-3xl">
            {categoryName}
          </h1>

          <p className="text-sm md:text-base text-on-surface-variant mt-4 max-w-xl leading-relaxed">
            {t('cat.subtitle')}
          </p>

          {/* Gold line */}
          <div className="mt-8 h-[2px] w-20 bg-gold-gradient rounded-full" />
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loaded && products.length > 0 ? (
          products.map((product, idx) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className={`group card-premium opacity-0 animate-fade-in-up stagger-${Math.min(idx + 1, 8)} ${
                idx === 0 ? 'sm:col-span-2' : ''
              }`}
              style={{ animationFillMode: 'forwards' }}
            >
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden ghost-border-gold h-full flex flex-col">
                {/* Image */}
                <div className={`relative overflow-hidden ${idx === 0 ? 'aspect-[16/10]' : 'aspect-square'}`}>
                  {/* Placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-on-surface-variant/30 bg-surface-container-low">
                    <span className="material-symbols-outlined text-4xl mb-1">image</span>
                  </div>
                  <img
                    alt={product.name}
                    src={product.main_image_url || "bad_url"}
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 z-10 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Featured badge */}
                  {idx === 0 && (
                    <div className="absolute top-4 start-4 z-30 px-3 py-1.5 rounded-full bg-gold text-primary text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      {t('cat.featured')}
                    </div>
                  )}

                  {/* Quick view icon */}
                  <div className="absolute bottom-4 end-4 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <span className="material-symbols-outlined text-primary text-[18px] rtl-flip">arrow_forward</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className={`font-bold text-on-surface tracking-tight line-clamp-1 ${idx === 0 ? 'text-lg' : 'text-sm'}`}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 opacity-70 leading-relaxed">
                    {product.description || t('product.description_fallback')}
                  </p>

                  {/* Price */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-outline-variant/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-black text-primary ${idx === 0 ? 'text-xl' : 'text-base'}`}>
                        {product.price}
                      </span>
                      <span className="text-xs font-semibold text-gold-dark">
                        {t('product.currency')}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[16px] rtl-flip transition-colors duration-300">
                        north_east
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : loaded ? (
          <div className="col-span-full py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/50 mb-4 block">inventory_2</span>
            <p className="text-on-surface-variant text-sm">{t('cat.no_products')}</p>
          </div>
        ) : (
          // Skeleton loading
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden ${i === 0 ? 'sm:col-span-2' : ''}`}
            >
              <div className={`shimmer w-full ${i === 0 ? 'aspect-[16/10]' : 'aspect-square'}`} />
              <div className="p-5 space-y-3">
                <div className="shimmer h-4 w-3/4 rounded-full" />
                <div className="shimmer h-3 w-1/2 rounded-full" />
                <div className="shimmer h-5 w-1/3 rounded-full mt-4" />
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
