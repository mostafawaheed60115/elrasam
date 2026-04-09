import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { useLang } from '../../contexts/LanguageContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Forms Visibility
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    id: null as number | null,
    name: '',
    description: '',
    price: '',
    category_id: ''
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<(File | null)[]>([null, null, null]);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({ id: null as number | null, name: '' });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin');
    }
    fetchData();
  }, [navigate]);

  async function fetchData() {
    setLoading(true);
    const [catRes, prodRes] = await Promise.all([
      supabase.schema('public').from('categories').select('*').order('created_at', { ascending: false }),
      supabase.schema('public').from('products').select('*, categories(name)').order('created_at', { ascending: false })
    ]);
    if (catRes.data) {
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !productForm.category_id) {
        setProductForm(prev => ({ ...prev, category_id: catRes.data[0].id.toString() }));
      }
    }
    if (prodRes.data) setProducts(prodRes.data);
    setLoading(false);
  }

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  /* ---------------------- CATEGORIES CRUD ---------------------- */
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (categoryImage) {
        const fileExt = categoryImage.name.split('.').pop();
        const fileName = `cat_${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('storage').upload(`categories/${fileName}`, categoryImage);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('storage').getPublicUrl(`categories/${fileName}`);
        imageUrl = data.publicUrl;
      }

      if (categoryForm.id) {
        const updates: any = { name: categoryForm.name };
        if (imageUrl) updates.image_url = imageUrl;
        const { error } = await supabase.schema('public').from('categories').update(updates).eq('id', categoryForm.id);
        if (error) throw error;
        showMessage(t('admin.cat_updated'));
      } else {
        if (!imageUrl) throw new Error(t('admin.image_required'));
        const { error } = await supabase.schema('public').from('categories').insert([{ name: categoryForm.name, image_url: imageUrl }]);
        if (error) throw error;
        showMessage(t('admin.cat_added'));
      }

      setCategoryForm({ id: null, name: '' });
      setCategoryImage(null);
      setShowCategoryForm(false);
      fetchData();
    } catch (err: any) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm(t('admin.delete_confirm_cat'))) return;
    setLoading(true);
    const { error } = await supabase.schema('public').from('categories').delete().eq('id', id);
    if (error) showMessage(error.message, 'error');
    else { showMessage(t('admin.cat_deleted')); fetchData(); }
    setLoading(false);
  };

  /* ---------------------- PRODUCTS CRUD ---------------------- */
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mainImageUrl = '';

      if (mainImage) {
        const ext = mainImage.name.split('.').pop();
        const mainPath = `products/main_${Date.now()}.${ext}`;
        const { error: mErr } = await supabase.storage.from('storage').upload(mainPath, mainImage);
        if (mErr) throw mErr;
        mainImageUrl = supabase.storage.from('storage').getPublicUrl(mainPath).data.publicUrl;
      }

      if (productForm.id) {
        const updates: any = {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          category_id: parseInt(productForm.category_id),
        };
        if (mainImageUrl) updates.main_image_url = mainImageUrl;

        const { error } = await supabase.schema('public').from('products').update(updates).eq('id', productForm.id);
        if (error) throw error;
        showMessage(t('admin.prod_updated'));
      } else {
        if (!mainImageUrl) throw new Error(t('admin.main_img_required'));

        const { data: inserted, error: iErr } = await supabase.schema('public').from('products').insert([
          {
            name: productForm.name,
            description: productForm.description,
            price: parseFloat(productForm.price),
            category_id: parseInt(productForm.category_id),
            main_image_url: mainImageUrl
          }
        ]).select().single();
        if (iErr) throw iErr;

        let displayOrder = 1;
        for (const tFile of additionalImages) {
          if (tFile) {
            const tExt = tFile.name.split('.').pop();
            const tPath = `products/add_${inserted.id}_${Date.now()}_${displayOrder}.${tExt}`;
            const { error: upErr } = await supabase.storage.from('storage').upload(tPath, tFile);
            if (!upErr) {
              const url = supabase.storage.from('storage').getPublicUrl(tPath).data.publicUrl;
              await supabase.schema('public').from('product_images').insert([{ product_id: inserted.id, image_url: url, display_order: displayOrder }]);
              displayOrder++;
            }
          }
        }
        showMessage(t('admin.prod_added'));
      }

      setProductForm({ id: null, name: '', description: '', price: '', category_id: categories[0]?.id.toString() || '' });
      setMainImage(null);
      setAdditionalImages([null, null, null]);
      setShowProductForm(false);
      fetchData();

    } catch (err: any) {
      showMessage(`${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm(t('admin.delete_confirm_prod'))) return;
    setLoading(true);
    await supabase.schema('public').from('product_images').delete().eq('product_id', id);
    const { error } = await supabase.schema('public').from('products').delete().eq('id', id);

    if (error) showMessage(error.message, 'error');
    else { showMessage(t('admin.prod_deleted')); fetchData(); }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <main className="pt-28 md:pt-40 min-h-screen bg-background">
      <div className="flex">
        {/* ==================== Sidebar ==================== */}
        <aside className="hidden md:flex flex-col w-72 fixed top-[146px] bottom-0 start-0 bg-surface-container-lowest border-e border-outline-variant/15 p-5 z-30">
          {/* Brand */}
          <div className="flex items-center justify-center px-4 mb-8 mt-2">
            <img
              src="/logo.jpg"
              alt={lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'}
              className="h-16 w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.15)]"
            />
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1 flex-grow">
            <button
              onClick={() => { setActiveTab('products'); setShowProductForm(false); }}
              className={`admin-sidebar-item ${activeTab === 'products' ? 'active' : 'text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              {t('admin.products')}
              <span className="ms-auto text-xs font-bold opacity-60">{products.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('categories'); setShowCategoryForm(false); }}
              className={`admin-sidebar-item ${activeTab === 'categories' ? 'active' : 'text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">category</span>
              {t('admin.categories_tab')}
              <span className="ms-auto text-xs font-bold opacity-60">{categories.length}</span>
            </button>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="admin-sidebar-item text-on-surface-variant hover:text-error mt-auto"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {t('admin.logout')}
          </button>
        </aside>

        {/* ==================== Mobile Top Bar ==================== */}
        <div className="md:hidden fixed top-[98px] inset-x-0 z-30 bg-surface-container-lowest border-b border-outline-variant/15 px-4 py-2 flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('products'); setShowProductForm(false); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${activeTab === 'products' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant'}`}
          >
            {t('admin.products')} ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setShowCategoryForm(false); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${activeTab === 'categories' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant'}`}
          >
            {t('admin.categories_tab')} ({categories.length})
          </button>
          <button
            onClick={handleLogout}
            className="p-2.5 text-on-surface-variant hover:text-error rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {/* ==================== Main Content ==================== */}
        <div className="flex-1 md:ms-72 w-full px-5 md:px-10 lg:px-14 pt-16 md:pt-6 pb-20">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-lowest rounded-2xl p-5 ghost-border-gold">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gold text-[22px]">inventory_2</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('admin.total_products')}</span>
              </div>
              <span className="text-3xl font-black text-primary">{products.length}</span>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-5 ghost-border-gold">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[22px]">category</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('admin.total_categories')}</span>
              </div>
              <span className="text-3xl font-black text-primary">{categories.length}</span>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-xl font-medium flex items-center gap-3 text-sm animate-fade-in ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {message.type === 'error' ? 'error' : 'check_circle'}
              </span>
              {message.text}
            </div>
          )}

          {/* ==================== PRODUCTS VIEW ==================== */}
          {activeTab === 'products' && (
            <div className="animate-fade-in-up">
              {!showProductForm ? (
                <div className="bg-surface-container-lowest rounded-2xl ghost-border overflow-hidden">
                  <div className="p-5 border-b border-outline-variant/15 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-on-surface">{t('admin.all_products')}</h2>
                    <button
                      onClick={() => {
                        setProductForm({ id: null, name: '', description: '', price: '', category_id: categories[0]?.id.toString() || '' });
                        setShowProductForm(true);
                      }}
                      className="px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-dim transition flex items-center gap-2 shadow-lg shadow-primary/10"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      {t('admin.new_product')}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-sm">
                      <thead className="bg-surface-container/40 text-on-surface-variant">
                        <tr>
                          <th className="px-5 py-4 font-semibold text-start">{t('admin.product_name')}</th>
                          <th className="px-5 py-4 font-semibold text-start">{t('admin.category')}</th>
                          <th className="px-5 py-4 font-semibold text-start">{t('admin.price')}</th>
                          <th className="px-5 py-4 font-semibold text-end">{t('admin.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-16 text-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-4xl text-outline-variant/40 mb-2 block">inventory_2</span>
                              {t('admin.no_products')}
                            </td>
                          </tr>
                        ) : products.map(p => (
                          <tr key={p.id} className="hover:bg-surface-container/30 transition duration-150 group">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 shadow-sm">
                                  <img src={p.main_image_url} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                </div>
                                <span className="font-bold text-on-surface text-sm">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-medium px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">
                                {categories.find(c => c.id === p.category_id)?.name || '—'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-primary">{p.price}</span>
                              <span className="text-xs text-gold-dark ms-1 font-medium">{t('product.currency')}</span>
                            </td>
                            <td className="px-5 py-4 text-end">
                              <button
                                onClick={() => {
                                  setProductForm({ id: p.id, name: p.name, description: p.description || '', price: p.price.toString(), category_id: p.category_id.toString() });
                                  setShowProductForm(true);
                                }}
                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition"
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition ms-1"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl ghost-border animate-fade-in-up">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-primary">{productForm.id ? t('admin.edit_product') : t('admin.create_product')}</h2>
                    </div>
                    <button onClick={() => setShowProductForm(false)} className="p-2 rounded-xl hover:bg-surface-container transition">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.product_name')}</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low focus:border-gold focus:ring-gold/30 shadow-sm text-sm py-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.category')}</label>
                        <select
                          required
                          value={productForm.category_id}
                          onChange={e => setProductForm({ ...productForm, category_id: e.target.value })}
                          className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low focus:border-gold focus:ring-gold/30 shadow-sm text-sm py-3"
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.price')}</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={productForm.price}
                          onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low focus:border-gold focus:ring-gold/30 shadow-sm text-sm py-3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.description')}</label>
                      <textarea
                        rows={3}
                        value={productForm.description}
                        onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low focus:border-gold focus:ring-gold/30 shadow-sm text-sm py-3"
                      />
                    </div>

                    {/* Image Uploads */}
                    <div className="pt-6 border-t border-outline-variant/15">
                      <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gold text-[18px]">photo_library</span>
                        {t('admin.main_image')} {productForm.id ? t('admin.main_image_keep') : t('admin.main_image_required')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <div className="relative border-2 border-dashed border-outline-variant/25 rounded-xl p-6 text-center hover:border-gold/40 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2 block">cloud_upload</span>
                            <span className="text-xs text-on-surface-variant">{lang === 'ar' ? 'اختر صورة' : 'Choose image'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              required={!productForm.id}
                              onChange={e => setMainImage(e.target.files ? e.target.files[0] : null)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          {mainImage && (
                            <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              {mainImage.name}
                            </p>
                          )}
                        </div>

                        {!productForm.id && additionalImages.map((_, idx) => (
                          <div key={idx}>
                            <p className="text-xs font-semibold text-on-surface-variant mb-2">
                              {t('admin.gallery_image')} {idx + 1} {t('admin.optional')}
                            </p>
                            <div className="relative border-2 border-dashed border-outline-variant/25 rounded-xl p-6 text-center hover:border-gold/40 transition-colors cursor-pointer">
                              <span className="material-symbols-outlined text-2xl text-on-surface-variant/30 mb-1 block">add_photo_alternate</span>
                              <span className="text-xs text-on-surface-variant">{lang === 'ar' ? 'اختياري' : 'Optional'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  const f = [...additionalImages];
                                  f[idx] = e.target.files ? e.target.files[0] : null;
                                  setAdditionalImages(f);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                            {additionalImages[idx] && (
                              <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                {additionalImages[idx]!.name}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-primary-dim transition-all duration-300 shadow-xl shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">{productForm.id ? 'save' : 'publish'}</span>
                            {loading ? t('admin.saving') : (productForm.id ? t('admin.update_product') : t('admin.publish'))}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== CATEGORIES VIEW ==================== */}
          {activeTab === 'categories' && (
            <div className="animate-fade-in-up">
              {!showCategoryForm ? (
                <div className="bg-surface-container-lowest rounded-2xl ghost-border overflow-hidden">
                  <div className="p-5 border-b border-outline-variant/15 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-on-surface">{t('admin.collections')}</h2>
                    <button
                      onClick={() => { setCategoryForm({ id: null, name: '' }); setShowCategoryForm(true); }}
                      className="px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-dim transition flex items-center gap-2 shadow-lg shadow-primary/10"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      {t('admin.new_collection')}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-sm">
                      <thead className="bg-surface-container/40 text-on-surface-variant">
                        <tr>
                          <th className="px-5 py-4 font-semibold text-start">{t('admin.collection_name')}</th>
                          <th className="px-5 py-4 font-semibold text-end">{t('admin.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {categories.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="py-16 text-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-4xl text-outline-variant/40 mb-2 block">category</span>
                              {t('admin.no_collections')}
                            </td>
                          </tr>
                        ) : categories.map(c => (
                          <tr key={c.id} className="hover:bg-surface-container/30 transition duration-150">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-4">
                                {c.image_url ? (
                                  <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    <img src={c.image_url} className="w-full h-full object-cover" alt="" />
                                  </div>
                                ) : (
                                  <div className="w-16 h-12 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant/30 text-[20px]">image</span>
                                  </div>
                                )}
                                <span className="font-bold text-base text-on-surface">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-end">
                              <button
                                onClick={() => { setCategoryForm({ id: c.id, name: c.name }); setShowCategoryForm(true); }}
                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition"
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c.id)}
                                className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition ms-1"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl ghost-border max-w-2xl animate-fade-in-up">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-primary">{categoryForm.id ? t('admin.edit_collection') : t('admin.create_collection')}</h2>
                    <button onClick={() => setShowCategoryForm(false)} className="p-2 rounded-xl hover:bg-surface-container transition">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <form onSubmit={handleCategorySubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.collection_name')}</label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name}
                        onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low focus:border-gold focus:ring-gold/30 shadow-sm text-sm py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-2">
                        {t('admin.cover_image')} {categoryForm.id ? t('admin.optional') : t('admin.main_image_required')}
                      </label>
                      <div className="relative border-2 border-dashed border-outline-variant/25 rounded-xl p-8 text-center hover:border-gold/40 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2 block">cloud_upload</span>
                        <span className="text-xs text-on-surface-variant">{lang === 'ar' ? 'اختر صورة' : 'Choose image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          required={!categoryForm.id}
                          onChange={e => setCategoryImage(e.target.files ? e.target.files[0] : null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      {categoryImage && (
                        <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {categoryImage.name}
                        </p>
                      )}
                    </div>
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-primary-dim transition-all duration-300 shadow-xl shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          {t('admin.save_collection')}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
