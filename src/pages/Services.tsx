import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import BookingButton from '../components/BookingButton';
import ServiceImageUpload from '../components/ServiceImageUpload';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { services as staticServices, getPricingForService } from '../data/services';
import { siteContent } from '../content/siteContent';
import { supabase } from '../lib/supabase';
import { useAdminServices, AdminServiceRecord } from '../hooks/useAdminServices';

interface ServiceImage {
  service_id: string;
  image_url: string;
}

export default function Services() {
  const animRef = useScrollAnimation();
  const location = useLocation();
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [isEditorMode, setIsEditorMode] = useState(false);
  const { services: dbServices, loading } = useAdminServices();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEditorMode(params.get('edit') === 'true');
  }, []);

  useEffect(() => {
    fetchServiceImages();
  }, []);

  async function fetchServiceImages() {
    const { data } = await supabase
      .from('service_images')
      .select('service_id, image_url');
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((img: ServiceImage) => { map[img.service_id] = img.image_url; });
      setServiceImages(map);
    }
  }

  const handleImageUpdate = (serviceId: string, imageUrl: string | null) => {
    if (imageUrl) {
      setServiceImages(prev => ({ ...prev, [serviceId]: imageUrl }));
    } else {
      setServiceImages(prev => {
        const updated = { ...prev };
        delete updated[serviceId];
        return updated;
      });
    }
  };

  useEffect(() => {
    if (!location.hash || loading) return;
    const id = location.hash.slice(1);
    const attempt = (tries: number) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 150);
      }
    };
    setTimeout(() => attempt(5), 100);
  }, [location.hash, loading]);

  const displayServices: AdminServiceRecord[] = dbServices.length > 0
    ? dbServices
    : staticServices.map((s, i) => ({
        id: s.id,
        service_key: s.id,
        title: s.title,
        short_title: s.shortTitle,
        description: s.description,
        features: s.features,
        price: 0,
        pricing_tiers: null,
        image_url: null,
        is_active: true,
        show_on_home: false,
        sort_order: i + 1,
        created_at: '',
      }));

  const navServices = displayServices;

  return (
    <div ref={animRef}>
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/procleanteam.jpeg" alt="Pro Clean Auto Detail Systems" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/80 to-brand-charcoal" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-orange-light font-semibold text-sm uppercase tracking-wider mb-3">Our Services</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Professional Auto Detailing Services in Yakima, WA
            </h1>
            <p className="text-lg text-stone-400 leading-relaxed">
              From ceramic coatings to RV and boat detailing, Pro Clean Auto Detail Systems
              offers a full range of professional detailing services for the Yakima Valley.
            </p>
          </div>
        </div>
      </section>

      <section className="py-3 bg-white border-b border-stone-200 sticky top-16 sm:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {navServices.map((service) => (
              <a
                key={service.id}
                href={`#${service.service_key ?? service.id}`}
                className="shrink-0 px-4 py-2 text-sm font-medium text-stone-600 hover:text-brand-red hover:bg-red-50 rounded-lg apple-transition whitespace-nowrap"
              >
                {service.short_title || service.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center py-20 bg-white">
          <div className="w-6 h-6 border-2 border-[#B91C1C] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="bg-white">
          {(() => {
            let imageServiceIndex = 0;
            return displayServices.map((service, i) => {
            const anchorId = service.service_key ?? service.id;
            const staticMatch = staticServices.find(s => s.id === service.service_key);
            const fallbackImageEntry = siteContent.images.services[anchorId as keyof typeof siteContent.images.services];
            const uploadedImage = serviceImages[anchorId];
            const dbImage = service.image_url;
            const hasImage = isEditorMode || uploadedImage || dbImage || fallbackImageEntry;
            const reverseLayout = hasImage ? imageServiceIndex++ % 2 === 1 : false;

            return (
              <section
                key={service.id}
                id={anchorId}
                className={`py-20 sm:py-24 ${i % 2 === 1 ? 'bg-stone-50' : 'bg-white'}`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-16 items-start`}>
                    <div className={`fade-in order-2 lg:order-none ${reverseLayout ? 'lg:order-2' : ''} ${!hasImage ? 'max-w-4xl' : ''}`}>
                      <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
                        {service.title}
                      </h2>
                      <p className="text-stone-600 leading-relaxed mb-8">
                        {service.description}
                      </p>

                      {(service.features?.length > 0 || staticMatch?.features?.length) && (
                        <div className="mb-8">
                          <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider mb-4">
                            What's Included
                          </h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(service.features?.length > 0 ? service.features : staticMatch?.features ?? []).map((feature) => (
                              <li key={feature} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                                <span className="text-sm text-stone-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(() => {
                        const dbTiers = service.pricing_tiers;
                        const staticPricing = getPricingForService(service.service_key);
                        const tiers = dbTiers && dbTiers.length > 0 ? dbTiers : staticPricing?.tiers;
                        if (!tiers || tiers.length === 0) return null;
                        return (
                          <div className="mb-8">
                            <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider mb-3">
                              Pricing
                            </h3>
                            <div className="rounded-xl border border-stone-200 overflow-hidden">
                              {tiers.map((tier, ti) => (
                                <div
                                  key={ti}
                                  className={`flex items-center justify-between px-4 py-3 ${ti % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}
                                >
                                  <span className="text-sm text-stone-600">{tier.label}</span>
                                  <span className="text-base font-bold text-brand-red">{tier.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <BookingButton size="md">
                        Book {service.short_title || service.title}
                      </BookingButton>
                    </div>

                    {hasImage && (
                      <div className={`fade-in order-1 lg:order-none ${reverseLayout ? 'lg:order-1' : ''}`} style={{ transitionDelay: '127ms' }}>
                        {isEditorMode ? (
                          <ServiceImageUpload
                            serviceId={anchorId}
                            serviceName={service.short_title || service.title}
                            currentImageUrl={uploadedImage}
                            onImageUpdate={(url) => handleImageUpdate(anchorId, url)}
                          />
                        ) : uploadedImage ? (
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg image-hover-apple">
                            <img src={uploadedImage} alt={service.title} className="w-full h-full object-cover" />
                          </div>
                        ) : dbImage ? (
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg image-hover-apple">
                            <img src={dbImage} alt={service.title} className="w-full h-full object-cover" />
                          </div>
                        ) : fallbackImageEntry ? (
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg image-hover-apple">
                            <img src={fallbackImageEntry.src} alt={fallbackImageEntry.alt || service.title} className="w-full h-full object-cover" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          });
          })()}
        </div>
      )}

      <section className="py-20 sm:py-28 bg-brand-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Vehicle?</h2>
          <p className="text-stone-400 text-lg mb-8">
            Book your appointment today and let the Pro Clean team take care of the rest.
            Serving Yakima, WA and surrounding areas.
          </p>
          <BookingButton size="lg" variant="primary">Book Your Appointment</BookingButton>
        </div>
      </section>
    </div>
  );
}
