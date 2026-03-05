import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import BookingButton from '../components/BookingButton';
import SocialLinks from '../components/SocialLinks';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { CONTACT } from '../data/services';

export default function Contact() {
  const animRef = useScrollAnimation();

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
              Get in Touch
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Contact Pro Clean Auto Detail Systems
            </h1>
            <p className="text-lg text-stone-400 leading-relaxed">
              Ready to schedule your detail? Have a question about our services? We're here to help.
              Reach out by phone, email, or visit our shop in Yakima, WA.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2 lg:col-start-4 fade-in-right space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Contact Information</h2>
                <ul className="space-y-5">
                  <li>
                    <a href={CONTACT.phoneLink} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-lg bg-red-50 text-brand-red flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-charcoal">Phone</p>
                        <p className="text-sm text-stone-500 group-hover:text-brand-red transition-colors">{CONTACT.phone}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href={CONTACT.emailLink} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-lg bg-red-50 text-brand-red flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-charcoal">Email</p>
                        <p className="text-sm text-stone-500 group-hover:text-brand-red transition-colors">{CONTACT.email}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href={CONTACT.addressLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-lg bg-red-50 text-brand-red flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-charcoal">Address</p>
                        <p className="text-sm text-stone-500 group-hover:text-brand-red transition-colors">{CONTACT.address}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-charcoal">Business Hours</p>
                        <div className="text-sm text-stone-500 space-y-0.5 mt-1">
                          <p>{CONTACT.hours.weekday}</p>
                          {CONTACT.hours.saturday && <p>{CONTACT.hours.saturday}</p>}
                          <p className="text-brand-red font-medium">{CONTACT.hours.sunday}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider mb-3">
                  Follow Us
                </h3>
                <SocialLinks variant="dark" />
              </div>

              <div className="p-6 rounded-xl bg-red-50 border border-red-100">
                <h3 className="font-semibold text-brand-charcoal mb-2">
                  Book Online
                </h3>
                <p className="text-sm text-stone-600 mb-4">
                  Skip the phone call and book your appointment online through Setmore.
                </p>
                <BookingButton size="sm">
                  Book Appointment
                </BookingButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-8 text-center fade-in">
            Find Us in Yakima
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200 fade-in">
            <iframe
              title="Pro Clean Auto Detail Systems Location - 1231 S 1st, Yakima, WA 98901"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2756.5!2d-120.5115!3d46.5958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s1231+S+1st+St%2C+Yakima%2C+WA+98901!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
