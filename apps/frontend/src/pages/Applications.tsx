import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

interface Application {
  id: number;
  company: string;
  position: string;
  location: string | null;
  status: string;
  url: string | null;
  appliedAt: string;
}

const statusStyle: Record<string, string> = {
  applied: "bg-blue/10 text-blue",
  phone_screen: "bg-yellow-50 text-yellow-700",
  interview: "bg-purple-50 text-purple-700",
  technical_test: "bg-orange-50 text-orange-700",
  offered: "bg-green-50 text-green-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red/10 text-red",
  withdrawn: "bg-gray-light/30 text-gray-dark",
};

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    url: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchApplications = () => {
    api
      .get("/applications")
      .then((res) => setApplications(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/applications", formData);
      setShowModal(false);
      setFormData({ company: "", position: "", location: "", url: "", notes: "" });
      fetchApplications();
    } catch {
      alert("Gagal menambahkan lamaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-dark/50 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-dark">Applications</h1>
          <p className="text-sm text-gray-dark/50 mt-1">
            {applications.length} lamaran tercatat
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue/90 transition"
        >
          + Tambah Lamaran
        </button>
      </div>

      {/* Table */}
      {applications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-dark/40 mb-2">Belum ada lamaran</p>
          <p className="text-sm text-gray-dark/40">
            Klik "Tambah Lamaran" untuk mulai tracking.
          </p>
        </div>
      ) : (
        <div className="border border-gray-light rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-light/20 border-b border-gray-light">
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70">Perusahaan</th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70">Posisi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70">Lokasi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-gray-light/50 hover:bg-gray-light/10 cursor-pointer transition"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-dark">{app.company}</td>
                  <td className="px-4 py-3 text-gray-dark/70">{app.position}</td>
                  <td className="px-4 py-3 text-gray-dark/70">{app.location || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[app.status] || "bg-gray-light/30 text-gray-dark"}`}
                    >
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-dark/50">{formatDate(app.appliedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah Lamaran */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white w-full max-w-md mx-4 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-dark">Tambah Lamaran</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-dark/40 hover:text-gray-dark text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  Perusahaan *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                  placeholder="Nama perusahaan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  Posisi *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                  placeholder="Posisi yang dilamar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                  placeholder="Jakarta, Remote, dll"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  URL Lowongan
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent resize-none"
                  placeholder="Catatan tambahan..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-light rounded-lg text-sm font-medium text-gray-dark/70 hover:bg-gray-light/20 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue/90 transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
