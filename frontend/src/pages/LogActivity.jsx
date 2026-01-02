import ActivityForm from "../components/ActivityForm";

export default function LogActivity() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="max-w-2xl space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          New entry
        </h2>
        <p className="text-sm opacity-60">
          {today}
        </p>
        <p className="text-sm opacity-70 max-w-xl">
          Record what you worked on today. Keep it factual and concise —
          this log is meant to help you see patterns over time, not write prose.
        </p>
      </header>

      {/* Form */}
      <ActivityForm />

      {/* Gentle guidance */}
      <footer className="text-xs opacity-50 max-w-xl">
        Tip: One entry per distinct task works better than grouping everything
        into a single long description.
      </footer>
    </section>
  );
}
