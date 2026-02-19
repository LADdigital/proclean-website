import { useState, type FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import BookingButton from '../components/BookingButton';
import ImagePlaceholder from '../components/ImagePlaceholder';
import SocialLinks from '../components/SocialLinks';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { CONTACT } from '../data/services';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const animRef = useScrollAnimation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          service: formState.service,
          message: formState.message,
        }]);

      if (dbError) throw dbError;

      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      setError('Something went wrong. Please call us directly or try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={animRef}>
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ImagePlaceholder alt="Pro Clean Auto Detail Systems" className="w-full h-full" />
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
            <div className="lg:col-span-3 fade-in-left">
              <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="p-8 rounded-xl bg-green-50 border border-green-200 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent</h3>
                  <p className="text-green-700">
                    We'll get back to you as soon as possible. For immediate assistance,
                    call us at{' '}
                    <a href={CONTACT.phoneLink} className="font-semibold underline">
                      {CONTACT.phone}
                    </a>
                    .
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2 text-sm font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Phone (optional)
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
                        placeholder="(509) 555-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Service Interest
                      </label>
                      <select
                        id="service"
                        value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors bg-white"
                      >
                        <option value="">Select a service</option>
                        <option value="ceramic-coating">Ceramic Coating</option>
                        <option value="paint-correction">Paint Correction</option>
                        <option value="interior-detailing">Interior Detailing</option>
                        <option value="exterior-detailing">Exterior Detailing</option>
                        <option value="wheel-restoration">Wheel Restoration</option>
                        <option value="paint-touchup">Paint Touchup</option>
                        <option value="rock-chip-repair">Rock Chip Repair</option>
                        <option value="rv-detailing">RV Detailing</option>
                        <option value="boat-detailing">Boat Detailing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors resize-none"
                      placeholder="Tell us about your vehicle and what you're looking for..."
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-brand-red text-white font-semibold rounded-lg btn-apple-hover hover:shadow-lg hover:shadow-red-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-2 fade-in-right space-y-8">
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
                          <p>{CONTACT.hours.saturday}</p>
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
