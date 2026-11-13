import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, Receipt, RotateCcw, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getLocalized } from '../../i18n/translations';
import { SafeImage } from '../SafeImage';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onProceedCheckout: () => void;
  onOpenHistory: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  onProceedCheckout,
  onOpenHistory,
}) => {
  const {
    language,
    t,
    isRtl,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQty,
    removeFromCart,
    clearCart,
    lastOrderCart,
    repeatLastOrder,
    orderHistory,
    settings,
  } = useStore();

  const slideOffset = isRtl ? '-100%' : '100%';

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={t.cart.title}
        >
          <div className="fixed inset-0" onClick={onClose} />
          <motion.aside
            initial={{ x: slideOffset }}
            animate={{ x: 0 }}
            exit={{ x: slideOffset }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md bg-[#F3EBDD] h-full flex flex-col border-s border-[#101B17]/15 shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#101B17] text-[#F3EBDD] border-b border-[#D7A65A]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#D7A65A]" />
                <h2 className="font-display text-lg font-bold text-white">
                  {t.cart.title}
                </h2>
                <span className="font-mono-tabular text-xs font-semibold text-[#D7A65A]">
                  ({cartCount})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-medium text-[#A9A79F] hover:text-red-300 px-2 py-1 cursor-pointer"
                  >
                    {t.cart.clearCart}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#F3EBDD] hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E7DFD0] flex items-center justify-center text-[#101B17]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display text-lg font-bold text-[#101210]">
                      {t.cart.emptyTitle}
                    </p>
                    <p className="text-sm text-[#5B564E]">{t.cart.emptyBody}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-center pt-2">
                    <a
                      href="#menu"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-[#101B17] text-[#F3EBDD] text-sm font-semibold hover:bg-[#1D2922] transition-colors"
                    >
                      {t.cart.browseMenu}
                    </a>
                    {lastOrderCart.length > 0 && (
                      <button
                        type="button"
                        onClick={repeatLastOrder}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#101B17]/20 text-xs font-semibold text-[#101B17] hover:bg-white cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{t.cart.repeatLastOrder}</span>
                      </button>
                    )}
                    {orderHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenHistory();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#101B17] hover:bg-white cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>
                          {t.history.title} ({orderHistory.length})
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {lastOrderCart.length > 0 && (
                    <button
                      type="button"
                      onClick={repeatLastOrder}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#101B17]/15 bg-white text-xs font-semibold text-[#101B17] hover:bg-[#E7DFD0] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.cart.repeatLastOrder}</span>
                    </button>
                  )}

                  <AnimatePresence initial={false}>
                    {cart.map((item) => {
                      const extrasSum = item.customisations.reduce((s, c) => s + c.price, 0);
                      const lineTotal = (item.unitPrice + extrasSum) * item.quantity;

                      return (
                        <motion.div
                          key={item.cartItemId}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.94 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white rounded-2xl border border-[#101B17]/10 p-3.5 flex gap-3.5"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#E7DFD0] shrink-0">
                            <SafeImage
                              src={item.image}
                              alt={getLocalized(item.productName, language)}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold text-[#101210] leading-snug">
                                {getLocalized(item.productName, language)}
                              </h3>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.cartItemId)}
                                aria-label="Remove item"
                                className="text-[#5B564E] hover:text-red-700 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {item.variantLabel && (
                              <p className="text-xs text-[#101B17] font-medium">
                                {getLocalized(item.variantLabel, language)}
                              </p>
                            )}

                            {item.selectedSides && item.selectedSides.length > 0 && (
                              <p className="text-xs text-[#5B564E]">
                                {t.cart.sidesLabel}: {item.selectedSides.join(', ')}
                              </p>
                            )}

                            {item.customisations.length > 0 && (
                              <p className="text-xs text-[#5B564E]">
                                {item.customisations
                                  .map((c) =>
                                    c.price > 0
                                      ? `${c.optionName} (+${settings.currency}${c.price})`
                                      : c.optionName
                                  )
                                  .join(', ')}
                              </p>
                            )}

                            {item.specialInstructions && (
                              <p className="text-xs italic text-[#5B564E]">
                                {t.cart.noteLabel}: {item.specialInstructions}
                              </p>
                            )}

                            <div className="pt-2 flex items-center justify-between">
                              <div className="inline-flex items-center bg-[#E7DFD0] rounded-lg p-0.5">
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.86 }}
                                  onClick={() => updateCartQty(item.cartItemId, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center text-[#101B17] hover:bg-white rounded cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </motion.button>
                                <motion.span
                                  key={item.quantity}
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  className="w-7 text-center font-mono-tabular text-xs font-bold text-[#101210]"
                                >
                                  {item.quantity}
                                </motion.span>
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.86 }}
                                  onClick={() => updateCartQty(item.cartItemId, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center text-[#101B17] hover:bg-white rounded cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>

                              <span className="font-mono-tabular text-sm font-bold text-[#101B17]">
                                {settings.currency}{lineTotal}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-[#101B17]/10 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5B564E] font-medium">{t.cart.subtotal}</span>
                  <span className="font-mono-tabular text-lg font-bold text-[#101210]">
                    {settings.currency}{cartSubtotal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onProceedCheckout}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-sm hover:bg-[#1D2922] transition-colors flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  <span>{t.cart.proceedCheckout}</span>
                  <ArrowRight className={`w-4 h-4 text-[#D7A65A] ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
