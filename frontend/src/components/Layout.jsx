import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { usePWAUpdate } from "../hooks/usePWAUpdate";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/log", label: "New Entry" },
  { to: "/analytics", label: "Analysis" },
];

export default function Layout({ children }) {
  const { theme, setTheme } = useTheme();
  const { needRefresh, refresh } = usePWAUpdate();

  return (
    <div className="min-h-screen font-serif bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 flex flex-col">
      {/* =========================
          DESKTOP HEADER
      ========================== */}
      <header className="hidden md:block border-b border-black/10 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            Daily Log
          </h1>

          <div className="flex items-center gap-8">
            <nav className="flex gap-6 text-sm">
              {navItems.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      "transition-opacity",
                      isActive
                        ? "opacity-100"
                        : "opacity-60 hover:opacity-100",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {needRefresh && (
                <button
                  onClick={refresh}
                  className="text-xs border border-black/20 dark:border-white/20 rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Refresh
                </button>
              )}

              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                className="text-xs bg-transparent border border-black/20 dark:border-white/20 rounded-md px-2 py-1"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          MAIN CONTENT
          (mobile-safe spacing)
      ========================== */}
      <main
        className="
          flex-1
          max-w-5xl
          mx-auto
          w-full
          px-6
          pt-24
          pb-32
          md:pt-12
          md:pb-12
        "
      >
        {children}
      </main>

      {/* =========================
          MOBILE TAB BAR
      ========================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-black/10 dark:border-white/10">
        <div className="flex justify-around items-center h-20 px-4 pb-safe">
          {navItems.map(link => (
            <NavLink key={link.to} to={link.to}>
              {({ isActive }) => (
                <div
                  className={[
                    "flex flex-col items-center justify-center",
                    "text-sm tracking-tight",
                    "transition-opacity",
                    isActive ? "opacity-100" : "opacity-50",
                  ].join(" ")}
                >
                  <span>{link.label}</span>
                  <span
                    className={[
                      "mt-1 h-1 w-1 rounded-full",
                      isActive
                        ? "bg-black dark:bg-white"
                        : "bg-transparent",
                    ].join(" ")}
                  />
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* =========================
          MOBILE QUICK ACTIONS
      ========================== */}
      <div className="md:hidden fixed top-6 right-4 z-50 flex flex-row gap-2 items-end">
        {needRefresh && (
          <button
            onClick={refresh}
            className="text-xs bg-black text-white dark:bg-white dark:text-black rounded-md px-3 py-1 shadow transition active:scale-95"
          >
            Refresh
          </button>
        )}

        <select
          value={theme}
          onChange={e => setTheme(e.target.value)}
          className="text-xs bg-white/90 dark:bg-black/90 backdrop-blur border border-black/20 dark:border-white/20 rounded-md px-2 py-1"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
}
