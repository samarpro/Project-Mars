export type Mode = 'JOURNAL' | 'LEARNING';

export type Space = {
  id: number;
  name: string;
};

export type DocumentRecord = {
  id: number;
  title: string;
  mode: Mode;
  space_id: number;
  updated_at: string;
};

export type SessionRecord = {
  id: number;
  space_id: number;
  document_id: number | null;
  mode: Mode;
  is_active: boolean;
  started_at: string;
  ended_at: string | null;
};

export type InsightRecord = {
  id: number;
  relation_type: string;
  reason_text: string;
  score: number;
  source_text: string;
  current_text: string;
  created_at: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function bootstrap() {
  return request<{ user: { id: number; username: string }; default_space: Space; spaces: Space[]; documents: DocumentRecord[] }>(
    '/bootstrap'
  );
}

export function createDocument(payload: { user_id: number; space_id: number; title: string; mode: Mode }) {
  return request<{ document: DocumentRecord }>('/documents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createSession(payload: { user_id: number; space_id: number; document_id: number; mode: Mode }) {
  return request<{ session: SessionRecord }>('/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function saveBlocks(documentId: number, payload: { session_id: number; text: string; finalize?: boolean }) {
  return request<{ document_id: number; block_count: number; insight_count: number; session: SessionRecord }>(
    `/documents/${documentId}/blocks`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

export function completeSession(sessionId: number) {
  return request<{ session: SessionRecord; insight_count: number }>(`/sessions/${sessionId}/complete`, {
    method: 'POST',
    body: '{}',
  });
}

export function fetchInsights(sessionId: number) {
  return request<{ insights: InsightRecord[] }>(`/insights?session_id=${sessionId}`);
}

export function postInsightEvent(insightId: number, payload: { event_type: string; session_id?: number; metadata?: Record<string, unknown> }) {
  return request<{ event_id: number; created_at: string }>(`/insights/${insightId}/events`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
