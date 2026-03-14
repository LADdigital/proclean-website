import { supabase } from './supabase';

export const SITE_NAME = 'procleanautodetailing';
const SAMPLE_RATE = 0.8;

const SESSION_ID_KEY = 'chat_session_id';
const SESSION_SAMPLED_KEY = 'chat_session_sampled';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  message: string;
}

interface ChatMessagePayload {
  type: 'chat_message';
  site: string;
  session_id: string;
  message: string;
  timestamp: string;
}

interface ConversationUpdatePayload {
  type: 'conversation_update';
  site: string;
  session_id: string;
  conversation: ConversationMessage[];
  timestamp: string;
}

export function generateSessionId(): string {
  const existing = localStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

  localStorage.setItem(SESSION_ID_KEY, id);
  return id;
}

export function resetSessionId(): string {
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_SAMPLED_KEY);
  return generateSessionId();
}

export function shouldSampleConversation(): boolean {
  const existing = localStorage.getItem(SESSION_SAMPLED_KEY);
  if (existing !== null) return existing === 'true';

  const sampled = Math.random() < SAMPLE_RATE;
  localStorage.setItem(SESSION_SAMPLED_KEY, String(sampled));
  return sampled;
}

function getWebhookUrl(): string {
  return (import.meta.env.VITE_CHATBOT_WEBHOOK as string) || '';
}

export async function sendChatMessageWebhook(
  sessionId: string,
  message: string
): Promise<void> {
  const url = getWebhookUrl();
  if (!url) return;

  const payload: ChatMessagePayload = {
    type: 'chat_message',
    site: SITE_NAME,
    session_id: sessionId,
    message,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Chat message webhook failed:', error);
  }
}

async function sendConversationUpdateWebhook(
  sessionId: string,
  conversation: ConversationMessage[]
): Promise<void> {
  const url = getWebhookUrl();
  if (!url) return;

  const payload: ConversationUpdatePayload = {
    type: 'conversation_update',
    site: SITE_NAME,
    session_id: sessionId,
    conversation,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Conversation update webhook failed:', error);
  }
}

export async function saveConversation(
  sessionId: string,
  conversation: ConversationMessage[]
): Promise<void> {
  if (!supabase) {
    sendConversationUpdateWebhook(sessionId, conversation);
    return;
  }

  try {
    const { error } = await supabase
      .from('chat_logs')
      .upsert(
        {
          session_id: sessionId,
          site: SITE_NAME,
          conversation,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id' }
      );

    if (error) {
      console.error('Chat log save failed:', error);
    }

    sendConversationUpdateWebhook(sessionId, conversation);
  } catch (err) {
    console.error('Chat log unexpected error:', err);
    sendConversationUpdateWebhook(sessionId, conversation);
  }
}
