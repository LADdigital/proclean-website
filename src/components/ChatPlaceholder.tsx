import { lazy, Suspense } from 'react';

const Chatbot = lazy(() => import('./Chatbot'));

interface ChatPlaceholderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ChatPlaceholder({ isOpen, setIsOpen }: ChatPlaceholderProps) {
  return (
    <Suspense fallback={null}>
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
    </Suspense>
  );
}
