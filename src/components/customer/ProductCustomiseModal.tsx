import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MEAL_SIDES_OPTIONS } from '../../data/initialMenu';
import { getLocalized } from '../../i18n/translations';
import type { Product, SelectedCustomisation } from '../../types';
import { SafeImage } from '../SafeImage';

interface ProductCustomiseModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderNowRedirect: () => void;
}

export const ProductCustomiseModal: React.FC<ProductCustomiseModalProps> = ({
  product,
  onClose,
  onOrderNowRedirect,
}) => {
  const { language, t, customisationGroups, addToCart, settings } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [selectedSideIds, setSelectedSideIds] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSelectedVariantId(product.variants?.[0]?.id || '');
    setSelectedOptions({});
    setSelectedSideIds([]);
    setInstructions('');
    setQuantity(1);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  const linkedGroups = useMemo(() => {
    if (!product?.customisationGroupIds?.length) return [];
    return product.customisationGroupIds
      .map((gid) => customisationGroups.find((g) => g.id === gid))
      .filter((g): g is NonNullable<typeof g> => Boolean(g));
  }, [product, customisationGroups]);

  const activeVariant = useMemo(() => {
    if (!product?.variants?.length) return undefined;
    return product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  }, [product, selectedVariantId]);

  const selectedCustomisationList: SelectedCustomisation[] = useMemo(() => {
    const out: SelectedCustomisation[] = [];
    for (const grp of linkedGroups) {
      const picked = selectedOptions[grp.id] || [];
      for (const optId of picked) {
        const opt = grp.options.find((o) => o.id === optId);
        if (opt) {
          out.push({
            groupId: grp.id,
            groupName: getLocalized(grp.name, language),
            optionId: opt.id,
            optionName: getLocalized(opt.name, language),
            price: opt.price,
          });
        }
      }
    }
    return out;
  }, [linkedGroups, selectedOptions, language]);

  if (!product) return null;

  const basePrice = activeVariant ? activeVariant.price : product.price;
  const extrasTotal = selectedCustomisationList.reduce((sum, c) => sum + c.price, 0);
  const unitTotal = basePrice + extrasTotal;
  const grandLineTotal = unitTotal * quantity;

  const isUnavailable = !product.available || Boolean(product.soldOut);
  const mealSidesMissing = Boolean(product.mealSideRule) && selectedSideIds.length !== 2;
  const requiredGroupMissing = linkedGroups.some(
    (grp) => grp.required && (selectedOptions[grp.id] || []).length === 0
  );
  const cannotAdd = isUnavailable || mealSidesMissing || requiredGroupMissing;

  const toggleOption = (groupId: string, optionId: string, type: 'single' | 'multiple', maxSelect = 10) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      if (type === 'single') {
        return { ...prev, [groupId]: current.includes(optionId) ? [] : [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      if (current.length >= maxSelect) {
        return prev;
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  const toggleSide = (sideId: string) => {
    setSelectedSideIds((prev) => {
      if (prev.includes(sideId)) return prev.filter((s) => s !== sideId);
      if (prev.length >= 2) return [prev[1], sideId];
      return [...prev, sideId];
    });
  };

  const handleConfirm = (openCheckoutImmediately: boolean) => {
    if (cannotAdd) return;

    const sideNames = selectedSideIds
      .map((sid) => MEAL_SIDES_OPTIONS.find((s) => s.id === sid))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => getLocalized(s.name, language));

    addToCart({
      productId: product.id,
      productName: product.name,
      image: product.image,
      variantId: activeVariant?.id,
      variantLabel: activeVariant?.label,
      unitPrice: basePrice,
      quantity,
      customisations: selectedCustomisationList,
      selectedSides: sideNames.length > 0 ? sideNames : undefined,
      specialInstructions: instructions.trim() || undefined,
    });

    onClose();
    if (openCheckoutImmediately) {
      onOrderNowRedirect();
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customiser-title"
      >
        <div className="fixed inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full sm:max-w-2xl bg-[#F3EBDD] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#101B17]/15 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header with Image */}
          <div className="relative h-52 sm:h-60 bg-[#101B17] shrink-0">
            <SafeImage
              src={product.image}
              alt={getLocalized(product.name, language)}
              fallbackLabel={getLocalized(product.name, language)}
              darkFallback
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101210]/90 via-[#101210]/30 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3.5 end-3.5 w-10 h-10 rounded-full bg-[#101B17]/90 text-[#F3EBDD] border border-white/15 flex items-center justify-center hover:bg-[#101210] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 start-5 end-5 text-[#F3EBDD]">
              <h2 id="customiser-title" className="font-display text-2xl font-bold leading-tight text-white">
                {getLocalized(product.name, language)}
              </h2>
              <p className="text-sm text-[#F3EBDD]/85 mt-1 line-clamp-2">
                {getLocalized(product.description, language)}
              </p>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#101210]">
                    {t.customiser.selectVariant}
                  </h3>
                  <span className="text-xs font-semibold text-[#101B17]">
                    {t.customiser.required}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((variant) => {
                    const active = activeVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`px-3.5 py-3 rounded-xl border text-start transition-colors flex items-center justify-between gap-2 min-h-[44px] cursor-pointer ${
                          active
                            ? 'bg-[#101B17] text-[#F3EBDD] border-[#101B17]'
                            : 'bg-white text-[#101210] border-[#101B17]/15 hover:border-[#101B17]'
                        }`}
                      >
                        <span className="text-sm font-semibold">
                          {getLocalized(variant.label, language)}
                        </span>
                        <span className={`text-sm font-mono-tabular font-bold ${active ? 'text-[#D7A65A]' : 'text-[#101B17]'}`}>
                          {settings.currency}{variant.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Meal Sides Rule (Any 2 Sides) */}
            {product.mealSideRule && (
              <div className="space-y-3 pt-4 border-t border-[#101B17]/10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#101210]">
                      {t.customiser.selectMealSides}
                    </h3>
                    <p className="text-xs text-[#5B564E]">{t.customiser.mealSidesHint}</p>
                  </div>
                  <span
                    className={`text-xs font-mono-tabular font-bold ${
                      selectedSideIds.length === 2 ? 'text-[#101B17]' : 'text-[#B45309]'
                    }`}
                  >
                    {selectedSideIds.length}/2
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEAL_SIDES_OPTIONS.map((side) => {
                    const picked = selectedSideIds.includes(side.id);
                    return (
                      <button
                        key={side.id}
                        type="button"
                        onClick={() => toggleSide(side.id)}
                        className={`px-3.5 py-3 rounded-xl border text-start flex items-center justify-between gap-2 transition-colors min-h-[44px] cursor-pointer ${
                          picked
                            ? 'bg-[#101B17] text-[#F3EBDD] border-[#101B17]'
                            : 'bg-white text-[#101210] border-[#101B17]/15 hover:border-[#101B17]'
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {getLocalized(side.name, language)}
                        </span>
                        <span className="text-xs opacity-85 flex items-center gap-1">
                          {picked && <Check className="w-4 h-4 text-[#D7A65A]" />}
                          <span>{t.customiser.free}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Linked Customisation Groups */}
            {linkedGroups.map((group) => {
              const selectedIds = selectedOptions[group.id] || [];
              return (
                <div key={group.id} className="space-y-3 pt-4 border-t border-[#101B17]/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#101210]">
                      {getLocalized(group.name, language)}
                    </h3>
                    <span className="text-xs text-[#5B564E]">
                      {group.required ? t.customiser.required : t.customiser.optional}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {group.options.map((opt) => {
                      const active = selectedIds.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            toggleOption(group.id, opt.id, group.selectionType, group.maxSelect)
                          }
                          className={`px-3.5 py-2.5 rounded-xl border text-start flex items-center justify-between gap-2 transition-colors min-h-[44px] cursor-pointer ${
                            active
                              ? 'bg-[#101B17] border-[#101B17] text-[#F3EBDD]'
                              : 'bg-white border-[#101B17]/15 text-[#101210] hover:border-[#101B17]/50'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                active
                                  ? 'bg-[#D7A65A] border-[#D7A65A] text-[#101210]'
                                  : 'border-[#5B564E]/40'
                              }`}
                            >
                              {active && <Check className="w-3 h-3" />}
                            </span>
                            <span>{getLocalized(opt.name, language)}</span>
                          </span>
                          {opt.price > 0 && (
                            <span className={`text-xs font-mono-tabular font-semibold ${active ? 'text-[#D7A65A]' : 'text-[#101B17]'}`}>
                              +{settings.currency}{opt.price}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special Instructions */}
            <div className="space-y-2 pt-4 border-t border-[#101B17]/10">
              <label htmlFor="item-instructions" className="block text-sm font-bold text-[#101210]">
                {t.customiser.specialInstructions}
              </label>
              <textarea
                id="item-instructions"
                rows={2}
                maxLength={200}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={t.customiser.instructionsPlaceholder}
                className="w-full rounded-xl border border-[#101B17]/20 bg-white px-3.5 py-2.5 text-sm text-[#101210] focus:outline-none focus:ring-2 focus:ring-[#101B17]"
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="bg-white border-t border-[#101B17]/12 p-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-[#E7DFD0] rounded-xl p-1 border border-[#101B17]/10">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-[#101B17] hover:bg-white cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-7 text-center font-mono-tabular font-bold text-sm text-[#101210]">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(30, q + 1))}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-[#101B17] hover:bg-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end flex-wrap">
              {isUnavailable ? (
                <span className="px-4 py-2.5 rounded-xl bg-red-100 text-red-800 font-semibold text-xs sm:text-sm">
                  {t.menu.soldOut}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={cannotAdd}
                    onClick={() => handleConfirm(false)}
                    className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[#101B17] text-[#101B17] font-semibold text-xs sm:text-sm hover:bg-[#E7DFD0] disabled:opacity-40 disabled:cursor-not-allowed min-h-[42px] whitespace-nowrap cursor-pointer"
                  >
                    {t.customiser.addToCart}
                  </button>
                  <button
                    type="button"
                    disabled={cannotAdd}
                    onClick={() => handleConfirm(true)}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-xs sm:text-sm hover:bg-[#1D2922] disabled:opacity-40 disabled:cursor-not-allowed min-h-[42px] whitespace-nowrap flex items-center gap-2 cursor-pointer"
                  >
                    <span>{t.customiser.orderNow}</span>
                    <span className="font-mono-tabular text-[#D7A65A]">
                      {settings.currency}{grandLineTotal}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
