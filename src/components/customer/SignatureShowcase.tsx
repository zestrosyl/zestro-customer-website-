import React, { useMemo, useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowRight, Check, Plus, SlidersHorizontal } from 'lucide-react';
import chefPlatterImg from '../../assets/images/zestro_chef_platter_1794604642991.jpg';
import { useStore } from '../../context/StoreContext';
import { getLocalized } from '../../i18n/translations';
import type { Product } from '../../types';
import { SafeImage } from '../SafeImage';

interface SignatureShowcaseProps {
  onOpenProduct: (product: Product) => void;
  onSelectCategoryAndScroll: (categoryId: string) => void;
}

const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const slideUpItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const SIGNATURE_TARGETS: { preferredId: string; fallbackCategory: string }[] = [
  { preferredId: 'burger-zestro-special', fallbackCategory: 'burger' },
  { preferredId: 'pizza-zestro-special', fallbackCategory: 'pizza' },
  { preferredId: 'chicken-crispy', fallbackCategory: 'fried-chicken' },
  { preferredId: 'bowl-katsu-chicken', fallbackCategory: 'rice-bowl' },
  { preferredId: 'meal-tandoori', fallbackCategory: 'meals' },
  { preferredId: 'sandwich-italian-sub', fallbackCategory: 'sandwiches' },
  { preferredId: 'pasta-oven-baked', fallbackCategory: 'pasta' },
];

