export type Language = 'en' | 'bn' | 'ar';

export interface LocalizedText {
  en: string;
  bn: string;
  ar: string;
}

export interface Category {
  id: string;
  name: LocalizedText;
  type: 'food' | 'beverage';
  displayOrder: number;
  active: boolean;
  image?: string;
  updatedAt?: unknown;
}

export interface ProductVariant {
  id: string;
  label: LocalizedText;
  price: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  variants?: ProductVariant[];
  customisationGroupIds?: string[];
  mealSideRule?: boolean;
  image?: string;
  available: boolean;
  soldOut?: boolean;
  popular?: boolean;
  featured?: boolean;
  displayOrder: number;
  reviewFlag?: string;
  updatedAt?: unknown;
}

export interface CustomisationOption {
  id: string;
  name: LocalizedText;
  price: number;
}

export interface CustomisationGroup {
  id: string;
  name: LocalizedText;
  selectionType: 'single' | 'multiple';
  required: boolean;
  minSelect?: number;
  maxSelect?: number;
  options: CustomisationOption[];
  updatedAt?: unknown;
}

export interface SelectedCustomisation {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: LocalizedText;
  image?: string;
  variantId?: string;
  variantLabel?: LocalizedText;
  unitPrice: number;
  quantity: number;
  customisations: SelectedCustomisation[];
  selectedSides?: string[];
  specialInstructions?: string;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus =
  | 'awaiting_whatsapp_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  categoryId: string;
  variantLabel?: string;
  customisations: {
    groupName: string;
    optionName: string;
    price: number;
  }[];
  selectedSides?: string[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderRef: string;
  orderType: OrderType;
  tableId?: string;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  notes?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  taxAmount: number;
  discountAmount: number;
  promoCode?: string;
  redeemedPoints?: number;
  loyaltyDiscountAmount?: number;
  total: number;
  status: OrderStatus;
  whatsappOpened?: boolean;
  staffNote?: string;
  userId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface LocalOrderHistoryEntry {
  orderId: string;
  orderRef: string;
  orderType: OrderType;
  tableNumber?: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  redeemedPoints?: number;
  loyaltyDiscountAmount?: number;
  total: number;
  status: OrderStatus;
  whatsappUrl?: string;
}

export type TableStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'waiting_for_order'
  | 'needs_cleaning';

export interface RestaurantTable {
  id: string;
  number: string;
  name: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  assignedStaffName?: string;
  notes?: string;
  updatedAt?: unknown;
}

export interface TableSession {
  id: string;
  tableId: string;
  tableNumber: string;
  orderId?: string;
  orderRef?: string;
  staffName?: string;
  status: 'open' | 'closed';
  startedAt?: unknown;
  closedAt?: unknown;
  updatedAt?: unknown;
}

export interface WaiterCall {
  id: string;
  tableId: string;
  tableNumber: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  handledBy?: string;
  note?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Promotion {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  code?: string;
  active: boolean;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  validUntil?: string;
  updatedAt?: unknown;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderRef?: string;
  lastOrderAt?: unknown;
  updatedAt?: unknown;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: LocalizedText;
}

export interface RestaurantSettings {
  restaurantName: string;
  logoUrl?: string;
  whatsappNumber: string;
  contactPhone?: string;
  address: LocalizedText;
  openingHours: LocalizedText;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  deliveryFee: number;
  minOrderAmount: number;
  taxPercent: number;
  serviceChargePercent: number;
  currency: string;
  defaultLanguage: Language;
  acceptingOrders: boolean;
  onlineOrderingEnabled?: boolean;
  qrTableOrderingEnabled?: boolean;
  reviews: ReviewItem[];
  updatedAt?: unknown;
}

export interface LiveHomepageSection {
  id: string;
  label: string;
  description: string;
  visible: boolean;
  order: number;
}

export interface HomepageOffer {
  id: string;
  title: string;
  description?: string;
  discountText?: string;
  code?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface LiveHomepageConfig {
  heroImageUrl?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCtaText?: string;
  promoBannerEnabled?: boolean;
  promoBannerText?: string;
  promoBannerCode?: string;
  sections?: LiveHomepageSection[];
}

export interface LiveGalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  featured: boolean;
}

export type StaffRole = 'admin' | 'manager' | 'staff';

export interface StaffMember {
  uid: string;
  username?: string;
  email?: string;
  displayName: string;
  role: StaffRole;
  active: boolean;
  updatedAt?: unknown;
}

export interface AdminSessionInfo {
  uid: string;
  username: string;
  displayName: string;
  role: StaffRole;
}

export interface CustomerProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  defaultAddress?: string;
  preferredOrderType?: OrderType;
  photoUrl?: string;
  welcomePoints?: number;
  bonusPoints?: number;
  lastLoyaltyNote?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold';

export interface LoyaltySummary {
  points: number;
  welcomePoints: number;
  bonusPoints: number;
  completedPoints: number;
  pendingPoints: number;
  redeemedPoints: number;
  eligibleOrdersCount: number;
  eligibleTotalSpent: number;
  tier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsToNextTier: number;
  tierProgressPercent: number;
}

export interface LoyaltyAdjustment {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  pointsDelta: number;
  reason: string;
  addedByUid: string;
  addedByName: string;
  createdAt?: unknown;
}
