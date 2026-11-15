import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Plus, SlidersHorizontal } from 'lucide-react';
import baristaBarImg from '../../assets/images/zestro_barista_bar_1794604643784.jpg';
import { useStore } from '../../context/StoreContext';
import { getLocalized } from '../../i18n/translations';
import type { Product } from '../../types';
import { SafeImage } from '../SafeImage';

interface BeverageSectionProps {
  onSelectCategoryAndScroll: (categoryId: string) => void;
  onOpenProduct: (product: Product) => void;
}

const FEATURED_BEVERAGE_IDS = [
  'frappe-mocha',
  'iced-spanish-latte',
  'mojito-virgin',
  'hot-cappuccino',
  'shake-nutella',
  'bubble-mango',
];

export const BeverageSection: React.FC<BeverageSectionProps> = ({
  onSelectCategoryAndScroll,
  onOpenProduct,
}) => {
  const { language, t, isRtl, categories, products, catalogLoading, addToCart, settings } = useStore();
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const beverageCategories = useMemo(
    () =>
      categories
        .filter((c) => c.active && c.type === 'beverage' && c.id !== 'add-syrup')
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  const featuredBeverages = useMemo(() => {
    const picked: Product[] = [];
    const seen = new Set<string>();
    const catSet = new Set(beverageCategories.map((c) => c.id));

    for (const p of products) {
      if (picked.length >= 6) break;
      if (catSet.has(p.categoryId) && p.available && !p.soldOut && (p.featured || p.popular) && !seen.has(p.id)) {
        seen.add(p.id);
        picked.push(p);
      }
    }
    for (const id of FEATURED_BEVERAGE_IDS) {
      if (picked.length >= 6) break;
      const found = products.find((p) => p.id === id && p.available && !p.soldOut && !seen.has(p.id));
      if (found) {
        seen.add(found.id);
        picked.push(found);
      }
    }
    if (picked.length < 6) {
      for (const p of products) {
        if (picked.length >= 6) break;
        if (catSet.has(p.categoryId) && p.available && !p.soldOut && !seen.has(p.id)) {
          seen.add(p.id);
          picked.push(p);
        }
      }
    }
    return picked;
  }, [products, beverageCategories]);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  // Early return must stay below every hook call: returning before a hook changes the
  // hook count between renders (loading -> loaded) and crashes React (minified error #300).
  if (!catalogLoading && beverageCategories.length === 0 && featuredBeverages.length === 0) {
    return null;
  }

  const formatPrice = (product: Product) => {
    if (product.variants && product.variants.length > 1) {
      const min = Math.min(...product.variants.map((v) => v.price));
      return `${t.menu.fromPrice} ${settings.currency}${min}`;
    }
    if (product.variants && product.variants.length === 1) {
      return `${settings.currency}${product.variants[0].price}`;
    }
    return `${settings.currency}${product.price}`;
  };

  const handleQuickOrder = (product: Product) => {
    const requiresModal =
      Boolean(product.variants?.length) ||
      Boolean(product.customisationGroupIds?.length);
    if (requiresModal) {
      onOpenProduct(product);
      return;
    }
    addToCart({
      productId: product.id,
      productName: product.name,
      image: product.image,
      unitPrice: product.price,
      quantity: 1,
      customisations: [],
    });
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
    }, 1100);
  };

  return (
    <section
      id="beverages"
      className="scroll-mt-20 py-16 sm:py-24 bg-[#101B17] text-[#F3EBDD] border-y border-[#D7A65A]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Atmospheric Barista Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6 relative"
          >
            <div className="rounded-3xl overflow-hidden border border-[#D7A65A]/25 shadow-2xl bg-[#1D2922] aspect-[4/3] group">
              <SafeImage
                src={baristaBarImg}
                alt="Zestro specialty iced caramel latte and strawberry citrus mocktail at the espresso bar"
                darkFallback
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#D7A65A]">
                <span aria-hidden="true" className="w-7 h-px bg-[#D7A65A]" />
                <span>{t.sections.beverageEyebrow}</span>
              </div>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-[#FFFFFF] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {t.sections.beverageTitle}
              </h2>
              <p className="text-base text-[#A9A79F] leading-relaxed">
                {t.sections.beverageSub}
              </p>
            </div>

            {/* Interactive Beverage Category Navigator */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {beverageCategories.map((cat, idx) => (
                <motion.button
                  key={cat.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.24, delay: idx * 0.03 }}
                  onClick={() => onSelectCategoryAndScroll(cat.id)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#1D2922] border border-white/10 hover:border-[#D7A65A] text-start transition-colors flex items-center justify-between gap-2 min-h-[44px] group cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-medium text-[#F3EBDD] truncate">
                    {getLocalized(cat.name, language)}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 text-[#D7A65A] shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      isRtl ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            <div className="pt-1">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectCategoryAndScroll(beverageCategories[0]?.id || 'frappe')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D7A65A] text-[#101210] text-xs sm:text-sm font-bold hover:bg-[#C49245] transition-colors min-h-[46px] cursor-pointer"
              >
                <span>{t.sections.exploreBeverages}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Highlighted Live Beverages */}
        {featuredBeverages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredBeverages.map((drink, idx) => {
              const cat = categoryMap.get(drink.categoryId);
              const justAdded = recentlyAddedId === drink.id;
              return (
                <motion.article
                  key={drink.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="bg-[#1D2922] rounded-2xl border border-white/10 p-4 flex items-center gap-4 hover:border-[#D7A65A]/50 transition-all group"
                >
                  <button
                    type="button"
                    onClick={() => onOpenProduct(drink)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-[#101210] shrink-0 cursor-pointer"
                  >
                    <SafeImage
                      src={drink.image}
                      alt={getLocalized(drink.name, language)}
                      fallbackLabel={getLocalized(drink.name, language)}
                      darkFallback
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[#A9A79F] truncate">
                        {cat ? getLocalized(cat.name, language) : ''}
                      </p>
                      <h3 className="font-display text-base font-bold text-[#F3EBDD] truncate">
                        <button
                          type="button"
                          onClick={() => onOpenProduct(drink)}
                          className="text-start hover:text-[#D7A65A] transition-colors cursor-pointer"
                        >
                          {getLocalized(drink.name, language)}
                        </button>
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-tabular text-sm font-bold text-[#D7A65A]">
                        {formatPrice(drink)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onOpenProduct(drink)}
                          aria-label={`${t.menu.viewDetails} ${getLocalized(drink.name, language)}`}
                          className="p-2 rounded-lg text-[#F3EBDD] bg-[#101B17] hover:bg-black/40 border border-white/10 transition-colors cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-[#D7A65A]" />
                        </motion.button>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleQuickOrder(drink)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] cursor-pointer ${
                            justAdded
                              ? 'bg-[#D7A65A] text-[#101210]'
                              : 'bg-[#F3EBDD] text-[#101210] hover:bg-white'
                          }`}
                        >
                          {justAdded ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          <span>{t.menu.quickAdd}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