export const SignatureShowcase: React.FC<SignatureShowcaseProps> = ({
  onOpenProduct,
  onSelectCategoryAndScroll,
}) => {
  const {
    language,
    t,
    isRtl,
    products,
    categories,
    catalogLoading,
    addToCart,
    settings,
  } = useStore();
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const signatureItems = useMemo(() => {
    const picked: Product[] = [];
    const seen = new Set<string>();

    const availableFood = products.filter((p) => {
      if (!p.available || p.soldOut) return false;
      const cat = categoryMap.get(p.categoryId);
      return !cat || cat.type !== 'beverage';
    });

    // 1. Prioritize live Admin-curated featured and popular dishes
    for (const item of availableFood) {
      if (picked.length >= 7) break;
      if ((item.featured || item.popular) && !seen.has(item.id)) {
        seen.add(item.id);
        picked.push(item);
      }
    }

    // 2. Match known signature IDs or category slugs if present
    for (const target of SIGNATURE_TARGETS) {
      if (picked.length >= 7) break;
      const match =
        availableFood.find(
          (p) => p.id === target.preferredId && !seen.has(p.id)
        ) ||
        availableFood.find(
          (p) => p.categoryId === target.fallbackCategory && !seen.has(p.id)
        );
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        picked.push(match);
      }
    }

    // 3. Fill remaining showcase slots with live available food dishes (one per category first)
    const usedCats = new Set(picked.map((p) => p.categoryId));
    for (const item of availableFood) {
      if (picked.length >= 7) break;
      if (!seen.has(item.id) && !usedCats.has(item.categoryId)) {
        seen.add(item.id);
        usedCats.add(item.categoryId);
        picked.push(item);
      }
    }
    for (const item of availableFood) {
      if (picked.length >= 7) break;
      if (!seen.has(item.id)) {
        seen.add(item.id);
        picked.push(item);
      }
    }

    return picked;
  }, [products, categoryMap]);

  if (!catalogLoading && signatureItems.length === 0) return null;

  const [leadItem, ...restItems] = signatureItems;

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

  const handleOrderNow = (product: Product) => {
    const needsCustomiser =
      Boolean(product.variants?.length) ||
      Boolean(product.mealSideRule) ||
      Boolean(product.customisationGroupIds?.length);
    if (needsCustomiser) {
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
      id="signature"
      className="scroll-mt-20 py-16 sm:py-24 bg-[#F3EBDD] border-b border-[#101B17]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Section Header */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <motion.div
              variants={slideUpItemVariants}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#101B17]"
            >
              <span aria-hidden="true" className="w-7 h-px bg-[#D7A65A]" />
              <span>{t.sections.signatureEyebrow}</span>
            </motion.div>
            <motion.h2
              variants={slideUpItemVariants}
              className="font-display text-3xl sm:text-4xl font-bold text-[#101210] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {t.sections.signatureTitle}
            </motion.h2>
            <motion.p
              variants={slideUpItemVariants}
              className="text-sm sm:text-base text-[#5B564E] leading-relaxed"
            >
              {t.sections.signatureSub}
            </motion.p>
          </div>

          <motion.button
            type="button"
            variants={slideUpItemVariants}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectCategoryAndScroll('all')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#101B17]/15 text-sm font-semibold text-[#101B17] hover:border-[#101B17] transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>{t.hero.exploreMenu}</span>
            <ArrowRight className={`w-4 h-4 text-[#D7A65A] ${isRtl ? 'rotate-180' : ''}`} />
          </motion.button>
        </motion.div>

        {catalogLoading ? (
          <div
            aria-busy="true"
            aria-label="Loading signature dishes"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#101B17]/10 overflow-hidden flex flex-col justify-between">
              <div className="aspect-[4/3] lg:aspect-[5/4] w-full skeleton-shimmer" />
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="h-3.5 w-36 rounded skeleton-shimmer" />
                  <div className="h-8 w-4/5 rounded skeleton-shimmer" />
                  <div className="h-4 w-full rounded skeleton-shimmer" />
                </div>
                <div className="pt-4 border-t border-[#101B17]/10 flex items-center justify-between">
                  <div className="h-7 w-24 rounded skeleton-shimmer" />
                  <div className="h-10 w-36 rounded-xl skeleton-shimmer" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#101B17]/10 p-4 flex gap-4 items-center"
                >
                  <div className="w-24 h-24 rounded-xl shrink-0 skeleton-shimmer" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-3 w-20 rounded skeleton-shimmer" />
                    <div className="h-5 w-4/5 rounded skeleton-shimmer" />
                    <div className="h-4 w-16 rounded skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Editorial Lead Dish Showcase */}
            <motion.article
              variants={slideUpItemVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -4 }}
              viewport={{ once: true, amount: 0.15 }}
              className="lg:col-span-5 bg-white rounded-3xl border border-[#101B17]/10 overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-[#101B17]/25 transition-all"
            >
              <button
                type="button"
                onClick={() => onOpenProduct(leadItem)}
                className="relative aspect-[4/3] lg:aspect-[5/4] w-full overflow-hidden bg-[#E7DFD0] text-start cursor-pointer"
              >
                <SafeImage
                  src={leadItem.image || chefPlatterImg}
                  alt={getLocalized(leadItem.name, language)}
                  fallbackLabel={getLocalized(leadItem.name, language)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </button>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-2.5">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5B564E]">
                    {categoryMap.get(leadItem.categoryId)
                      ? getLocalized(categoryMap.get(leadItem.categoryId)!.name, language)
                      : ''}
                    {' · '}
                    {t.menu.customisable}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#101210] leading-snug">
                    <button
                      type="button"
                      onClick={() => onOpenProduct(leadItem)}
                      className="text-start hover:text-[#1D2922] transition-colors cursor-pointer"
                    >
                      {getLocalized(leadItem.name, language)}
                    </button>
                  </h3>
                  <p className="text-sm sm:text-base text-[#5B564E] leading-relaxed">
                    {getLocalized(leadItem.description, language)}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#101B17]/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono-tabular text-xl font-bold text-[#101B17]">
                    {formatPrice(leadItem)}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onOpenProduct(leadItem)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F3EBDD] border border-[#101B17]/15 text-xs font-semibold text-[#101B17] hover:border-[#101B17] transition-colors min-h-[42px] cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{t.menu.viewDetails}</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleOrderNow(leadItem)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#101B17] text-[#F3EBDD] text-xs font-semibold hover:bg-[#1D2922] transition-colors min-h-[42px] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D7A65A]" />
                      <span>{t.hero.orderNow}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Staggered 6-Dish Editorial Companion Grid */}
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              {restItems.map((item) => {
                const cat = categoryMap.get(item.categoryId);
                const justAdded = recentlyAddedId === item.id;

                return (
                  <motion.article
                    key={item.id}
                    variants={slideUpItemVariants}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl border border-[#101B17]/10 p-4 flex gap-4 items-center hover:border-[#101B17]/30 hover:shadow-lg transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenProduct(item)}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#E7DFD0] shrink-0 cursor-pointer"
                    >
                      <SafeImage
                        src={item.image}
                        alt={getLocalized(item.name, language)}
                        fallbackLabel={getLocalized(item.name, language)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>

                    <div className="min-w-0 flex-1 flex flex-col justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#5B564E] truncate">
                          {cat ? getLocalized(cat.name, language) : ''}
                        </p>
                        <h3 className="font-display text-base sm:text-lg font-bold text-[#101210] leading-snug line-clamp-1">
                          <button
                            type="button"
                            onClick={() => onOpenProduct(item)}
                            className="text-start hover:text-[#1D2922] transition-colors cursor-pointer"
                          >
                            {getLocalized(item.name, language)}
                          </button>
                        </h3>
                        <p className="text-xs text-[#5B564E] line-clamp-1">
                          {getLocalized(item.description, language)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="font-mono-tabular text-sm font-bold text-[#101B17]">
                          {formatPrice(item)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={() => onOpenProduct(item)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#101B17] bg-[#F3EBDD] border border-[#101B17]/12 hover:border-[#101B17] transition-colors min-h-[34px] cursor-pointer"
                          >
                            {t.menu.viewDetails}
                          </motion.button>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleOrderNow(item)}
                            aria-label={`${t.hero.orderNow} ${getLocalized(item.name, language)}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors min-h-[34px] cursor-pointer ${
                              justAdded
                                ? 'bg-[#D7A65A] text-[#101210]'
                                : 'bg-[#101B17] text-[#F3EBDD] hover:bg-[#1D2922]'
                            }`}
                          >
                            {justAdded ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Plus className="w-3 h-3 text-[#D7A65A]" />
                            )}
                            <span>{t.menu.quickAdd}</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};
