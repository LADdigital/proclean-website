import { Shield, Award, Users, Heart, Star, CheckCircle } from 'lucide-react';
import BookingButton from '../components/BookingButton';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Quality Craftsmanship',
    description: 'Every vehicle receives our full attention. We never cut corners or rush a job. The finish has to meet our standard before it leaves the shop.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Experience You Can Trust',
    description: 'Over 15 years of hands-on detailing in Yakima means we\'ve seen and handled it all. Our expertise comes from thousands of real-world jobs.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Dedicated Team',
    description: 'Our team is trained in the latest detailing techniques and products. We invest in our people because skilled technicians deliver better results.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Community First',
    description: 'We\'re Yakima locals serving Yakima drivers. This is our community, and our reputation is built on doing right by our neighbors.',
  },
];

export default function About() {
  const animRef = useScrollAnimation();

  return (
    <div ref={animRef}>
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/procleanteam.jpeg"
            alt="Pro Clean Auto Detail Systems shop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/80 to-brand-charcoal" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-orange-light font-semibold text-sm uppercase tracking-wider mb-3">
              About Us
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Yakima's Trusted Auto Detailing Experts Since 2010
            </h1>
            <p className="text-lg text-stone-400 leading-relaxed">
              Pro Clean Auto Detail Systems has been serving the Yakima Valley for over 15 years,
              building a reputation for quality work and honest service.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Pro Clean Auto Detail Systems started with a simple mission: deliver the
                  highest quality auto detailing in Yakima, WA. What began as a one-person
                  operation has grown into one of the most respected detailing shops in Central
                  Washington, with a full team of trained technicians and a facility equipped
                  to handle everything from daily drivers to luxury vehicles, RVs, and boats.
                </p>
                <p>
                  Over the past 15 years, we've detailed thousands of vehicles for customers
                  across Yakima and the surrounding areas, including Selah, Union Gap, Terrace
                  Heights, and the greater Yakima Valley. Our growth has been driven entirely
                  by word-of-mouth referrals and repeat customers — a testament to the quality
                  of work we deliver every day.
                </p>
                <p>
                  We've continually invested in advanced tools, premium products, and ongoing
                  training to stay at the forefront of the detailing industry. From professional-grade
                  ceramic coatings to multi-stage paint correction, we bring the same precision
                  and care to every job, regardless of size.
                </p>
              </div>
            </div>
            <div className="fade-in-right rounded-2xl overflow-hidden shadow-2xl bg-brand-charcoal image-hover-apple">
              <img
                src="/procleanteam.jpeg"
                alt="The Pro Clean Auto Detail Systems team at their Yakima, WA shop"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <p className="text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="fade-in p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-red-50 text-brand-red flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-brand-charcoal mb-2">{value.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in-left order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-xl p-8 text-center">
                  <p className="text-4xl font-bold text-brand-red">15+</p>
                  <p className="text-sm text-stone-500 mt-2">Years in Business</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-8 text-center">
                  <p className="text-4xl font-bold text-brand-red">9</p>
                  <p className="text-sm text-stone-500 mt-2">Specialized Services</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-8 text-center col-span-2">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-brand-orange fill-brand-orange" />
                    ))}
                  </div>
                  <p className="text-sm text-stone-500">5-Star Rated on Google</p>
                </div>
              </div>
            </div>
            <div className="fade-in-right order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal mb-6">
                Why Yakima Trusts Pro Clean
              </h2>
              <ul className="space-y-4">
                {[
                  'Locally owned and operated in Yakima, WA',
                  'Full team of trained and experienced technicians',
                  'Professional-grade products and equipment',
                  'Services for cars, trucks, SUVs, RVs, and boats',
                  'Convenient online booking through Setmore',
                  'Serving Yakima, Selah, Union Gap, and surrounding areas',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                    <span className="text-stone-600">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <BookingButton size="lg">
                  Schedule Your Detail
                </BookingButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
