import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Receipt,
  RotateCcw,
  Save,
  Search,
  ShoppingBag,
  User as UserIcon,
  Utensils,
  X,
  XCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Order, OrderStatus, OrderType } from '../../types';

interface CustomerAccountModalProps {
  open: boolean;
  initialTab?: 'orders' | 'profile';
  onClose: () => void;
  onReorderSuccess: () => void;
}

const PROGRESS_STEPS: OrderStatus[] = [
  'awaiting_whatsapp_confirmation',
  'confirmed',
  'preparing',
  'ready',
  'completed',
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const digitsOnly = cleaned.replace(/^\+/, '');
  return /^\d{7,16}$/.test(digitsOnly);
}

function formatFirestoreDate(val: unknown): string {
  if (!val) return '';
  let dateObj: Date | null = null;
  if (
    typeof val === 'object' &&
    val !== null &&
    'toDate' in val &&
    typeof (val as { toDate: () => Date }).toDate === 'function'
  ) {
    dateObj = (val as { toDate: () => Date }).toDate();
  } else if (
    typeof val === 'object' &&
    val !== null &&
    'seconds' in val &&
    typeof (val as { seconds: number }).seconds === 'number'
  ) {
    dateObj = new Date((val as { seconds: number }).seconds * 1000);
  } else if (typeof val === 'string' || typeof val === 'number') {
    dateObj = new Date(val);
  }
  if (!dateObj || Number.isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusMeta(
  status: OrderStatus,
  labels: Record<OrderStatus, string>
): { label: string; textClass: string; Icon: React.ComponentType<{ className?: string }> } {
  switch (status) {
    case 'awaiting_whatsapp_confirmation':
      return {
        label: labels.awaiting_whatsapp_confirmation,
        textClass: 'text-amber-800',
        Icon: Clock,
      };
    case 'confirmed':
      return {
        label: labels.confirmed,
        textClass: 'text-sky-800',
        Icon: CheckCircle2,
      };
    case 'preparing':
      return {
        label: labels.preparing,
        textClass: 'text-indigo-800',
        Icon: ChefHat,
      };
    case 'ready':
      return {
        label: labels.ready,
        textClass: 'text-teal-800',
        Icon: PackageCheck,
      };
    case 'completed':
      return {
        label: labels.completed,
        textClass: 'text-emerald-800',
        Icon: PackageCheck,
      };
    case 'cancelled':
      return {
        label: labels.cancelled,
        textClass: 'text-red-700',
        Icon: XCircle,
      };
  }
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  open,
  initialTab = 'orders',
  onClose,
  onReorderSuccess,
}) => {
  const {
    t,
    isRtl,
    settings,
    customerUser,
    customerProfile,
    customerOrders,
    orderHistory,
    saveCustomerProfile,
    signOutCustomer,
    reorderFromFirestoreOrder,
    loyalty,
    getOrderLoyaltyPoints,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>(initialTab);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderScope, setOrderScope] = useState<'all' | 'active'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [preferredOrderType, setPreferredOrderType] = useState<OrderType>('takeaway');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setProfileError(null);
    }
  }, [open, initialTab]);

  useEffect(() => {
    setDisplayName(customerProfile?.displayName || customerUser?.displayName || '');
    setPhone(customerProfile?.phone || '');
    setDefaultAddress(customerProfile?.defaultAddress || '');
    setPreferredOrderType(customerProfile?.preferredOrderType || 'takeaway');
  }, [customerProfile, customerUser]);

  const localWhatsappByOrderId = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of orderHistory) {
      if (entry.whatsappUrl) map.set(entry.orderId, entry.whatsappUrl);
    }
    return map;
  }, [orderHistory]);

  const totalSpent = useMemo(
    () =>
      customerOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [customerOrders]
  );

  const activeOrdersCount = useMemo(
    () => customerOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length,
    [customerOrders]
  );

  const filteredCustomerOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return customerOrders.filter((ord) => {
      if (orderScope === 'active' && (ord.status === 'completed' || ord.status === 'cancelled')) {
        return false;
      }
      if (!q) return true;
      const statusLabel = t.history.statuses[ord.status].toLowerCase();
      const typeLabel =
        ord.orderType === 'dine_in'
          ? t.checkout.dineIn.toLowerCase()
          : ord.orderType === 'delivery'
          ? t.checkout.delivery.toLowerCase()
          : t.checkout.takeaway.toLowerCase();
      const matchesRef = ord.orderRef.toLowerCase().includes(q);
      const matchesTable = ord.tableNumber
        ? ord.tableNumber.toLowerCase().includes(q) ||
          `${t.history.tableLabel.toLowerCase()} ${ord.tableNumber.toLowerCase()}`.includes(q)
        : false;
      const matchesStatus = statusLabel.includes(q) || ord.status.toLowerCase().includes(q);
      const matchesType = typeLabel.includes(q);
      const matchesItems = ord.items.some(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.variantLabel && i.variantLabel.toLowerCase().includes(q))
      );
      return matchesRef || matchesTable || matchesStatus || matchesType || matchesItems;
    });
  }, [
    customerOrders,
    orderScope,
    orderSearch,
    t.checkout.delivery,
    t.checkout.dineIn,
    t.checkout.takeaway,
    t.history.statuses,
    t.history.tableLabel,
  ]);

  const slideOffset = isRtl ? '-100%' : '100%';
  const resolvedName =
    customerProfile?.displayName ||
    customerUser?.displayName ||
    customerUser?.email?.split('@')[0] ||
    'Guest';
  const resolvedEmail = customerProfile?.email || customerUser?.email || '';
  const initials = resolvedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const formatOrderType = (type: OrderType) => {
    if (type === 'dine_in') return { label: t.checkout.dineIn, Icon: Utensils };
    if (type === 'delivery') return { label: t.checkout.delivery, Icon: MapPin };
    return { label: t.checkout.takeaway, Icon: ShoppingBag };
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingProfile) return;
    setProfileError(null);

    if (!displayName.trim()) {
      setProfileError(t.account.errors.nameRequired);
      return;
    }
    if (phone.trim() && !isValidPhone(phone)) {
      setProfileError(t.account.errors.phoneInvalid);
      return;
    }

    setSavingProfile(true);
    try {
      await saveCustomerProfile({
        displayName: displayName.trim(),
        phone: phone.trim(),
        defaultAddress: defaultAddress.trim(),
        preferredOrderType,
      });
    } catch {
      setProfileError('Unable to save profile right now. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleReorder = (order: Order) => {
    const ok = reorderFromFirestoreOrder(order);
    if (ok) {
      onReorderSuccess();
    }
  };

  const handleSignOut = async () => {
    await signOutCustomer();
    onClose();
  };

  const progressRatio = Math.max(0, Math.min(1, loyalty.tierProgressPercent / 100));

  return (
    <AnimatePresence>
      {open && customerUser && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={t.account.myAccountBtn}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: slideOffset }}
            animate={{ x: 0 }}
            exit={{ x: slideOffset }}
            transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
            className="relative z-10 w-full max-w-lg bg-[#F3EBDD] h-full flex flex-col border-s border-[#101B17]/15 shadow-2xl"
          >
            {/* Dark Luxury Sticky Header */}
            <header className="bg-[#101B17] text-[#F3EBDD] border-b border-[#D7A65A]/20 shrink-0">
              <div className="px-5 py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {customerProfile?.photoUrl || customerUser.photoURL ? (
                    <img
                      src={customerProfile?.photoUrl || customerUser.photoURL || ''}
                      alt={resolvedName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#D7A65A]/50 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#D7A65A] text-[#101210] font-display font-bold text-sm flex items-center justify-center shrink-0">
                      {initials || 'Z'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="font-display text-base sm:text-lg font-bold text-white leading-snug truncate">
                      {resolvedName}
                    </h2>
                    <p className="text-xs text-[#A9A79F] truncate">
                      {resolvedEmail}
                      <span aria-hidden="true" className="mx-1.5 text-white/25">
                        ·
                      </span>
                      <span className="font-semibold text-[#D7A65A]">
                        {t.account.loyalty.tiers[loyalty.tier]}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={handleSignOut}
                    title={t.account.signOutBtn}
                    aria-label={t.account.signOutBtn}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#A9A79F] hover:text-red-300 min-h-[40px] min-w-[40px] px-2.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline whitespace-nowrap">{t.account.signOutBtn}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={onClose}
                    aria-label="Close"
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[#F3EBDD] hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Clean Underline Navigation Tabs */}
              <nav
                className="grid grid-cols-2 border-t border-white/10"
                aria-label="Account sections"
              >
                {(
                  [
                    {
                      id: 'orders',
                      label: `${t.account.ordersTab} (${customerOrders.length})`,
                      Icon: Receipt,
                    },
                    {
                      id: 'profile',
                      label: t.account.profileTab,
                      Icon: UserIcon,
                    },
                  ] as const
                ).map(({ id, label, Icon }) => {
                  const active = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      className={`relative py-3 px-4 text-xs sm:text-sm font-semibold transition-colors min-h-[44px] inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                        active ? 'text-[#D7A65A]' : 'text-[#A9A79F] hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{label}</span>
                      {active && (
                        <motion.span
                          layoutId="customer-account-tab-underline"
                          transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                          className="absolute bottom-0 start-4 end-4 h-0.5 bg-[#D7A65A] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </header>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnimatePresence mode="wait">
                {activeTab === 'orders' ? (
                  <motion.div
                    key="tab-orders"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                    className="space-y-4"
                  >
                    {/* Quiet Inline Loyalty Status Bar */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                      className="w-full text-start px-4 py-3 rounded-xl bg-white border border-[#101B17]/12 hover:border-[#101B17]/30 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Award className="w-4 h-4 text-[#D7A65A] shrink-0" />
                        <span className="text-xs font-medium text-[#101210] truncate">
                          {t.account.loyalty.balanceLabel}:{' '}
                          <strong className="font-mono-tabular text-[#101B17]">
                            {loyalty.points.toLocaleString()} {t.account.loyalty.pointsUnit}
                          </strong>
                          {loyalty.pendingPoints > 0 && (
                            <>
                              <span aria-hidden="true" className="mx-1.5 text-[#101B17]/30">
                                ·
                              </span>
                              <span className="font-mono-tabular text-amber-800 font-medium">
                                {t.account.loyalty.inProgressLabel}: {loyalty.pendingPoints.toLocaleString()}{' '}
                                {t.account.loyalty.pointsUnit}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true" className="mx-1.5 text-[#101B17]/30">
                            ·
                          </span>
                          <span className="text-[#5B564E]">
                            {t.account.loyalty.tiers[loyalty.tier]}
                          </span>
                        </span>
                      </div>
                      <ArrowRight
                        className={`w-3.5 h-3.5 text-[#101B17]/60 group-hover:text-[#101B17] transition-transform shrink-0 ${
                          isRtl ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
                        }`}
                      />
                    </button>

                    {customerOrders.length === 0 ? (
                      <div className="py-14 text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#E7DFD0] flex items-center justify-center text-[#101B17]">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5 max-w-xs mx-auto">
                          <p className="font-display text-lg font-bold text-[#101210]">
                            {t.history.emptyTitle}
                          </p>
                          <p className="text-sm text-[#5B564E] leading-relaxed">
                            {t.history.emptyBody}
                          </p>
                        </div>
                        <div className="pt-1">
                          <a
                            href="#menu"
                            onClick={onClose}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#101B17] text-[#F3EBDD] text-sm font-semibold hover:bg-[#1D2922] transition-colors min-h-[44px]"
                          >
                            {t.history.browseMenu}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* All Orders / Active Orders Filter + Search Bar */}
                        <div className="space-y-2.5 bg-white rounded-2xl border border-[#101B17]/12 p-3">
                          <div
                            className="grid grid-cols-2 p-1 rounded-xl bg-[#E7DFD0] border border-[#101B17]/10"
                            role="tablist"
                            aria-label={t.account.ordersTab}
                          >
                            {(
                              [
                                {
                                  id: 'all',
                                  label: t.history.allOrdersTab,
                                  count: customerOrders.length,
                                },
                                {
                                  id: 'active',
                                  label: t.history.activeOrdersTab,
                                  count: activeOrdersCount,
                                },
                              ] as const
                            ).map((tab) => {
                              const selected = orderScope === tab.id;
                              return (
                                <button
                                  key={tab.id}
                                  type="button"
                                  role="tab"
                                  aria-selected={selected}
                                  onClick={() => setOrderScope(tab.id)}
                                  className={`relative py-2 px-3 rounded-lg text-xs font-semibold transition-colors min-h-[38px] inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                    selected
                                      ? 'text-[#F3EBDD]'
                                      : 'text-[#101210]/75 hover:text-[#101B17]'
                                  }`}
                                >
                                  {selected && (
                                    <motion.span
                                      layoutId="account-order-scope-pill"
                                      transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                                      className="absolute inset-0 bg-[#101B17] rounded-lg shadow-xs"
                                    />
                                  )}
                                  <span className="relative z-10">{tab.label}</span>
                                  <span
                                    className={`relative z-10 font-mono-tabular text-[11px] px-1.5 py-0.5 rounded ${
                                      selected
                                        ? 'bg-[#D7A65A] text-[#101210] font-bold'
                                        : 'bg-[#101B17]/10 text-[#101B17]'
                                    }`}
                                  >
                                    {tab.count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="relative">
                            <Search className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="search"
                              value={orderSearch}
                              onChange={(e) => setOrderSearch(e.target.value)}
                              placeholder={t.history.searchPlaceholder}
                              aria-label={t.history.searchPlaceholder}
                              className="w-full ps-9 pe-9 py-2 text-xs sm:text-sm rounded-xl bg-[#F3EBDD]/60 border border-[#101B17]/15 text-[#101210] placeholder:text-[#5B564E]/75 focus:outline-none focus:border-[#101B17] focus:bg-white focus:ring-2 focus:ring-[#101B17]/12 min-h-[40px]"
                            />
                            {orderSearch && (
                              <button
                                type="button"
                                onClick={() => setOrderSearch('')}
                                aria-label={t.history.clearSearchBtn}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[#5B564E] hover:text-[#101210] hover:bg-[#101B17]/8 absolute end-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#5B564E]">{t.history.liveStatusHint}</p>

                        {filteredCustomerOrders.length === 0 ? (
                          <div className="py-10 text-center space-y-3 bg-white rounded-2xl border border-[#101B17]/12 p-6">
                            <div className="w-11 h-11 mx-auto rounded-full bg-[#E7DFD0] flex items-center justify-center text-[#101B17]">
                              <Search className="w-5 h-5" />
                            </div>
                            {orderSearch.trim() ? (
                              <>
                                <p className="text-sm font-semibold text-[#101210]">
                                  {t.history.noSearchResults.replace('{query}', orderSearch.trim())}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setOrderSearch('')}
                                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#101B17]/20 text-xs font-semibold text-[#101B17] hover:bg-[#F3EBDD] transition-colors min-h-[40px] cursor-pointer"
                                >
                                  {t.history.clearSearchBtn}
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="font-display text-base font-bold text-[#101210]">
                                  {t.history.noActiveTitle}
                                </p>
                                <p className="text-xs text-[#5B564E] max-w-xs mx-auto">
                                  {t.history.noActiveBody}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setOrderScope('all')}
                                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#101B17] text-[#F3EBDD] text-xs font-semibold hover:bg-[#1D2922] transition-colors min-h-[40px] cursor-pointer"
                                >
                                  {t.history.viewAllOrdersBtn}
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          filteredCustomerOrders.map((order, orderIndex) => {
                            const statusMeta = getStatusMeta(order.status, t.history.statuses);
                            const StatusIcon = statusMeta.Icon;
                            const typeMeta = formatOrderType(order.orderType);
                            const stepIndex = PROGRESS_STEPS.indexOf(order.status);
                            const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
                            const formattedDate = formatFirestoreDate(order.createdAt);
                            const isExpanded = expandedOrderId === order.id;
                            const whatsappUrl = localWhatsappByOrderId.get(order.id);
                            const orderPts = getOrderLoyaltyPoints(order.total, order.status);
                            const stepRatio =
                              stepIndex >= 0 ? (stepIndex + 1) / PROGRESS_STEPS.length : 0;

                            return (
                              <motion.article
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.22,
                                  delay: Math.min(orderIndex * 0.04, 0.2),
                                  ease: EASE_OUT_EXPO,
                                }}
                                className="bg-white rounded-2xl border border-[#101B17]/12 p-4 space-y-3.5"
                              >
                                {/* Card Header: Reference + Unboxed Status */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-mono-tabular text-sm sm:text-base font-bold text-[#101210]">
                                        {order.orderRef}
                                      </h3>
                                    </div>
                                    <p className="text-xs text-[#5B564E] mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                      <span>{typeMeta.label}</span>
                                      {order.tableNumber && (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span>
                                            {t.history.tableLabel} {order.tableNumber}
                                          </span>
                                        </>
                                      )}
                                      <span aria-hidden="true">·</span>
                                      <span className="font-mono-tabular">
                                        {totalQty} {t.history.itemsLabel}
                                      </span>
                                      {order.status === 'cancelled' ? (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span className="text-red-700/80 font-medium">
                                            {t.account.loyalty.cancelledFromOrder}
                                          </span>
                                        </>
                                      ) : orderPts > 0 ? (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span
                                            className={`font-semibold font-mono-tabular ${
                                              order.status === 'completed'
                                                ? 'text-[#101B17]'
                                                : 'text-amber-800'
                                            }`}
                                          >
                                            {(order.status === 'completed'
                                              ? t.account.loyalty.earnedFromOrder
                                              : t.account.loyalty.pendingFromOrder
                                            ).replace('{pts}', String(orderPts))}
                                          </span>
                                        </>
                                      ) : null}
                                      {formattedDate && (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span className="font-mono-tabular">{formattedDate}</span>
                                        </>
                                      )}
                                    </p>
                                  </div>

                                  <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${statusMeta.textClass}`}
                                  >
                                    <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="whitespace-nowrap">{statusMeta.label}</span>
                                  </span>
                                </div>

                                {/* Clean Animated Progress Bar */}
                                {order.status !== 'cancelled' && stepIndex >= 0 && (
                                  <div
                                    className="h-1.5 w-full rounded-full bg-[#E7DFD0] overflow-hidden"
                                    aria-label={statusMeta.label}
                                  >
                                    <motion.div
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: stepRatio }}
                                      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                                      style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                                      className="h-full w-full rounded-full bg-[#101B17]"
                                    />
                                  </div>
                                )}

                                {/* Items List separated by hairline dividers */}
                                <div className="divide-y divide-[#101B17]/8 border-t border-b border-[#101B17]/8">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={`${item.productId}-${idx}`}
                                      className="py-2.5 text-xs space-y-0.5"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <span className="font-medium text-[#101210]">
                                          <span className="font-mono-tabular font-semibold text-[#101B17]">
                                            {item.quantity}x
                                          </span>{' '}
                                          {item.name}
                                          {item.variantLabel ? ` (${item.variantLabel})` : ''}
                                        </span>
                                        <span className="font-mono-tabular font-semibold text-[#101210] shrink-0">
                                          {settings.currency}
                                          {item.lineTotal}
                                        </span>
                                      </div>
                                      {item.selectedSides && item.selectedSides.length > 0 && (
                                        <p className="text-[11px] text-[#5B564E]">
                                          {t.cart.sidesLabel}: {item.selectedSides.join(', ')}
                                        </p>
                                      )}
                                      {item.customisations && item.customisations.length > 0 && (
                                        <p className="text-[11px] text-[#5B564E]">
                                          {item.customisations.map((c) => c.optionName).join(', ')}
                                        </p>
                                      )}
                                      {item.specialInstructions && (
                                        <p className="text-[11px] italic text-[#5B564E]">
                                          {t.cart.noteLabel}: {item.specialInstructions}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Expandable Complete Order Receipt */}
                                <AnimatePresence initial={false}>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                                      className="space-y-3 text-xs pt-1"
                                    >
                                      <p className="font-semibold text-[#101210]">
                                        {t.account.orderDetailsTitle}
                                      </p>

                                      <div className="space-y-1 text-[#101210]">
                                        <p className="text-[11px] font-medium text-[#5B564E]">
                                          {t.account.deliveryDetailsLabel}
                                        </p>
                                        <p>
                                          <span className="font-medium">{order.customerName}</span>
                                          <span aria-hidden="true" className="mx-1.5 text-[#101B17]/35">
                                            ·
                                          </span>
                                          <span className="font-mono-tabular">{order.customerPhone}</span>
                                        </p>
                                        {order.deliveryAddress && (
                                          <p className="text-[#5B564E]">{order.deliveryAddress}</p>
                                        )}
                                        {order.notes && (
                                          <p className="text-[#5B564E] italic">
                                            {t.account.customerNoteLabel}: {order.notes}
                                          </p>
                                        )}
                                      </div>

                                      {order.staffNote && (
                                        <div className="p-3 rounded-xl bg-[#E7DFD0] text-[#101B17]">
                                          <p className="font-semibold text-[11px]">
                                            {t.account.kitchenNoteLabel}
                                          </p>
                                          <p className="mt-0.5">{order.staffNote}</p>
                                        </div>
                                      )}

                                      <div className="space-y-1 text-[#5B564E] pt-2 border-t border-[#101B17]/8">
                                        <div className="flex justify-between">
                                          <span>{t.checkout.subtotal}</span>
                                          <span className="font-mono-tabular">
                                            {settings.currency}
                                            {order.subtotal}
                                          </span>
                                        </div>
                                        {order.deliveryFee > 0 && (
                                          <div className="flex justify-between">
                                            <span>{t.checkout.deliveryCharge}</span>
                                            <span className="font-mono-tabular">
                                              {settings.currency}
                                              {order.deliveryFee}
                                            </span>
                                          </div>
                                        )}
                                        {order.serviceCharge > 0 && (
                                          <div className="flex justify-between">
                                            <span>{t.checkout.serviceCharge}</span>
                                            <span className="font-mono-tabular">
                                              {settings.currency}
                                              {order.serviceCharge}
                                            </span>
                                          </div>
                                        )}
                                        {order.taxAmount > 0 && (
                                          <div className="flex justify-between">
                                            <span>{t.checkout.tax}</span>
                                            <span className="font-mono-tabular">
                                              {settings.currency}
                                              {order.taxAmount}
                                            </span>
                                          </div>
                                        )}
                                        {order.discountAmount > 0 && (
                                          <div className="flex justify-between text-[#101B17] font-medium">
                                            <span>
                                              {t.checkout.discount}
                                              {order.promoCode ? ` (${order.promoCode})` : ''}
                                            </span>
                                            <span className="font-mono-tabular">
                                              -{settings.currency}
                                              {order.discountAmount}
                                            </span>
                                          </div>
                                        )}
                                        {order.redeemedPoints && order.redeemedPoints > 0 && (
                                          <div className="flex justify-between text-[#8C5B2E] font-medium">
                                            <span>
                                              {t.account.loyalty.redeemedOnOrder.replace(
                                                '{pts}',
                                                String(order.redeemedPoints)
                                              )}
                                            </span>
                                            <span className="font-mono-tabular">
                                              -{settings.currency}
                                              {order.loyaltyDiscountAmount ||
                                                Number((order.redeemedPoints / 10).toFixed(2))}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Footer: Total + Read-Only Actions */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                  <div>
                                    <span className="text-[11px] text-[#5B564E] block">
                                      {t.checkout.total}
                                    </span>
                                    <span className="font-display text-lg font-bold text-[#101B17] font-mono-tabular">
                                      {settings.currency}
                                      {order.total}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedOrderId((prev) =>
                                          prev === order.id ? null : order.id
                                        )
                                      }
                                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#101B17]/15 text-xs font-semibold text-[#101210] hover:border-[#101B17] hover:bg-[#F3EBDD]/60 transition-colors min-h-[40px] whitespace-nowrap cursor-pointer"
                                    >
                                      <span>
                                        {isExpanded
                                          ? t.account.hideDetailsBtn
                                          : t.account.viewDetailsBtn}
                                      </span>
                                      {isExpanded ? (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      ) : (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      )}
                                    </button>

                                    {whatsappUrl &&
                                      order.status === 'awaiting_whatsapp_confirmation' && (
                                        <a
                                          href={whatsappUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#101B17]/20 text-xs font-semibold text-[#101B17] hover:bg-[#E7DFD0] min-h-[40px] whitespace-nowrap"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5" />
                                          <span>{t.history.reopenWhatsapp}</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}

                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() => handleReorder(order)}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101B17] text-[#F3EBDD] text-xs font-semibold hover:bg-[#1D2922] transition-colors min-h-[40px] whitespace-nowrap cursor-pointer"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 text-[#D7A65A]" />
                                      <span>{t.history.reorderBtn}</span>
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.article>
                            );
                          })
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-profile"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                    className="space-y-6"
                  >
                    {/* Unified Signature Membership Card */}
                    <motion.section
                      initial={{ opacity: 0, y: 12, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                      aria-label={t.account.loyalty.balanceLabel}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1D2922] via-[#101B17] to-[#101210] text-[#F3EBDD] p-5 sm:p-6 shadow-[0_18px_40px_-20px_rgba(16,18,16,0.65)] border border-[#D7A65A]/30"
                    >
                      {/* Architectural circular crest linework */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 180 180"
                        className="pointer-events-none absolute -end-8 -top-10 w-44 h-44 text-[#D7A65A] opacity-[0.08]"
                        fill="none"
                      >
                        <circle cx="90" cy="90" r="82" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="90" cy="90" r="58" stroke="currentColor" strokeWidth="1" />
                        <circle cx="90" cy="90" r="34" stroke="currentColor" strokeWidth="1" />
                      </svg>

                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium text-[#A9A79F]">
                            {t.account.loyalty.balanceLabel}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D7A65A]">
                            <Award className="w-3.5 h-3.5" />
                            <span>{t.account.loyalty.tiers[loyalty.tier]}</span>
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-4 flex-wrap">
                          <div className="flex items-baseline gap-1.5">
                            <motion.span
                              key={loyalty.points}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                              className="font-display text-4xl font-bold tracking-tight text-white font-mono-tabular"
                            >
                              {loyalty.points.toLocaleString()}
                            </motion.span>
                            <span className="text-sm font-medium text-[#D7A65A]">
                              {t.account.loyalty.pointsUnit}
                            </span>
                          </div>

                          <div className="text-xs text-[#A9A79F] font-mono-tabular flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                            <span>
                              {t.account.loyalty.welcomeBonusLabel}:{' '}
                              <span className="text-white font-semibold">
                                {loyalty.welcomePoints}
                              </span>
                            </span>
                            <span aria-hidden="true" className="text-white/25">
                              ·
                            </span>
                            <span>
                              {t.account.loyalty.completedLabel}:{' '}
                              <span className="text-white font-semibold">
                                {loyalty.completedPoints}
                              </span>
                            </span>
                            {loyalty.bonusPoints > 0 && (
                              <>
                                <span aria-hidden="true" className="text-white/25">
                                  ·
                                </span>
                                <span>
                                  {t.account.loyalty.adminBonusLabel}:{' '}
                                  <span className="text-[#D7A65A] font-semibold">
                                    +{loyalty.bonusPoints}
                                  </span>
                                </span>
                              </>
                            )}
                            {loyalty.redeemedPoints > 0 && (
                              <>
                                <span aria-hidden="true" className="text-white/25">
                                  ·
                                </span>
                                <span>
                                  {t.account.loyalty.redeemedLabel}:{' '}
                                  <span className="text-white font-semibold">
                                    -{loyalty.redeemedPoints}
                                  </span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: progressRatio }}
                              transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT_EXPO }}
                              style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                              className="h-full w-full rounded-full bg-[#D7A65A]"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[11px] text-[#A9A79F]">
                            <span>
                              {loyalty.nextTier
                                ? t.account.loyalty.pointsToNextTier
                                    .replace('{pts}', String(loyalty.pointsToNextTier))
                                    .replace('{tier}', t.account.loyalty.tiers[loyalty.nextTier])
                                : t.account.loyalty.maxTierReached}
                            </span>
                            {loyalty.pendingPoints > 0 ? (
                              <span className="text-end font-semibold text-[#D7A65A] font-mono-tabular">
                                {t.account.loyalty.inProgressLabel}: +{loyalty.pendingPoints.toLocaleString()}{' '}
                                {t.account.loyalty.pointsUnit}
                              </span>
                            ) : (
                              <span className="text-end">{t.account.loyalty.earnRateHint}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#A9A79F]/85 leading-relaxed pt-1 border-t border-white/10">
                            {loyalty.pendingPoints > 0
                              ? t.account.loyalty.pendingNote
                              : t.account.loyalty.earnRateHint}
                          </p>
                        </div>
                      </div>
                    </motion.section>

                    {/* Clean Unboxed Order Totals Strip */}
                    <div className="grid grid-cols-2 divide-x rtl:divide-x-reverse divide-[#101B17]/15 py-1">
                      <div className="pe-4">
                        <p className="text-xs text-[#5B564E]">{t.account.totalOrdersStat}</p>
                        <p className="font-display text-2xl font-bold text-[#101210] font-mono-tabular mt-0.5">
                          {customerOrders.length}
                        </p>
                      </div>
                      <div className="ps-5">
                        <p className="text-xs text-[#5B564E]">{t.account.totalSpentStat}</p>
                        <p className="font-display text-2xl font-bold text-[#101210] font-mono-tabular mt-0.5">
                          {settings.currency}
                          {totalSpent.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {(!customerProfile?.phone || !customerProfile?.defaultAddress) && (
                      <div className="px-4 py-3 rounded-xl bg-[#E7DFD0] border border-[#101B17]/12 text-[#101210] text-xs flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#101B17] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{t.account.completeProfileBanner}</span>
                      </div>
                    )}

                    {profileError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{profileError}</span>
                      </div>
                    )}

                    {/* Clean Single-Elevation Profile Form */}
                    <form
                      onSubmit={handleSaveProfile}
                      className="bg-white rounded-2xl border border-[#101B17]/12 p-5 space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label
                          htmlFor="prof-name"
                          className="block text-xs font-medium text-[#5B564E]"
                        >
                          {t.account.fullName} *
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-[#5B564E]/80 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="prof-name"
                            type="text"
                            required
                            maxLength={120}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder={t.account.fullNamePlaceholder}
                            className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-[#F3EBDD]/35 text-sm text-[#101210] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101B17]/25 focus:border-[#101B17] transition-all min-h-[46px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="prof-phone"
                          className="block text-xs font-medium text-[#5B564E]"
                        >
                          {t.account.phone}
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#5B564E]/80 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="prof-phone"
                            type="tel"
                            maxLength={24}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.account.phonePlaceholder}
                            className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-[#F3EBDD]/35 text-sm text-[#101210] font-mono-tabular focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101B17]/25 focus:border-[#101B17] transition-all min-h-[46px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="block text-xs font-medium text-[#5B564E]">
                          {t.account.preferredOrderType}
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#E7DFD0] border border-[#101B17]/10">
                          {(
                            [
                              { id: 'dine_in', label: t.checkout.dineIn, Icon: Utensils },
                              { id: 'takeaway', label: t.checkout.takeaway, Icon: ShoppingBag },
                              { id: 'delivery', label: t.checkout.delivery, Icon: MapPin },
                            ] as const
                          ).map(({ id, label, Icon }) => {
                            const active = preferredOrderType === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setPreferredOrderType(id)}
                                className={`relative py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[42px] whitespace-nowrap cursor-pointer ${
                                  active ? 'text-[#F3EBDD]' : 'text-[#101210]/75 hover:text-[#101B17]'
                                }`}
                              >
                                {active && (
                                  <motion.span
                                    layoutId="profile-preferred-order-pill"
                                    transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                                    className="absolute inset-0 bg-[#101B17] rounded-lg shadow-xs"
                                  />
                                )}
                                <Icon
                                  className={`w-3.5 h-3.5 relative z-10 shrink-0 ${
                                    active ? 'text-[#D7A65A]' : 'text-[#101B17]'
                                  }`}
                                />
                                <span className="relative z-10">{label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="prof-address"
                          className="block text-xs font-medium text-[#5B564E]"
                        >
                          {t.account.defaultAddress}
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-[#5B564E]/80 absolute start-3.5 top-3.5 pointer-events-none" />
                          <textarea
                            id="prof-address"
                            rows={2}
                            maxLength={400}
                            value={defaultAddress}
                            onChange={(e) => setDefaultAddress(e.target.value)}
                            placeholder={t.account.defaultAddressPlaceholder}
                            className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-[#F3EBDD]/35 text-sm text-[#101210] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101B17]/25 focus:border-[#101B17] transition-all"
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.985 }}
                        disabled={savingProfile}
                        className="w-full py-3 px-6 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-sm hover:bg-[#1D2922] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 min-h-[48px] shadow-sm cursor-pointer"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#D7A65A]" />
                            <span>{t.account.savingProfile}</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 text-[#D7A65A]" />
                            <span>{t.account.saveProfileBtn}</span>
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
