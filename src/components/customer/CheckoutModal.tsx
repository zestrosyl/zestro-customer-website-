import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ExternalLink,
  MapPin,
  MessageCircle,
  QrCode,
  ShoppingBag,
  UserCheck,
  UserPlus,
  Utensils,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { API_BASE } from '../../services/liveApi';
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  openWhatsappHandoff,
} from '../../services/whatsappService';
import type { OrderType } from '../../types';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  onOpenQrScanner?: () => void;
}

function isValidCustomerPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (/^(\+?880|0)1[3-9]\d{8}$/.test(cleaned)) return true;
  return /^\+?[1-9]\d{7,14}$/.test(cleaned);
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  onOpenAuth,
  onOpenQrScanner,
}) => {
  const {
    t,
    cart,
    cartSubtotal,
    clearCart,
    saveLastOrderCart,
    addOrderHistoryEntry,
    detectedTableId,
    detectedTableNumber,
    detectedTableName,
    clearDetectedTable,
    promotions,
    settings,
    customerUser,
    customerProfile,
    loyalty,
  } = useStore();

  const [orderType, setOrderType] = useState<OrderType>(
    detectedTableNumber ? 'dine_in' : 'takeaway'
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [manualTableNumber, setManualTableNumber] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [redeemPointsInput, setRedeemPointsInput] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [completedState, setCompletedState] = useState<{
    orderRef: string;
    whatsappUrl: string;
    saveWarning?: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    if (detectedTableNumber) {
      setOrderType('dine_in');
    }
    if (customerUser || customerProfile) {
      const profileName = customerProfile?.displayName || customerUser?.displayName || '';
      const profilePhone = customerProfile?.phone || '';
      const profileAddr = customerProfile?.defaultAddress || '';
      setCustomerName((prev) => (prev.trim() ? prev : profileName));
      setCustomerPhone((prev) => (prev.trim() ? prev : profilePhone));
      setDeliveryAddress((prev) => (prev.trim() ? prev : profileAddr));
      if (!detectedTableNumber && customerProfile?.preferredOrderType) {
        setOrderType(customerProfile.preferredOrderType);
      }
    }
  }, [open, customerUser, customerProfile, detectedTableNumber]);

  useEffect(() => {
    if (!open || cartSubtotal < 399) {
      setRedeemPointsInput('');
    }
  }, [open, cartSubtotal]);

  const activePromo = useMemo(() => {
    if (!appliedPromoCode) return undefined;
    return promotions.find(
      (p) =>
        p.active &&
        p.code &&
        p.code.trim().toUpperCase() === appliedPromoCode.trim().toUpperCase()
    );
  }, [promotions, appliedPromoCode]);

  const deliveryFee = orderType === 'delivery' ? Number(settings.deliveryFee) || 0 : 0;

  let promoDiscountAmount = 0;
  if (activePromo && cartSubtotal >= (Number(activePromo.minOrderAmount) || 0)) {
    const subtotalMinor = Math.round(cartSubtotal * 100);
    const discountMinor =
      activePromo.discountType === 'percent'
        ? Math.round((subtotalMinor * Number(activePromo.discountValue)) / 100)
        : Math.min(subtotalMinor, Math.round(Number(activePromo.discountValue) * 100));
    promoDiscountAmount = Number((discountMinor / 100).toFixed(2));
  }

  const discountedSubtotalMinor = Math.max(
    0,
    Math.round(cartSubtotal * 100) - Math.round(promoDiscountAmount * 100)
  );
  const serviceCharge =
    orderType === 'dine_in' && settings.serviceChargePercent > 0
      ? Number((Math.round((discountedSubtotalMinor * settings.serviceChargePercent) / 100) / 100).toFixed(2))
      : 0;
  const taxAmount =
    settings.taxPercent > 0
      ? Number((Math.round((discountedSubtotalMinor * settings.taxPercent) / 100) / 100).toFixed(2))
      : 0;

  const preLoyaltyTotal = Math.max(
    0,
    Number((cartSubtotal - promoDiscountAmount + deliveryFee + serviceCharge + taxAmount).toFixed(2))
  );

  // Loyalty redemption rules: Min order ৳399, Max 80% of available points, 10 points = ৳1
  const MIN_REDEEM_ORDER = 399;
  const maxRedeemablePoints = Math.floor(Math.max(0, loyalty.points) * 0.8);
  const maxPointsForBill = Math.floor(preLoyaltyTotal * 10);
  const trimmedRedeem = redeemPointsInput.trim();
  const parsedRedeemNumber = trimmedRedeem === '' ? 0 : Number(trimmedRedeem);
  const isRedeemMeetsMinOrder = cartSubtotal >= MIN_REDEEM_ORDER;

  let redeemValidationError: string | null = null;
  let validRedeemedPoints = 0;

  if (trimmedRedeem !== '' && customerUser) {
    if (!Number.isFinite(parsedRedeemNumber) || parsedRedeemNumber < 0 || !Number.isInteger(parsedRedeemNumber)) {
      redeemValidationError = t.checkout.redeem.invalidNumberError;
    } else if (parsedRedeemNumber > 0) {
      if (!isRedeemMeetsMinOrder) {
        redeemValidationError = t.checkout.redeem.minOrderError;
      } else if (parsedRedeemNumber > maxRedeemablePoints) {
        redeemValidationError = t.checkout.redeem.exceededError.replace(
          '{max}',
          String(maxRedeemablePoints)
        );
      } else if (parsedRedeemNumber > maxPointsForBill) {
        redeemValidationError = t.checkout.redeem.billLimitError.replace(
          '{max}',
          String(maxPointsForBill)
        );
      } else {
        validRedeemedPoints = parsedRedeemNumber;
      }
    }
  }

  const loyaltyDiscountAmount =
    validRedeemedPoints > 0 ? Number((validRedeemedPoints / 10).toFixed(2)) : 0;
  const estimatedTotal = Math.max(
    0,
    Number((preLoyaltyTotal - loyaltyDiscountAmount).toFixed(2))
  );

  if (!open) return null;

  const handleApplyPromo = () => {
    const clean = promoCodeInput.trim().toUpperCase();
    if (!clean) {
      setAppliedPromoCode('');
      return;
    }
    const found = promotions.find(
      (p) => p.active && p.code && p.code.trim().toUpperCase() === clean
    );
    if (!found) {
      setErrorMsg('Invalid or inactive promo code.');
      return;
    }
    setErrorMsg(null);
    setAppliedPromoCode(clean);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg(null);

    if (!settings.acceptingOrders) {
      setErrorMsg(t.checkout.notAccepting);
      return;
    }
    if (orderType === 'dine_in' && settings.qrTableOrderingEnabled === false) {
      setErrorMsg('Dine-in table ordering is currently disabled by the restaurant.');
      return;
    }
    if (orderType !== 'dine_in' && settings.onlineOrderingEnabled === false) {
      setErrorMsg('Online takeaway and delivery ordering is currently paused.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMsg(t.checkout.errors.nameRequired);
      return;
    }
    if (!isValidCustomerPhone(customerPhone)) {
      setErrorMsg(t.checkout.errors.phoneInvalid);
      return;
    }
    if (orderType === 'dine_in' && !detectedTableNumber && !manualTableNumber.trim()) {
      setErrorMsg('Please scan your table QR code or enter your dining table number.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg(t.checkout.errors.addressRequired);
      return;
    }
    if (
      orderType === 'delivery' &&
      settings.minOrderAmount > 0 &&
      cartSubtotal < settings.minOrderAmount
    ) {
      setErrorMsg(
        `${t.checkout.errors.minOrderNotMet} ${settings.currency}${settings.minOrderAmount}`
      );
      return;
    }
    if (redeemValidationError) {
      setErrorMsg(redeemValidationError);
      return;
    }

    setSubmitting(true);
    try {
      const effectiveTableNumber =
        orderType === 'dine_in'
          ? detectedTableNumber || manualTableNumber.trim() || undefined
          : undefined;
      const effectiveTableId =
        orderType === 'dine_in' && detectedTableId ? detectedTableId : undefined;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      const prepRes = await fetch(`${API_BASE}/api/orders/prepare`, {
        method: 'POST',
        headers: { ...headers, 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({
          orderType,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          tableId: effectiveTableId,
          tableNumber: effectiveTableNumber,
          promoCode: appliedPromoCode,
          redeemPoints: validRedeemedPoints,
          notes: orderNotes.trim(),
          items: cart.map((ci) => ({
            productId: ci.productId,
            variantId: ci.variantId,
            quantity: ci.quantity,
            selectedSides: ci.selectedSides,
            specialInstructions: ci.specialInstructions,
            customisations: ci.customisations.map((c) => ({
              groupId: c.groupId,
              optionId: c.optionId,
            })),
          })),
        }),
      });

      const prepData = await prepRes.json();
      if (!prepRes.ok) {
        setErrorMsg(prepData.error || 'Unable to verify order.');
        setSubmitting(false);
        return;
      }

      const whatsappMessage = buildWhatsappMessage({
        orderRef: prepData.orderRef,
        orderType: prepData.orderType,
        customerName: prepData.customerName,
        customerPhone: prepData.customerPhone,
        deliveryAddress: prepData.deliveryAddress,
        tableNumber: prepData.tableNumber,
        notes: orderNotes.trim() || undefined,
        items: prepData.items,
        subtotal: prepData.subtotal,
        deliveryFee: prepData.deliveryFee,
        serviceCharge: prepData.serviceCharge,
        taxAmount: prepData.taxAmount,
        discountAmount: prepData.discountAmount,
        redeemedPoints: prepData.redeemedPoints,
        loyaltyDiscountAmount: prepData.loyaltyDiscountAmount,
        total: prepData.total,
      });

      const whatsappUrl = buildWhatsappUrl(prepData.whatsappNumber, whatsappMessage);

      const createdOrderId = prepData.orderId || `ord_local_${Date.now()}`;

      addOrderHistoryEntry({
        orderId: createdOrderId,
        orderRef: prepData.orderRef,
        orderType: prepData.orderType,
        ...(prepData.tableNumber ? { tableNumber: prepData.tableNumber } : {}),
        createdAt: new Date().toISOString(),
        items: cart,
        subtotal: prepData.subtotal,
        ...(prepData.redeemedPoints ? { redeemedPoints: prepData.redeemedPoints } : {}),
        ...(prepData.loyaltyDiscountAmount
          ? { loyaltyDiscountAmount: prepData.loyaltyDiscountAmount }
          : {}),
        total: prepData.total,
        status: 'awaiting_whatsapp_confirmation',
        whatsappUrl,
      });

      saveLastOrderCart(cart);
      clearCart();
      setRedeemPointsInput('');
      openWhatsappHandoff(whatsappUrl);
      setCompletedState({
        orderRef: prepData.orderRef,
        whatsappUrl,
      });
    } catch {
      setErrorMsg('Network error preparing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setCompletedState(null);
    setRedeemPointsInput('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <div className="fixed inset-0" onClick={handleDone} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full sm:max-w-xl bg-[#F3EBDD] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#101B17]/15 max-h-[92vh] flex flex-col overflow-hidden"
        >
          <div className="px-6 py-4 bg-[#101B17] text-[#F3EBDD] border-b border-[#D7A65A]/20 flex items-center justify-between">
            <h2 id="checkout-title" className="font-display text-xl font-bold text-white">
              {completedState ? t.checkout.whatsappReadyTitle : t.checkout.title}
            </h2>
            <button
              type="button"
              onClick={handleDone}
              aria-label="Close"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#F3EBDD] hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {completedState ? (
            <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#101B17] text-[#D7A65A] flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono-tabular uppercase tracking-wider text-[#5B564E]">
                  {t.checkout.orderRefLabel}:{' '}
                  <strong className="text-[#101B17]">{completedState.orderRef}</strong>
                </p>
                <p className="text-base font-medium text-[#101210] leading-relaxed">
                  {t.checkout.whatsappReadyBody}
                </p>
              </div>

              {completedState.saveWarning && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-start flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{completedState.saveWarning}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={completedState.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-sm hover:bg-[#1D2922] min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4 text-[#D7A65A]" />
                  <span>{t.checkout.openWhatsappAgain}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleDone}
                  className="px-6 py-3.5 rounded-xl border border-[#101B17]/20 text-[#101210] font-semibold text-sm hover:bg-white min-h-[48px] cursor-pointer"
                >
                  {t.checkout.doneBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {!settings.acceptingOrders && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                  {t.checkout.notAccepting}
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {customerUser ? (
                <div className="px-3.5 py-2.5 rounded-xl bg-[#101B17]/8 border border-[#101B17]/15 text-xs text-[#101B17] font-medium flex items-center gap-2">
                  <UserCheck className="w-4 h-4 shrink-0 text-[#101B17]" />
                  <span>{t.account.signedInCheckoutHint}</span>
                </div>
              ) : (
                onOpenAuth && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#101B17]/12 text-xs text-[#5B564E] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <UserPlus className="w-4 h-4 text-[#101B17] shrink-0" />
                      <span className="truncate">{t.account.guestCheckoutAccountHint}</span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="shrink-0 font-bold text-[#101B17] hover:underline whitespace-nowrap cursor-pointer"
                    >
                      {t.account.signInForProfileBtn}
                    </button>
                  </div>
                )
              )}

              {/* Order Type Selector */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-[#101210]">
                  {t.checkout.orderTypeLabel}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      {
                        id: 'dine_in',
                        title: t.checkout.dineIn,
                        desc: t.checkout.dineInDesc,
                        Icon: Utensils,
                      },
                      {
                        id: 'takeaway',
                        title: t.checkout.takeaway,
                        desc: t.checkout.takeawayDesc,
                        Icon: ShoppingBag,
                      },
                      {
                        id: 'delivery',
                        title: t.checkout.delivery,
                        desc: t.checkout.deliveryDesc,
                        Icon: MapPin,
                      },
                    ] as const
                  ).map(({ id, title, desc, Icon }) => {
                    const active = orderType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setOrderType(id)}
                        className={`p-3 rounded-xl border text-start transition-colors flex flex-col gap-1 min-h-[76px] cursor-pointer ${
                          active
                            ? 'bg-[#101B17] text-[#F3EBDD] border-[#101B17]'
                            : 'bg-white text-[#101210] border-[#101B17]/15 hover:border-[#101B17]'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${active ? 'text-[#D7A65A]' : 'text-[#101B17]'}`}
                        />
                        <span className="text-xs sm:text-sm font-bold">{title}</span>
                        <span className="text-[11px] opacity-80 leading-tight hidden sm:block">
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table Banner or QR Scan / Optional Table Field */}
              {orderType === 'dine_in' && (
                <div>
                  {detectedTableNumber ? (
                    <div className="px-4 py-3 rounded-xl bg-[#101B17]/8 border border-[#101B17]/20 text-sm text-[#101B17] flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold">
                          {detectedTableName || `${t.checkout.tableLabel} ${detectedTableNumber}`}
                        </p>
                        <p className="text-[11px] font-mono-tabular text-[#5B564E]">
                          {detectedTableId} · {t.qrScanner.autoAssignedBadge}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {onOpenQrScanner && (
                          <button
                            type="button"
                            onClick={onOpenQrScanner}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#101B17]/20 text-xs font-semibold text-[#101B17] hover:bg-[#E7DFD0] cursor-pointer min-h-[36px]"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{t.qrScanner.switchTableBtn}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={clearDetectedTable}
                          aria-label={t.qrScanner.clearTableBtn}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#5B564E] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label htmlFor="chk-table" className="block text-sm font-semibold text-[#101210]">
                        {t.checkout.tableLabel}{' '}
                        <span className="text-xs font-normal text-[#5B564E]">
                          ({t.checkout.tableOptional})
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="chk-table"
                          type="text"
                          maxLength={20}
                          value={manualTableNumber}
                          onChange={(e) => setManualTableNumber(e.target.value)}
                          placeholder="e.g. 05"
                          className="flex-1 rounded-xl border border-[#101B17]/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101B17]"
                        />
                        {onOpenQrScanner && (
                          <button
                            type="button"
                            onClick={onOpenQrScanner}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#101B17] text-[#F3EBDD] text-xs font-semibold hover:bg-[#1D2922] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[42px]"
                          >
                            <QrCode className="w-4 h-4 text-[#D7A65A]" />
                            <span>{t.qrScanner.scanTableBtn}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="chk-name" className="block text-sm font-semibold text-[#101210]">
                    {t.checkout.nameLabel} *
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    maxLength={120}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.checkout.namePlaceholder}
                    className="w-full rounded-xl border border-[#101B17]/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101B17]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="chk-phone" className="block text-sm font-semibold text-[#101210]">
                    {t.checkout.phoneLabel} *
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    required
                    maxLength={24}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.checkout.phonePlaceholder}
                    className="w-full rounded-xl border border-[#101B17]/20 bg-white px-3.5 py-2.5 text-sm font-mono-tabular focus:outline-none focus:ring-2 focus:ring-[#101B17]"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              {orderType === 'delivery' && (
                <div className="space-y-1.5">
                  <label htmlFor="chk-addr" className="block text-sm font-semibold text-[#101210]">
                    {t.checkout.addressLabel} *
                  </label>
                  <textarea
                    id="chk-addr"
                    rows={2}
                    required
                    maxLength={400}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={t.checkout.addressPlaceholder}
                    className="w-full rounded-xl border border-[#101B17]/20 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101B17]"
                  />
                </div>
              )}

              {/* Promo Code & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="chk-promo" className="block text-sm font-semibold text-[#101210]">
                    {t.checkout.promoLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="chk-promo"
                      type="text"
                      maxLength={32}
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder={t.checkout.promoPlaceholder}
                      className="flex-1 rounded-xl border border-[#101B17]/20 bg-white px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#101B17]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 rounded-xl bg-[#E7DFD0] border border-[#101B17]/15 text-xs font-semibold text-[#101B17] hover:bg-[#DDD2BF] cursor-pointer"
                    >
                      {t.checkout.applyPromo}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="chk-notes" className="block text-sm font-semibold text-[#101210]">
                    {t.checkout.notesLabel}
                  </label>
                  <input
                    id="chk-notes"
                    type="text"
                    maxLength={250}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={t.checkout.notesPlaceholder}
                    className="w-full rounded-xl border border-[#101B17]/20 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#101B17]"
                  />
                </div>
              </div>

              {/* Redeem Loyalty Points */}
              <div className="bg-white rounded-2xl border border-[#101B17]/12 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#D7A65A] shrink-0" />
                      <h3 className="text-sm font-bold text-[#101210]">
                        {t.checkout.redeem.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#5B564E]">{t.checkout.redeem.rateHint}</p>
                  </div>

                  {customerUser && (
                    <div className="text-end shrink-0">
                      <span className="text-[11px] text-[#5B564E] block">
                        {t.checkout.redeem.availableLabel}
                      </span>
                      <span className="text-sm font-bold tabular-nums text-[#101B17]">
                        {loyalty.points.toLocaleString()} {t.account.loyalty.pointsUnit}
                      </span>
                    </div>
                  )}
                </div>

                {!customerUser ? (
                  <div className="flex items-center justify-between gap-3 pt-1 text-xs text-[#5B564E]">
                    <span>{t.checkout.redeem.signInHint}</span>
                    {onOpenAuth && (
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="shrink-0 font-bold text-[#101B17] hover:underline whitespace-nowrap cursor-pointer"
                      >
                        {t.account.signInForProfileBtn}
                      </button>
                    )}
                  </div>
                ) : !isRedeemMeetsMinOrder ? (
                  <div className="px-3 py-2.5 rounded-lg bg-[#F3EBDD] border border-[#D7A65A]/45 text-xs text-[#101210]">
                    {t.checkout.redeem.minOrderHint.replace(
                      '{amount}',
                      `${settings.currency}${MIN_REDEEM_ORDER - cartSubtotal}`
                    )}
                  </div>
                ) : maxRedeemablePoints <= 0 ? (
                  <p className="text-xs text-[#5B564E]">{t.checkout.redeem.noPointsHint}</p>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5B564E]">
                      <label htmlFor="chk-redeem-points" className="font-semibold text-[#101210]">
                        {t.checkout.redeem.inputLabel}
                      </label>
                      <span className="tabular-nums">
                        {t.checkout.redeem.maxCapLabel}:{' '}
                        <strong className="text-[#101B17]">
                          {maxRedeemablePoints.toLocaleString()} {t.account.loyalty.pointsUnit}
                        </strong>{' '}
                        ({settings.currency}
                        {Number((maxRedeemablePoints / 10).toFixed(2))})
                      </span>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                      <input
                        id="chk-redeem-points"
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        value={redeemPointsInput}
                        onChange={(e) => setRedeemPointsInput(e.target.value)}
                        placeholder={t.checkout.redeem.inputPlaceholder}
                        className={`flex-1 min-w-[140px] rounded-xl border px-3.5 py-2.5 text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 ${
                          redeemValidationError
                            ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400'
                            : 'border-[#101B17]/20 bg-[#F3EBDD]/40 text-[#101210] focus:ring-[#101B17]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setRedeemPointsInput(
                            String(Math.min(maxRedeemablePoints, maxPointsForBill))
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-[#E7DFD0] border border-[#101B17]/15 text-xs font-semibold text-[#101B17] hover:bg-[#DDD2BF] whitespace-nowrap cursor-pointer"
                      >
                        {t.checkout.redeem.maxBtn} ({Math.min(maxRedeemablePoints, maxPointsForBill)})
                      </button>
                      {trimmedRedeem !== '' && (
                        <button
                          type="button"
                          onClick={() => setRedeemPointsInput('')}
                          className="px-3 py-2 rounded-xl border border-[#101B17]/15 text-xs font-medium text-[#5B564E] hover:bg-[#F3EBDD] whitespace-nowrap cursor-pointer"
                        >
                          {t.checkout.redeem.clearBtn}
                        </button>
                      )}
                    </div>

                    {redeemValidationError ? (
                      <p className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{redeemValidationError}</span>
                      </p>
                    ) : validRedeemedPoints > 0 ? (
                      <p className="text-xs font-semibold text-[#101B17] flex items-center gap-1.5 tabular-nums">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#101B17]" />
                        <span>
                          {t.checkout.redeem.savingsPreview
                            .replace('{pts}', validRedeemedPoints.toLocaleString())
                            .replace('{amount}', `${settings.currency}${loyaltyDiscountAmount}`)}
                        </span>
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-[#101B17]/12 p-4 space-y-2 text-sm">
                <h3 className="font-bold text-[#101210] pb-1 border-b border-[#101B17]/10">
                  {t.checkout.summaryTitle}
                </h3>
                <div className="flex justify-between text-[#5B564E]">
                  <span>{t.checkout.subtotal}</span>
                  <span className="font-mono-tabular">
                    {settings.currency}{cartSubtotal}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#5B564E]">
                    <span>{t.checkout.deliveryCharge}</span>
                    <span className="font-mono-tabular">
                      {settings.currency}{deliveryFee}
                    </span>
                  </div>
                )}
                {serviceCharge > 0 && (
                  <div className="flex justify-between text-[#5B564E]">
                    <span>{t.checkout.serviceCharge}</span>
                    <span className="font-mono-tabular">
                      {settings.currency}{serviceCharge}
                    </span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between text-[#5B564E]">
                    <span>{t.checkout.tax}</span>
                    <span className="font-mono-tabular">
                      {settings.currency}{taxAmount}
                    </span>
                  </div>
                )}
                {promoDiscountAmount > 0 && (
                  <div className="flex justify-between text-[#101B17] font-medium">
                    <span>
                      {t.checkout.discount}
                      {appliedPromoCode ? ` (${appliedPromoCode})` : ''}
                    </span>
                    <span className="font-mono-tabular">
                      -{settings.currency}{promoDiscountAmount}
                    </span>
                  </div>
                )}
                {loyaltyDiscountAmount > 0 && (
                  <div className="flex justify-between text-[#101B17] font-medium">
                    <span>
                      {t.checkout.redeem.discountLine.replace(
                        '{pts}',
                        validRedeemedPoints.toLocaleString()
                      )}
                    </span>
                    <span className="font-mono-tabular">
                      -{settings.currency}{loyaltyDiscountAmount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-[#101210] pt-2 border-t border-[#101B17]/10">
                  <span>{t.checkout.total}</span>
                  <span className="font-mono-tabular text-[#101B17]">
                    {settings.currency}{estimatedTotal}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !settings.acceptingOrders ||
                  cart.length === 0 ||
                  Boolean(redeemValidationError)
                }
                className="w-full py-3.5 px-6 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-sm hover:bg-[#1D2922] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#D7A65A]" />
                <span>{submitting ? t.checkout.submitting : t.checkout.placeOrderBtn}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
