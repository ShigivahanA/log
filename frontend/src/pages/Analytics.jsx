import { useActivities } from "../context/ActivityContext";

export default function Analytics() {
  const { activities } = useActivities();

  /* -----------------------------
     Normalization
  ------------------------------*/
  const byDate = activities.reduce((acc, a) => {
    acc[a.date] = (acc[a.date] || 0) + a.hours;
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();
  const totalHours = Object.values(byDate).reduce((s, h) => s + h, 0);
  const activeDays = dates.length;
  const avgPerDay = activeDays ? totalHours / activeDays : 0;

  /* -----------------------------
     Date helpers
  ------------------------------*/
  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  function sumRange(start, end) {
    return dates
      .filter(d => d >= start && d <= end)
      .reduce((s, d) => s + byDate[d], 0);
  }

  /* -----------------------------
     Weekly / Monthly / Quarterly
  ------------------------------*/
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const weekStart = daysAgo(today.getDay() === 0 ? 6 : today.getDay() - 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const quarterStart = new Date(
    today.getFullYear(),
    Math.floor(today.getMonth() / 3) * 3,
    1
  )
    .toISOString()
    .slice(0, 10);

  const weekHours = sumRange(weekStart, todayKey);
  const monthHours = sumRange(monthStart, todayKey);
  const quarterHours = sumRange(quarterStart, todayKey);

  /* -----------------------------
     Consistency
  ------------------------------*/
  const firstDay = dates[0];
  const totalSpanDays = firstDay
    ? Math.round(
        (new Date(todayKey) - new Date(firstDay)) / 86400000
      ) + 1
    : 0;

  const consistencyRate = totalSpanDays
    ? (activeDays / totalSpanDays) * 100
    : 0;

  /* -----------------------------
     Streaks
  ------------------------------*/
  function daysBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  let longestStreak = 0;
  let temp = 1;

  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) === 1) {
      temp++;
    } else {
      longestStreak = Math.max(longestStreak, temp);
      temp = 1;
    }
  }
  longestStreak = Math.max(longestStreak, temp);

  /* -----------------------------
     Trend (last 7 vs prev 7)
  ------------------------------*/
  const last7 = sumRange(daysAgo(6), todayKey);
  const prev7 = sumRange(daysAgo(13), daysAgo(7));

  const trend =
    last7 > prev7
      ? "up"
      : last7 < prev7
      ? "down"
      : "flat";

  /* -----------------------------
     Workload distribution
  ------------------------------*/
  let light = 0,
    medium = 0,
    heavy = 0;

  Object.values(byDate).forEach(h => {
    if (h < 2) light++;
    else if (h < 5) medium++;
    else heavy++;
  });

  return (
    <section className="space-y-16 max-w-4xl">
      {/* =========================
          HEADER
      ========================== */}
      <header className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Analysis
        </h2>
        <p className="text-sm opacity-60">
          Patterns, consistency, and momentum over time.
        </p>
      </header>

      {/* =========================
          CORE METRICS
      ========================== */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total hours", value: totalHours.toFixed(2) },
          { label: "Active days", value: activeDays },
          { label: "Avg / active day", value: avgPerDay.toFixed(2) },
        ].map(stat => (
          <div
            key={stat.label}
            className="border border-black/10 dark:border-white/10 rounded-xl p-6"
          >
            <div className="text-xs opacity-60">{stat.label}</div>
            <div className="mt-3 text-2xl font-light">
              {stat.value}
            </div>
          </div>
        ))}
      </section>

      {/* =========================
          TIME WINDOWS
      ========================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">
          Time windows
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "This week", value: weekHours },
            { label: "This month", value: monthHours },
            { label: "This quarter", value: quarterHours },
          ].map(w => (
            <div
              key={w.label}
              className="border border-black/10 dark:border-white/10 rounded-xl p-6"
            >
              <div className="text-xs opacity-60">{w.label}</div>
              <div className="mt-2 text-xl font-light">
                {w.value.toFixed(2)}h
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          CONSISTENCY & TREND
      ========================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 space-y-2">
          <div className="text-xs opacity-60">Consistency</div>
          <div className="text-2xl font-light">
            {consistencyRate.toFixed(1)}%
          </div>
          <p className="text-xs opacity-60">
            {activeDays} active days across {totalSpanDays} total days
          </p>
        </div>

        <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 space-y-2">
          <div className="text-xs opacity-60">Momentum (7-day)</div>
          <div className="text-2xl font-light">
            {trend === "up" && "↑ Improving"}
            {trend === "down" && "↓ Declining"}
            {trend === "flat" && "→ Stable"}
          </div>
          <p className="text-xs opacity-60">
            Last 7 days: {last7.toFixed(2)}h · Previous:{" "}
            {prev7.toFixed(2)}h
          </p>
        </div>
      </section>

      {/* =========================
          WORKLOAD PROFILE
      ========================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">
          Workload profile
        </h3>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <div className="opacity-60">Light (&lt;2h)</div>
            <div className="text-xl font-light">{light} days</div>
          </div>

          <div className="space-y-1">
            <div className="opacity-60">Medium (2–5h)</div>
            <div className="text-xl font-light">{medium} days</div>
          </div>

          <div className="space-y-1">
            <div className="opacity-60">Heavy (&gt;5h)</div>
            <div className="text-xl font-light">{heavy} days</div>
          </div>
        </div>
      </section>

      {/* =========================
          INTERPRETATION
      ========================== */}
      <p className="text-sm opacity-60 max-w-2xl">
        These metrics emphasize consistency and momentum over raw totals.
        Over time, patterns in streaks, workload balance, and weekly trends
        provide stronger insight than isolated productive days.
      </p>
    </section>
  );
}
