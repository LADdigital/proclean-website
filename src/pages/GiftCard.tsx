import { Gift, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BOOKING_URL, CONTACT } from '../data/services';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const GIFT_CARD_URL = BOOKING_URL;

const occasions = [
  { label: "Birthdays" },
  { label: "Father's Day" },
  { label: "Mother's Day" },
  { label: "Holidays" },
  { label: "Anniversaries" },
  { label: "Just Because" },
];

export default function GiftCard() {
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/30 rounded-full px-4 py-1.5 mb-6">
            <Gift className="w-4 h-4 text-brand-orange-light" />
            <span className="text-brand-orange-light font-semibold text-sm uppercase tracking-wider">Gift Cards</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Give the Gift of a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-light to-brand-red-light">
              Clean Car
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Treat someone special to a professional detail from Yakima's most trusted auto detailing shop.
            The perfect gift for any occasion — no wrapping required.
          </p>
          <a
            href={GIFT_CARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-brand-red text-white text-lg font-semibold rounded-xl hover:bg-brand-red/90 btn-apple-hover hover:shadow-lg hover:shadow-red-900/40 transition-all"
          >
            <Gift className="w-5 h-5" />
            Purchase a Gift Card
          </a>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in">
              <p className="text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">Why Gift Cards Work</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-6">
                The Thoughtful Gift They'll Actually Use
              </h2>
              <p className="text-stone-600 leading-relaxed mb-8">
                Everyone loves a clean car but rarely makes time for it. A Pro Clean gift card gives the people
                you care about a professional-grade detail from Yakima's most trusted shop — a real treat
                they'd never buy themselves.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-charcoal">Redeemable for any service</p>
                    <p className="text-sm text-stone-500 mt-0.5">From a quick wash to a full ceramic coating — the recipient chooses what they want.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-charcoal">No expiration stress</p>
                    <p className="text-sm text-stone-500 mt-0.5">They book when it's convenient for them. No rush, no pressure.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-charcoal">Backed by 15+ years of expertise</p>
                    <p className="text-sm text-stone-500 mt-0.5">You're gifting a premium experience from Yakima's most trusted detail team.</p>
                  </div>
                </li>
              </ul>
              <a
                href={GIFT_CARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-white font-semibold rounded-xl hover:bg-brand-red/90 btn-apple-hover hover:shadow-lg hover:shadow-red-900/30 transition-all"
              >
                <Gift className="w-5 h-5" />
                Purchase a Gift Card
              </a>
            </div>

            <div className="fade-in grid grid-cols-2 gap-4" style={{ transitionDelay: '100ms' }}>
              <div className="col-span-2 rounded-2xl bg-brand-charcoal p-8 text-white text-center">
                <div className="w-16 h-16 rounded-full bg-brand-red/20 flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-brand-orange-light" />
                </div>
                <p className="text-2xl font-bold mb-1">Pro Clean Gift Card</p>
                <p className="text-stone-400 text-sm">Valid for all services</p>
                <div className="mt-4 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <p className="text-xs text-stone-500 mt-2">5-star rated service</p>
              </div>
              {occasions.map((o) => (
                <div key={o.label} className="rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-center">
                  <p className="text-sm font-medium text-brand-charcoal">{o.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <p className="text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">Simple. Fast. Thoughtful.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Purchase Online', desc: 'Buy a gift card in minutes through our booking platform. Choose any amount you like.' },
              { step: '02', title: 'Send the Gift', desc: 'Forward the gift card to your recipient via email or text. Instant delivery, no shipping needed.' },
              { step: '03', title: 'They Book & Enjoy', desc: 'They schedule at their convenience and arrive to find Yakima\'s best detail team ready to go.' },
            ].map((item, i) => (
              <div key={item.step} className="fade-in text-center" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-14 h-14 rounded-full bg-brand-red text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-brand-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-brand-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <Gift className="w-12 h-12 text-brand-orange-light mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Make Someone's Day?
          </h2>
          <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
            A Pro Clean gift card is the gift that gets used, appreciated, and remembered.
            Purchase yours today or call us if you have questions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GIFT_CARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-red text-white font-semibold rounded-xl hover:bg-brand-red/90 btn-apple-hover hover:shadow-lg hover:shadow-red-900/40 transition-all"
            >
              <Gift className="w-5 h-5" />
              Purchase a Gift Card
            </a>
            <a
              href={CONTACT.phoneLink}
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold border-2 border-stone-600 rounded-xl hover:border-white btn-apple-hover transition-all"
            >
              Questions? Call Us
            </a>
          </div>
          <p className="text-stone-500 text-sm mt-6">
            Or browse our{' '}
            <Link to="/services" className="text-brand-orange-light hover:underline">
              full list of services
            </Link>{' '}
            to see what's included.
          </p>
        </div>
      </section>
    </div>
  );
}
