import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Tag,
} from 'lucide-react';
import diningRoomImg from '../../assets/images/zestro_dining_room_1794604642566.jpg';
import { useStore } from '../../context/StoreContext';
import {
  IMG_BEVERAGES,
  IMG_BOWL_PASTA,
  IMG_BURGER,
  IMG_CHICKEN_MEALS,
  IMG_PIZZA,
} from '../../data/initialMenu';
import { getLocalized } from '../../i18n/translations';
import type { Product } from '../../types';
import { BrandLogo } from '../BrandLogo';
import { SafeImage } from '../SafeImage';

interface LandingSectionsProps {
  onSelectCategoryAndScroll: (categoryId: string) => void;
  onOpenProduct: (product: Product) => void;
}

export const FeaturedCategoriesStrip: React.FC<{
  onSelectCategoryAndScroll: (categoryId: string) => void;
}> = ({ onSelectCategoryAndScroll }) => {
  const { language, t, isRtl, categories, products, catalogLoading } = useStore();

  const activeCategories = categories
    .filter((c) => c.active)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 7);

  if (!catalogLoading && activeCategories.length === 0) {
    return null;
  }

  const pickCategoryImage = (categoryId: string, nameEn: string, type: 'food' | 'beverage') => {
    const prodWithImg = products.find(
      (p) => p.categoryId === categoryId && p.available && p.image && p.image.trim()
    );
    if (prodWithImg?.image) return prodWithImg.image;
    const lower = nameEn.toLowerCase();
    if (type === 'beverage' || lower.includes('coffee') || lower.includes('drink') || lower.includes('beverage')) {
      return IMG_BEVERAGES;
    }
    if (lower.includes('pizza')) return IMG_PIZZA;
    if (lower.includes('burger')) return IMG_BURGER;
    if (lower.includes('bowl') || lower.includes('pasta') || lower.includes('rice')) return IMG_BOWL_PASTA;
    return IMG_CHICKEN_MEALS;
  };

  const highlights = activeCategories.map((cat) => ({
    id: cat.id,
    img: pickCategoryImage(cat.id, cat.name.en, cat.type),
    label: cat.name,
  }));

  return (
    <section
      id="categories"
      className="scroll-mt-20 py-14 sm:py-16 bg-[#E7DFD0] border-b border-[#101B17]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        >
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101210]">
              {t.sections.featuredCategories}
            </h2>
            <p className="text-sm text-[#5B564E]">{t.sections.featuredCategoriesSub}</p>
          </div>
        </motion.div>

        {/* Image-led horizontal rail on mobile -> 7-col gallery on desktop */}
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory pb-2 sm:pb-0">
          {highlights.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.28, delay: idx * 0.03 }}
              onClick={() => onSelectCategoryAndScroll(item.id)}
              className="group relative snap-start shrink-0 w-[148px] sm:w-auto aspect-[4/5] rounded-2xl overflow-hidden border border-[#101B17]/12 bg-[#101B17] text-start hover:border-[#D7A65A] hover:shadow-xl transition-all cursor-pointer"
            >
              <SafeImage
                src={item.img}
                alt={getLocalized(item.label, language)}
                darkFallback
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#101210]/90 via-[#101210]/25 to-transparent pointer-events-none"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-[#FFFFFF] truncate">
                  {getLocalized(item.label, language)}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 text-[#D7A65A] shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    isRtl ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export const PopularAndOffersSection: React.FC<LandingSectionsProps> = ({
  onOpenProduct,
  onSelectCategoryAndScroll,
}) => {
  const { language, t, isRtl, products, promotions, settings } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const popular = products
    .filter((p) => (p.popular || p.featured) && p.available && !p.soldOut)
    .slice(0, 6);
  const activePromotions = promotions.filter((pr) => pr.active);

  const handleCopyCode = async (promoId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(promoId);
      window.setTimeout(() => setCopiedId((prev) => (prev === promoId ? null : prev)), 2000);
    } catch {
      // Clipboard blocked in restricted context; silent fallback
    }
  };

  return (
    <section id="offers" className="scroll-mt-20 py-16 sm:py-24 bg-white border-b border-[#101B17]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Guest Favorites */}
        {popular.length > 0 && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35 }}
              className="space-y-2"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101210]">
                {t.sections.popularItems}
              </h2>
              <p className="text-sm text-[#5B564E]">{t.sections.popularItemsSub}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {popular.map((item, idx) => (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  onClick={() => onOpenProduct(item)}
                  className="bg-[#F3EBDD]/65 rounded-2xl border border-[#101B17]/10 p-4 flex items-center gap-4 text-start hover:border-[#101B17]/30 hover:bg-[#F3EBDD] hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#E7DFD0] shrink-0">
                    <SafeImage
                      src={item.image}
                      alt={getLocalized(item.name, language)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-display font-bold text-base text-[#101210] truncate">
                      {getLocalized(item.name, language)}
                    </h3>
                    <p className="text-xs text-[#5B564E] line-clamp-2">
                      {getLocalized(item.description, language)}
                    </p>
                    <p className="font-mono-tabular text-sm font-bold text-[#101B17]">
                      {settings.currency}
                      {item.variants?.length ? item.variants[0].price : item.price}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Active Special Offers */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="space-y-2"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101210]">
              {t.sections.specialOffers}
            </h2>
            <p className="text-sm text-[#5B564E]">{t.sections.specialOffersSub}</p>
          </motion.div>

          {activePromotions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#F3EBDD] rounded-2xl border border-[#101B17]/10 p-6 sm:p-8 text-sm text-[#5B564E]"
            >
              {t.sections.specialOffersEmpty}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePromotions.map((promo, idx) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="bg-[#101B17] text-[#F3EBDD] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 border border-[#D7A65A]/25 shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#D7A65A]">
                      <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
                        <Tag className="w-4 h-4" />
                        <span>
                          {promo.discountValue > 0
                            ? promo.discountType === 'percent'
                              ? `${promo.discountValue}% OFF`
                              : `${settings.currency}${promo.discountValue} OFF`
                            : t.sections.activeOfferBadge}
                        </span>
                      </span>
                      {promo.validUntil && (
                        <span className="text-[#A9A79F] font-mono-tabular">
                          {promo.validUntil}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#FFFFFF]">
                      {getLocalized(promo.title, language)}
                    </h3>
                    <p className="text-sm text-[#F3EBDD]/80 leading-relaxed">
                      {getLocalized(promo.description, language)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    {promo.code ? (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopyCode(promo.id, promo.code!)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1D2922] hover:bg-[#26362D] border border-white/10 text-xs transition-colors cursor-pointer"
                      >
                        <span className="font-mono-tabular font-bold text-[#D7A65A]">
                          {promo.code}
                        </span>
                        {copiedId === promo.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#A9A79F]" />
                        )}
                        <span className="text-[#F3EBDD]/85">
                          {copiedId === promo.id ? t.sections.promoCopied : t.sections.copyPromo}
                        </span>
                      </motion.button>
                    ) : (
                      <span className="text-xs text-[#A9A79F]">
                        {t.sections.activeOfferBadge}
                      </span>
                    )}

                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onSelectCategoryAndScroll('all')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D7A65A] text-[#101210] text-xs font-bold hover:bg-[#C49245] transition-colors min-h-[40px] cursor-pointer"
                    >
                      <span>{t.sections.orderOfferCta}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const AboutReviewsContactFooter: React.FC<{
  onNavigateRoute?: (path: string, sectionId: string) => void;
  showGallery?: boolean;
}> = ({ onNavigateRoute, showGallery = true }) => {
  const { language, t, settings, gallery } = useStore();

  const rawPhone = (settings.contactPhone || settings.whatsappNumber || '+8801601987672').replace(
    /[^\d+]/g,
    ''
  );
  const telHref = `tel:${rawPhone}`;
  const waDigits = (settings.whatsappNumber || '+8801601987672').replace(/\D/g, '');
  const waHref = `https://wa.me/${waDigits}`;

  const handleFooterNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    sectionId: string
  ) => {
    if (!onNavigateRoute) return;
    e.preventDefault();
    onNavigateRoute(path, sectionId);
  };

  return (
    <>
      {/* Live R2 Atmosphere Gallery (when configured in Admin) */}
      {showGallery && gallery.length > 0 && (
        <section
          id="gallery"
          className="scroll-mt-20 py-16 sm:py-20 bg-[#E7DFD0] border-b border-[#101B17]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101210]">
                Atmosphere &amp; Culinary Gallery
              </h2>
              <p className="text-sm text-[#5B564E]">
                Inside the Zestro dining room, kitchen craft, and espresso bar.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.slice(0, 8).map((photo) => (
                <figure
                  key={photo.id}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#101B17] border border-[#101B17]/12 shadow-sm"
                >
                  <SafeImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    darkFallback
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#101210]/90 via-[#101210]/40 to-transparent text-[#F3EBDD]">
                    <p className="text-xs sm:text-sm font-semibold truncate">{photo.title}</p>
                    {photo.caption && (
                      <p className="text-[11px] text-[#F3EBDD]/80 truncate">{photo.caption}</p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us & Culinary Philosophy — Dark Forest Charcoal Band */}
      <section
        id="about"
        className="scroll-mt-20 py-16 sm:py-24 bg-[#1D2922] text-[#F3EBDD] border-b border-[#D7A65A]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.42 }}
              className="lg:col-span-5"
            >
              <div className="rounded-3xl overflow-hidden border border-[#D7A65A]/25 shadow-2xl bg-[#101B17] aspect-[4/3] group">
                <SafeImage
                  src={diningRoomImg}
                  alt="Zestro dining room interior with warm brass lighting and espresso bar"
                  darkFallback
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.42, delay: 0.08 }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#D7A65A]">
                  <span aria-hidden="true" className="w-7 h-px bg-[#D7A65A]" />
                  <span>{t.sections.aboutEyebrow}</span>
                </div>
                <h2
                  className="font-display text-3xl sm:text-4xl font-bold text-[#FFFFFF]"
                  style={{ textWrap: 'balance' }}
                >
                  {t.sections.storyTitle}
                </h2>
                <p className="text-base text-[#A9A79F] leading-relaxed max-w-2xl">
                  {t.sections.storyBody}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {t.sections.whyChoosePoints.map((pt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                    className="bg-[#101B17] rounded-2xl border border-white/10 p-5 space-y-2.5 hover:border-[#D7A65A]/40 transition-colors"
                  >
                    <span className="font-mono-tabular text-xs font-bold text-[#D7A65A]">
                      0{idx + 1}.
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#F3EBDD]">
                      {pt.title}
                    </h3>
                    <p className="text-sm text-[#A9A79F] leading-relaxed">{pt.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Guest Voices / Reviews — Soft Ivory Band */}
      {settings.reviews && settings.reviews.length > 0 && (
        <section className="py-16 sm:py-20 bg-[#F3EBDD] border-b border-[#101B17]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101210]">
              {t.sections.reviewsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {settings.reviews.map((rev, idx) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.32, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-[#101B17]/10 p-6 space-y-4 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#D7A65A]">
                      {Array.from({ length: Math.min(5, Math.max(1, rev.rating)) }).map(
                        (_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        )
                      )}
                    </div>
                    <p className="text-sm text-[#101210] leading-relaxed">
                      &ldquo;{getLocalized(rev.comment, language)}&rdquo;
                    </p>
                  </div>
                  <div className="text-xs text-[#5B564E] pt-3 border-t border-[#101B17]/8">
                    <strong className="text-[#101210]">{rev.author}</strong> · {rev.role}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Architectural Dark Footer — Zero Admin Exposure */}
      <footer id="contact" className="scroll-mt-20 bg-[#101210] text-[#F3EBDD] pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
            <div className="md:col-span-4 space-y-4">
              <BrandLogo variant="dark" size="md" logoUrl={settings.logoUrl} />
              <p className="text-sm text-[#A9A79F] max-w-sm leading-relaxed">
                {t.footer.tagline}
              </p>

              <nav className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs font-medium text-[#F3EBDD]/80">
                <a
                  href="/"
                  onClick={(e) => handleFooterNav(e, '/', 'home')}
                  className="hover:text-[#D7A65A] transition-colors"
                >
                  {t.nav.home}
                </a>
                <a
                  href="/menu"
                  onClick={(e) => handleFooterNav(e, '/menu', 'menu')}
                  className="hover:text-[#D7A65A] transition-colors"
                >
                  {t.nav.menu}
                </a>
                <a
                  href="/offers"
                  onClick={(e) => handleFooterNav(e, '/offers', 'offers')}
                  className="hover:text-[#D7A65A] transition-colors"
                >
                  {t.nav.offers}
                </a>
                <a
                  href="/about"
                  onClick={(e) => handleFooterNav(e, '/about', 'about')}
                  className="hover:text-[#D7A65A] transition-colors"
                >
                  {t.nav.about}
                </a>
                <a
                  href="/contact"
                  onClick={(e) => handleFooterNav(e, '/contact', 'contact')}
                  className="hover:text-[#D7A65A] transition-colors"
                >
                  {t.nav.contact}
                </a>
              </nav>
            </div>

            <div className="md:col-span-4 space-y-3 text-sm">
              <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
                {t.sections.locationTitle}
              </h3>
              <div className="flex items-start gap-2.5 text-[#F3EBDD]/85">
                <MapPin className="w-4 h-4 text-[#D7A65A] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#A9A79F]">
                    {t.sections.addressLabel}
                  </span>
                  <span>{getLocalized(settings.address, language)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-[#F3EBDD]/85">
                <Clock className="w-4 h-4 text-[#D7A65A] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#A9A79F]">
                    {t.sections.hoursLabel}
                  </span>
                  <span>{getLocalized(settings.openingHours, language)}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-4 text-sm">
              <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
                {t.sections.phoneLabel}
              </h3>
              <a
                href={telHref}
                className="inline-flex items-center gap-2.5 text-[#F3EBDD] font-mono-tabular hover:text-[#D7A65A] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D7A65A] shrink-0" />
                <span>{settings.whatsappNumber}</span>
              </a>
              <p className="text-xs text-[#A9A79F]">{t.footer.whatsappOrderLine}</p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  href={telHref}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D2922] hover:bg-[#26362D] border border-white/10 text-xs font-semibold text-[#F3EBDD] transition-colors min-h-[40px]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D7A65A]" />
                  <span>{t.sections.callNow}</span>
                </motion.a>
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D7A65A] hover:bg-[#C49245] text-xs font-bold text-[#101210] transition-colors min-h-[40px]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t.sections.chatWhatsapp}</span>
                </motion.a>
              </div>

              {(settings.socialLinks?.facebook ||
                settings.socialLinks?.instagram ||
                settings.socialLinks?.tiktok) && (
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#A9A79F]">
                  {settings.socialLinks.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#D7A65A]"
                    >
                      Facebook
                    </a>
                  )}
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#D7A65A]"
                    >
                      Instagram
                    </a>
                  )}
                  {settings.socialLinks.tiktok && (
                    <a
                      href={settings.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#D7A65A]"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A9A79F]">
            <span>
              © {new Date().getFullYear()} {settings.restaurantName}. {t.footer.rights}
            </span>
            <span className="font-mono-tabular">{settings.currency} BDT</span>
          </div>
        </div>
      </footer>
    </>
  );
};
