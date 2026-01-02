import { useActivities } from "../context/ActivityContext";

export default function Dashboard() {
  const { activities, loading } = useActivities();

  if (loading) {
    return <p className="text-sm opacity-60">Loading journal…</p>;
  }

  /* -----------------------------
     Helpers
  ------------------------------*/
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const byDate = activities.reduce((acc, a) => {
    acc[a.date] = (acc[a.date] || 0) + a.hours;
    return acc;
  }, {});

  /* -----------------------------
     Filter ONLY valid streak days
  ------------------------------*/
  const activeDates = Object.keys(byDate)
    .filter(d => byDate[d] > 0)
    .sort();

  /* -----------------------------
     Today stats
  ------------------------------*/
  const todayHours = byDate[todayKey] || 0;
  const todayEntries = activities.filter(a => a.date === todayKey).length;

  /* -----------------------------
     Date helper
  ------------------------------*/
  function daysBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  /* -----------------------------
     Current streak
  ------------------------------*/
  const currentStreakDays = new Set();
  let cursor = todayKey;

  while (byDate[cursor] !== undefined && byDate[cursor] > 0) {
    currentStreakDays.add(cursor);
    const d = new Date(cursor);
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().slice(0, 10);
  }

  const currentStreak = currentStreakDays.size;

  /* -----------------------------
     Longest streak (correct)
  ------------------------------*/
  let longestStreak = 0;
  let temp = 0;

  for (let i = 0; i < activeDates.length; i++) {
    if (
      i === 0 ||
      daysBetween(activeDates[i - 1], activeDates[i]) !== 1
    ) {
      temp = 1;
    } else {
      temp++;
    }
    longestStreak = Math.max(longestStreak, temp);
  }

  /* -----------------------------
     Monthly calendar
  ------------------------------*/
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastOfMonth.getDate();
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday start

  const calendarCells = [];

  for (let i = 0; i < startWeekday; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = d.toISOString().slice(0, 10);

    calendarCells.push({
      date: key,
      hours: byDate[key] || 0,
      isToday: key === todayKey,
      inStreak:
        currentStreakDays.has(key) && byDate[key] > 0,
    });
  }

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  /* -----------------------------
     Recent entries
  ------------------------------*/
  const recent = activities.slice(0, 6);

  return (
    <section className="space-y-16">
      {/* =========================
          TODAY
      ========================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-black/10 dark:border-white/10 rounded-xl p-8">
          <h2 className="text-sm opacity-60">Today</h2>
          <div className="mt-4 text-4xl font-light">
            {todayHours.toFixed(2)}
            <span className="text-base ml-1 opacity-60">h</span>
          </div>
          <div className="mt-2 text-xs opacity-60">
            {todayEntries} entries
          </div>
        </div>

        <div className="border border-black/10 dark:border-white/10 rounded-xl p-8 md:col-span-2">
          <h2 className="text-sm opacity-60 mb-4">Momentum</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs opacity-60">Current streak</div>
              <div className="text-2xl font-light mt-1">
                {currentStreak} days
              </div>
            </div>

            <div>
              <div className="text-xs opacity-60">Longest streak</div>
              <div className="text-2xl font-light mt-1">
                {longestStreak} days
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MONTHLY CALENDAR
      ========================== */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {today.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h2>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 text-xs opacity-50 max-w-sm">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

       {/* Calendar grid */}
<div className="grid grid-cols-7 gap-2 max-w-sm">
  {calendarCells.map((cell, i) =>
    cell ? (
      <div
        key={cell.date}
        title={`${cell.date} — ${cell.hours.toFixed(2)}h`}
        className={[
          "w-8 h-8 rounded-md flex items-center justify-center text-xs",
          "border border-black/10 dark:border-white/10",

          // worked day background
          cell.hours > 0 && "bg-black/5 dark:bg-white/10",

          // neon ONLY for streak days with work
          cell.inStreak &&
            cell.hours > 0 &&
            "ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",

          // subtle today marker (NO neon)
          cell.isToday &&
            cell.hours === 0 &&
            "border-2 border-dashed border-black/30 dark:border-white/30",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {new Date(cell.date).getDate()}
      </div>
    ) : (
      <div key={`empty-${i}`} />
    )
  )}
</div>


        <p className="text-xs opacity-60 max-w-sm">
          Neon highlights indicate your current active streak.
        </p>
      </section>

      {/* =========================
          RECENT WORK
      ========================== */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent work
        </h2>

        <ul className="space-y-3 text-sm max-w-3xl">
          {recent.map(a => (
            <li
              key={a._id}
              className="flex justify-between gap-6 border-b border-black/10 dark:border-white/10 pb-2"
            >
              <span className="truncate">{a.task}</span>
              <span className="opacity-60 tabular-nums">
                {a.hours.toFixed(2)}h
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* =========================
          ALL ENTRIES
      ========================== */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          All entries
        </h2>

        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {activities.map(a => (
            <li
              key={a._id}
              className="py-4 flex justify-between gap-6"
            >
              <div>
                <div className="text-sm">{a.task}</div>
                <div className="text-xs opacity-60">{a.date}</div>
              </div>
              <div className="text-sm tabular-nums opacity-70">
                {a.hours.toFixed(2)}h
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
