import { apiFetch } from "./api";

export interface ChatUserBrief {
  user_id: number;
  full_name: string;
  avatar_url?: string | null;
}

export interface ChatLastMessage {
  message_id: number;
  content: string;
  type: string;
  created_at: string;
  sender_id: number;
}

export interface ChatConversation {
  conversation_id: number;
  participant: ChatUserBrief;
  last_message?: ChatLastMessage | null;
  unread_count: number;
  last_message_at?: string | null;
  created_at: string;
}

export interface ChatMessage {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  type: string;
  translated_content?: string | null;
  created_at: string;
  is_read: boolean;
}

export interface PusherConfig {
  key: string;
  cluster: string;
  auth_endpoint: string;
}

export function listConversations() {
  return apiFetch<{ data: ChatConversation[]; pagination: unknown }>("/api/v1/conversations");
}

export function createOrGetConversation(receiverId: number) {
  return apiFetch<{ data: ChatConversation }>("/api/v1/conversations", {
    method: "POST",
    body: JSON.stringify({ receiver_id: receiverId }),
  });
}

export function listMessages(conversationId: number) {
  return apiFetch<{ data: ChatMessage[]; next_cursor?: number | null }>(
    `/api/v1/conversations/${conversationId}/messages?limit=50`
  );
}

export function sendMessage(conversationId: number, content: string) {
  return apiFetch<{ data: ChatMessage }>(`/api/v1/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content, type: "TEXT" }),
  });
}

export function markConversationRead(conversationId: number, lastReadMessageId?: number) {
  return apiFetch<null>(`/api/v1/conversations/${conversationId}/read`, {
    method: "POST",
    body: JSON.stringify({ last_read_message_id: lastReadMessageId ?? null }),
  });
}

export function sendTypingStatus(conversationId: number, isTyping: boolean) {
  return apiFetch<null>(`/api/v1/conversations/${conversationId}/typing`, {
    method: "POST",
    body: JSON.stringify({ is_typing: isTyping }),
  });
}

export function translateMessage(messageId: number, targetLanguage: "VI" | "JA" = "VI") {
  return apiFetch<{
    data: {
      message_id: number;
      original_content: string;
      translated_content: string;
      target_language: "VI" | "JA";
    };
  }>(`/api/v1/messages/${messageId}/translate`, {
    method: "POST",
    body: JSON.stringify({ target_language: targetLanguage }),
  });
}

export function getPusherConfig() {
  return apiFetch<{ data: PusherConfig }>("/api/v1/pusher/config");
}
