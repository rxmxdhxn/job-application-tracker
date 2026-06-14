import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  appliedAt: string;
}

const statusColor: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700",
  phone_screen: "bg-yellow-50 text-yellow-700",
  interview: "bg-purple-50 text-purple-700",
  technical_test: "bg-orange-50 text-orange-700",
  offered: "bg-green-50 text-green-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setApplications(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">Job Tracker</h1>
          <button
            onClick={() => navigate("/applications/new")}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            + Tambah Lamaran
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-2">Belum ada lamaran</p>
            <p className="text-sm text-gray-400">
              Klik "Tambah Lamaran" untuk mulai tracking.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition cursor-pointer"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-medium text-gray-900">{app.company}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{app.position}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[app.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Applied {formatDate(app.appliedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
