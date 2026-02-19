import { lazy, Suspense } from 'react';

const Chatbot = lazy(() => import('./Chatbot'));

export default function ChatPlaceholder() {
  return (
    <Suspense fallback={null}>
      <Chatbot />
    </Suspense>
  );
}
