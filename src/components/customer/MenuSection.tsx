import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowUpDown,
  Check,
  ChevronDown,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getLocalized } from '../../i18n/translations';
import type { Product } from '../../types';
import { SafeImage } from '../SafeImage';

interface MenuSectionProps {
  selectedCategoryId: string;
  onSelectCategory: (catId: string) => void;
  onOpenProduct: (product: Product) => void;
}

const PAGE_SIZE = 8;

type SortMode = 'featured' | 'price_asc' | 'price_desc';

function getEffectiveSortPrice(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    return Math.min(...product.variants.map((v) => v.price));
  }
  return product.price;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onOpenProduct,
}) => {
  const {
    language,
    t,
    categories,
    products,
    customisationGroups,
    catalogLoading,
    catalogError,
    reloadCatalog,
    addToCart,
    settings,
  } = useStore();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'food' | 'beverage' | 'popular'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('featured');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 180);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [typeFilter, selectedCategoryId, debouncedSearch, sortMode]);

  useEffect(() => {
    const btn = chipRefs.current[selectedCategoryId];
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedCategoryId]);

  const deduplicatedCategories = useMemo(() => {
    const seenIds = new Set<string>();
    return categories
      .filter((c) => {
        if (!c.active) return false;
        if (seenIds.has(c.id)) return false;
        seenIds.add(c.id);
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories]);

  const activeCategories = useMemo(
    () =>
      deduplicatedCategories.filter((c) => {
        if (typeFilter === 'food') return c.type === 'food';
        if (typeFilter === 'beverage') return c.type === 'beverage';
        return true;
      }),
    [deduplicatedCategories, typeFilter]
  );

  const categoryMap = useMemo(
    () => new Map(deduplicatedCategories.map((c) => [c.id, c])),
    [deduplicatedCategories]
  );

  const filteredProducts = useMemo(() => {
    const q = debouncedSearch;
    const filtered = products.filter((p) => {
      const cat = categoryMap.get(p.categoryId);
      if (!cat && categories.some((c) => c.id === p.categoryId && !c.active)) {
        return false;
      }
      if (typeFilter === 'food' && cat?.type !== 'food') return false;
      if (typeFilter === 'beverage' && cat?.type !== 'beverage') return false;
      if (typeFilter === 'popular' && !p.popular && !p.featured) return false;
      if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) return false;
      if (q) {
        const haystack = [
          p.name.en,
          p.name.bn,
          p.name.ar,
          p.description.en,
          p.description.bn,
          p.description.ar,
          cat?.name.en || '',
          cat?.name.bn || '',
          cat?.name.ar || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortMode === 'price_asc') {
      return [...filtered].sort((a, b) => getEffectiveSortPrice(a) - getEffectiveSortPrice(b));
    }
    if (sortMode === 'price_desc') {
      return [...filtered].sort((a, b) => getEffectiveSortPrice(b) - getEffectiveSortPrice(a));
    }
    return [...filtered].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [products, categories, categoryMap, typeFilter, selectedCategoryId, debouncedSearch, sortMode]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleProducts.length < filteredProducts.length;
  const remainingCount = Math.max(0, filteredProducts.length - visibleProducts.length);
  const progressPercent =
    filteredProducts.length > 0
      ? Math.min(100, Math.round((visibleProducts.length / filteredProducts.length) * 100))
      : 0;

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length));
      setLoadingMore(false);
    }, 150);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setTypeFilter('all');
    setSortMode('featured');
    onSelectCategory('all');
    setVisibleCount(PAGE_SIZE);
  };

  const handleQuickAdd = (product: Product) => {
    if (!product.available || product.soldOut) return;
    const hasRequiredGroup = Boolean(
      product.customisationGroupIds?.some((gid) =>
        customisationGroups.some((g) => g.id === gid && g.required)
      )
    );
    const requiresCustomiser =
      Boolean(product.variants && product.variants.length > 0) ||
      Boolean(product.mealSideRule) ||
      hasRequiredGroup;
    if (requiresCustomiser) {
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

  const formatPriceDisplay = (product: Product) => {
    if (product.variants && product.variants.length > 1) {
      const prices = product.variants.map((v) => v.price);
      const min = Math.min(...prices);
      return `${t.menu.fromPrice} ${settings.currency}${min}`;
    }
    if (product.variants && product.variants.length === 1) {
      return `${settings.currency}${product.variants[0].price}`;
    }
    if (product.price === 0 && product.categoryId === 'sides') {
      return t.customiser.free;
    }
    return `${settings.currency}${product.price}`;
  };

  return (
    <section id="menu" className="scroll-mt-20 py-16 sm:py-24 bg-[#F3EBDD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Heading & Full-Catalog Debounced Search */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-5"
        >
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101210]">
              {t.menu.title}
            </h2>
            <p className="text-[#5B564E] text-sm sm:text-base">{t.menu.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.menu.searchPlaceholder}
                aria-label={t.menu.searchPlaceholder}
                className="w-full ps-10 pe-10 py-3 rounded-xl bg-white border border-[#101B17]/15 text-sm text-[#101210] placeholder:text-[#5B564E]/75 focus:outline-none focus:ring-2 focus:ring-[#101B17] transition-shadow"
              />
              {searchInput && (
                <motion.button
                  type="button"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSearchInput('');
                    setDebouncedSearch('');
                  }}
                  aria-label={t.menu.clearSearch}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[#5B564E] hover:text-[#101210] hover:bg-[#E7DFD0] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            <div className="relative shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#5B564E] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                aria-label={t.menu.sortLabel}
                className="w-full sm:w-auto ps-8 pe-8 py-3 rounded-xl bg-white border border-[#101B17]/15 text-xs sm:text-sm font-medium text-[#101210] focus:outline-none focus:ring-2 focus:ring-[#101B17] appearance-none cursor-pointer min-h-[46px]"
              >
                <option value="featured">{t.menu.sortFeatured}</option>
                <option value="price_asc">{t.menu.sortPriceLow}</option>
                <option value="price_desc">{t.menu.sortPriceHigh}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#5B564E] absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Segmented Type Filter + Count Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 p-1 bg-[#E7DFD0] rounded-xl border border-[#101B17]/10 overflow-x-auto max-w-full no-scrollbar">
            {(
              [
                { id: 'all', label: t.menu.all },
                { id: 'food', label: t.menu.food },
                { id: 'beverage', label: t.menu.beverages },
                { id: 'popular', label: t.menu.popularFilter },
              ] as const
            ).map((tab) => {
              const active = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setTypeFilter(tab.id);
                    onSelectCategory('all');
                  }}
                  className={`relative px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer ${
                    active ? 'text-[#F3EBDD]' : 'text-[#101210]/75 hover:text-[#101B17]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="menu-type-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-[#101B17] rounded-lg"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono-tabular text-[#5B564E]">
            {catalogLoading ? (
              <div
                aria-hidden="true"
                className="h-4 w-36 rounded-md skeleton-shimmer"
              />
            ) : (
              <>
                {debouncedSearch && (
                  <span className="me-2 text-[#101B17] font-semibold">
                    {t.menu.resultsFor} &ldquo;{debouncedSearch}&rdquo; ·
                  </span>
                )}
                <span>
                  {t.menu.showingLabel}{' '}
                  <strong className="text-[#101210]">{visibleProducts.length}</strong>{' '}
                  {t.menu.ofLabel}{' '}
                  <strong className="text-[#101210]">{filteredProducts.length}</strong>{' '}
                  {t.menu.itemsLabel}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Horizontal Category Bar */}
        {catalogLoading ? (
          <div
            aria-hidden="true"
            className="flex items-center gap-2 overflow-hidden pb-1"
          >
            {['w-16', 'w-24', 'w-20', 'w-28', 'w-24', 'w-32', 'w-20', 'w-24'].map(
              (widthClass, idx) => (
                <div
                  key={idx}
                  className={`${widthClass} h-[38px] rounded-lg border border-[#101B17]/8 shrink-0 skeleton-shimmer`}
                />
              )
            )}
          </div>
        ) : (
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
            role="tablist"
            aria-label="Menu categories"
          >
            <motion.button
              ref={(el) => {
                chipRefs.current['all'] = el;
              }}
              type="button"
              role="tab"
              whileTap={{ scale: 0.95 }}
              aria-selected={selectedCategoryId === 'all'}
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-[#101B17] text-[#F3EBDD] border-[#101B17]'
                  : 'bg-white text-[#101210] border-[#101B17]/12 hover:border-[#101B17]'
              }`}
            >
              {t.menu.all}
            </motion.button>
            {activeCategories.map((cat) => (
              <motion.button
                key={cat.id}
                ref={(el) => {
                  chipRefs.current[cat.id] = el;
                }}
                type="button"
                role="tab"
                whileTap={{ scale: 0.95 }}
                aria-selected={selectedCategoryId === cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? 'bg-[#101B17] text-[#F3EBDD] border-[#101B17]'
                    : 'bg-white text-[#101210] border-[#101B17]/12 hover:border-[#101B17]'
                }`}
              >
                {getLocalized(cat.name, language)}
              </motion.button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {catalogLoading ? (
          <div aria-busy="true" aria-label="Loading menu items" className="space-y-7">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#101B17]/10 overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] w-full skeleton-shimmer" />
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded skeleton-shimmer" />
                      <div className="h-4 sm:h-5 w-4/5 rounded skeleton-shimmer" />
                      <div className="hidden sm:block space-y-1.5 pt-0.5">
                        <div className="h-3 w-full rounded skeleton-shimmer" />
                        <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                      </div>
                    </div>
                    <div className="pt-2.5 border-t border-[#101B17]/8 flex items-center justify-between gap-2">
                      <div className="h-5 w-16 rounded skeleton-shimmer" />
                      <div className="h-[36px] w-20 rounded-lg skeleton-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : catalogError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            role="alert"
            className="bg-white rounded-2xl border border-red-300/80 p-10 sm:p-12 text-center space-y-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-lg mx-auto">
              <p className="font-display text-xl font-bold text-[#101210]">
                Live Menu Temporarily Unavailable
              </p>
              <p className="text-sm text-[#5B564E]">{catalogError}</p>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={reloadCatalog}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#101B17] text-[#F3EBDD] rounded-xl hover:bg-[#1D2922] transition-colors min-h-[40px] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#D7A65A]" />
              <span>Retry Live Menu</span>
            </motion.button>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-[#101B17]/10 p-10 sm:p-12 text-center space-y-4"
          >
            <p className="text-base font-medium text-[#101210]">
              {typeFilter === 'popular' && !debouncedSearch && selectedCategoryId === 'all'
                ? t.menu.popularEmpty
                : t.menu.noResults}
            </p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={handleResetFilters}
              className="px-5 py-2.5 text-xs font-semibold bg-[#101B17] text-[#F3EBDD] rounded-xl hover:bg-[#1D2922] transition-colors min-h-[40px] cursor-pointer"
            >
              {t.menu.resetFilters}
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
              {visibleProducts.map((product, idx) => {
                const cat = categoryMap.get(product.categoryId);
                const isUnavailable = !product.available || product.soldOut;
                const isCustomisable =
                  Boolean(product.variants?.length) ||
                  Boolean(product.customisationGroupIds?.length) ||
                  Boolean(product.mealSideRule);
                const justAdded = recentlyAddedId === product.id;

                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={isUnavailable ? undefined : { y: -4 }}
                    transition={{
                      duration: 0.25,
                      delay: (idx % PAGE_SIZE) * 0.025,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`group bg-white rounded-2xl border border-[#101B17]/10 overflow-hidden flex flex-col hover:shadow-xl hover:border-[#101B17]/25 transition-all duration-200 ${
                      isUnavailable ? 'opacity-70' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenProduct(product)}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-[#E7DFD0] text-start focus-visible:outline-none cursor-pointer"
                    >
                      <SafeImage
                        src={product.image}
                        alt={getLocalized(product.name, language)}
                        fallbackLabel={getLocalized(product.name, language)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                    </button>

                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-[#5B564E]">
                          <span className="font-medium uppercase tracking-wider truncate max-w-[120px] sm:max-w-none">
                            {cat ? getLocalized(cat.name, language) : ''}
                          </span>
                          {isCustomisable && (
                            <>
                              <span aria-hidden="true" className="hidden sm:inline">
                                ·
                              </span>
                              <span className="hidden sm:inline">{t.menu.customisable}</span>
                            </>
                          )}
                          {isUnavailable && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-red-700 font-semibold">
                                {product.soldOut ? t.menu.soldOut : t.menu.unavailable}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="font-display text-sm sm:text-base font-bold text-[#101210] leading-snug line-clamp-2">
                          <button
                            type="button"
                            onClick={() => onOpenProduct(product)}
                            className="text-start hover:text-[#1D2922] transition-colors cursor-pointer"
                          >
                            {getLocalized(product.name, language)}
                          </button>
                        </h3>

                        <p className="text-xs text-[#5B564E] line-clamp-2 hidden sm:block">
                          {getLocalized(product.description, language)}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#101B17]/8 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono-tabular text-sm sm:text-base font-bold text-[#101B17]">
                          {formatPriceDisplay(product)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.92 }}
                            onClick={() => onOpenProduct(product)}
                            aria-label={`${t.menu.viewDetails} ${getLocalized(product.name, language)}`}
                            className="inline-flex items-center justify-center p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-[#101B17] bg-[#F3EBDD] hover:bg-[#E7DFD0] transition-colors min-h-[36px] min-w-[36px] cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline ms-1">{t.menu.viewDetails}</span>
                          </motion.button>

                          {!isUnavailable && !(product.price === 0 && product.categoryId === 'sides') && (
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleQuickAdd(product)}
                              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] whitespace-nowrap cursor-pointer ${
                                justAdded
                                  ? 'bg-[#D7A65A] text-[#101210]'
                                  : 'bg-[#101B17] text-[#F3EBDD] hover:bg-[#1D2922]'
                              }`}
                            >
                              {justAdded ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-[#D7A65A]" />
                              )}
                              <span>{t.menu.quickAdd}</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Pagination Progress & Load More */}
            <div className="pt-4 flex flex-col items-center gap-3">
              <div className="w-full max-w-xs space-y-1.5 text-center">
                <p className="text-xs font-mono-tabular text-[#5B564E]">
                  {t.menu.showingLabel}{' '}
                  <strong className="text-[#101210]">{visibleProducts.length}</strong>{' '}
                  {t.menu.ofLabel}{' '}
                  <strong className="text-[#101210]">{filteredProducts.length}</strong>{' '}
                  {t.menu.itemsLabel}
                </p>
                <div className="h-1.5 w-full bg-[#101B17]/12 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="h-full bg-[#101B17] rounded-full"
                  />
                </div>
              </div>

              {hasMore ? (
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#101B17] text-[#F3EBDD] text-sm font-semibold hover:bg-[#1D2922] disabled:opacity-70 transition-colors min-h-[46px] shadow-sm cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D7A65A]" />
                      <span>{t.menu.loadingMore}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {t.menu.loadMoreBtn} (+{Math.min(PAGE_SIZE, remainingCount)})
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#D7A65A]" />
                    </>
                  )}
                </motion.button>
              ) : (
                <p className="text-xs font-medium text-[#5B564E] pt-1">
                  {t.menu.allLoaded}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
