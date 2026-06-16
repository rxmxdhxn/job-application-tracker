import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/api";

interface Timeline {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
}

interface Application {
  id: number;
  company: string;
  position: string;
  location: string | null;
  status: string;
  url: string | null;
  notes: string | null;
  requirements: string | null;
  appliedAt: string;
  timelines?: Timeline[];
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
    requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editData, setEditData] = useState({
    company: "",
    position: "",
    location: "",
    url: "",
    notes: "",
    requirements: "",
  });
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
      setFormData({
        company: "",
        position: "",
        location: "",
        url: "",
        notes: "",
        requirements: "",
      });
      fetchApplications();
      toast.success("Lamaran berhasil ditambahkan");
    } catch {
      toast.error("Gagal menambahkan lamaran");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatusInline = async (
    id: number,
    newStatus: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      await api.patch(`/applications/${id}/status`, {
        status: newStatus,
        note: `Status diubah ke ${newStatus.replace("_", " ")}`,
      });
      fetchApplications();
      toast.success("Status diperbarui");
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  const openDetail = async (id: number) => {
    try {
      const res = await api.get(`/applications/${id}`);
      setSelectedApp(res.data);
      setEditData({
        company: res.data.company,
        position: res.data.position,
        location: res.data.location || "",
        url: res.data.url || "",
        notes: res.data.notes || "",
        requirements: res.data.requirements || "",
      });
    } catch {
      toast.error("Gagal memuat detail lamaran");
    }
  };

  const handleSaveDetail = async () => {
    if (!selectedApp) return;
    setSubmitting(true);

    try {
      await api.put(`/applications/${selectedApp.id}`, editData);
      const res = await api.get(`/applications/${selectedApp.id}`);
      setSelectedApp(res.data);
      fetchApplications();
      toast.success("Lamaran berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui lamaran");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteApp = async () => {
    if (!selectedApp) return;
    if (!confirm(`Hapus lamaran ${selectedApp.company}?`)) return;
    try {
      await api.delete(`/applications/${selectedApp.id}`);
      setSelectedApp(null);
      fetchApplications();
      toast.success("Lamaran dihapus");
    } catch {
      toast.error("Gagal menghapus lamaran");
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
    <div className="px-10 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold font-satoshi text-gray-dark tracking-tight">
            Lamaran
          </h1>
          <p className="text-sm text-gray-dark/50 mt-2">
            {applications.length} lamaran tercatat
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-dark text-white px-5 py-2.5  text-sm font-medium hover:bg-red/90 hover:shadow-md transition-all duration-200"
        >
          + Tambah Lamaran
        </button>
      </div>

      {/* Table */}
      {applications.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-dark/40 mb-2">Belum ada lamaran</p>
          <p className="text-sm text-gray-dark/40">
            Klik "Tambah Lamaran" untuk mulai tracking.
          </p>
        </div>
      ) : (
        <div className="border border-gray-light rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-light/20 border-b border-gray-light">
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70 w-[22%]">
                  Perusahaan
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70 w-[22%]">
                  Posisi
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70 w-[14%]">
                  Lokasi
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70 w-[16%]">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70 w-[14%]">
                  Tanggal
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-dark/70 w-[12%]">
                  Link
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-gray-light/40 last:border-0 hover:bg-gray-light/10 cursor-pointer transition-colors duration-150"
                  onClick={() => openDetail(app.id)}
                >
                  <td className="px-4 py-3 font-medium text-gray-dark">
                    {app.company}
                  </td>
                  <td className="px-4 py-3 text-gray-dark/70">
                    {app.position}
                  </td>
                  <td className="px-4 py-3 text-gray-dark/70">
                    {app.location || "-"}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatusInline(
                          app.id,
                          e.target.value,
                          e as unknown as React.MouseEvent,
                        )
                      }
                      className={`text-xs font-medium px-2.5 py-1 cursor-pointer focus:ring-2 focus:ring-blue/30 ${statusStyle[app.status] || "bg-gray-light/30 text-gray-dark"}`}
                    >
                      <option value="applied">Applied</option>
                      <option value="phone_screen">Phone Screen</option>
                      <option value="interview">Interview</option>
                      <option value="technical_test">Technical Test</option>
                      <option value="offered">Offered</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-dark/50">
                    {formatDate(app.appliedAt)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {app.url ? (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue hover:underline"
                      >
                        Buka
                      </a>
                    ) : (
                      <span className="text-gray-dark/30">-</span>
                    )}
                  </td>
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

          <div className="relative bg-white w-full  max-w-[90vh] mx-4 rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-dark tracking-tight">
                Tambah Lamaran
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-dark/40 hover:text-gray-dark text-xl transition-colors duration-150"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  Perusahaan *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
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
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
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
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
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
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 resize-none transition-all duration-150"
                  placeholder="Kualifikasi / requirement lowongan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark/80 mb-1">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 resize-none transition-all duration-150"
                  placeholder="Catatan tambahan..."
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-light rounded-xl text-sm font-medium text-gray-dark/70 hover:bg-gray-light/20 transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue/90 hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelectedApp(null)}
          />

          <div className="relative bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="sticky top-0 bg-white border-b border-gray-light/60 px-8 py-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-dark tracking-tight">
                Detail Lamaran
              </h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-dark/40 hover:text-gray-dark text-2xl leading-none transition-colors duration-150"
              >
                &times;
              </button>
            </div>

            <div className="px-8 py-7 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-dark/50 mb-1">
                    Perusahaan
                  </label>
                  <input
                    type="text"
                    value={editData.company}
                    onChange={(e) =>
                      setEditData({ ...editData, company: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-dark/50 mb-1">
                    Posisi
                  </label>
                  <input
                    type="text"
                    value={editData.position}
                    onChange={(e) =>
                      setEditData({ ...editData, position: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-dark/50 mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) =>
                      setEditData({ ...editData, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
                    placeholder="Jakarta, Remote, dll"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-dark/50 mb-1">
                    Tanggal Apply
                  </label>
                  <p className="px-4 py-2.5 text-sm text-gray-dark">
                    {formatDate(selectedApp.appliedAt)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-dark/50 mb-1">
                  URL Lowongan
                </label>
                <input
                  type="url"
                  value={editData.url}
                  onChange={(e) =>
                    setEditData({ ...editData, url: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs text-gray-dark/50 mb-1">
                  Requirements
                </label>
                <textarea
                  value={editData.requirements}
                  onChange={(e) =>
                    setEditData({ ...editData, requirements: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 resize-none transition-all duration-150"
                  placeholder="Kualifikasi / requirement lowongan"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-dark/50 mb-1">
                  Catatan
                </label>
                <textarea
                  value={editData.notes}
                  onChange={(e) =>
                    setEditData({ ...editData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 resize-none transition-all duration-150"
                  placeholder="Catatan tambahan..."
                />
              </div>

              <div>
                <label className="block text-xs text-gray-dark/50 mb-2">
                  Timeline
                </label>
                {selectedApp.timelines && selectedApp.timelines.length > 0 ? (
                  <div className="space-y-3">
                    {selectedApp.timelines.map((t) => (
                      <div
                        key={t.id}
                        className="flex gap-3 border-l-2 border-blue pl-3 py-1"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[t.status] || "bg-gray-light/30 text-gray-dark"}`}
                            >
                              {t.status.replace("_", " ")}
                            </span>
                            <span className="text-xs text-gray-dark/50">
                              {formatDate(t.createdAt)}
                            </span>
                          </div>
                          {t.note && (
                            <p className="text-sm text-gray-dark/80 mt-1">
                              {t.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-dark/50">
                    Belum ada riwayat.
                  </p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-light/60 px-8 py-5 flex justify-between">
              <button
                onClick={deleteApp}
                className="px-5 py-2.5 rounded-xl border border-red/60 text-sm text-red hover:bg-red/10 hover:border-red transition-all duration-200"
              >
                Hapus
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-light text-sm text-gray-dark hover:bg-gray-light/20 transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveDetail}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue text-white text-sm font-medium hover:bg-blue/90 hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
