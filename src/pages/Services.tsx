import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Shield,
  Sparkles,
  Car,
  Droplets,
  CircleDot,
  PaintBucket,
  Disc3,
  Truck,
  Ship,
  Zap,
  CheckCircle,
} from 'lucide-react';
import BookingButton from '../components/BookingButton';
import ServiceImageUpload from '../components/ServiceImageUpload';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useRevealAnimation } from '../hooks/useRevealAnimation';
import { services } from '../data/services';
import { siteContent } from '../content/siteContent';
import { supabase } from '../lib/supabase';

const serviceIcons: Record<string, React.ReactNode> = {
  'ceramic-coating': <Shield className="w-8 h-8" />,
  'paint-correction': <Sparkles className="w-8 h-8" />,
  'interior-detailing': <Car className="w-8 h-8" />,
  'exterior-detailing': <Droplets className="w-8 h-8" />,
  'wheel-restoration': <CircleDot className="w-8 h-8" />,
  'paint-touchup': <PaintBucket className="w-8 h-8" />,
  'rock-chip-repair': <Disc3 className="w-8 h-8" />,
  'paintless-dent-repair': <Zap className="w-8 h-8" />,
  'rv-detailing': <Truck className="w-8 h-8" />,
  'boat-detailing': <Ship className="w-8 h-8" />,
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

    if (!error && data) {
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
