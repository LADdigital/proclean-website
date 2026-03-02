import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://www.procleanautodetailsystems.com';

interface SEOMeta {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  ogType?: string;
}

const PAGE_META: Record<string, SEOMeta> = {
  '/': {
    title: 'Pro Clean Auto Detail Systems | Yakima, WA Auto Detailing',
    description:
      "Yakima's premier auto detailing shop with 15+ years experience. Ceramic coating, paint correction, interior & exterior detailing. Call 509-454-9299.",
    keywords:
      'auto detailing Yakima WA, ceramic coating Yakima, paint correction Yakima, car detailing Yakima, Pro Clean Auto Detail',
    ogImage: `${BASE_URL}/procleanteam.jpeg`,
  },
  '/about': {
    title: "About Pro Clean Auto Detail | Yakima's Trusted Detailers Since 2010",
    description:
      "Meet the Pro Clean Auto Detail team — Yakima's trusted detailers since 2010. Locally owned, 15+ years experience, serving Yakima Valley with pride.",
    keywords:
      'about Pro Clean Auto Detail, Yakima auto detailing history, local auto detailers Yakima WA, trusted car detailing Yakima',
    ogImage: `${BASE_URL}/procleanteam.jpeg`,
  },
  '/services': {
    title: 'Auto Detailing Services in Yakima, WA | Pro Clean Auto Detail',
    description:
      'Explore all Pro Clean services: ceramic coating, paint correction, interior & exterior detailing, wheel restoration, paintless dent repair, and more.',
    keywords:
      'auto detailing services Yakima, ceramic coating Yakima, paint correction Yakima, interior detailing Yakima, wheel restoration Yakima, paintless dent repair Yakima',
    ogImage: `${BASE_URL}/ceramiccoating.jpeg`,
  },
  '/gallery': {
    title: 'Auto Detailing Gallery | Pro Clean Auto Detail Yakima, WA',
    description:
      'Browse real before & after photos from Pro Clean Auto Detail Systems. Every image shows actual detailing work performed at our Yakima, WA shop.',
    keywords:
      'auto detailing gallery Yakima, before after car detailing, ceramic coating results Yakima, paint correction results Yakima',
    ogImage: `${BASE_URL}/procleanteam.jpeg`,
  },
  '/contact': {
    title: 'Contact Pro Clean Auto Detail | Yakima, WA — Call 509-454-9299',
    description:
      'Contact Pro Clean Auto Detail Systems in Yakima, WA. Call 509-454-9299, email us, or visit 1231 S 1st St. Book your detailing appointment today.',
    keywords:
      'contact Pro Clean Auto Detail, auto detailing Yakima phone, book car detailing Yakima, 509-454-9299, 1231 S 1st Yakima WA',
    ogImage: `${BASE_URL}/procleanteam.jpeg`,
  },
  '/gift-card': {
    title: 'Auto Detailing Gift Cards | Pro Clean Auto Detail Yakima, WA',
    description:
      'Give the gift of a professionally detailed car. Pro Clean Auto Detail gift cards are redeemable for any service. Perfect for any occasion in Yakima, WA.',
    keywords:
      'auto detailing gift card Yakima, car detail gift Yakima WA, Pro Clean gift card, detailing gift ideas Yakima',
    ogImage: `${BASE_URL}/procleanteam.jpeg`,
  },
};

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = PAGE_META[pathname] ?? PAGE_META['/'];
    const canonicalURL = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
    const ogImage = meta.ogImage ?? `${BASE_URL}/procleanteam.jpeg`;

    document.title = meta.title;

    setMeta('title', meta.title);
    setMeta('description', meta.description);
    setMeta('keywords', meta.keywords);
    setCanonical(canonicalURL === BASE_URL ? `${BASE_URL}/` : canonicalURL);

    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', canonicalURL === BASE_URL ? `${BASE_URL}/` : canonicalURL, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:type', meta.ogType ?? 'website', 'property');

    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', ogImage);
  }, [pathname]);
}
