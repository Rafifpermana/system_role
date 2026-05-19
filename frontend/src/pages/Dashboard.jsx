import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

// 1. PASTIKAN IMPORT INI ADA DI ATAS
import SupervisorDashboard from "./SupervisorDashboard";
import AdminHeadDashboard from "./AdminHeadDashboard"; 
import AdminDashboard from "./AdminDashboard";
import DriverDashboard from "./DriverDashboard";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole")?.toLowerCase(); // Tambahkan toLowerCase() agar lebih aman
  const username = localStorage.getItem("username");

  const [message, setMessage] = useState("");

  // ========================================================
  // ROUTER PINTAR: Arahkan ke dashboard khusus berdasarkan Role
  // ========================================================
  if (role === "supervisor") {
    return <SupervisorDashboard />;
  }
  
  // 2. PASTIKAN BLOK IF INI ADA SEBELUM handleLogout
  if (role === "admin head" || role === "admin_head") { 
    return <AdminHeadDashboard />;
  }

    if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "driver") {
    return <DriverDashboard />;
  }

  // ========================================================
  // LOGIKA DASBOR UMUM (Untuk Driver, Admin, Finance, HRD)
  // ========================================================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleClockIn = async () => {
    setMessage(""); // Reset pesan
    try {
      const response = await api.post("/attendance/clock-in");
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal melakukan absensi masuk" });
    }
  };

  const handleClockOut = async () => {
    setMessage(""); // Reset pesan
    try {
      const response = await api.put("/attendance/clock-out");
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal melakukan absensi pulang" });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- SIDEBAR UMUM --- */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl z-10">
        <h2 className="text-2xl font-bold mb-8 tracking-wide">
          Logistik<span className="text-blue-500">Hub</span>
        </h2>
        
        <div className="mb-8 pb-6 border-b border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Akses Pengguna</p>
          <p className="text-xl font-bold text-blue-400 uppercase">{role}</p>
          <p className="text-sm text-slate-300 mt-1">{username}</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white border-0">
            🏠 Dashboard Utama
          </Button>
          {/* Slot untuk menu khusus tiap role nantinya */}
        </nav>

        <Button onClick={handleLogout} variant="destructive" className="w-full mt-auto">
          Logout Sistem
        </Button>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-800">Selamat Datang, {username}!</h1>
          <p className="text-slate-500 mt-2">Sistem Manajemen Logistik Terintegrasi (RBAC)</p>
        </header>

        {/* Notifikasi Absen */}
        {message && message.type && (
          <div className={`mb-6 p-4 rounded-md border shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* --- KARTU ABSENSI (Wajib untuk semua role operasional) --- */}
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-slate-100 rounded-t-lg border-b border-slate-200">
              <CardTitle className="text-slate-800">Absensi Harian</CardTitle>
              <CardDescription>Catat waktu masuk dan pulang Anda</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex gap-4">
              <Button onClick={handleClockIn} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm">
                ⏱️ Clock In
              </Button>
              <Button onClick={handleClockOut} variant="outline" className="flex-1 border-slate-300 hover:bg-slate-100">
                🛑 Clock Out
              </Button>
            </CardContent>
          </Card>

          {/* --- KARTU PLACEHOLDER (Untuk menu selanjutnya) --- */}
          <Card className="shadow-sm border-dashed border-2 border-slate-300 bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-slate-400">Ruang Kerja {role.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Modul antarmuka khusus untuk divisi Anda akan segera ditambahkan di area ini.
              </p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}