import { supabase } from './supabase';

const SITE_NAME = 'procleanautodetailing';
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/jqbnqvj7fblonsrcr320pta1jiypxb1x';
const SAMPLE_RATE = 0.8;

const SESSION_ID_KEY = 'chat_session_id';
const SESSION_SAMPLED_KEY = 'chat_session_sampled';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  message: string;
}

export interface MakePayload {
  site: string;
  session_id: string;
  conversation: ConversationMessage[];
  created_at: string;
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

async function sendConversationToMake(payload: MakePayload): Promise<void> {
  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Make.com webhook send failed:', error);
  }
}

export async function saveConversation(
  sessionId: string,
  conversation: ConversationMessage[]
): Promise<void> {
  if (!supabase) return;

  try {
    const { data, error } = await supabase
      .from('chat_logs')
      .upsert(
        {
          session_id: sessionId,
          site: SITE_NAME,
          conversation,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id' }
      )
      .select('created_at')
      .maybeSingle();

    if (error) {
      console.error('Chat log save failed:', error);
      return;
    }

    const payload: MakePayload = {
      site: SITE_NAME,
      session_id: sessionId,
      conversation,
      created_at: data?.created_at ?? new Date().toISOString(),
    };

    sendConversationToMake(payload);
  } catch (err) {
    console.error('Chat log unexpected error:', err);
  }
}
