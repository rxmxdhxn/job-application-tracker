import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Camera, FileText, Trash2 } from "lucide-react";
import api from "../lib/api";

interface UserData {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  cv: string | null;
  createdAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setUser(res.data);
      setName(res.data.name);
      setLoading(false);
    });
  }, []);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", { name });
      setUser(res.data);
      toast.success("Profil berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Isi password lama dan baru");
      return;
    }
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password berhasil diubah");
    } catch {
      toast.error("Password lama salah");
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.put("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => (prev ? { ...prev, avatar: res.data.avatar } : null));
      toast.success("Foto profil diperbarui");
    } catch {
      toast.error("Gagal upload foto (max 2MB, JPG/PNG)");
    }
  };

  const handleUploadCv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await api.put("/auth/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => (prev ? { ...prev, cv: res.data.cv } : null));
      toast.success("CV berhasil diupload");
    } catch {
      toast.error("Gagal upload CV (max 10MB, PDF/DOC)");
    }
  };

  const handleDeleteCv = async () => {
    if (!confirm("Hapus CV?")) return;
    try {
      await api.delete("/auth/cv");
      setUser((prev) => (prev ? { ...prev, cv: null } : null));
      toast.success("CV berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus CV");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-dark/50 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-dark tracking-tight mb-10">
        Profile
      </h1>

      <div className="space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={`http://localhost:3001${user.avatar}`}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-gray-light"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-light/30 flex items-center justify-center">
                <User size={32} className="text-gray-dark/40" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-blue/90 transition-all duration-200">
              <Camera size={14} className="text-white" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUploadAvatar}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-dark">{user?.name}</p>
            <p className="text-sm text-gray-dark/50">{user?.email}</p>
          </div>
        </div>

        {/* Edit Nama */}
        <div className="border border-gray-light/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-dark/70">Informasi</h2>
          <div>
            <label className="block text-xs text-gray-dark/50 mb-1">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-dark/50 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm bg-gray-light/10 text-gray-dark/50"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={saving}
            className="bg-blue text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue/90 hover:shadow-md transition-all duration-200 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>

        {/* CV */}
        <div className="border border-gray-light/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-dark/70">CV / Resume</h2>
          {user?.cv ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
                  <FileText size={18} className="text-blue" />
                </div>
                <div>
                  <a
                    href={`http://localhost:3001${user.cv}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-gray-dark hover:text-blue transition-colors duration-150"
                  >
                    Lihat CV
                  </a>
                  <p className="text-xs text-gray-dark/40">PDF</p>
                </div>
              </div>
              <button
                onClick={handleDeleteCv}
                className="p-2 rounded-xl text-red/60 hover:text-red hover:bg-red/10 transition-all duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-dark/40">Belum ada CV diupload</p>
          )}
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-light rounded-xl text-sm text-gray-dark/70 cursor-pointer hover:bg-gray-light/20 transition-all duration-200">
              <FileText size={16} />
              {user?.cv ? "Ganti CV" : "Upload CV"}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleUploadCv}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-dark/40">Max 10MB (PDF, DOC, DOCX)</p>
          </div>
        </div>

        {/* Ganti Password */}
        <div className="border border-gray-light/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-dark/70">
            Ganti Password
          </h2>
          <div>
            <label className="block text-xs text-gray-dark/50 mb-1">
              Password Lama
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
              placeholder="Masukkan password lama"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-dark/50 mb-1">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue/40 transition-all duration-150"
              placeholder="Masukkan password baru"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-blue text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue/90 hover:shadow-md transition-all duration-200"
          >
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );
}
