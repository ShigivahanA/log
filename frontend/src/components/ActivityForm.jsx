import { useState } from "react";
import { useActivities } from "../context/ActivityContext";

export default function ActivityForm() {
  const { addActivity } = useActivities();

  const todayISO = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(todayISO);
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

  const chars = task.length;

  async function submit(e) {
    e.preventDefault();
    setSaving(true);

    await addActivity({
      date,
      task: task.trim(),
      hours: Number(hours),
    });

    setTask("");
    setHours("");
    setDate(todayISO);
    setTouched(false);
    setSaving(false);
  }

  return (
    <form
      onSubmit={submit}
      className="border border-black/10 dark:border-white/10 rounded-xl p-8 space-y-10"
    >
      {/* Date */}
      <section className="space-y-2">
        <label className="block text-sm opacity-60">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="bg-transparent border border-black/20 dark:border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
        />
      </section>

      {/* Description */}
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm opacity-60">
            What did you work on?
          </label>
          <span
            className={[
              "text-xs",
              chars > 200 ? "opacity-80" : "opacity-40",
            ].join(" ")}
          >
            {chars} chars
          </span>
        </div>

        <textarea
          rows={5}
          placeholder="Be specific but concise. What moved the work forward?"
          className={[
            "w-full resize-none bg-transparent",
            "border rounded-md px-4 py-3 text-sm",
            "focus:outline-none focus:ring-1",
            "border-black/20 dark:border-white/20",
            "focus:ring-black dark:focus:ring-white",
          ].join(" ")}
          value={task}
          onChange={e => {
            setTask(e.target.value);
            setTouched(true);
          }}
          required
        />

        {touched && chars < 15 && (
          <p className="text-xs opacity-50">
            Very short entries tend to be less useful later.
          </p>
        )}
      </section>

      {/* Hours */}
      <section className="space-y-2 max-w-xs">
        <label className="text-sm opacity-60">
          Time spent (hours)
        </label>
        <input
          type="number"
          step="0.25"
          min="0"
          placeholder="e.g. 1.5"
          className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          value={hours}
          onChange={e => setHours(e.target.value)}
          required
        />
      </section>

      {/* Actions */}
      <section className="flex items-center gap-4">
        <button
          disabled={saving}
          className={[
            "px-6 py-2 rounded-md text-sm font-medium",
            "bg-black text-white dark:bg-white dark:text-black",
            "disabled:opacity-40",
          ].join(" ")}
        >
          {saving ? "Saving…" : "Save entry"}
        </button>

        <span className="text-xs opacity-50">
          Press Enter to submit
        </span>
      </section>
    </form>
  );
}
