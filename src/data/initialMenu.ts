import {
  Category,
  CustomisationGroup,
  Product,
  Promotion,
  RestaurantSettings,
  RestaurantTable,
} from '../types';

export const IMG_HERO = '/src/assets/images/zestro_hero_feast_1794594788896.jpg';
export const IMG_BURGER = '/src/assets/images/zestro_burger_signature_1794594788162.jpg';
export const IMG_PIZZA = '/src/assets/images/zestro_pizza_artisan_1794594789442.jpg';
export const IMG_CHICKEN_MEALS = '/src/assets/images/zestro_fried_chicken_meals_1794594790682.jpg';
export const IMG_BOWL_PASTA = '/src/assets/images/zestro_rice_bowl_pasta_1794594789487.jpg';
export const IMG_BEVERAGES = '/src/assets/images/zestro_coffee_beverages_1794594791369.jpg';
export const OFFICIAL_LOGO_PATH = '/assets/aistudio/FB_IMG_1794593749464_090db6e9.jpg';

export const MEAL_SIDES_OPTIONS = [
  {
    id: 'side_fries',
    name: {
      en: 'Hot Fries / French Fries',
      bn: 'হট ফ্রাইস / ফ্রেঞ্চ ফ্রাইস',
      ar: 'بطاطس مقلية / بطاطس حارة',
    },
  },
  {
    id: 'side_veggies',
    name: {
      en: 'Sautéed Vegetables',
      bn: 'সতে ভেজিটেবলস',
      ar: 'خضروات سوتيه',
    },
  },
  {
    id: 'side_mash',
    name: {
      en: 'Mashed Potato',
      bn: 'ম্যাশড পটেটো',
      ar: 'بطاطس مهروسة',
    },
  },
  {
    id: 'side_thai_rice',
    name: {
      en: 'Thai Fried Rice',
      bn: 'থাই ফ্রাইড রাইস',
      ar: 'أرز مقلي تايلاندي',
    },
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'fries', type: 'food', displayOrder: 1, active: true, image: IMG_BURGER, name: { en: 'Fries', bn: 'ফ্রাইস', ar: 'بطاطس مقلية' } },
  { id: 'wedges', type: 'food', displayOrder: 2, active: true, image: IMG_BURGER, name: { en: 'Wedges', bn: 'ওয়েজেস', ar: 'بطاطس ودجز' } },
  { id: 'sandwiches', type: 'food', displayOrder: 3, active: true, image: IMG_BURGER, name: { en: 'Sandwiches', bn: 'স্যান্ডউইচ', ar: 'ساندويتشات' } },
  { id: 'pasta', type: 'food', displayOrder: 4, active: true, image: IMG_BOWL_PASTA, name: { en: 'Pasta', bn: 'পাস্তা', ar: 'باستا' } },
  { id: 'chowmein', type: 'food', displayOrder: 5, active: true, image: IMG_BOWL_PASTA, name: { en: 'Chowmein', bn: 'চাউমিন', ar: 'تشاو مين' } },
  { id: 'wings', type: 'food', displayOrder: 6, active: true, image: IMG_CHICKEN_MEALS, name: { en: 'Wings', bn: 'উইংস', ar: 'أجنحة دجاج' } },
  { id: 'fried-chicken', type: 'food', displayOrder: 7, active: true, image: IMG_CHICKEN_MEALS, name: { en: 'Fried Chicken', bn: 'ফ্রাইড চিকেন', ar: 'دجاج مقلي' } },
  { id: 'shawarma-wrap', type: 'food', displayOrder: 8, active: true, image: IMG_BURGER, name: { en: 'Shawarma / Wrap', bn: 'শাওয়ারমা / র‍্যাপ', ar: 'شاورما / راب' } },
  { id: 'burger', type: 'food', displayOrder: 9, active: true, image: IMG_BURGER, name: { en: 'Burger', bn: 'বার্গার', ar: 'برجر' } },
  { id: 'pizza', type: 'food', displayOrder: 10, active: true, image: IMG_PIZZA, name: { en: 'Pizza', bn: 'পিজ্জা', ar: 'بيتزا' } },
  { id: 'rice-bowl', type: 'food', displayOrder: 11, active: true, image: IMG_BOWL_PASTA, name: { en: 'Rice Bowl', bn: 'রাইস বোল', ar: 'أطباق الأرز' } },
  { id: 'meals', type: 'food', displayOrder: 12, active: true, image: IMG_CHICKEN_MEALS, name: { en: 'Meals', bn: 'মিলস', ar: 'وجبات رئيسية' } },
  { id: 'add-ons', type: 'food', displayOrder: 13, active: true, image: IMG_BURGER, name: { en: 'Add-ons', bn: 'অ্যাড-অনস', ar: 'إضافات' } },
  { id: 'sides', type: 'food', displayOrder: 14, active: true, image: IMG_CHICKEN_MEALS, name: { en: 'Sides', bn: 'সাইডস', ar: 'أطباق جانبية' } },

  { id: 'frappe', type: 'beverage', displayOrder: 15, active: true, image: IMG_BEVERAGES, name: { en: 'Frappe', bn: 'ফ্রাপে', ar: 'فرابيه' } },
  { id: 'bubble-drinks', type: 'beverage', displayOrder: 16, active: true, image: IMG_BEVERAGES, name: { en: 'Bubble Drinks', bn: 'বাবল ড্রিংকস', ar: 'مشروبات البابلز' } },
  { id: 'mocktails-mojito', type: 'beverage', displayOrder: 17, active: true, image: IMG_BEVERAGES, name: { en: 'Mocktails / Mojito', bn: 'মকটেইল / মোহিতো', ar: 'موكتيل / موهيتو' } },
  { id: 'smoothie', type: 'beverage', displayOrder: 18, active: true, image: IMG_BEVERAGES, name: { en: 'Smoothie', bn: 'স্মুদি', ar: 'سموذي' } },
  { id: 'iced-coffee', type: 'beverage', displayOrder: 19, active: true, image: IMG_BEVERAGES, name: { en: 'Iced Coffee', bn: 'আইসড কফি', ar: 'قهوة مثلجة' } },
  { id: 'hot-coffee', type: 'beverage', displayOrder: 20, active: true, image: IMG_BEVERAGES, name: { en: 'Hot Coffee', bn: 'হট কফি', ar: 'قهوة ساخنة' } },
  { id: 'cold-coffee', type: 'beverage', displayOrder: 21, active: true, image: IMG_BEVERAGES, name: { en: 'Cold Coffee', bn: 'কোল্ড কফি', ar: 'قهوة باردة' } },
  { id: 'shakes', type: 'beverage', displayOrder: 22, active: true, image: IMG_BEVERAGES, name: { en: 'Shakes', bn: 'শেকস', ar: 'ميلك شيك' } },
  { id: 'tea', type: 'beverage', displayOrder: 23, active: true, image: IMG_BEVERAGES, name: { en: 'Tea', bn: 'চা', ar: 'شاي' } },
  { id: 'add-syrup', type: 'beverage', displayOrder: 24, active: true, image: IMG_BEVERAGES, name: { en: 'Add Syrup', bn: 'অ্যাড সিরাপ', ar: 'إضافة نكهة' } },
];

