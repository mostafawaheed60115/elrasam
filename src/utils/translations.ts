export type Lang = 'en' | 'ar';

export const translations: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.categories': { en: 'Categories', ar: 'الأقسام' },
  'nav.search': { en: 'Search our collections...', ar: 'ابحث في مجموعاتنا...' },
  'nav.admin': { en: 'Admin', ar: 'لوحة التحكم' },

  // Home
  'home.badge': { en: 'The Collections', ar: 'المجموعات' },
  'home.title': { en: 'Explore Our Exclusive Collections', ar: 'استكشف مجموعاتنا الحصرية' },
  'home.subtitle': {
    en: 'Browse through our curated catalog of premium products, crafted for those who appreciate quality and elegance.',
    ar: 'تصفح كتالوج منتجاتنا المميزة، المصممة لمن يقدّرون الجودة والأناقة.'
  },
  'home.no_categories': {
    en: 'No categories available yet. Please add them from the Admin panel.',
    ar: 'لا توجد أقسام متاحة حالياً. يرجى إضافتها من لوحة التحكم.'
  },

  // Category Products
  'cat.badge': { en: 'Curated Selection', ar: 'مجموعة مختارة' },
  'cat.back': { en: 'Home', ar: 'الرئيسية' },
  'cat.subtitle': {
    en: 'Discover products that redefine elegance. Crafted with precision, designed for distinction.',
    ar: 'اكتشف منتجات تعيد تعريف الأناقة. مصنوعة بدقة، مصممة للتميّز.'
  },
  'cat.no_products': { en: 'No products in this category.', ar: 'لا توجد منتجات في هذا القسم.' },
  'cat.featured': { en: 'Featured', ar: 'مميز' },

  // Product Details
  'product.back': { en: 'Back to Collection', ar: 'العودة للمجموعة' },
  'product.contact': { en: 'Order via WhatsApp', ar: 'اطلب عبر واتساب' },
  'product.description_fallback': {
    en: 'Premium quality product. Meticulously crafted for the highest standard of living.',
    ar: 'منتج عالي الجودة. تم تصميمه بعناية لأعلى معايير المعيشة.'
  },
  'product.image_unavailable': { en: 'Image Unavailable', ar: 'الصورة غير متاحة' },
  'product.currency': { en: 'EGP', ar: 'ج.م' },
  'product.loading': { en: 'Loading...', ar: 'جاري التحميل...' },

  // Footer
  'footer.developed_by': { en: 'Developed by', ar: 'تم التطوير بواسطة' },
  'footer.rights': { en: 'All rights reserved', ar: 'جميع الحقوق محفوظة' },
  'footer.privacy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  'footer.terms': { en: 'Terms of Service', ar: 'شروط الخدمة' },
  'footer.contact': { en: 'Contact Us', ar: 'اتصل بنا' },

  // Admin Login
  'admin.login_title': { en: 'Admin Access', ar: 'دخول المسؤول' },
  'admin.username': { en: 'Username', ar: 'اسم المستخدم' },
  'admin.password': { en: 'Password', ar: 'كلمة المرور' },
  'admin.login_btn': { en: 'Login', ar: 'تسجيل الدخول' },
  'admin.login_error': { en: 'Invalid admin credentials.', ar: 'بيانات الدخول غير صحيحة.' },

  // Admin Dashboard
  'admin.title': { en: 'Content Studio', ar: 'استوديو المحتوى' },
  'admin.subtitle': { en: 'Manage your luxury catalog seamlessly.', ar: 'إدارة الكتالوج الفاخر بسلاسة.' },
  'admin.logout': { en: 'Logout', ar: 'تسجيل الخروج' },
  'admin.products': { en: 'Products', ar: 'المنتجات' },
  'admin.categories_tab': { en: 'Categories', ar: 'الأقسام' },
  'admin.all_products': { en: 'All Products', ar: 'جميع المنتجات' },
  'admin.new_product': { en: 'New Product', ar: 'منتج جديد' },
  'admin.product_name': { en: 'Product Name', ar: 'اسم المنتج' },
  'admin.category': { en: 'Category', ar: 'القسم' },
  'admin.price': { en: 'Price (EGP)', ar: 'السعر (ج.م)' },
  'admin.actions': { en: 'Actions', ar: 'إجراءات' },
  'admin.no_products': { en: 'No products found.', ar: 'لا توجد منتجات.' },
  'admin.edit_product': { en: 'Edit Product', ar: 'تعديل المنتج' },
  'admin.create_product': { en: 'Create New Product', ar: 'إضافة منتج جديد' },
  'admin.description': { en: 'Description', ar: 'الوصف' },
  'admin.main_image': { en: 'Main Image', ar: 'الصورة الرئيسية' },
  'admin.main_image_keep': { en: '(Leave blank to keep)', ar: '(اتركه فارغاً للإبقاء)' },
  'admin.main_image_required': { en: '(Required)', ar: '(مطلوب)' },
  'admin.gallery_image': { en: 'Gallery Image', ar: 'صورة المعرض' },
  'admin.optional': { en: '(Optional)', ar: '(اختياري)' },
  'admin.saving': { en: 'Saving to Catalog...', ar: 'جاري الحفظ...' },
  'admin.update_product': { en: 'Update Product', ar: 'تحديث المنتج' },
  'admin.publish': { en: 'Publish to Catalog', ar: 'نشر في الكتالوج' },
  'admin.collections': { en: 'Collections', ar: 'المجموعات' },
  'admin.new_collection': { en: 'New Collection', ar: 'مجموعة جديدة' },
  'admin.collection_name': { en: 'Collection Name', ar: 'اسم المجموعة' },
  'admin.edit_collection': { en: 'Edit Collection', ar: 'تعديل المجموعة' },
  'admin.create_collection': { en: 'Create Collection', ar: 'إنشاء مجموعة' },
  'admin.cover_image': { en: 'Cover Image', ar: 'صورة الغلاف' },
  'admin.save_collection': { en: 'Save Collection', ar: 'حفظ المجموعة' },
  'admin.processing': { en: 'Processing...', ar: 'جاري المعالجة...' },
  'admin.no_collections': { en: 'No collections found.', ar: 'لا توجد مجموعات.' },
  'admin.total_products': { en: 'Total Products', ar: 'إجمالي المنتجات' },
  'admin.total_categories': { en: 'Total Categories', ar: 'إجمالي الأقسام' },
  'admin.delete_confirm_cat': { en: 'Delete this category? Products might be affected.', ar: 'حذف هذا القسم؟ قد تتأثر المنتجات.' },
  'admin.delete_confirm_prod': { en: 'Are you sure you want to delete this product?', ar: 'هل أنت متأكد من حذف هذا المنتج؟' },
  'admin.cat_added': { en: 'Category added successfully!', ar: 'تمت إضافة القسم بنجاح!' },
  'admin.cat_updated': { en: 'Category updated successfully!', ar: 'تم تحديث القسم بنجاح!' },
  'admin.cat_deleted': { en: 'Category deleted', ar: 'تم حذف القسم' },
  'admin.prod_added': { en: 'Product added successfully!', ar: 'تمت إضافة المنتج بنجاح!' },
  'admin.prod_updated': { en: 'Product updated successfully!', ar: 'تم تحديث المنتج بنجاح!' },
  'admin.prod_deleted': { en: 'Product deleted', ar: 'تم حذف المنتج' },
  'admin.image_required': { en: 'Image is required for new categories.', ar: 'الصورة مطلوبة للأقسام الجديدة.' },
  'admin.main_img_required': { en: 'Main Image is required.', ar: 'الصورة الرئيسية مطلوبة.' },
};
