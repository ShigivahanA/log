export default function ActivityList({ activities }) {
  if (!activities.length) {
    return (
      <div className="text-sm opacity-60 border border-black/10 dark:border-white/10 rounded-xl p-6">
        No entries yet. Start by logging your first activity.
      </div>
    );
  }

  /* -----------------------------
     Group activities by date
  ------------------------------*/
  const grouped = activities.reduce((acc, activity) => {
    acc[activity.date] = acc[activity.date] || [];
    acc[activity.date].push(activity);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-10">
      {dates.map(date => {
        const dayTotal = grouped[date].reduce(
          (s, a) => s + a.hours,
          0
        );

        return (
          <section key={date} className="space-y-4">
            {/* Date header */}
            <header className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold tracking-tight">
                {formatDate(date)}
              </h3>
              <span className="text-xs opacity-50 tabular-nums">
                {dayTotal.toFixed(2)} h
              </span>
            </header>

            {/* Entries */}
            <ul className="divide-y divide-black/10 dark:divide-white/10 border border-black/10 dark:border-white/10 rounded-xl">
              {grouped[date].map(activity => (
                <li
                  key={activity._id}
                  className="px-5 py-4 flex items-start justify-between gap-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                >
                  {/* Description */}
                  <div className="min-w-0 space-y-1">
                    <div className="text-sm font-medium leading-snug truncate">
                      {activity.task}
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="text-sm tabular-nums opacity-70 whitespace-nowrap">
                    {activity.hours.toFixed(2)} h
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
