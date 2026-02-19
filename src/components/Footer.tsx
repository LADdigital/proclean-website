import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { CONTACT, BOOKING_URL, services } from '../data/services';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img
              src="/Photoroom_20260213_195605.png"
              alt="Pro Clean Auto Detail Systems"
              className="h-16 w-auto mb-4"
            />
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              Yakima's trusted auto detailing professionals. Over 15 years of experience delivering
              exceptional results for cars, trucks, RVs, and boats.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Pro Clean on Instagram"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-brand-red hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Pro Clean on Facebook"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-brand-red hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services#${service.id}`}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-stone-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm text-stone-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-sm text-stone-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="text-sm text-stone-400 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-sm text-stone-400 hover:text-white transition-colors">Contact</Link></li>
              <li>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-orange-light hover:text-white transition-colors">
                  Book Appointment
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a href={CONTACT.phoneLink} className="flex items-start gap-3 text-sm text-stone-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={CONTACT.emailLink} className="flex items-start gap-3 text-sm text-stone-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.addressLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-stone-400 hover:text-white transition-colors">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {CONTACT.address}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-400">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p>{CONTACT.hours.weekday}</p>
                  <p>{CONTACT.hours.saturday}</p>
                  <p>{CONTACT.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              &copy; {new Date().getFullYear()} Pro Clean Auto Detail Systems. All rights reserved.
            </p>
            <p className="text-xs text-stone-500">
              1231 S 1st, Yakima, WA 98901
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
