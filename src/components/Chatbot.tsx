import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send } from 'lucide-react';

const WEBHOOK_URL = import.meta.env.VITE_CHATBOT_WEBHOOK || '';
const DEFAULT_BOOKING_URL = 'https://procleanautodetailing.setmore.com/book';
const BOOK_BUTTON_PATTERN = /\[SHOW_BOOK_BUTTON:\s*([^\]]+)\]/;

const SERVICE_BOOKING_URLS: Record<string, string> = {
  'Mid Size SUV/Truck Complete': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=b15ff53ba1790709e7c944d3307dd5ccd09eb932&type=service&staff=SKIP&staffSelected=false',
  'Full Size SUV/Truck Complete': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=b4e9d667367b1fd152eb0e5077efb8fbf2c7f1df&type=service&staff=SKIP&staffSelected=false',
  'Car/Small Truck Complete': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=0eaeb1ba0a28c6f8e2dd5247eb29abb17019e1d8&type=service&staff=SKIP&staffSelected=false',
  'Mini Detail': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=s946e1483395536521&type=service&staff=SKIP&staffSelected=false',
  'Car/Small Truck Interior Only': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=392a38de25ae35b788bc21134304e0b36b92eb5f&type=service&staff=SKIP&staffSelected=false',
  'Mid Size SUV/Truck Interior Only': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=4c9fc8e62141d84f058d576f135e94975309ad4e&type=service&staff=SKIP&staffSelected=false',
  'Full Size SUV/Truck Interior Only': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=dc7387e8caa777cbe987fb46eedb130038bd2012&type=service&staff=SKIP&staffSelected=false',
  'Car/Small Truck Exterior Only': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=28a6eda1c7711e836f33f9b76dfb97df1775baa6&type=service&staff=SKIP&staffSelected=false',
  'Mid Size SUV/Truck Exterior Only': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=03e29ea5fba2f4a975b931b9a1a2d4170df701c7&type=service&staff=SKIP&staffSelected=false',
  'Large SUV/Truck Exterior Only': 'https://procleanautodetailing.setmore.com/book?step=time-slot&products=47fc942f9af14961ca1439542ea8bf0182fa2c6a&type=service&staff=SKIP&staffSelected=false',
};

function resolveBookingUrl(serviceName: string): string {
  const trimmed = serviceName.trim();
  return SERVICE_BOOKING_URLS[trimmed] ?? DEFAULT_BOOKING_URL;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  showBookButton?: boolean;
  bookingUrl?: string;
}

interface WebhookResponse {
  bot_message: string;
  mode?: string;
  confidence?: string;
}

function CustomChatIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-9 h-9' : 'w-6 h-6';
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={sizeClass}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;

  const scripts = div.querySelectorAll('script, iframe, object, embed, form');
  scripts.forEach(el => el.remove());

  const allElements = div.querySelectorAll('*');
  allElements.forEach(el => {
    const attrs = Array.from(el.attributes);
    attrs.forEach(attr => {
      if (attr.name.startsWith('on') || attr.value.includes('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return div.innerHTML;
}

function parseResponse(response: WebhookResponse): { content: string; showBookButton: boolean; bookingUrl: string } {
  let content = response.bot_message || '';
  const match = content.match(BOOK_BUTTON_PATTERN);
  const showBookButton = match !== null;
  const bookingUrl = match ? resolveBookingUrl(match[1]) : DEFAULT_BOOKING_URL;

  content = content.replace(BOOK_BUTTON_PATTERN, '').trim();
  content = sanitizeHTML(content);

  return { content, showBookButton, bookingUrl };
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function sendMessageToWebhook(message: string, sessionId: string): Promise<WebhookResponse | null> {
  if (!WEBHOOK_URL) {
    return null;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chatbot webhook error:', error);
    return null;
  }
}

function MessageBubble({
  message,
  prefersReducedMotion
}: {
  message: Message;
  prefersReducedMotion: boolean;
}) {
  const isUser = message.role === 'user';
  const animationClass = prefersReducedMotion ? '' : 'animate-fadeInUp';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${animationClass}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-white/10 backdrop-blur-sm border-r-2 border-brand-red/50 text-white'
            : 'bg-white/5 backdrop-blur-sm text-stone-200'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div
            className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        )}
      </div>

      {message.showBookButton && (
        <a
          href={message.bookingUrl ?? DEFAULT_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-900/30 transition-all text-center"
        >
          Book Now
        </a>
      )}
    </div>
  );
}

function LoadingIndicator({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <div className="flex items-start">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-stone-400"
              style={{
                animation: prefersReducedMotion ? 'none' : `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Chatbot({ isOpen, setIsOpen }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [sessionId, setSessionId] = useState(() => generateUUID());
  const [isShaking, setIsShaking] = useState(false);
  const [isMobileHidden, setIsMobileHidden] = useState(() => {
    return sessionStorage.getItem('chatWidgetHidden') === 'true';
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hideMobileWidget = () => {
    setIsMobileHidden(true);
    sessionStorage.setItem('chatWidgetHidden', 'true');
    if (isOpen) setIsOpen(false);
  };

  const showMobileWidget = () => {
    setIsMobileHidden(false);
    sessionStorage.setItem('chatWidgetHidden', 'false');
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isOpen || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 700);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, prefersReducedMotion]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setSessionId(generateUUID());
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const response = await sendMessageToWebhook(trimmedInput, sessionId);

    let assistantMessage: Message;

    if (response && response.bot_message) {
      const { content, showBookButton, bookingUrl } = parseResponse(response);
      assistantMessage = { role: 'assistant', content, showBookButton, bookingUrl };
    } else {
      assistantMessage = {
        role: 'assistant',
        content: "Sorry, we're having trouble connecting right now. Please call us directly at 509-454-9299.",
      };
    }

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const animationClass = prefersReducedMotion ? '' : 'transition-all duration-300';

  return (
    <>
      {/* Mobile restore tab — shown only when widget is hidden on mobile */}
      <button
        onClick={showMobileWidget}
        aria-label="Show chat widget"
        className={`fixed bottom-20 right-0 z-[9999] sm:hidden flex items-center gap-1.5 pl-3 pr-2 py-2 bg-gradient-to-r from-brand-red to-brand-orange text-white text-xs font-semibold rounded-l-xl shadow-lg transition-all duration-300 ${isMobileHidden ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
      >
        <CustomChatIcon size="sm" />
        Chat
      </button>

      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat assistant"
        aria-expanded={isOpen}
        className={`fixed bottom-4 right-6 z-[9999] group overflow-visible ${isShaking ? 'animate-widget-shake' : ''} transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-75' : isMobileHidden ? 'sm:flex hidden' : 'flex'}`}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Curved text SVG wrapper — sized to encompass the 80px button with arc labels */}
        <div className="relative w-[124px] h-[124px] flex items-center justify-center overflow-visible">
          {!isOpen && (
            <svg
              viewBox="0 0 124 124"
              className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="topArc"
                  d="M 22,54 A 40,40 0 0,1 102,54"
                  fill="none"
                />
              </defs>
              <text
                fontSize="10.5"
                fontWeight="700"
                fontFamily="inherit"
                fill="#f97316"
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.85))' }}
              >
                <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                  Chat with Us!
                </textPath>
              </text>
            </svg>
          )}

          <div
            className={`relative w-20 h-20 flex items-center justify-center text-white cursor-pointer
              ${animationClass}
              ${isOpen ? 'scale-95' : 'scale-100 group-hover:scale-110'}
            `}
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br from-brand-red to-brand-orange opacity-0 blur-xl
                ${animationClass}
                ${isOpen ? 'opacity-70' : 'group-hover:opacity-50'}
              `}
            />
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br from-brand-red to-brand-orange border border-white/60 ${animationClass}`}
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25), 0 4px 12px rgba(185,28,28,0.3)' }}
            />
            <div className={`relative z-10 ${animationClass}`}>
              <CustomChatIcon size="lg" />
            </div>
          </div>

          {/* Mobile-only dismiss button — small X in top-left corner of the widget area */}
          {!isOpen && (
            <button
              onClick={(e) => { e.stopPropagation(); hideMobileWidget(); }}
              aria-label="Hide chat widget"
              className="absolute top-0.5 left-0.5 sm:hidden w-5 h-5 rounded-full bg-stone-700/80 text-stone-300 hover:bg-stone-600 hover:text-white transition-colors flex items-center justify-center"
            >
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="10" y2="10" />
                <line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            </button>
          )}
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={panelRef}
        className={`fixed z-[10000] flex flex-col bg-brand-charcoal/95 backdrop-blur-[12px] border border-white/10 shadow-2xl rounded-2xl
          ${animationClass}
          ${isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none translate-y-4'
          }
          bottom-4 right-4
          w-[calc(100vw-2rem)] max-w-sm
          lg:bottom-28 lg:right-6 lg:h-[600px]
        `}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          maxHeight: 'min(calc(100svh - 5rem), 600px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-brand-red to-brand-orange text-white">
              <CustomChatIcon />
            </div>
            <div>
              <h2 id="chatbot-title" className="text-sm sm:text-base font-semibold text-white">
                Pro Clean Assistant
              </h2>
              <p className="text-xs text-stone-400">Here to help</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close chat"
            className="p-2 text-stone-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4 lg:flex-1" style={{ minHeight: 0 }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center px-4 py-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-red to-brand-orange flex items-center justify-center mb-3">
                <CustomChatIcon />
              </div>
              <h3 className="text-white font-semibold mb-1">Welcome!</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Ask us about our detailing services, pricing, or business.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}

          {isLoading && <LoadingIndicator prefersReducedMotion={prefersReducedMotion} />}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/30 text-sm disabled:opacity-50"
              aria-label="Chat message input"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white rounded-xl hover:shadow-lg hover:shadow-red-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-stone-500 text-center mt-2">Powered by <a href="https://laddigitalofyakima.com" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors underline">LAD Digital</a></p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.2s ease-out;
        }

        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fadeInUp {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
