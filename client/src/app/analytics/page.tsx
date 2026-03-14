"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { TaskAnalyticsBucket } from "@/types/task";
import { HiOutlineRefresh } from "react-icons/hi";

const EMPTY_BUCKETS: TaskAnalyticsBucket[] = [];

const toBucketMap = (buckets: TaskAnalyticsBucket[]) =>
  buckets.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item._id]: item.count }), {});

function BucketBars({
  title,
  buckets,
  max,
  colorClass,
}: {
  title: string;
  buckets: TaskAnalyticsBucket[];
  max: number;
  colorClass: string;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-3">
        {buckets.length === 0 ? (
          <p className="text-sm text-gray-400">No data</p>
        ) : (
          buckets.map((bucket) => {
            const widthPct = max === 0 ? 0 : Math.max(6, Math.round((bucket.count / max) * 100));
            return (
              <div key={bucket._id}>
                <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{bucket._id}</span>
                  <span className="font-semibold text-gray-700">{bucket.count}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${widthPct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const {
    tasks,
    analytics,
    isLoading,
    analyticsLoading,
    analyticsError,
    fetchTasks,
    fetchAnalytics,
  } = useTaskStore();

  useEffect(() => {
    if (!user) return;
    void fetchTasks();
    void fetchAnalytics();
  }, [fetchAnalytics, fetchTasks, user]);

  const statusBuckets = analytics?.byStatus ?? EMPTY_BUCKETS;
  const priorityBuckets = analytics?.byPriority ?? EMPTY_BUCKETS;
  const categoryBuckets = analytics?.byCategory ?? EMPTY_BUCKETS;
  const dueTimelineBuckets = analytics?.dueTimeline ?? EMPTY_BUCKETS;
  const topTags = analytics?.topTags ?? EMPTY_BUCKETS;

  const maxBarValue = (() => {
    const all = [...statusBuckets, ...priorityBuckets, ...categoryBuckets, ...dueTimelineBuckets, ...topTags];
    return all.reduce((max, item) => Math.max(max, item.count), 0);
  })();

  const statusMap = toBucketMap(statusBuckets);
  const overview = analytics?.overview;

  const inboxCount = tasks.filter((task) => task.status !== "done").length;

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar inboxCount={inboxCount} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-start justify-between px-8 pt-7 pb-4 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Task Analytics</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Aggregation dashboard from MongoDB pipeline ({analytics?.generatedAt ? new Date(analytics.generatedAt).toLocaleString() : "not loaded"})
            </p>
          </div>
          <button
            type="button"
            onClick={() => { void fetchAnalytics(); }}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-200 hover:border-primary/40 hover:text-primary"
          >
            <HiOutlineRefresh className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {analyticsLoading || isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-24 rounded-2xl bg-white/70 animate-pulse" />
              ))}
            </div>
          ) : analyticsError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 max-w-3xl">
              Failed to load analytics: {analyticsError}
            </div>
          ) : !overview ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400 bg-white max-w-3xl">
              No analytics data yet.
            </div>
          ) : (
            <div className="space-y-6">
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <article className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Total Tasks</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{overview.total}</p>
                </article>
                <article className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Done</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600">{overview.done}</p>
                </article>
                <article className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <p className="text-xs uppercase tracking-wide text-gray-400">In Progress</p>
                  <p className="mt-1 text-2xl font-bold text-sky-600">{overview.inProgress}</p>
                </article>
                <article className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Overdue</p>
                  <p className="mt-1 text-2xl font-bold text-rose-600">{overview.overdue}</p>
                </article>
                <article className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Completion</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{overview.completionRate}%</p>
                </article>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">Status Mix</h3>
                  <p className="text-xs text-gray-400">todo / in-progress / done</p>
                </div>
                <div className="mt-4 h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
                  {[
                    { key: "todo", color: "bg-amber-400" },
                    { key: "in-progress", color: "bg-sky-500" },
                    { key: "done", color: "bg-emerald-500" },
                  ].map((segment) => {
                    const count = statusMap[segment.key] ?? 0;
                    const width = overview.total === 0 ? 0 : (count / overview.total) * 100;
                    return <div key={segment.key} className={segment.color} style={{ width: `${width}%` }} />;
                  })}
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>Todo: {statusMap.todo ?? 0}</span>
                  <span>In-progress: {statusMap["in-progress"] ?? 0}</span>
                  <span>Done: {statusMap.done ?? 0}</span>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <BucketBars title="By Priority" buckets={priorityBuckets} max={maxBarValue} colorClass="bg-sky-500" />
                <BucketBars title="By Category" buckets={categoryBuckets} max={maxBarValue} colorClass="bg-indigo-500" />
                <BucketBars title="Due Timeline" buckets={dueTimelineBuckets} max={maxBarValue} colorClass="bg-amber-500" />
                <BucketBars title="Top Tags" buckets={topTags} max={maxBarValue} colorClass="bg-emerald-500" />
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
