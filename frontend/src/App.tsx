import { useEffect, useState } from "react";
import { type MonitoredSite } from "./lib/schema";
import { v4 as uuidv4 } from "uuid";
import { SiteCard } from "./components/sitecard";

interface SiteWithStatus extends MonitoredSite {
  status?: number;
  responseTime?: number;
  history?: {
    timestamp: string;
    status: number;
    responseTime: number;
  }[];
}

function fetchMonitoring(setSites: (sites: any) => void) {
  fetch("/data/monitoring.json")
    .then((res) => res.json())
    .then((monitoring) => {
      setSites((prevSites: any[]) =>
        prevSites.map((site) => {
          const match = monitoring.find((m: any) => m.id === site.url);
          return match
            ? {
                ...site,
                status: match.status,
                responseTime: match.responseTime,
                history: match.history,
              }
            : site;
        })
      );
    })
    .catch(console.error);
}

function App() {
  const [sites, setSites] = useState<SiteWithStatus[]>([]);
  const [form, setForm] = useState({ name: "", url: "", category: "" });

  useEffect(() => {
    const stored = localStorage.getItem("sites");
    const parsed = stored ? JSON.parse(stored) : [];

    fetch("http://localhost:4000/api/monitoring")
      .then(res => res.json())
      .then((backendData: any[]) => {
        const merged = parsed.map((site: any) => {
          const match = backendData.find((b: any) => b.id === site.url || b.url === site.url);
          return match
            ? {
                ...site,
                status: match.status,
                responseTime: match.responseTime,
                history: match.history,
              }
            : site;
        });
        setSites(merged);
      })
      .catch(err => {
        console.error("❌ Failed to load monitoring.json", err);
        setSites(parsed);
      });
  }, []);
const reload = async () => {
  console.log("🔄 reload() triggered");
  try {
    //const res = await fetch("https://784a-2a01-e0a-1ff-b170-5c51-6cdf-af84-634e.ngrok-free.app/api/monitoring");
    const res = await fetch("http://localhost:4000/api/monitoring");
    const text = await res.text();
    console.log("📦 Response text:", text);

    const data: SiteWithStatus[] = JSON.parse(text);
    console.log("✅ Sites rechargés :", data);
    if (Array.isArray(data) && data.length > 0) {
      setSites((prevSites) =>
        prevSites.map((site) => {
          const updated = data.find((s) => s.id === site.id || s.url === site.url);
          return updated
            ? {
                ...site,
                status: updated.status ?? site.status,
                responseTime: updated.responseTime ?? site.responseTime,
                history: updated.history ?? site.history,
              }
            : site;
        })
      );
    } else {
      console.warn("⚠️ Aucune donnée à afficher");
    }

    // Met à jour la copie utilisée par n8n
    const postRes = await fetch("http://localhost:4000/api/update-local-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: data }),
    });
    console.log("✅ POST update-local-copy status:", postRes.status);
  } catch (err) {
    console.error("❌ Erreur pendant reload():", err);
  }
};

  const downloadMonitoringJson = () => {
    const blob = new Blob([JSON.stringify(sites, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "monitoring.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) return;

    const newSite: MonitoredSite = {
      id: uuidv4(),
      name: form.name,
      url: form.url,
      category: form.category || undefined,
    };

    const updatedSites = [...sites, newSite];
    setSites(updatedSites);
    localStorage.setItem("sites", JSON.stringify(updatedSites));
    setForm({ name: "", url: "", category: "" });

    // Rafraîchit les données de monitoring
    fetchMonitoring(setSites);
  };

  const handleRemove = (id: string) => {
    const updated = sites.filter((s) => s.id !== id);
    setSites(updated);
    localStorage.setItem("sites", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">📡 Uptime Monitor Dashboard</h1>
      <div className="text-sm text-gray-500 mb-4">Powered by n8n + React</div>
      <button
        onClick={reload}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        🔄 Rafraîchir les données
      </button>
      <button
        onClick={downloadMonitoringJson}
        className="mb-4 ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        💾 Exporter monitoring.json
      </button>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 space-y-4">
        <input
          type="text"
          placeholder="Nom du site"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Catégorie (optionnel)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter un site
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map(site => (
          <SiteCard
          key={site.id}
          site={site}
          onRemove={handleRemove}
          status={site.status}
          responseTime={site.responseTime}
        />
        ))}
        
      </div>
    </main>
  );
}

export default App;
