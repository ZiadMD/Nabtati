import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
const resources = {
  en: {
    translation: {
      // App name and general
      appName: 'Hadeeqati',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      
      // Auth screens
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      displayName: 'Display Name',
      forgotPassword: 'Forgot Password?',
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',
      signUp: 'Sign Up',
      signIn: 'Sign In',
      logout: 'Logout',
      
      // Tab navigation
      home: 'Home',
      myGarden: 'My Garden',
      shop: 'Shop',
      profile: 'Profile',
      
      // Home screen
      scanPlant: 'Scan Plant',
      featuredTips: 'Featured Tips',
      recentActivity: 'Recent Activity',
      welcomeMessage: 'Welcome to Hadeeqati!',
      
      // Garden screen
      addPlant: 'Add Plant',
      noPlants: 'No plants added yet. Tap the + button to add your first plant!',
      waterToday: 'Plants to water today',
      allPlants: 'All Plants',
      daysUntilWatering: 'Days until next watering',
      wateringDue: 'Watering due!',
      
      // Plant detail screen
      plantDetails: 'Plant Details',
      nickname: 'Nickname',
      species: 'Species',
      location: 'Location',
      lastWatered: 'Last Watered',
      wateringSchedule: 'Watering Schedule',
      waterNow: 'Water Now',
      diagnose: 'Diagnose Issues',
      wateringHistory: 'Watering History',
      customWateringInterval: 'Custom Watering Interval',
      days: 'days',
      
      // Diagnose screen
      takePicture: 'Take Picture',
      selectFromGallery: 'Select from Gallery',
      analyzing: 'Analyzing your plant...',
      diagnosisResults: 'Diagnosis Results',
      identifiedPlant: 'Identified Plant',
      issue: 'Issue',
      remedies: 'Remedies',
      confidence: 'Confidence',
      tryAgain: 'Try Again',
      
      // Marketplace screen
      searchProducts: 'Search Products',
      categories: 'Categories',
      seeds: 'Seeds',
      plants: 'Plants',
      tools: 'Tools',
      fertilizers: 'Fertilizers',
      pots: 'Pots',
      addToCart: 'Add to Cart',
      price: 'Price',
      
      // Cart screen
      cart: 'Cart',
      emptyCart: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      checkout: 'Checkout',
      total: 'Total',
      quantity: 'Quantity',
      
      // Checkout screen
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      orderSummary: 'Order Summary',
      placeOrder: 'Place Order',
      orderConfirmation: 'Order Confirmation',
      orderPlaced: 'Your order has been placed!',
      orderNumber: 'Order Number',
      
      // Profile screen
      accountSettings: 'Account Settings',
      language: 'Language',
      notifications: 'Notifications',
      about: 'About',
      help: 'Help',
      termsAndConditions: 'Terms and Conditions',
      privacyPolicy: 'Privacy Policy',
      deleteAccount: 'Delete Account',
      
      // Error messages
      error: 'Error',
      networkError: 'Network error. Please check your connection.',
      authError: 'Authentication error. Please login again.',
      requiredField: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      passwordLength: 'Password must be at least 8 characters',
      passwordMatch: 'Passwords do not match',
    },
  },
  ar: {
    translation: {
      // App name and general
      appName: 'حديقتي',
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      confirm: 'تأكيد',
      
      // Auth screens
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      displayName: 'الاسم الظاهر',
      forgotPassword: 'نسيت كلمة المرور؟',
      noAccount: 'ليس لديك حساب؟',
      haveAccount: 'لديك حساب بالفعل؟',
      signUp: 'إنشاء حساب',
      signIn: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      
      // Tab navigation
      home: 'الرئيسية',
      myGarden: 'حديقتي',
      shop: 'المتجر',
      profile: 'الملف الشخصي',
      
      // Home screen
      scanPlant: 'فحص النبات',
      featuredTips: 'نصائح مميزة',
      recentActivity: 'النشاط الأخير',
      welcomeMessage: 'مرحبًا بك في حديقتي!',
      
      // Garden screen
      addPlant: 'إضافة نبات',
      noPlants: 'لم تضف أي نباتات بعد. انقر على زر + لإضافة أول نبات!',
      waterToday: 'نباتات تحتاج للري اليوم',
      allPlants: 'جميع النباتات',
      daysUntilWatering: 'أيام حتى الري القادم',
      wateringDue: 'موعد الري!',
      
      // Plant detail screen
      plantDetails: 'تفاصيل النبات',
      nickname: 'الاسم المستعار',
      species: 'النوع',
      location: 'الموقع',
      lastWatered: 'آخر ري',
      wateringSchedule: 'جدول الري',
      waterNow: 'ري الآن',
      diagnose: 'تشخيص المشاكل',
      wateringHistory: 'سجل الري',
      customWateringInterval: 'فترة ري مخصصة',
      days: 'أيام',
      
      // Diagnose screen
      takePicture: 'التقاط صورة',
      selectFromGallery: 'اختيار من المعرض',
      analyzing: 'جاري تحليل النبات الخاص بك...',
      diagnosisResults: 'نتائج التشخيص',
      identifiedPlant: 'النبات المحدد',
      issue: 'المشكلة',
      remedies: 'العلاجات',
      confidence: 'نسبة الثقة',
      tryAgain: 'المحاولة مرة أخرى',
      
      // Marketplace screen
      searchProducts: 'البحث عن منتجات',
      categories: 'الفئات',
      seeds: 'البذور',
      plants: 'النباتات',
      tools: 'الأدوات',
      fertilizers: 'الأسمدة',
      pots: 'الأواني',
      addToCart: 'إضافة إلى السلة',
      price: 'السعر',
      
      // Cart screen
      cart: 'سلة التسوق',
      emptyCart: 'سلة التسوق فارغة',
      continueShopping: 'مواصلة التسوق',
      checkout: 'إتمام الشراء',
      total: 'المجموع',
      quantity: 'الكمية',
      
      // Checkout screen
      shippingAddress: 'عنوان الشحن',
      paymentMethod: 'طريقة الدفع',
      orderSummary: 'ملخص الطلب',
      placeOrder: 'تقديم الطلب',
      orderConfirmation: 'تأكيد الطلب',
      orderPlaced: 'تم تقديم طلبك!',
      orderNumber: 'رقم الطلب',
      
      // Profile screen
      accountSettings: 'إعدادات الحساب',
      language: 'اللغة',
      notifications: 'الإشعارات',
      about: 'حول',
      help: 'المساعدة',
      termsAndConditions: 'الشروط والأحكام',
      privacyPolicy: 'سياسة الخصوصية',
      deleteAccount: 'حذف الحساب',
      
      // Error messages
      error: 'خطأ',
      networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
      authError: 'خطأ في المصادقة. يرجى تسجيل الدخول مرة أخرى.',
      requiredField: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صالح',
      passwordLength: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      passwordMatch: 'كلمات المرور غير متطابقة',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;