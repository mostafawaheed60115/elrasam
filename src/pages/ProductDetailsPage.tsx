import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useLang } from '../contexts/LanguageContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { t, lang } = useLang();

  useEffect(() => {
    async function fetchProduct() {
      const { data: productData } = await supabase
        .schema('public')
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();
      if (productData) {
        const { data: imagesData } = await supabase
          .schema('public')
          .from('product_images')
          .select('*')
          .eq('product_id', id)
          .order('display_order', { ascending: true });
        const fullProduct = { ...productData, additionalImages: imagesData || [] };
        setProduct(fullProduct);
        setSelectedImage(fullProduct.main_image_url || '');
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="text-sm text-on-surface-variant font-medium">{t('product.loading')}</span>
        </div>
      </div>
    );
  }

  const allImages = [
    { id: 'main', image_url: product.main_image_url },
    ...(product.additionalImages || [])
  ].filter(img => img.image_url);

  return (
    <main className="pt-24 pb-20 px-5 md:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">

        {/* Left: Product Images */}
        <div className="md:col-span-7 flex flex-col gap-5">
          {/* Main Image */}
          <button
            onClick={() => setExpandedImage(selectedImage)}
            className="w-full block relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[3/4] group cursor-zoom-in text-left bg-surface-container-low gradient-border"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/30">
              <span className="material-symbols-outlined text-5xl mb-2">image</span>
              <span className="text-xs font-medium uppercase tracking-widest">{t('product.image_unavailable')}</span>
            </div>
            <img
              alt={product.name}
              src={selectedImage}
              onError={(e) => { e.currentTarget.style.opacity = '0'; }}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 z-10 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Zoom indicator */}
            <div className="absolute top-4 end-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              <span className="material-symbols-outlined text-primary text-[20px]">zoom_in</span>
            </div>
            {/* Inner border for premium feel */}
            <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none z-20" />
          </button>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                    selectedImage === img.image_url
                      ? 'border-gold shadow-lg shadow-gold/20 ring-2 ring-gold/30'
                      : 'border-transparent hover:border-outline-variant/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    alt=""
                    src={img.image_url}
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="sticky top-28">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8 group"
            >
              <span className="material-symbols-outlined text-[18px] rtl-flip group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform">
                arrow_back
              </span>
              {t('product.back')}
            </button>

            {/* Category badge */}
            {product.categories?.name && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 text-gold-dark rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <span className="w-1 h-1 rounded-full bg-gold" />
                {product.categories.name}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary leading-[1.15] mb-8">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl lg:text-4xl font-black text-primary">{product.price}</span>
              <span className="text-lg font-bold text-gold">{t('product.currency')}</span>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-gold-gradient rounded-full" />
              <div className="h-[2px] flex-grow bg-outline-variant/15 rounded-full" />
            </div>

            {/* Description */}
            <div className="mb-10">
              <p className="text-on-surface-variant text-base lg:text-lg leading-[1.8]">
                {product.description || t('product.description_fallback')}
              </p>
            </div>

            {/* WhatsApp CTA */}
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/201004212424"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full py-5 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-2xl font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current relative z-10 transition-transform group-hover:scale-110">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span className="relative z-10">{t('product.contact')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out animate-fade-in"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            alt=""
          />
          <button
            className="absolute top-6 end-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-md transition-colors w-12 h-12 flex items-center justify-center border border-white/20"
            onClick={(e) => { e.stopPropagation(); setExpandedImage(null); }}
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          {/* Thumbnail navigation in lightbox */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 inset-x-6 flex justify-center gap-2">
              {allImages.map((img: any) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setExpandedImage(img.image_url); }}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    expandedImage === img.image_url ? 'border-gold scale-110' : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
