export default function Dashboard() {
  return (
    <div className="px-10 py-12 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-dark tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-dark/50 mt-2">Ringkasan lamaran Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="border border-gray-light/60 rounded-2xl p-6 hover:border-gray-light hover:shadow-sm transition-all duration-200">
          <p className="text-sm text-gray-dark/50">Total Lamaran</p>
          <p className="text-3xl font-bold text-gray-dark mt-2 tracking-tight">
            0
          </p>
        </div>
        <div className="border border-gray-light/60 rounded-2xl p-6 hover:border-gray-light hover:shadow-sm transition-all duration-200">
          <p className="text-sm text-gray-dark/50">Menunggu Response</p>
          <p className="text-3xl font-bold text-gray-dark mt-2 tracking-tight">
            0
          </p>
        </div>
        <div className="border border-gray-light/60 rounded-2xl p-6 hover:border-gray-light hover:shadow-sm transition-all duration-200">
          <p className="text-sm text-gray-dark/50">Interview</p>
          <p className="text-3xl font-bold text-gray-dark mt-2 tracking-tight">
            0
          </p>
        </div>
      </div>
    </div>
  );
}
