export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Ringkasan lamaran Anda</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-100 rounded-lg p-5">
          <p className="text-sm text-gray-500">Total Lamaran</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
        </div>
        <div className="border border-gray-100 rounded-lg p-5">
          <p className="text-sm text-gray-500">Menunggu Response</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
        </div>
        <div className="border border-gray-100 rounded-lg p-5">
          <p className="text-sm text-gray-500">Interview</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
        </div>
      </div>
    </div>
  );
}
