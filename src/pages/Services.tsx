import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import BookingButton from '../components/BookingButton';
import ServiceImageUpload from '../components/ServiceImageUpload';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useRevealAnimation } from '../hooks/useRevealAnimation';
import { services } from '../data/services';
import { siteContent } from '../content/siteContent';
import { supabase } from '../lib/supabase';
import { useAdminServices } from '../hooks/useAdminServices';

const svgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#B91C1C',
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
  'interior-detailing': (
    <svg {...svgProps}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  'exterior-detailing': (
    <svg {...svgProps}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3"/>
      <path d="M8 21h8"/>
      <path d="M12 3v4"/>
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
  'paint-touchup': (
    <svg {...svgProps}>
      <path d="M12 19l7-7 3 3-7 7-3-3z"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      <path d="M2 2l7.586 7.586"/>
      <circle cx="11" cy="11" r="2"/>
    </svg>
  ),
  'rock-chip-repair': (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 9l6 6"/>
      <path d="M9 15l2-2"/>
      <path d="M13 9l2 2"/>
    </svg>
  ),
  'rv-detailing': (
    <svg {...svgProps}>
      <rect x="1" y="7" width="18" height="11" rx="2"/>
      <path d="M19 9h2l2 4v2h-4"/>
      <circle cx="6" cy="18" r="2"/>
      <circle cx="16" cy="18" r="2"/>
    </svg>
  ),
  'boat-detailing': (
    <svg {...svgProps}>
      <path d="M3 17l4-8 5 6 3-4 4 6"/>
      <path d="M2 20h20"/>
      <path d="M12 3v4"/>
      <path d="M8 7h8"/>
    </svg>
  ),
};


interface ServiceImage {
  service_id: string;
  image_url: string;
}

export default function Services() {
  const animRef = useScrollAnimation();
  const location = useLocation();
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [_imagesFetchError, setImagesFetchError] = useState(false);
  const { services: adminServices } = useAdminServices();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEditorMode(params.get('edit') === 'true');
  }, []);

  useEffect(() => {
    fetchServiceImages();
  }, []);

  async function fetchServiceImages() {
    const { data, error } = await supabase
      .from('service_images')
      .select('service_id, image_url');

    if (error) {
      setImagesFetchError(true);
    } else if (data) {
      const imagesMap: Record<string, string> = {};
      data.forEach((img: ServiceImage) => {
        imagesMap[img.service_id] = img.image_url;
      });
      setServiceImages(imagesMap);
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
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 100;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div ref={animRef}>
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/procleanteam.jpeg"
            alt="Pro Clean Auto Detail Systems"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/80 to-brand-charcoal" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-orange-light font-semibold text-sm uppercase tracking-wider mb-3">
              Our Services
            </p>
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

      <section className="py-8 bg-white border-b border-stone-200 sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="shrink-0 px-4 py-2 text-sm font-medium text-stone-600 hover:text-brand-red hover:bg-red-50 rounded-lg apple-transition whitespace-nowrap"
              >
                {service.shortTitle}
              </a>
            ))}
          </div>
        </div>
      </section>

      {adminServices.length > 0 && (
        <section className="py-16 bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminServices.map((service) => (
                <div
                  key={service.id}
                  className="p-6 rounded-xl border border-stone-200 bg-white hover:border-brand-red/30 hover:shadow-xl hover:shadow-red-900/5 btn-apple-hover"
                >
                  {service.image_url && (
                    <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!service.image_url && (
                    <div className="w-12 h-12 rounded-lg bg-red-50 text-brand-red flex items-center justify-center mb-4">
                      {serviceIcons[service.id] ?? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
                        </svg>
                      )}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-brand-charcoal mb-2">{service.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">{service.description}</p>
                  {service.price > 0 && (
                    <p className="mt-3 text-base font-bold text-brand-red">${service.price}</p>
                  )}
                  <div className="mt-4">
                    <BookingButton size="sm">Book Now</BookingButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="bg-white">
        {services.map((service, i) => (
          <section
            key={service.id}
            id={service.id}
            className={`py-20 sm:py-24 ${i % 2 === 1 ? 'bg-stone-50' : 'bg-white'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {(() => {
                const hasImage = isEditorMode || serviceImages[service.id] || siteContent.images.services[service.id as keyof typeof siteContent.images.services];
                const reverseLayout = i % 2 === 1 || service.id === 'ceramic-coating';
                return (
                  <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-16 items-start ${reverseLayout ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={`fade-in ${reverseLayout ? 'lg:order-2' : ''} ${!hasImage ? 'max-w-4xl' : ''}`}>
                      <div className="w-16 h-16 rounded-xl bg-red-50 text-brand-red flex items-center justify-center mb-6">
                        {serviceIcons[service.id]}
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
                        {service.title}
                      </h2>
                      <p className="text-stone-600 leading-relaxed mb-8">
                        {service.description}
                      </p>
                      <div className="mb-8">
                        <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider mb-4">
                          What's Included
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                              <span className="text-sm text-stone-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <BookingButton size="md">
                        Book {service.shortTitle}
                      </BookingButton>
                    </div>

                    {hasImage && (
                      <div className={`fade-in ${reverseLayout ? 'lg:order-1' : ''}`} style={{ transitionDelay: '150ms' }}>
                        {isEditorMode ? (
                          <ServiceImageUpload
                            serviceId={service.id}
                            serviceName={service.shortTitle}
                            currentImageUrl={serviceImages[service.id]}
                            onImageUpdate={(url) => handleImageUpdate(service.id, url)}
                          />
                        ) : serviceImages[service.id] ? (
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg image-hover-apple">
                            <img
                              src={serviceImages[service.id]}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : siteContent.images.services[service.id as keyof typeof siteContent.images.services] ? (
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg image-hover-apple">
                            <img
                              src={siteContent.images.services[service.id as keyof typeof siteContent.images.services]?.src}
                              alt={siteContent.images.services[service.id as keyof typeof siteContent.images.services]?.alt || service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </section>
        ))}
      </div>

      <section className="py-20 sm:py-28 bg-brand-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Vehicle?
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Book your appointment today and let the Pro Clean team take care of the rest.
            Serving Yakima, WA and surrounding areas.
          </p>
          <BookingButton size="lg" variant="primary">
            Book Your Appointment
          </BookingButton>
        </div>
      </section>
    </div>
  );
}
