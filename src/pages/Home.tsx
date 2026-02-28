import { useRef, useState, useEffect } from 'react';
import {
  Star,
  ArrowRight,
  ChevronRight,
  Phone,
  Clock,
  MapPin,
  Gift,
} from 'lucide-react';
import { prefersReducedMotion } from '../utils/animations';
import { Link } from 'react-router-dom';
import BookingButton from '../components/BookingButton';
import SocialLinks from '../components/SocialLinks';
import EnhancedCarousel from '../components/EnhancedCarousel';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { supabase } from '../lib/supabase';
import { CONTACT } from '../data/services';
import { siteContent } from '../content/siteContent';
import { useHeroDepth } from '../hooks/useHeroDepth';
import { useRevealAnimation } from '../hooks/useRevealAnimation';
import { useAdminServices } from '../hooks/useAdminServices';

const svgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const serviceIcons: Record<string, React.ReactNode> = {
  'paint-correction': (
    <svg {...svgProps}>
      <path d="M4 20h16"/>
      <path d="M6 20l2-6h8l2 6"/>
      <path d="M9 10l3-6 3 6"/>
    </svg>
  ),
  'ceramic-coating': (
    <svg {...svgProps}>
      <path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z"/>
    </svg>
  ),
  'paintless-dent-repair': (
    <svg {...svgProps}>
      <rect x="3" y="10" width="10" height="6" rx="1"/>
      <path d="M14 7l4 4"/>
      <path d="M16 5l3 3"/>
    </svg>
  ),
  'complete-detailing': (
    <svg {...svgProps}>
      <path d="M3 6h18"/>
      <path d="M3 12h18"/>
      <path d="M3 18h18"/>
      <circle cx="19" cy="6" r="2" fill="currentColor" stroke="none"/>
      <circle cx="19" cy="18" r="2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  'wheel-restoration': (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="3" x2="12" y2="9"/>
      <line x1="12" y1="15" x2="12" y2="21"/>
      <line x1="3" y1="12" x2="9" y2="12"/>
      <line x1="15" y1="12" x2="21" y2="12"/>
    </svg>
  ),
};

