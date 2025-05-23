import { type MonitoredSite } from "../lib/schema";
import { motion } from "framer-motion";
import { MiniChart } from "./minichart";

export function SiteCard({
  site,
  onRemove,
  status,
  responseTime,
}: {
  site: MonitoredSite & {
    history?: { timestamp: string; status: number; responseTime: number }[];
  };
  onRemove: (id: string) => void;
  status?: number;
  responseTime?: number;
}) {
  console.log("📊 Site:", site.name, "History:", site.history);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 bg-white shadow rounded hover:shadow-lg transition relative"
    >
      <button
        onClick={() => onRemove(site.id)}
        className="absolute top-2 right-2 text-sm text-red-400 hover:text-red-600"
        title="Supprimer"
      >
        ✕
      </button>
      <h2 className="font-semibold text-lg">{site.name}</h2>
      <p className="text-sm text-gray-600 break-all">{site.url}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`text-xl ${status === 200 ? "text-green-500" : "text-red-500"}`}>
          {status === 200 ? "🟢" : "🔴"}
        </span>
        <span className="text-sm text-gray-500">{responseTime ?? "?"} ms</span>
      </div>
      {site.category && (
        <span className="text-xs text-gray-400">{site.category}</span>
      )}
      {site.history && site.history.length > 0 && (
        <div className="mt-4">
          <MiniChart data={site.history.map(h => ({ timestamp: h.timestamp, responseTime: h.responseTime }))} />
        </div>
      )}
    </motion.div>
  );
}