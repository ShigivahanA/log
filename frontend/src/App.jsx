import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivityProvider } from "./context/ActivityContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LogActivity from "./pages/LogActivity";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <ActivityProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<LogActivity />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ActivityProvider>
  );
}
