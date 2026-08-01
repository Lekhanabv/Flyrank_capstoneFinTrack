"use client";

import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { useEffect, useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default function HealthCheckPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchHealthData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: Post = await response.json();

        if (isMounted) {
          setPost(data);
          setError(null);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Unknown error");
          setPost(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchHealthData();

    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  return (
    <AppShell title="Health Check">
      <Card className="p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">System status</p>
            <h2 className="mt-1 text-2xl font-semibold">API health overview</h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Live check
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              <span className="font-medium">Loading health data…</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]">Error</p>
            <p className="mt-3 text-lg font-medium">Unable to fetch health data</p>
            <p className="mt-2 text-sm text-rose-600">{error}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setRetryKey((value) => value + 1)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-500"
              >
                Retry request
              </button>
            </div>
          </div>
        ) : post ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Success</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-600">Post ID: {post.id} • User ID: {post.userId}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Response body</p>
              <p className="mt-3 leading-7 text-slate-700">{post.body}</p>
            </div>
          </div>
        ) : null}
      </Card>
    </AppShell>
  );
}