export default function Home() {
  const animRef = useScrollAnimation();
  const heroRef = useRef<HTMLDivElement>(null);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const reviewsPositionRef = useRef(0);
  const reviewsAnimFrameRef = useRef<number>();
  const [reviewsPaused, setReviewsPaused] = useState(false);
  const reviewsPausedRef = useRef(false);
  const [galleryImages, setGalleryImages] = useState<{ src: string; alt: string }[]>(siteContent.images.gallery);

  useEffect(() => {
    supabase
      .from('gallery_images')
      .select('image_url, position')
      .order('position', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setGalleryImages(data.map((img, i) => ({ src: img.image_url, alt: `Gallery image ${i + 1}` })));
        }
      });
  }, []);
  useEffect(() => {
    reviewsPausedRef.current = reviewsPaused;
  }, [reviewsPaused]);

  useEffect(() => {
    const container = reviewsScrollRef.current;
    if (!container || prefersReducedMotion()) return;
    const ITEM_WIDTH = 320 + 24;
    const REVIEW_COUNT = 6;
    const totalWidth = REVIEW_COUNT * ITEM_WIDTH;
    const speed = 0.4;
    const animate = () => {
      if (!reviewsPausedRef.current) {
        reviewsPositionRef.current += speed;
        if (reviewsPositionRef.current >= totalWidth) {
          reviewsPositionRef.current -= totalWidth;
        }
        container.style.transform = `translateX(-${reviewsPositionRef.current}px)`;
      }
      reviewsAnimFrameRef.current = requestAnimationFrame(animate);
    };
    reviewsAnimFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (reviewsAnimFrameRef.current) cancelAnimationFrame(reviewsAnimFrameRef.current);
    };
  }, []);

  const { backgroundTransform, contentTransform } = useHeroDepth();
  const servicesReveal = useRevealAnimation();
  const whyChooseReveal = useRevealAnimation();
  const galleryReveal = useRevealAnimation();
  const { homeServices, loading: servicesLoading } = useAdminServices();

  return (
    <div ref={animRef}>
      <section className="relative overflow-hidden bg-brand-charcoal" style={{ minHeight: '100vh' }}>
        <div ref={heroRef} className="absolute inset-0 hidden lg:block" style={backgroundTransform}>
          <img
            src={siteContent.images.hero.src}
            alt={siteContent.images.hero.alt}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-brand-charcoal/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/40 via-transparent to-brand-charcoal/70" />
        </div>

        <div className="relative z-10 w-full flex flex-col lg:min-h-screen" style={contentTransform}>
          <div className="lg:flex-1 flex flex-col justify-start pt-28 sm:pt-32 lg:pt-48">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                Come See the Future of the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-light to-brand-red-light">
                  Auto Detail Industry
                </span>
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-brand-orange-light to-brand-red-light rounded-full mx-auto mt-6" />
            </div>
          </div>

          <div className="lg:hidden">
            <img
              src={siteContent.images.hero.src}
              alt={siteContent.images.hero.alt}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="pb-6 sm:pb-10 lg:pb-20 pt-3 lg:pt-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <BookingButton size="lg">
                  Schedule Your Detail
                </BookingButton>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-brand-red text-white font-semibold rounded-lg hover:bg-brand-red/90 btn-apple-hover text-sm sm:text-base"
                >
                  View Our Services
                </Link>
                <a
                  href={CONTACT.phoneLink}
                  className="inline-flex items-center gap-2 px-6 py-4 text-white font-semibold border-2 border-white/30 rounded-lg hover:bg-white/10 btn-apple-hover text-sm sm:text-base"
                >
                  <Phone className="w-5 h-5" />
                  Call {CONTACT.phone}
                </a>
              </div>
              <Link
                to="/gift-card"
                className="inline-flex items-center gap-2 text-brand-orange-light font-semibold hover:gap-3 transition-all text-sm"
              >
                <Gift className="w-4 h-4" />
                Give a Gift Card
                <ArrowRight className="w-4 h-4" />
              </Link>
              <SocialLinks variant="light" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent hidden lg:block" />
      </section>

      <section className="py-16 sm:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="text-center fade-in">
            <p className="text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">
              Customer Reviews
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
              What Yakima Drivers Say
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Real feedback from real customers. See what people in Yakima and the surrounding
              areas have to say about their experience with Pro Clean.
            </p>
          </div>
        </div>

        <div
          className="relative cursor-pointer select-none overflow-hidden"
          onClick={() => setReviewsPaused(p => !p)}
          title={reviewsPaused ? 'Click to resume' : 'Click to pause'}
        >
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={reviewsScrollRef}
            className="flex gap-6"
            style={{
              width: 'max-content',
              willChange: 'transform',
            }}
          >
            {(() => {
              const reviews = [
                { name: 'Roy Simmons', initial: 'R', rating: 5, timeAgo: '4 months ago', text: 'I give these guys five stars for the restoration of my 2013 Subaru headlight lens They look new', color: 'bg-sky-600' },
                { name: 'Paula', initial: 'P', rating: 5, timeAgo: '5 months ago', text: 'I had my outback washed, waxed, detailed, total inside washed, and the headlights cleared of all the foggy stuff. I walked away with a new car. Super nice professional caring people. I highly recommend these people and this company.', color: 'bg-teal-600' },
                { name: 'Jose Herrera', initial: 'J', rating: 5, timeAgo: '6 months ago', text: 'Took my blazer in for a hand wash and the guys did an exceptional job. Great customer service! I will be bringing my car back', color: 'bg-stone-500' },
                { name: 'Maddie Martinez', initial: 'M', rating: 5, timeAgo: '8 months ago', text: 'Beyond happy with my experience! First time customer and will be coming back for all my detail needs. My car looked cleaner and newer from when I took it out the lot.', color: 'bg-brand-orange' },
                { name: 'Veronica Herrera', initial: 'V', rating: 5, timeAgo: '8 months ago', text: 'Highly recommend pro clean! I went in for a detail and my car came out looking brand new. I also had a few dents, and was able to get that serviced in the back the same day. Thank you!', color: 'bg-blue-600' },
                { name: 'Dan R.', initial: 'D', rating: 5, timeAgo: 'Edited 9 months ago', text: 'I love this place. Excellent staff, excellent workers, excellent auto detailing.', color: 'bg-brand-red', badge: 'Local Guide' },
              ];
              return [...reviews, ...reviews, ...reviews];
            })().map((review, i) => (
              <div key={i} className="shrink-0 w-80 p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-brand-red/30 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`${review.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0`}>
                    {review.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-brand-charcoal text-sm">{review.name}</p>
                      {review.badge && (
                        <span className="text-xs bg-brand-orange/10 text-brand-orange font-medium px-2 py-0.5 rounded-full">
                          {review.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">{review.timeAgo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-4">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>

          {reviewsPaused && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="bg-black/50 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
                Paused — click to resume
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-10 px-4">
          <a
            href="https://www.google.com/search?sca_esv=f736710e6b71d7f5&sxsrf=ANbL-n7LclPH_BUKJRql8CUzrk0Bae8fug:1771042594610&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_x9vzxBY3O39_3Cy0X4Ep5F-xYR--JdlcO1YQyqjTz4axWfr-_-oiMOLCBlAghnvQcf3uKKxWW0ldlBUQnZ2slq9JaA_ujIijal4-khil1zinerD-eg%3D%3D&q=Pro+Clean+Auto+Detail+Systems+Reviews&sa=X&ved=2ahUKEwjzkO_lj9iSAxW0IzQIHXu5BYkQ0bkNegQIHhAH&biw=1920&bih=992&dpr=2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-red font-semibold hover:gap-3 transition-all"
          >
            See All Reviews on Google <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <section className="py-10 bg-brand-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-6 sm:px-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-brand-orange-light" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Give the gift of a clean car</p>
                <p className="text-stone-400 text-sm mt-0.5">Pro Clean gift cards — perfect for any occasion.</p>
              </div>
            </div>
            <Link
              to="/gift-card"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-brand-red/90 btn-apple-hover text-sm whitespace-nowrap"
            >
              <Gift className="w-4 h-4" />
              Get a Gift Card
            </Link>
          </div>
        </div>
      </section>

      <section ref={servicesReveal.ref} className={`py-20 sm:py-28 bg-white ${servicesReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
              Professional Auto Detailing Services
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              From ceramic coatings to complete interior restorations, we deliver showroom-quality
              results for every vehicle that comes through our doors.
            </p>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-44 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : homeServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeServices.map((service, i) => (
                <Link
                  key={service.id}
                  to="/services"
                  className={`group relative rounded-xl border border-stone-200 hover:border-brand-red/30 bg-white btn-apple-hover hover:shadow-xl hover:shadow-red-900/5 overflow-hidden flex flex-col h-full ${servicesReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'} stagger-item-${i % 6}`}
                >
                  <div className="relative overflow-hidden bg-stone-100 aspect-[4/3]">
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-red-50 text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
                        {serviceIcons[service.service_key ?? ''] ?? (
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-lg font-semibold text-brand-charcoal group-hover:text-brand-red transition-colors">
                      {service.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-red opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceIcons && Object.keys(serviceIcons).slice(0, 5).map((id, i) => (
                <Link
                  key={id}
                  to="/services"
                  className={`group relative rounded-xl border border-stone-200 hover:border-brand-red/30 bg-white btn-apple-hover hover:shadow-xl hover:shadow-red-900/5 overflow-hidden flex flex-col h-full stagger-item-${i % 6}`}
                >
                  <div className="w-full aspect-[4/3] rounded-lg bg-red-50 text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
                    <div className="scale-150">
                      {serviceIcons[id]}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-stone-400 group-hover:text-brand-red transition-colors">Loading...</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12 fade-in">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-brand-red font-semibold hover:gap-3 transition-all"
            >
              View All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section ref={whyChooseReveal.ref} className={`py-20 sm:py-28 bg-stone-50 ${whyChooseReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">
                Why Choose Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-6">
                Yakima's Most Trusted Detail Shop
              </h2>
              <p className="text-stone-600 leading-relaxed mb-8">
                For over 15 years, Pro Clean Auto Detail Systems has been the go-to detailing shop in Yakima, WA.
                Our reputation is built on consistent quality, honest service, and a team that treats every vehicle
                like it's their own. We've invested in the latest tools and techniques to deliver results that speak
                for themselves.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <p className="text-3xl font-bold text-brand-red">15+</p>
                  <p className="text-sm text-stone-500 mt-1">Years Experience</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <p className="text-3xl font-bold text-brand-red">9</p>
                  <p className="text-sm text-stone-500 mt-1">Specialized Services</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <p className="text-3xl font-bold text-brand-red">1000s</p>
                  <p className="text-sm text-stone-500 mt-1">Vehicles Detailed</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <p className="text-3xl font-bold text-brand-red">5</p>
                  <p className="text-sm text-stone-500 mt-1 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-brand-orange fill-brand-orange" /> Star Reviews
                  </p>
                </div>
              </div>
              <BookingButton variant="primary" size="lg">
                Book Your Appointment
              </BookingButton>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-brand-charcoal image-hover-apple">
              <img
                src={siteContent.images.trustedBy.src}
                alt={siteContent.images.trustedBy.alt}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section ref={galleryReveal.ref} className={`py-20 sm:py-28 bg-stone-50 overflow-hidden ${galleryReveal.isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
              See the Pro Clean Difference
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              Real results from real vehicles. Browse our complete gallery on the Services page to see detailed before and after transformations across all our services.
            </p>
          </div>

        </div>

        <EnhancedCarousel images={galleryImages} />
      </section>

      <section className="py-20 sm:py-28 bg-brand-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Get Your Vehicle Detailed?
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-8">
                Schedule your appointment today and experience why Yakima drivers have trusted
                Pro Clean Auto Detail Systems for over 15 years.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BookingButton size="lg" variant="primary">
                  Book Your Appointment
                </BookingButton>
                <a
                  href={CONTACT.phoneLink}
                  className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold border-2 border-stone-600 rounded-lg hover:border-white btn-apple-hover"
                >
                  <Phone className="w-5 h-5" /> Call Us
                </a>
                <Link
                  to="/gift-card"
                  className="inline-flex items-center gap-2 px-8 py-4 text-brand-orange-light font-semibold border-2 border-brand-orange-light/30 rounded-lg hover:border-brand-orange-light btn-apple-hover"
                >
                  <Gift className="w-5 h-5" /> Gift Cards
                </Link>
              </div>
            </div>

            <div className="fade-in-right grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="w-6 h-6 text-brand-orange-light mb-3" />
                <h3 className="font-semibold mb-1">Visit Us</h3>
                <a href={CONTACT.addressLink} target="_blank" rel="noopener noreferrer" className="text-sm text-stone-400 hover:text-white transition-colors">
                  {CONTACT.address}
                </a>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <Phone className="w-6 h-6 text-brand-orange-light mb-3" />
                <h3 className="font-semibold mb-1">Call Us</h3>
                <a href={CONTACT.phoneLink} className="text-sm text-stone-400 hover:text-white transition-colors">
                  {CONTACT.phone}
                </a>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 sm:col-span-2">
                <Clock className="w-6 h-6 text-brand-orange-light mb-3" />
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <div className="text-sm text-stone-400 space-y-0.5">
                  <p>{CONTACT.hours.weekday}</p>
                  {CONTACT.hours.saturday && <p>{CONTACT.hours.saturday}</p>}
                  <p>{CONTACT.hours.sunday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
