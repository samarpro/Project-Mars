'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  bootstrap,
  completeSession,
  createDocument,
  createSession,
  fetchInsights,
  postInsightEvent,
  saveBlocks,
  type InsightRecord,
  type Mode,
  type SessionRecord,
} from '@/lib/api';

const MODE_COPY: Record<Mode, { title: string; description: string }> = {
  JOURNAL: {
    title: 'Journal Mode',
    description: 'Write without interruptions. Insights appear when you end the session.',
  },
  LEARNING: {
    title: 'Learning Mode',
    description: 'Insights can surface during writing to connect related concepts.',
  },
};

export default function WorkspaceApp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [spaceId, setSpaceId] = useState<number | null>(null);

  const [mode, setMode] = useState<Mode>('JOURNAL');
  const [title, setTitle] = useState('Untitled entry');
  const [content, setContent] = useState('');

  const [documentId, setDocumentId] = useState<number | null>(null);
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [insights, setInsights] = useState<InsightRecord[]>([]);

  const canStart = userId !== null && spaceId !== null && !session;
  const canSave = documentId !== null && session?.is_active;

  const modeCopy = useMemo(() => MODE_COPY[mode], [mode]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await bootstrap();
        setUserId(data.user.id);
        setSpaceId(data.default_space.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bootstrap data');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const startWritingSession = async () => {
    if (!userId || !spaceId) {
      return;
    }
    setError(null);
    setStatus('Starting session...');

    try {
      const { document } = await createDocument({
        user_id: userId,
        space_id: spaceId,
        title: title.trim() || 'Untitled entry',
        mode,
      });

      const { session: createdSession } = await createSession({
        user_id: userId,
        space_id: spaceId,
        document_id: document.id,
        mode,
      });

      setDocumentId(document.id);
      setSession(createdSession);
      setInsights([]);
      setStatus(`${modeCopy.title} session started.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start session');
      setStatus('');
    }
  };

  const syncContent = async (finalize = false) => {
    if (!documentId || !session) {
      return;
    }

    setError(null);
    setStatus(finalize ? 'Ending session and generating insights...' : 'Saving content...');

    try {
      const saved = await saveBlocks(documentId, {
        session_id: session.id,
        text: content,
        finalize,
      });

      let latestSession = saved.session;

      if (finalize && latestSession.is_active) {
        const completed = await completeSession(session.id);
        latestSession = completed.session;
      }

      setSession(latestSession);

      const insightResponse = await fetchInsights(session.id);
      setInsights(insightResponse.insights);

      setStatus(finalize ? `Session ended. ${insightResponse.insights.length} insights found.` : 'Saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync content');
      setStatus('');
    }
  };

  const trackInsight = async (insightId: number, eventType: string) => {
    if (!session) {
      return;
    }

    try {
      await postInsightEvent(insightId, { event_type: eventType, session_id: session.id });
      if (eventType === 'INSIGHT_DISMISSED') {
        setInsights((prev) => prev.filter((item) => item.id !== insightId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track insight event');
    }
  };

  if (loading) {
    return <main className="p-8">Loading workspace...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#151515] p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section className="bg-white rounded-2xl border border-[#e7e7e7] p-5 md:p-7 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Project Mars Workspace</h1>
          <p className="text-sm text-[#555] mt-1">Cross-reference your current writing with your past notes.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Entry title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-lg border border-[#ddd] px-3 py-2 outline-none focus:ring-2 focus:ring-[#d4d9ff]"
                placeholder="Untitled entry"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Mode</span>
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as Mode)}
                disabled={Boolean(session)}
                className="rounded-lg border border-[#ddd] px-3 py-2 outline-none focus:ring-2 focus:ring-[#d4d9ff] disabled:bg-[#f4f4f4]"
              >
                <option value="JOURNAL">Journal</option>
                <option value="LEARNING">Learning</option>
              </select>
            </label>
          </div>

          <div className="mt-3 text-xs text-[#666]">
            <strong>{modeCopy.title}:</strong> {modeCopy.description}
          </div>

          <div className="mt-5">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full h-[320px] rounded-xl border border-[#ddd] p-4 leading-relaxed outline-none focus:ring-2 focus:ring-[#d4d9ff]"
              placeholder="Start writing here. Use blank lines to create separate blocks."
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={startWritingSession}
              disabled={!canStart}
              className="px-4 py-2 rounded-lg bg-[#1d2a4d] text-white disabled:opacity-40"
            >
              Start Session
            </button>
            <button
              onClick={() => syncContent(false)}
              disabled={!canSave}
              className="px-4 py-2 rounded-lg border border-[#d7d7d7] bg-white disabled:opacity-40"
            >
              Save Blocks
            </button>
            <button
              onClick={() => syncContent(true)}
              disabled={!canSave}
              className="px-4 py-2 rounded-lg bg-[#0f766e] text-white disabled:opacity-40"
            >
              End Session + Get Insights
            </button>
          </div>

          {status ? <p className="mt-3 text-sm text-[#1f5a3c]">{status}</p> : null}
          {error ? <p className="mt-3 text-sm text-[#a31515] break-all">{error}</p> : null}
        </section>

        <aside className="bg-white rounded-2xl border border-[#e7e7e7] p-5 md:p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold">Insights</h2>
          <p className="text-sm text-[#666] mt-1">{mode === 'JOURNAL' ? 'Journal insights appear after session end.' : 'Learning insights can update during save.'}</p>

          <div className="mt-4 space-y-3">
            {insights.length === 0 ? (
              <p className="text-sm text-[#7a7a7a]">No insights yet.</p>
            ) : (
              insights.map((insight) => (
                <article key={insight.id} className="rounded-xl border border-[#e7e7e7] p-3 bg-[#fafafa]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold tracking-wide text-[#253159]">{insight.relation_type}</span>
                    <span className="text-xs text-[#666]">score {insight.score.toFixed(2)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#222]">{insight.reason_text}</p>
                  <p className="mt-2 text-xs text-[#575757] max-h-20 overflow-hidden">{insight.source_text}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => trackInsight(insight.id, 'INSIGHT_OPENED')}
                      className="text-xs px-2 py-1 rounded bg-[#e8ecff]"
                    >
                      Opened
                    </button>
                    <button
                      onClick={() => trackInsight(insight.id, 'INSIGHT_MARKED_USEFUL')}
                      className="text-xs px-2 py-1 rounded bg-[#dbf5ea]"
                    >
                      Useful
                    </button>
                    <button
                      onClick={() => trackInsight(insight.id, 'INSIGHT_DISMISSED')}
                      className="text-xs px-2 py-1 rounded bg-[#ffe4e4]"
                    >
                      Dismiss
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
