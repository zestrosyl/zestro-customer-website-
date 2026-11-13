import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChefHat,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  PackageCheck,
  Receipt,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  UserPlus,
  Utensils,
  X,
  XCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getLocalized } from '../../i18n/translations';
import type { LocalOrderHistoryEntry, Order, OrderStatus, OrderType } from '../../types';

interface OrderHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onReorderSuccess: () => void;
  onOpenAuth?: () => void;
}

const PROGRESS_STEPS: OrderStatus[] = [
  'awaiting_whatsapp_confirmation',
  'confirmed',
  'preparing',
  'ready',
  'completed',
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface DisplayOrderLineItem {
  key: string;
  name: string;
  quantity: number;
  lineTotal: number;
  selectedSides?: string[];
  customisationsText?: string;
  specialInstructions?: string;
}

interface UnifiedOrderRecord {
  id: string;
  orderRef: string;
  orderType: OrderType;
  tableNumber?: string;
  status: OrderStatus;
  total: number;
  redeemedPoints?: number;
  loyaltyDiscountAmount?: number;
  staffNote?: string;
  whatsappUrl?: string;
  createdAtMs: number;
  formattedDate: string;
  totalQty: number;
  items: DisplayOrderLineItem[];
  sourceLocalEntry?: LocalOrderHistoryEntry;
  sourceCloudOrder?: Order;
}

function toTimestampMs(val: unknown): number {
  if (!val) return 0;
  if (
    typeof val === 'object' &&
    val !== null &&
    'toMillis' in val &&
    typeof (val as { toMillis: () => number }).toMillis === 'function'
  ) {
    return (val as { toMillis: () => number }).toMillis();
  }
  if (
    typeof val === 'object' &&
    val !== null &&
    'seconds' in val &&
    typeof (val as { seconds: number }).seconds === 'number'
  ) {
    return (val as { seconds: number }).seconds * 1000;
  }
  if (typeof val === 'string' || typeof val === 'number') {
    const parsed = new Date(val).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatDateMs(ms: number): string {
  if (!ms) return '';
  return new Date(ms).toLocaleString([], {
    month: 'short',
    day: 'numeric',
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
        Icon: Sparkles,
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

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  open,
  onClose,
  onReorderSuccess,
  onOpenAuth,
}) => {
  const {
    language,
    t,
    isRtl,
    settings,
    products,
    orderHistory,
    reorderFromHistory,
    reorderFromFirestoreOrder,
    customerUser,
    customerOrders,
  } = useStore();

  const [orderScope, setOrderScope] = useState<'all' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const slideOffset = isRtl ? '-100%' : '100%';

  const formatOrderType = (type: OrderType) => {
    if (type === 'dine_in') return { label: t.checkout.dineIn, Icon: Utensils };
    if (type === 'delivery') return { label: t.checkout.delivery, Icon: MapPin };
    return { label: t.checkout.takeaway, Icon: ShoppingBag };
  };

  // Merge live Firestore customerOrders (when signed in) with local browser orderHistory
  const unifiedOrders = useMemo<UnifiedOrderRecord[]>(() => {
    const localById = new Map<string, LocalOrderHistoryEntry>();
    for (const entry of orderHistory) {
      localById.set(entry.orderId, entry);
    }

    const byId = new Map<string, UnifiedOrderRecord>();

    if (customerUser) {
      for (const ord of customerOrders) {
        const localMatch = localById.get(ord.id);
        const createdAtMs =
          toTimestampMs(ord.createdAt) || (localMatch ? toTimestampMs(localMatch.createdAt) : 0);
        const lineItems: DisplayOrderLineItem[] = ord.items.map((item, idx) => {
          const matchedProd = products.find((p) => p.id === item.productId);
          const baseName = matchedProd ? getLocalized(matchedProd.name, language) : item.name;
          const fullName = item.variantLabel ? `${baseName} (${item.variantLabel})` : baseName;
          return {
            key: `${item.productId}-${idx}`,
            name: fullName,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            selectedSides: item.selectedSides,
            customisationsText:
              item.customisations && item.customisations.length > 0
                ? item.customisations.map((c) => c.optionName).join(', ')
                : undefined,
            specialInstructions: item.specialInstructions,
          };
        });

        byId.set(ord.id, {
          id: ord.id,
          orderRef: ord.orderRef,
          orderType: ord.orderType,
          tableNumber: ord.tableNumber,
          status: ord.status,
          total: ord.total,
          redeemedPoints: ord.redeemedPoints,
          loyaltyDiscountAmount: ord.loyaltyDiscountAmount,
          staffNote: ord.staffNote,
          whatsappUrl: localMatch?.whatsappUrl,
          createdAtMs,
          formattedDate: formatDateMs(createdAtMs),
          totalQty: ord.items.reduce((sum, i) => sum + i.quantity, 0),
          items: lineItems,
          sourceCloudOrder: ord,
          sourceLocalEntry: localMatch,
        });
      }
    }

    for (const entry of orderHistory) {
      if (byId.has(entry.orderId)) continue;
      const createdAtMs = toTimestampMs(entry.createdAt);
      const lineItems: DisplayOrderLineItem[] = entry.items.map((item, idx) => {
        const extrasSum = item.customisations.reduce((s, c) => s + c.price, 0);
        const lineTotal = (item.unitPrice + extrasSum) * item.quantity;
        const prodName = getLocalized(item.productName, language);
        const variantStr = item.variantLabel
          ? ` (${getLocalized(item.variantLabel, language)})`
          : '';
        return {
          key: `${item.cartItemId}-${idx}`,
          name: `${prodName}${variantStr}`,
          quantity: item.quantity,
          lineTotal,
          selectedSides: item.selectedSides,
          customisationsText:
            item.customisations.length > 0
              ? item.customisations.map((c) => c.optionName).join(', ')
              : undefined,
          specialInstructions: item.specialInstructions,
        };
      });

      byId.set(entry.orderId, {
        id: entry.orderId,
        orderRef: entry.orderRef,
        orderType: entry.orderType,
        tableNumber: entry.tableNumber,
        status: entry.status,
        total: entry.total,
        redeemedPoints: entry.redeemedPoints,
        loyaltyDiscountAmount: entry.loyaltyDiscountAmount,
        whatsappUrl: entry.whatsappUrl,
        createdAtMs,
        formattedDate: formatDateMs(createdAtMs),
        totalQty: entry.items.reduce((sum, i) => sum + i.quantity, 0),
        items: lineItems,
        sourceLocalEntry: entry,
      });
    }

    return Array.from(byId.values()).sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [customerOrders, customerUser, language, orderHistory, products]);

  const activeOrdersCount = useMemo(
    () => unifiedOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length,
    [unifiedOrders]
  );

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return unifiedOrders.filter((ord) => {
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
      const matchesItems = ord.items.some((i) => i.name.toLowerCase().includes(q));
      return matchesRef || matchesTable || matchesStatus || matchesType || matchesItems;
    });
  }, [
    orderScope,
    searchQuery,
    t.checkout.delivery,
    t.checkout.dineIn,
    t.checkout.takeaway,
    t.history.statuses,
    t.history.tableLabel,
    unifiedOrders,
  ]);

  const handleReorder = (ord: UnifiedOrderRecord) => {
    const ok = ord.sourceCloudOrder
      ? reorderFromFirestoreOrder(ord.sourceCloudOrder)
      : ord.sourceLocalEntry
      ? reorderFromHistory(ord.sourceLocalEntry)
      : false;
    if (ok) {
      onReorderSuccess();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={t.history.title}
        >
          <div className="fixed inset-0" onClick={onClose} />
          <motion.aside
            initial={{ x: slideOffset }}
            animate={{ x: 0 }}
            exit={{ x: slideOffset }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
            className="relative z-10 w-full max-w-lg bg-[#F3EBDD] h-full flex flex-col border-s border-[#101B17]/15 shadow-2xl"
          >
            {/* Dark Luxury Header (Read-only — no customer delete or edit controls) */}
            <div className="px-5 py-4 bg-[#101B17] text-[#F3EBDD] border-b border-[#D7A65A]/20 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Receipt className="w-5 h-5 text-[#D7A65A] shrink-0" />
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold text-white truncate">
                    {t.history.title}
                  </h2>
                  <p className="text-[11px] text-[#A9A79F] truncate">
                    {t.history.liveStatusHint}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#F3EBDD] hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            {unifiedOrders.length > 0 && (
              <div className="px-5 py-3.5 bg-white border-b border-[#101B17]/10 space-y-2.5 shrink-0">
                <div
                  className="grid grid-cols-2 p-1 rounded-xl bg-[#E7DFD0] border border-[#101B17]/10"
                  role="tablist"
                  aria-label={t.history.title}
                >
                  {(
                    [
                      {
                        id: 'all',
                        label: t.history.allOrdersTab,
                        count: unifiedOrders.length,
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
                            layoutId="history-order-scope-pill"
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.history.searchPlaceholder}
                    aria-label={t.history.searchPlaceholder}
                    className="w-full ps-9 pe-9 py-2 text-xs sm:text-sm rounded-xl bg-[#F3EBDD]/60 border border-[#101B17]/15 text-[#101210] placeholder:text-[#5B564E]/75 focus:outline-none focus:border-[#101B17] focus:bg-white focus:ring-2 focus:ring-[#101B17]/12 min-h-[40px]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={t.history.clearSearchBtn}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[#5B564E] hover:text-[#101210] hover:bg-[#101B17]/8 absolute end-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!customerUser && onOpenAuth && (
                <div className="px-3.5 py-3 rounded-xl bg-white border border-[#101B17]/14 text-xs text-[#5B564E] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserPlus className="w-4 h-4 text-[#101B17] shrink-0" />
                    <span className="truncate">{t.account.guestCheckoutAccountHint}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="shrink-0 font-bold text-[#101B17] hover:text-[#D7A65A] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.account.signUpBtn}
                  </button>
                </div>
              )}

              {unifiedOrders.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E7DFD0] flex items-center justify-center text-[#101B17]">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <p className="font-display text-lg font-bold text-[#101210]">
                      {t.history.emptyTitle}
                    </p>
                    <p className="text-sm text-[#5B564E] leading-relaxed">
                      {t.history.emptyBody}
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="#menu"
                      onClick={onClose}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#101B17] text-[#F3EBDD] text-sm font-semibold hover:bg-[#1D2922] transition-colors min-h-[44px]"
                    >
                      {t.history.browseMenu}
                    </a>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-[#101B17]/12 p-6">
                  <div className="w-11 h-11 mx-auto rounded-full bg-[#E7DFD0] flex items-center justify-center text-[#101B17]">
                    <Search className="w-5 h-5" />
                  </div>
                  {searchQuery.trim() ? (
                    <>
                      <p className="text-sm font-semibold text-[#101210]">
                        {t.history.noSearchResults.replace('{query}', searchQuery.trim())}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
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
                <>
                  <p className="text-xs text-[#5B564E]">{t.history.subtitle}</p>
                  {filteredOrders.map((ord, idx) => {
                    const statusMeta = getStatusMeta(ord.status, t.history.statuses);
                    const StatusIcon = statusMeta.Icon;
                    const typeMeta = formatOrderType(ord.orderType);
                    const TypeIcon = typeMeta.Icon;
                    const stepIndex = PROGRESS_STEPS.indexOf(ord.status);
                    const stepRatio =
                      stepIndex >= 0 ? (stepIndex + 1) / PROGRESS_STEPS.length : 0;

                    return (
                      <motion.article
                        key={ord.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: Math.min(idx * 0.035, 0.16),
                          ease: EASE_OUT_EXPO,
                        }}
                        className="bg-white rounded-2xl border border-[#101B17]/12 p-4 space-y-3.5 shadow-xs"
                      >
                        {/* Top row: Ref, Inline Type & Date, Unboxed Status */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono-tabular text-sm font-bold text-[#101210]">
                                {ord.orderRef}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5B564E] mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                              <span className="inline-flex items-center gap-1 font-medium text-[#101B17]">
                                <TypeIcon className="w-3 h-3 text-[#D7A65A]" />
                                <span>{typeMeta.label}</span>
                              </span>
                              {ord.tableNumber && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>
                                    {t.history.tableLabel} {ord.tableNumber}
                                  </span>
                                </>
                              )}
                              {ord.formattedDate && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono-tabular">{ord.formattedDate}</span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-tabular">
                                {ord.totalQty} {t.history.itemsLabel}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${statusMeta.textClass}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="whitespace-nowrap">{statusMeta.label}</span>
                          </span>
                        </div>

                        {/* Live Progress Bar */}
                        {ord.status !== 'cancelled' && stepIndex >= 0 && (
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

                        {/* Live Kitchen Note */}
                        {ord.staffNote && (
                          <div className="px-3 py-2 rounded-xl bg-[#E7DFD0] text-xs text-[#101B17]">
                            <span className="font-semibold">{t.account.kitchenNoteLabel}: </span>
                            <span>{ord.staffNote}</span>
                          </div>
                        )}

                        {/* Items List */}
                        <div className="divide-y divide-[#101B17]/8 border-t border-b border-[#101B17]/8">
                          {ord.items.map((item) => (
                            <div key={item.key} className="py-2 text-xs space-y-0.5">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-[#101210]">
                                  <span className="font-mono-tabular text-[#101B17]">
                                    {item.quantity}x
                                  </span>{' '}
                                  {item.name}
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
                              {item.customisationsText && (
                                <p className="text-[11px] text-[#5B564E]">
                                  {item.customisationsText}
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

                        {/* Total & Read-only Reorder / WhatsApp Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div>
                            <span className="text-[11px] text-[#5B564E] block">
                              {t.checkout.total}
                            </span>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-mono-tabular text-base font-bold text-[#101B17]">
                                {settings.currency}
                                {ord.total}
                              </span>
                              {ord.redeemedPoints && ord.redeemedPoints > 0 && (
                                <span className="text-[11px] font-medium text-[#8C5B2E] font-mono-tabular">
                                  ({t.account.loyalty.redeemedOnOrder.replace(
                                    '{pts}',
                                    String(ord.redeemedPoints)
                                  )}
                                  )
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {ord.whatsappUrl &&
                              ord.status === 'awaiting_whatsapp_confirmation' && (
                                <a
                                  href={ord.whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#101B17]/20 text-xs font-semibold text-[#101B17] hover:bg-[#E7DFD0] min-h-[40px] whitespace-nowrap"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>{t.history.reopenWhatsapp}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}

                            <button
                              type="button"
                              onClick={() => handleReorder(ord)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101B17] text-[#F3EBDD] text-xs font-semibold hover:bg-[#1D2922] transition-colors min-h-[40px] whitespace-nowrap cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#D7A65A]" />
                              <span>{t.history.reorderBtn}</span>
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