export const INITIAL_CUSTOMISATION_GROUPS: CustomisationGroup[] = [
  {
    id: 'burger-addons',
    name: { en: 'Add-ons & Extras', bn: 'অ্যাড-অনস ও এক্সট্রা', ar: 'إضافات اختيارية' },
    selectionType: 'multiple',
    required: false,
    minSelect: 0,
    maxSelect: 5,
    options: [
      { id: 'addon-ketchup', name: { en: 'Tomato Ketchup', bn: 'টমেটো কেচাপ', ar: 'كاتشب طماطم' }, price: 20 },
      { id: 'addon-zestro-sauce', name: { en: 'Zestro Sauce', bn: 'জেস্ট্রো সস', ar: 'صلصة زيسترو' }, price: 30 },
      { id: 'addon-sliced-cheese', name: { en: 'Sliced Cheese', bn: 'স্লাইসড চিজ', ar: 'جبنة شرائح' }, price: 40 },
      { id: 'addon-chicken-patty', name: { en: 'Chicken Patty', bn: 'চিকেন প্যাটি', ar: 'شريحة دجاج إضافية' }, price: 130 },
      { id: 'addon-beef-patty', name: { en: 'Beef Patty', bn: 'বিফ প্যাটি', ar: 'شريحة لحم إضافية' }, price: 180 },
    ],
  },
  {
    id: 'dipping-sauces',
    name: { en: 'Dipping Sauces', bn: 'ডিপিং সস', ar: 'صلصات التغميس' },
    selectionType: 'multiple',
    required: false,
    minSelect: 0,
    maxSelect: 3,
    options: [
      { id: 'addon-ketchup', name: { en: 'Tomato Ketchup', bn: 'টমেটো কেচাপ', ar: 'كاتشب طماطم' }, price: 20 },
      { id: 'addon-zestro-sauce', name: { en: 'Zestro Sauce', bn: 'জেস্ট্রো সস', ar: 'صلصة زيسترو' }, price: 30 },
    ],
  },
  {
    id: 'spice-level',
    name: { en: 'Spice Preference', bn: 'ঝালের মাত্রা', ar: 'درجة التوابل' },
    selectionType: 'single',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    options: [
      { id: 'spice-mild', name: { en: 'Mild', bn: 'হালকা ঝাল', ar: 'خفيف' }, price: 0 },
      { id: 'spice-regular', name: { en: 'Regular', bn: 'স্বাভাবিক', ar: 'عادي' }, price: 0 },
      { id: 'spice-spicy', name: { en: 'Extra Spicy', bn: 'বেশি ঝাল', ar: 'حار جداً' }, price: 0 },
    ],
  },
  {
    id: 'coffee-syrup',
    name: { en: 'Add Syrup', bn: 'সিরাপ যোগ করুন', ar: 'إضافة شراب نكهة' },
    selectionType: 'multiple',
    required: false,
    minSelect: 0,
    maxSelect: 2,
    options: [
      { id: 'syrup-vanilla', name: { en: 'Vanilla Syrup', bn: 'ভ্যানিলা সিরাপ', ar: 'شراب فانيلا' }, price: 99 },
      { id: 'syrup-caramel', name: { en: 'Caramel Syrup', bn: 'ক্যারামেল সিরাপ', ar: 'شراب كراميل' }, price: 99 },
      { id: 'syrup-hazelnut', name: { en: 'Hazelnut Syrup', bn: 'হ্যাজেলনাট সিরাপ', ar: 'شراب بندق' }, price: 99 },
      { id: 'syrup-coconut', name: { en: 'Coconut Syrup', bn: 'কোকোনাট সিরাপ', ar: 'شراب جوز الهند' }, price: 99 },
    ],
  },
  {
    id: 'sugar-level',
    name: { en: 'Sugar Level', bn: 'চিনির পরিমাণ', ar: 'مستوى السكر' },
    selectionType: 'single',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    options: [
      { id: 'sugar-regular', name: { en: 'Regular Sugar', bn: 'স্বাভাবিক চিনি', ar: 'سكر عادي' }, price: 0 },
      { id: 'sugar-less', name: { en: 'Less Sugar', bn: 'কম চিনি', ar: 'سكر قليل' }, price: 0 },
      { id: 'sugar-none', name: { en: 'No Sugar', bn: 'চিনি ছাড়া', ar: 'بدون سكر' }, price: 0 },
    ],
  },
  {
    id: 'ice-level',
    name: { en: 'Ice Preference', bn: 'বরফের পরিমাণ', ar: 'كمية الثلج' },
    selectionType: 'single',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    options: [
      { id: 'ice-regular', name: { en: 'Regular Ice', bn: 'স্বাভাবিক বরফ', ar: 'ثلج عادي' }, price: 0 },
      { id: 'ice-less', name: { en: 'Less Ice', bn: 'কম বরফ', ar: 'ثلج قليل' }, price: 0 },
      { id: 'ice-none', name: { en: 'No Ice', bn: 'বরফ ছাড়া', ar: 'بدون ثلج' }, price: 0 },
    ],
  },
];

function makeItem(
  id: string,
  categoryId: string,
  en: string,
  bn: string,
  ar: string,
  price: number,
  image: string,
  displayOrder: number,
  opts?: {
    descEn?: string;
    descBn?: string;
    descAr?: string;
    variants?: Product['variants'];
    customisationGroupIds?: string[];
    mealSideRule?: boolean;
    popular?: boolean;
    featured?: boolean;
    reviewFlag?: string;
  }
): Product {
  return {
    id,
    categoryId,
    name: { en, bn, ar },
    description: {
      en: opts?.descEn || `${en} freshly prepared at Zestro Kitchen.`,
      bn: opts?.descBn || `জেস্ট্রো কিচেনে তাজা তৈরি ${bn}।`,
      ar: opts?.descAr || `${ar} محضر طازجاً في مطبخ زيسترو.`,
    },
    price,
    variants: opts?.variants,
    customisationGroupIds: opts?.customisationGroupIds,
    mealSideRule: opts?.mealSideRule || false,
    image,
    available: true,
    soldOut: false,
    popular: opts?.popular || false,
    featured: opts?.featured || false,
    displayOrder,
    reviewFlag: opts?.reviewFlag,
  };
}

const twoCoffeeVariants = (p1: number, p2: number): Product['variants'] => [
  { id: 'variant-1', label: { en: 'Variant 1', bn: 'ভ্যারিয়েন্ট ১', ar: 'الخيار ١' }, price: p1 },
  { id: 'variant-2', label: { en: 'Variant 2', bn: 'ভ্যারিয়েন্ট ২', ar: 'الخيار ٢' }, price: p2 },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. FRIES
  makeItem('fries-classic', 'fries', 'Classic French Fries', 'ক্লাসিক ফ্রেঞ্চ ফ্রাইস', 'بطاطس مقلية كلاسيك', 190, IMG_BURGER, 1, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    descEn: 'Golden crisp potato fries lightly seasoned with sea salt.',
  }),
  makeItem('fries-hot', 'fries', 'Hot Fries', 'হট ফ্রাইস', 'بطاطس حارة', 210, IMG_BURGER, 2, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    descEn: 'Crispy fries tossed in Zestro signature fiery spice dust.',
  }),
  makeItem('fries-loaded', 'fries', 'Grilled Loaded Fries', 'গ্রিলড লোডেড ফ্রাইস', 'بطاطس محملة بالدجاج المشوي', 400, IMG_BURGER, 3, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    popular: true,
    descEn: 'Loaded with char-grilled chicken, melted cheese, and signature sauces.',
  }),

  // 2. WEDGES
  makeItem('wedges-classic', 'wedges', 'Classic Potato Wedges', 'ক্লাসিক পটেটো ওয়েজেস', 'بطاطس ودجز كلاسيك', 180, IMG_BURGER, 4, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('wedges-bbq', 'wedges', 'BBQ Wedges', 'বিবিকিউ ওয়েজেস', 'بطاطس ودجز باربكيو', 220, IMG_BURGER, 5, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),

  // 3. SANDWICHES
  makeItem('sandwich-grilled-chicken', 'sandwiches', 'Classic Grilled Chicken Sandwich', 'ক্লাসিক গ্রিলড চিকেন স্যান্ডউইচ', 'ساندويتش دجاج مشوي كلاسيك', 260, IMG_BURGER, 6, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('sandwich-cheese-blast', 'sandwiches', 'Creamy Cheese Blast Sub', 'ক্রিমি চিজ ব্লাস্ট সাব', 'ساب الجبنة الكريمية', 300, IMG_BURGER, 7, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    popular: true,
  }),
  makeItem('sandwich-italian-sub', 'sandwiches', 'Italian Sub Sandwich', 'ইতালিয়ান সাব স্যান্ডউইচ', 'ساندويتش ساب إيطالي', 380, IMG_BURGER, 8, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),

  // 4. PASTA
  makeItem('pasta-regular-chicken', 'pasta', 'Regular Chicken Pasta', 'রেগুলার চিকেন পাস্তা', 'باستا الدجاج العادية', 290, IMG_BOWL_PASTA, 9, {
    customisationGroupIds: ['spice-level'],
  }),
  makeItem('pasta-alfredo', 'pasta', 'Alfredo Cream Pasta', 'আলফ্রেডো ক্রিম পাস্তা', 'باستا ألفريدو بالكريمة', 350, IMG_BOWL_PASTA, 10, {
    customisationGroupIds: ['spice-level'],
    popular: true,
  }),
  makeItem('pasta-oven-baked', 'pasta', 'Oven Baked Supreme Pasta', 'ওভেন বেকড সুপ্রিম পাস্তা', 'باستا سوبريم مخبوزة بالفرن', 390, IMG_BOWL_PASTA, 11, {
    customisationGroupIds: ['spice-level'],
    featured: true,
  }),

  // 5. CHOWMEIN
  makeItem('chowmein-chicken', 'chowmein', 'Chicken Chowmein (1:2)', 'চিকেন চাউমিন (১:২)', 'تشاو مين الدجاج (١:٢)', 320, IMG_BOWL_PASTA, 12, {
    customisationGroupIds: ['spice-level'],
  }),
  makeItem('chowmein-zestro-special', 'chowmein', 'Zestro Special Chowmein (1:2)', 'জেস্ট্রো স্পেশাল চাউমিন (১:২)', 'تشاو مين زيسترو الخاص (١:٢)', 390, IMG_BOWL_PASTA, 13, {
    customisationGroupIds: ['spice-level'],
  }),

  // 6. WINGS
  makeItem('wings-bbq', 'wings', 'Smoky BBQ Wings (6 pcs)', 'স্মোকি বিবিকিউ উইংস (৬ পিস)', 'أجنحة باربكيو مدخنة (٦ قطع)', 360, IMG_CHICKEN_MEALS, 14, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('wings-crispy', 'wings', 'Crispy Chicken Wings (6 pcs)', 'ক্রিস্পি চিকেন উইংস (৬ পিস)', 'أجنحة دجاج مقرمشة (٦ قطع)', 360, IMG_CHICKEN_MEALS, 15, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('wings-hot', 'wings', 'Hot Wings (6 pcs)', 'হট উইংস (৬ পিস)', 'أجنحة حارة (٦ قطع)', 360, IMG_CHICKEN_MEALS, 16, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),

  // 7. FRIED CHICKEN
  makeItem('chicken-crispy', 'fried-chicken', 'Crispy Fried Chicken', 'ক্রিস্পি ফ্রাইড চিকেন', 'دجاج مقلي مقرمش', 280, IMG_CHICKEN_MEALS, 17, {
    variants: [
      { id: '2pcs', label: { en: '2 pcs', bn: '২ পিস', ar: 'قطعتان' }, price: 280 },
      { id: '4pcs', label: { en: '4 pcs', bn: '৪ পিস', ar: '٤ قطع' }, price: 440 },
      { id: '6pcs', label: { en: '6 pcs', bn: '৬ পিস', ar: '٦ قطع' }, price: 620 },
      { id: '8pcs', label: { en: '8 pcs', bn: '৮ পিস', ar: '٨ قطع' }, price: 800 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    popular: true,
  }),
  makeItem('chicken-thai', 'fried-chicken', 'Thai Fried Chicken', 'থাই ফ্রাইড চিকেন', 'دجاج مقلي تايلاندي', 280, IMG_CHICKEN_MEALS, 18, {
    variants: [
      { id: '2pcs', label: { en: '2 pcs', bn: '২ পিস', ar: 'قطعتان' }, price: 280 },
      { id: '4pcs', label: { en: '4 pcs', bn: '৪ পিস', ar: '٤ قطع' }, price: 440 },
      { id: '6pcs', label: { en: '6 pcs', bn: '৬ পিস', ar: '٦ قطع' }, price: 620 },
      { id: '8pcs', label: { en: '8 pcs', bn: '৮ পিস', ar: '٨ قطع' }, price: 800 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('chicken-boneless-strips', 'fried-chicken', 'Boneless Chicken Strips', 'বোনলেস চিকেন স্ট্রিপস', 'شرائح دجاج مقرمشة بدون عظم', 350, IMG_CHICKEN_MEALS, 19, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('chicken-cheese-balls', 'fried-chicken', 'Chicken Cheese Balls', 'চিকেন চিজ বলস', 'كرات الدجاج بالجبنة', 400, IMG_CHICKEN_MEALS, 20, {
    customisationGroupIds: ['dipping-sauces'],
  }),

  // 8. SHAWARMA / WRAP
  makeItem('wrap-grilled-chicken', 'shawarma-wrap', 'Grilled Chicken Wrap', 'গ্রিলড চিকেন র‍্যাপ', 'راب دجاج مشوي', 280, IMG_BURGER, 21, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('wrap-spicy-chicken', 'shawarma-wrap', 'Spicy Chicken Wrap', 'স্পাইসি চিকেন র‍্যাপ', 'راب دجاج حار', 300, IMG_BURGER, 22, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('wrap-zestro-signature', 'shawarma-wrap', 'Zestro Signature Wrap', 'জেস্ট্রো সিগনেচার র‍্যাপ', 'راب زيسترو المميز', 340, IMG_BURGER, 23, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    featured: true,
  }),

  // 9. BURGER
  makeItem('burger-regular-chicken', 'burger', 'Regular Chicken Burger', 'রেগুলার চিকেন বার্গার', 'برجر دجاج عادي', 270, IMG_BURGER, 24, {
    customisationGroupIds: ['burger-addons', 'spice-level'],
  }),
  makeItem('burger-chicken-cheese', 'burger', 'Chicken Cheese Burger', 'চিকেন চিজ বার্গার', 'برجر دجاج بالجبنة', 300, IMG_BURGER, 25, {
    customisationGroupIds: ['burger-addons', 'spice-level'],
  }),
  makeItem('burger-crispy-chicken', 'burger', 'Crispy Chicken Burger', 'ক্রিস্পি চিকেন বার্গার', 'برجر دجاج مقرمش', 340, IMG_BURGER, 26, {
    customisationGroupIds: ['burger-addons', 'spice-level'],
    popular: true,
  }),
  makeItem('burger-smoky-bbq', 'burger', 'Smoky BBQ Chicken Burger', 'স্মোকি বিবিকিউ চিকেন বার্গার', 'برجر دجاج باربكيو مدخن', 340, IMG_BURGER, 27, {
    customisationGroupIds: ['burger-addons', 'spice-level'],
  }),
  makeItem('burger-beef-cheese', 'burger', 'Beef Cheese Burger', 'বিফ চিজ বার্গার', 'برجر لحم بالجبنة', 380, IMG_BURGER, 28, {
    customisationGroupIds: ['burger-addons', 'spice-level'],
  }),
  makeItem('burger-zestro-special', 'burger', 'Zestro Special Burger', 'জেস্ট্রো স্পেশাল বার্গার', 'برجر زيسترو الخاص', 420, IMG_BURGER, 29, {
    customisationGroupIds: ['burger-addons', 'spice-level'],
    popular: true,
    featured: true,
  }),

  // 10. ADD-ONS (Standalone category for reference & direct ordering)
  makeItem('addon-ketchup-item', 'add-ons', 'Tomato Ketchup', 'টমেটো কেচাপ', 'كاتشب طماطم', 20, IMG_BURGER, 30),
  makeItem('addon-zestro-sauce-item', 'add-ons', 'Zestro Sauce', 'জেস্ট্রো সস', 'صلصة زيسترو', 30, IMG_BURGER, 31),
  makeItem('addon-sliced-cheese-item', 'add-ons', 'Sliced Cheese', 'স্লাইসড চিজ', 'جبنة شرائح', 40, IMG_BURGER, 32),
  makeItem('addon-chicken-patty-item', 'add-ons', 'Chicken Patty', 'চিকেন প্যাটি', 'شريحة دجاج', 130, IMG_BURGER, 33),
  makeItem('addon-beef-patty-item', 'add-ons', 'Beef Patty', 'বিফ প্যাটি', 'شريحة لحم', 180, IMG_BURGER, 34),

  // 11. PIZZA
  makeItem('pizza-margherita', 'pizza', 'Classic Margherita Pizza', 'ক্লাসিক মার্গারিটা পিজ্জা', 'بيتزا مارغريتا كلاسيك', 420, IMG_PIZZA, 35, {
    variants: [
      { id: '8in', label: { en: '8-inch', bn: '৮ ইঞ্চি', ar: '٨ إنش' }, price: 420 },
      { id: '10in', label: { en: '10-inch', bn: '১০ ইঞ্চি', ar: '١٠ إنش' }, price: 720 },
      { id: '12in', label: { en: '12-inch', bn: '১২ ইঞ্চি', ar: '١٢ إنش' }, price: 820 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('pizza-mexican-spicy', 'pizza', 'Mexican Spicy Chicken Pizza', 'মেক্সিকান স্পাইসি চিকেন পিজ্জা', 'بيتزا دجاج مكسيكي حار', 450, IMG_PIZZA, 36, {
    variants: [
      { id: '8in', label: { en: '8-inch', bn: '৮ ইঞ্চি', ar: '٨ إنش' }, price: 450 },
      { id: '10in', label: { en: '10-inch', bn: '১০ ইঞ্চি', ar: '١٠ إنش' }, price: 750 },
      { id: '12in', label: { en: '12-inch', bn: '১২ ইঞ্চি', ar: '١٢ إنش' }, price: 870 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('pizza-smoky-bbq', 'pizza', 'Smoky BBQ Chicken Pizza', 'স্মোকি বিবিকিউ চিকেন পিজ্জা', 'بيتزا دجاج باربكيو مدخن', 520, IMG_PIZZA, 37, {
    variants: [
      { id: '8in', label: { en: '8-inch', bn: '৮ ইঞ্চি', ar: '٨ إنش' }, price: 520 },
      { id: '10in', label: { en: '10-inch', bn: '১০ ইঞ্চি', ar: '١٠ إنش' }, price: 870 },
      { id: '12in', label: { en: '12-inch', bn: '১২ ইঞ্চি', ar: '١٢ إنش' }, price: 980 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    popular: true,
  }),
  makeItem('pizza-sausage-delight', 'pizza', 'Chicken Sausage Delight Pizza', 'চিকেন সসেজ ডিলাইট পিজ্জা', 'بيتزا نقانق الدجاج', 540, IMG_PIZZA, 38, {
    variants: [
      { id: '8in', label: { en: '8-inch', bn: '৮ ইঞ্চি', ar: '٨ إنش' }, price: 540 },
      { id: '10in', label: { en: '10-inch', bn: '১০ ইঞ্চি', ar: '١٠ إنش' }, price: 890 },
      { id: '12in', label: { en: '12-inch', bn: '১২ ইঞ্চি', ar: '١٢ إنش' }, price: 990 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('pizza-four-seasons', 'pizza', 'Four Seasons Special Pizza', 'ফোর সিজনস স্পেশাল পিজ্জা', 'بيتزا الفصول الأربعة الخاصة', 580, IMG_PIZZA, 39, {
    variants: [
      { id: '8in', label: { en: '8-inch', bn: '৮ ইঞ্চি', ar: '٨ إنش' }, price: 580 },
      { id: '10in', label: { en: '10-inch', bn: '১০ ইঞ্চি', ar: '١٠ إنش' }, price: 890 },
      { id: '12in', label: { en: '12-inch', bn: '১২ ইঞ্চি', ar: '١٢ إنش' }, price: 1020 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('pizza-zestro-special', 'pizza', 'Zestro Special Pizza', 'জেস্ট্রো স্পেশাল পিজ্জা', 'بيتزا زيسترو الخاصة', 940, IMG_PIZZA, 40, {
    variants: [
      { id: '10in', label: { en: '10-inch', bn: '১০ ইঞ্চি', ar: '١٠ إنش' }, price: 940 },
      { id: '12in', label: { en: '12-inch', bn: '১২ ইঞ্চি', ar: '١٢ إنش' }, price: 1080 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    featured: true,
  }),
  makeItem('pizza-deep-dish', 'pizza', 'Deep Dish Pizza', 'ডিপ ডিশ পিজ্জা', 'بيتزا ديب ديش', 1350, IMG_PIZZA, 41, {
    variants: [
      { id: '12in', label: { en: '12-inch', bn: '১২ ইঞ্চি', ar: '١٢ إنش' }, price: 1350 },
    ],
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),

  // 12. RICE BOWL
  makeItem('bowl-crispy-chicken', 'rice-bowl', 'Crispy Chicken Bowl', 'ক্রিস্পি চিকেন বোল', 'طبق أرز الدجاج المقرمش', 260, IMG_BOWL_PASTA, 42, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('bowl-bbq-chicken', 'rice-bowl', 'BBQ Chicken Bowl', 'বিবিকিউ চিকেন বোল', 'طبق أرز دجاج الباربكيو', 270, IMG_BOWL_PASTA, 43, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('bowl-sizzling-chicken', 'rice-bowl', 'Sizzling Chicken Bowl', 'সিজলিং চিকেন বোল', 'طبق أرز الدجاج السيزلنغ', 280, IMG_BOWL_PASTA, 44, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
  }),
  makeItem('bowl-katsu-chicken', 'rice-bowl', 'Katsu Chicken Bowl', 'কাৎসু চিকেন বোল', 'طبق أرز كاتسو الدجاج', 290, IMG_BOWL_PASTA, 45, {
    customisationGroupIds: ['dipping-sauces', 'spice-level'],
    popular: true,
  }),

  // 13. MEALS (Select Any 2 Sides)
  makeItem('meal-tandoori', 'meals', 'Signature Tandoori Chicken', 'সিগনেচার তান্দুরি চিকেন', 'دجاج تندوري مميز', 380, IMG_CHICKEN_MEALS, 46, {
    mealSideRule: true,
    customisationGroupIds: ['spice-level'],
    popular: true,
  }),
  makeItem('meal-smoky-bbq', 'meals', 'Smoky BBQ Chicken', 'স্মোকি বিবিকিউ চিকেন', 'دجاج باربكيو مدخن', 460, IMG_CHICKEN_MEALS, 47, {
    mealSideRule: true,
    customisationGroupIds: ['spice-level'],
  }),
  makeItem('meal-inferno-peri', 'meals', 'Inferno Peri Peri Chicken', 'ইনফার্নো পেরি পেরি চিকেন', 'دجاج بيري بيري الحار', 480, IMG_CHICKEN_MEALS, 48, {
    mealSideRule: true,
    customisationGroupIds: ['spice-level'],
  }),
  makeItem('meal-chicken-steak', 'meals', 'Chicken Steak', 'চিকেন স্টেক', 'ستيك دجاج', 490, IMG_CHICKEN_MEALS, 49, {
    mealSideRule: true,
    customisationGroupIds: ['spice-level'],
    featured: true,
  }),
  makeItem('meal-italian-stuffed', 'meals', 'Italian Stuffed Chicken', 'ইতালিয়ান স্টাফড চিকেন', 'دجاج محشي إيطالي', 530, IMG_CHICKEN_MEALS, 50, {
    mealSideRule: true,
    customisationGroupIds: ['spice-level'],
    reviewFlag: 'Printed menu image spells "Itallian Stuffed Chicken"; standardized to "Italian Stuffed Chicken".',
  }),

  // 14. SIDES (Informational / included in meals)
  makeItem('side-fries-item', 'sides', 'Hot Fries / French Fries', 'হট ফ্রাইস / ফ্রেঞ্চ ফ্রাইস', 'بطاطس مقلية / بطاطس حارة', 0, IMG_BURGER, 51, {
    descEn: 'Available as one of your 2 included sides with any Zestro Meal.',
  }),
  makeItem('side-veggies-item', 'sides', 'Sautéed Vegetables', 'সতে ভেজিটেবলস', 'خضروات سوتيه', 0, IMG_CHICKEN_MEALS, 52, {
    descEn: 'Available as one of your 2 included sides with any Zestro Meal.',
  }),
  makeItem('side-mashed-item', 'sides', 'Mashed Potato', 'ম্যাশড পটেটো', 'بطاطس مهروسة', 0, IMG_CHICKEN_MEALS, 53, {
    descEn: 'Available as one of your 2 included sides with any Zestro Meal.',
  }),
  makeItem('side-thai-rice-item', 'sides', 'Thai Fried Rice', 'থাই ফ্রাইড রাইস', 'أرز مقلي تايلاندي', 0, IMG_BOWL_PASTA, 54, {
    descEn: 'Available as one of your 2 included sides with any Zestro Meal.',
  }),

  // 15. FRAPPE
  makeItem('frappe-mocha', 'frappe', 'Mocha Frappe', 'মোকা ফ্রাপে', 'موكا فرابيه', 310, IMG_BEVERAGES, 55, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
    popular: true,
  }),
  makeItem('frappe-caramel', 'frappe', 'Caramel Frappe', 'ক্যারামেল ফ্রাপে', 'كراميل فرابيه', 310, IMG_BEVERAGES, 56, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('frappe-hazelnut', 'frappe', 'Hazelnut Frappe', 'হ্যাজেলনাট ফ্রাপে', 'فرابيه بالبندق', 310, IMG_BEVERAGES, 57, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
    reviewFlag: 'Printed menu image spells "Hazlenut Frappe"; standardized to "Hazelnut Frappe".',
  }),
  makeItem('frappe-cookies-cream', 'frappe', 'Cookies N Cream Frappe', 'কুকিজ অ্যান্ড ক্রিম ফ্রাপে', 'فرابيه كوكيز آند كريم', 300, IMG_BEVERAGES, 58, {
    customisationGroupIds: ['sugar-level'],
  }),

  // 16. BUBBLE DRINKS
  makeItem('bubble-mango', 'bubble-drinks', 'Mango Bubble Drink', 'ম্যাঙ্গো বাবল ড্রিংক', 'مشروب بابلز المانجو', 350, IMG_BEVERAGES, 59, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('bubble-blueberry', 'bubble-drinks', 'Blueberry Bubble Drink', 'ব্লুবেরি বাবল ড্রিংক', 'مشروب بابلز التوت الأزرق', 340, IMG_BEVERAGES, 60, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('bubble-blue-coconut', 'bubble-drinks', 'Blue Coconut Bubble Drink', 'ব্লু কোকোনাট বাবল ড্রিংক', 'مشروب بابلز جوز الهند الأزرق', 340, IMG_BEVERAGES, 61, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('bubble-raspberry', 'bubble-drinks', 'Raspberry Bubble Drink', 'রাস্পবেরি বাবল ড্রিংক', 'مشروب بابلز التوت الأحمر', 340, IMG_BEVERAGES, 62, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('bubble-strawberry', 'bubble-drinks', 'Strawberry Bubble Drink', 'স্ট্রবেরি বাবল ড্রিংক', 'مشروب بابلز الفراولة', 340, IMG_BEVERAGES, 63, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),

  // 17. MOCKTAILS / MOJITO
  makeItem('mojito-virgin', 'mocktails-mojito', 'Virgin Mojito', 'ভার্জিন মোহিতো', 'فيرجن موهيتو', 270, IMG_BEVERAGES, 64, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
    popular: true,
  }),
  makeItem('mojito-strawberry', 'mocktails-mojito', 'Strawberry Mojito', 'স্ট্রবেরি মোহিতো', 'موهيتو الفراولة', 270, IMG_BEVERAGES, 65, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-raspberry', 'mocktails-mojito', 'Raspberry Mojito', 'রাস্পবেরি মোহিতো', 'موهيتو التوت الأحمر', 270, IMG_BEVERAGES, 66, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-blueberry', 'mocktails-mojito', 'Blueberry Mojito', 'ব্লুবেরি মোহিতো', 'موهيتو التوت الأزرق', 280, IMG_BEVERAGES, 67, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-blue-ocean', 'mocktails-mojito', 'Blue Ocean', 'ব্লু ওশান', 'بلو أوشن موكتيل', 330, IMG_BEVERAGES, 68, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-mango', 'mocktails-mojito', 'Mango Mojito', 'ম্যাঙ্গো মোহিতো', 'موهيتو المانجو', 290, IMG_BEVERAGES, 69, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-orange', 'mocktails-mojito', 'Orange Mojito', 'অরেঞ্জ মোহিতো', 'موهيتو البرتقال', 290, IMG_BEVERAGES, 70, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-pink-guava', 'mocktails-mojito', 'Pink Guava & Strawberry', 'পিংক পেয়ারা ও স্ট্রবেরি', 'جوافة وردية وفراولة', 300, IMG_BEVERAGES, 71, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-pinacolada', 'mocktails-mojito', 'Pinacolada', 'পিনা কোলাডা', 'بينا كولادا', 300, IMG_BEVERAGES, 72, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),
  makeItem('mojito-green-apple', 'mocktails-mojito', 'Green Apple', 'গ্রিন অ্যাপল', 'موهيتو التفاح الأخضر', 300, IMG_BEVERAGES, 73, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),

  // 18. SMOOTHIE
  makeItem('smoothie-strawberry', 'smoothie', 'Strawberry Smoothie', 'স্ট্রবেরি স্মুদি', 'سموذي الفراولة', 320, IMG_BEVERAGES, 74, {
    customisationGroupIds: ['sugar-level'],
  }),
  makeItem('smoothie-mango', 'smoothie', 'Mango Smoothie', 'ম্যাঙ্গো স্মুদি', 'سموذي المانجو', 330, IMG_BEVERAGES, 75, {
    customisationGroupIds: ['sugar-level'],
  }),
  makeItem('smoothie-blueberry', 'smoothie', 'Blueberry Smoothie', 'ব্লুবেরি স্মুদি', 'سموذي التوت الأزرق', 320, IMG_BEVERAGES, 76, {
    customisationGroupIds: ['sugar-level'],
  }),
  makeItem('smoothie-coconut', 'smoothie', 'Coconut Smoothie', 'কোকোনাট স্মুদি', 'سموذي جوز الهند', 330, IMG_BEVERAGES, 77, {
    customisationGroupIds: ['sugar-level'],
  }),

  // 19. ICED COFFEE
  makeItem('iced-chai-latte', 'iced-coffee', 'Iced Chai Latte', 'আইসড চাই লাটে', 'آيس شاي لاتيه', 240, IMG_BEVERAGES, 78, {
    variants: twoCoffeeVariants(240, 320),
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-americano', 'iced-coffee', 'Iced Americano', 'আইসড আমেরিকানো', 'آيس أمريكانو', 180, IMG_BEVERAGES, 79, {
    variants: twoCoffeeVariants(180, 250),
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-affogato', 'iced-coffee', 'Affogato', 'অ্যাফোগাতো', 'أفوغاتو', 240, IMG_BEVERAGES, 80, {
    customisationGroupIds: ['coffee-syrup'],
  }),
  makeItem('iced-cappuccino', 'iced-coffee', 'Iced Cappuccino', 'আইসড ক্যাপুচিনো', 'آيس كابتشينو', 220, IMG_BEVERAGES, 81, {
    variants: twoCoffeeVariants(220, 320),
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-latte', 'iced-coffee', 'Iced Latte', 'আইসড লাটে', 'آيس لاتيه', 220, IMG_BEVERAGES, 82, {
    variants: twoCoffeeVariants(220, 320),
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-mocha', 'iced-coffee', 'Iced Mocha', 'আইসড মোকা', 'آيس موكا', 240, IMG_BEVERAGES, 83, {
    variants: twoCoffeeVariants(240, 340),
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-spanish-latte', 'iced-coffee', 'Iced Spanish Latte', 'আইসড স্প্যানিশ লাটে', 'آيس سبانيش لاتيه', 250, IMG_BEVERAGES, 84, {
    variants: twoCoffeeVariants(250, 340),
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
    popular: true,
  }),
  makeItem('iced-matcha-latte', 'iced-coffee', 'Iced Matcha Latte', 'আইসড ম্যাচা লাটে', 'آيس ماتشا لاتيه', 250, IMG_BEVERAGES, 85, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-caramel-macchiato', 'iced-coffee', 'Iced Caramel Macchiato', 'আইসড ক্যারামেল মাকিয়াতো', 'آيس كراميل ماكياتو', 260, IMG_BEVERAGES, 86, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-flat-white', 'iced-coffee', 'Iced Flat White', 'আইসড ফ্ল্যাট হোয়াইট', 'آيس فلات وايت', 340, IMG_BEVERAGES, 87, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level', 'ice-level'],
  }),
  makeItem('iced-tonic-espresso', 'iced-coffee', 'Iced Tonic Espresso', 'আইসড টনিক এসপ্রেসো', 'آيس تونيك إسبريسو', 200, IMG_BEVERAGES, 88, {
    customisationGroupIds: ['sugar-level', 'ice-level'],
  }),

  // 20. HOT COFFEE
  makeItem('hot-espresso', 'hot-coffee', 'Espresso', 'এসপ্রেসো', 'إسبريسو', 160, IMG_BEVERAGES, 89, {
    variants: twoCoffeeVariants(160, 220),
    customisationGroupIds: ['sugar-level'],
  }),
  makeItem('hot-americano', 'hot-coffee', 'Americano', 'আমেরিকানো', 'أمريكانو', 190, IMG_BEVERAGES, 90, {
    variants: twoCoffeeVariants(190, 250),
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('hot-chocolate', 'hot-coffee', 'Hot Chocolate', 'হট চকোলেট', 'شوكولاتة ساخنة', 220, IMG_BEVERAGES, 91, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('hot-cappuccino', 'hot-coffee', 'Cappuccino', 'ক্যাপুচিনো', 'كابتشينو', 220, IMG_BEVERAGES, 92, {
    variants: twoCoffeeVariants(220, 330),
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
    popular: true,
  }),
  makeItem('hot-latte', 'hot-coffee', 'Latte', 'লাটে', 'لاتيه', 220, IMG_BEVERAGES, 93, {
    variants: twoCoffeeVariants(220, 330),
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('hot-spanish-latte', 'hot-coffee', 'Spanish Latte', 'স্প্যানিশ লাটে', 'سبانيش لاتيه', 240, IMG_BEVERAGES, 94, {
    variants: twoCoffeeVariants(240, 330),
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('hot-mocha', 'hot-coffee', 'Mocha', 'মোকা', 'موكا', 250, IMG_BEVERAGES, 95, {
    variants: twoCoffeeVariants(250, 330),
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('hot-chai-latte', 'hot-coffee', 'Chai Latte', 'চাই লাটে', 'شاي لاتيه', 240, IMG_BEVERAGES, 96, {
    variants: twoCoffeeVariants(240, 340),
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('hot-macchiato', 'hot-coffee', 'Macchiato', 'মাকিয়াতো', 'ماكياتو', 180, IMG_BEVERAGES, 97, {
    variants: twoCoffeeVariants(180, 250),
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('hot-flat-white', 'hot-coffee', 'Flat White', 'ফ্ল্যাট হোয়াইট', 'فلات وايت', 340, IMG_BEVERAGES, 98, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),

  // 21. COLD COFFEE
  makeItem('cold-coffee-chocolate', 'cold-coffee', 'Chocolate Cold Coffee', 'চকোলেট কোল্ড কফি', 'قهوة باردة بالشوكولاتة', 180, IMG_BEVERAGES, 99, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('cold-coffee-oreo', 'cold-coffee', 'Oreo Blended Cold Coffee', 'ওরিও ব্লেন্ডেড কোল্ড কফি', 'قهوة باردة بالأوريو', 200, IMG_BEVERAGES, 100, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),
  makeItem('cold-coffee-kitkat', 'cold-coffee', 'Kitkat Cold Coffee', 'কিটক্যাট কোল্ড কফি', 'قهوة باردة بالكيت كات', 220, IMG_BEVERAGES, 101, {
    customisationGroupIds: ['coffee-syrup', 'sugar-level'],
  }),

  // 22. SHAKES
  makeItem('shake-chocolate', 'shakes', 'Chocolate Shake', 'চকোলেট শেক', 'شيك الشوكولاتة', 300, IMG_BEVERAGES, 102, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-caramel', 'shakes', 'Caramel Shake', 'ক্যারামেল শেক', 'شيك الكراميل', 300, IMG_BEVERAGES, 103, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-vanilla', 'shakes', 'Vanilla Shake', 'ভ্যানিলা শেক', 'شيك الفانيلا', 300, IMG_BEVERAGES, 104, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-strawberry', 'shakes', 'Strawberry Shake', 'স্ট্রবেরি শেক', 'شيك الفراولة', 300, IMG_BEVERAGES, 105, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-mango', 'shakes', 'Mango Shake', 'ম্যাঙ্গো শেক', 'شيك المانجو', 360, IMG_BEVERAGES, 106, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-blueberry', 'shakes', 'Blueberry Shake', 'ব্লুবেরি শেক', 'شيك التوت الأزرق', 330, IMG_BEVERAGES, 107, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-nutella', 'shakes', 'Nutella Shake', 'নুটেলা শেক', 'شيك النوتيلا', 330, IMG_BEVERAGES, 108, { customisationGroupIds: ['sugar-level'], popular: true }),
  makeItem('shake-choco-malt', 'shakes', 'Chocolate Malt Shake', 'চকোলেট মল্ট শেক', 'شيك مالت الشوكولاتة', 330, IMG_BEVERAGES, 109, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-oreo', 'shakes', 'Oreo Shake', 'ওরিও শেক', 'شيك الأوريو', 300, IMG_BEVERAGES, 110, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-hazelnut', 'shakes', 'Hazelnut Shake', 'হ্যাজেলনাট শেক', 'شيك البندق', 320, IMG_BEVERAGES, 111, {
    customisationGroupIds: ['sugar-level'],
    reviewFlag: 'Printed menu image spells "Hazlenut"; standardized to "Hazelnut Shake".',
  }),
  makeItem('shake-peanut-butter', 'shakes', 'Peanut Butter Shake', 'পিনাট বাটার শেক', 'شيك زبدة الفول السوداني', 330, IMG_BEVERAGES, 112, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-pb-jelly', 'shakes', 'Peanut Butter Jelly Shake', 'পিনাট বাটার জেলি শেক', 'شيك زبدة الفول السوداني والمربى', 360, IMG_BEVERAGES, 113, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-pb-malt', 'shakes', 'Peanut Butter Malt Shake', 'পিনাট বাটার মল্ট শেক', 'شيك مالت زبدة الفول السوداني', 360, IMG_BEVERAGES, 114, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-pb-oreo', 'shakes', 'Peanut Butter Oreo Shake', 'পিনাট বাটার ওরিও শেক', 'شيك أوريو وزبدة الفول السوداني', 360, IMG_BEVERAGES, 115, { customisationGroupIds: ['sugar-level'] }),
  makeItem('shake-pb-blueberry', 'shakes', 'Peanut Butter Blueberry Shake', 'পিনাট বাটার ব্লুবেরি শেক', 'شيك توت وزبدة الفول السوداني', 380, IMG_BEVERAGES, 116, { customisationGroupIds: ['sugar-level'] }),

  // 23. TEA
  makeItem('tea-english', 'tea', 'English Tea', 'ইংলিশ টি', 'شاي إنجليزي', 140, IMG_BEVERAGES, 117, { customisationGroupIds: ['sugar-level'] }),
  makeItem('tea-london-fog', 'tea', 'London Fog Tea', 'লন্ডন ফগ টি', 'شاي لندن فوغ', 150, IMG_BEVERAGES, 118, { customisationGroupIds: ['sugar-level'] }),
  makeItem('tea-earl-grey', 'tea', 'Earl Grey Tea', 'আর্ল গ্রে টি', 'شاي إيرل غراي', 140, IMG_BEVERAGES, 119, { customisationGroupIds: ['sugar-level'] }),
  makeItem('tea-lemon', 'tea', 'Lemon Tea', 'লেমন টি', 'شاي بالليمون', 170, IMG_BEVERAGES, 120, { customisationGroupIds: ['sugar-level'] }),
  makeItem('tea-iced-lemon', 'tea', 'Iced Lemon Tea', 'আইসড লেমন টি', 'شاي مثلج بالليمون', 200, IMG_BEVERAGES, 121, { customisationGroupIds: ['sugar-level', 'ice-level'] }),
  makeItem('tea-iced-peach', 'tea', 'Iced Peach Tea', 'আইসড পিচ টি', 'شاي مثلج بالخوخ', 220, IMG_BEVERAGES, 122, { customisationGroupIds: ['sugar-level', 'ice-level'] }),
  makeItem('tea-iced-raspberry', 'tea', 'Iced Raspberry Tea', 'আইসড রাস্পবেরি টি', 'شاي مثلج بالتوت', 220, IMG_BEVERAGES, 123, { customisationGroupIds: ['sugar-level', 'ice-level'] }),

  // 24. ADD SYRUP
  makeItem('syrup-item-vanilla', 'add-syrup', 'Vanilla Syrup', 'ভ্যানিলা সিরাপ', 'شراب الفانيلا', 99, IMG_BEVERAGES, 124),
  makeItem('syrup-item-caramel', 'add-syrup', 'Caramel Syrup', 'ক্যারামেল সিরাপ', 'شراب الكراميل', 99, IMG_BEVERAGES, 125),
  makeItem('syrup-item-hazelnut', 'add-syrup', 'Hazelnut Syrup', 'হ্যাজেলনাট সিরাপ', 'شراب البندق', 99, IMG_BEVERAGES, 126),
  makeItem('syrup-item-coconut', 'add-syrup', 'Coconut Syrup', 'কোকোনাট সিরাপ', 'شراب جوز الهند', 99, IMG_BEVERAGES, 127),
];

export const INITIAL_TABLES: RestaurantTable[] = Array.from({ length: 12 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return {
    id: `table-${num}`,
    number: num,
    name: `Table ${num}`,
    capacity: idx % 3 === 0 ? 6 : idx % 2 === 0 ? 4 : 2,
    status: 'available',
    currentOrderId: '',
    assignedStaffName: '',
    notes: '',
  };
});

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-welcome',
    title: {
      en: 'Zestro Dine-In & Café Experience',
      bn: 'জেস্ট্রো ডাইন-ইন ও ক্যাফে অভিজ্ঞতা',
      ar: 'تجربة زيسترو للمطعم والمقهى',
    },
    description: {
      en: 'Ask your server or check our WhatsApp channel for seasonal chef specials and combo offers.',
      bn: 'মৌসুমী শেফ স্পেশাল ও কম্বো অফারের জন্য আমাদের টিম বা হোয়াটসঅ্যাপে যোগাযোগ করুন।',
      ar: 'اسأل فريقنا أو تواصل عبر واتساب لمعرفة عروض الشيف الموسمية.',
    },
    code: '',
    active: false,
    discountType: 'percent',
    discountValue: 0,
    minOrderAmount: 0,
    validUntil: '',
  },
];

export const INITIAL_SETTINGS: RestaurantSettings = {
  restaurantName: 'Zestro',
  logoUrl: OFFICIAL_LOGO_PATH,
  whatsappNumber: '+880 1601-987672',
  contactPhone: '+880 1601-987672',
  address: {
    en: 'Address not yet configured — update in Admin Settings',
    bn: 'ঠিকানা এখনো সেট করা হয়নি — অ্যাডমিন সেটিংস থেকে আপডেট করুন',
    ar: 'لم يتم تحديد العنوان بعد — قم بالتحديث من إعدادات الإدارة',
  },
  openingHours: {
    en: 'Opening hours configurable in Admin Settings',
    bn: 'খোলার সময় অ্যাডমিন সেটিংস থেকে পরিবর্তনযোগ্য',
    ar: 'ساعات العمل قابلة للتعديل من إعدادات الإدارة',
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    tiktok: '',
  },
  deliveryFee: 0,
  minOrderAmount: 0,
  taxPercent: 0,
  serviceChargePercent: 0,
  currency: '৳',
  defaultLanguage: 'en',
  acceptingOrders: true,
  reviews: [
    {
      id: 'rev-1',
      author: 'Farhan Ahmed',
      role: 'Regular Guest',
      rating: 5,
      comment: {
        en: 'The Zestro Special Burger and Iced Spanish Latte hit the exact balance of craft and comfort.',
        bn: 'জেস্ট্রো স্পেশাল বার্গার আর আইসড স্প্যানিশ লাটে স্বাদে ও মানে অসাধারণ।',
        ar: 'برجر زيسترو الخاص والسبانيش لاتيه المثلج يجمعان بين الجودة والمذاق الرائع.',
      },
    },
    {
      id: 'rev-2',
      author: 'Nusrat Jahan',
      role: 'Dine-In Guest',
      rating: 5,
      comment: {
        en: 'Scanning the table QR code made ordering for our whole table effortless and fast.',
        bn: 'টেবিলের কিউআর কোড স্ক্যান করে পুরো টেবিলের জন্য অর্ডার করা খুবই সহজ ছিল।',
        ar: 'مسح رمز QR على الطاولة جعل الطلب لمجموعتنا سهلاً وسريعاً للغاية.',
      },
    },
    {
      id: 'rev-3',
      author: 'Tanvir Hasan',
      role: 'Coffee Enthusiast',
      rating: 5,
      comment: {
        en: 'Crispy fried chicken stays crunchy and the pasta portions are generous every single visit.',
        bn: 'ক্রিস্পি ফ্রাইড চিকেন দারুণ মচমচে এবং প্রতিবারই পাস্তার পরিমাণ বেশ ভালো থাকে।',
        ar: 'الدجاج المقلي المقرمش رائع دائماً وحصص الباستا سخية في كل زيارة.',
      },
    },
  ],
};
