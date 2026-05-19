import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  
  // State navigasi menu (tab aktif)
  const [activeTab, setActiveTab] = useState("overview");

  // State untuk data Laporan
  const [reportData, setReportData] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // State untuk form Override
  const [taskId, setTaskId] = useState("");
  const [taskStatus, setTaskStatus] = useState("cancelled");
  const [taskNote, setTaskNote] = useState("");
  const [expenseId, setExpenseId] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("approved");
  const [message, setMessage] = useState("");

  // Mengambil data saat menu "Overview" diklik atau halaman pertama kali dimuat
  useEffect(() => {
    if (activeTab === "overview") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setIsLoadingReport(true);
    try {
      const response = await api.get("/reports/dashboard");
      setReportData(response.data.data);
    } catch (error) {
      console.error("Gagal menarik data laporan", error);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fungsi Eksekusi Override Tugas
  const handleOverrideTask = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.put(`/supervisor/tasks/${taskId}/override`, {
        status: taskStatus,
        note: taskNote || "Diubah paksa oleh Supervisor (UI)",
      });
      setMessage({ type: "success", text: response.data.message });
      setTaskId(""); setTaskNote("");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal mengubah tugas" });
    }
  };

  // Fungsi Eksekusi Override Dana
  const handleOverrideExpense = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.put(`/supervisor/expenses/${expenseId}/override`, {
        status: expenseStatus,
      });
      setMessage({ type: "success", text: response.data.message });
      setExpenseId("");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal mengubah dana" });
    }
  };

  const selectClass = "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Khusus Supervisor */}
      <aside className="w-64 bg-slate-950 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-red-500 tracking-wider">SUPERVISOR</h2>
          <p className="text-sm text-slate-400 mt-1">Sistem Logistik Pusat</p>
        </div>

        <div className="mb-6 pb-6 border-b border-slate-800">
          <p className="text-sm text-slate-500">Akses ID:</p>
          <p className="text-lg font-semibold">{username}</p>
        </div>

        <nav className="flex-1 space-y-3">
          <Button 
            variant={activeTab === "overview" ? "secondary" : "ghost"} 
            className="w-full justify-start text-left"
            onClick={() => setActiveTab("overview")}
          >
            📊 Laporan Sistem
          </Button>
          <Button 
            variant={activeTab === "tasks" ? "secondary" : "ghost"} 
            className="w-full justify-start text-left text-red-400 hover:text-red-300"
            onClick={() => setActiveTab("tasks")}
          >
            ⚡ Override Tugas
          </Button>
          <Button 
            variant={activeTab === "expenses" ? "secondary" : "ghost"} 
            className="w-full justify-start text-left text-orange-400 hover:text-orange-300"
            onClick={() => setActiveTab("expenses")}
          >
            💸 Override Dana
          </Button>
        </nav>

        <Button onClick={handleLogout} variant="destructive" className="w-full mt-auto">
          Logout Sistem
        </Button>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-800">
            {activeTab === "overview" && "Laporan Sistem Logistik"}
            {activeTab === "tasks" && "God Mode: Kendali Tugas"}
            {activeTab === "expenses" && "God Mode: Kendali Dana"}
          </h1>
        </header>

        {/* --- KONTEN: OVERVIEW (Fetch Laporan) --- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {isLoadingReport ? (
              <p className="text-slate-500 animate-pulse">Memuat data dari server...</p>
            ) : reportData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-blue-50 rounded-t-lg">
                    <CardTitle className="text-blue-800">Statistik Tugas</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {reportData.ringkasan_tugas?.length > 0 ? (
                        reportData.ringkasan_tugas.map((tugas, idx) => (
                          <li key={idx} className="flex justify-between items-center border-b pb-2">
                            <span className="capitalize font-medium text-slate-700">{tugas.status}</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                              {tugas.total_tugas} Tugas
                            </span>
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Belum ada data tugas.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-green-50 rounded-t-lg">
                    <CardTitle className="text-green-800">Statistik Dana</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {reportData.ringkasan_dana?.length > 0 ? (
                        reportData.ringkasan_dana.map((dana, idx) => (
                          <li key={idx} className="flex justify-between items-center border-b pb-2">
                            <span className="capitalize font-medium text-slate-700">{dana.status}</span>
                            <span className="text-green-700 font-bold">
                              Rp {Number(dana.total_dana).toLocaleString('id-ID')}
                            </span>
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Belum ada data pengeluaran.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-red-500">Gagal memuat data laporan.</p>
            )}
          </div>
        )}

        {/* --- KONTEN: OVERRIDE TUGAS --- */}
        {activeTab === "tasks" && (
          <Card className="max-w-2xl border-red-200 shadow-md">
            <CardHeader className="bg-red-50 rounded-t-lg">
              <CardTitle className="text-red-700">Eksekusi Status Tugas</CardTitle>
              <CardDescription>Bypass alur logistik standar. Perubahan ini mutlak.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleOverrideTask} className="space-y-4">
                {message && message.type && (
                  <div className={`p-3 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                <div className="space-y-2">
                  <Label>ID Tugas</Label>
                  <Input type="number" value={taskId} onChange={(e) => setTaskId(e.target.value)} placeholder="Contoh: 1" required />
                </div>
                <div className="space-y-2">
                  <Label>Paksa Menjadi Status</Label>
                  <select className={selectClass} value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Catatan (Wajib Diisi)</Label>
                  <Input type="text" value={taskNote} onChange={(e) => setTaskNote(e.target.value)} placeholder="Alasan override..." required />
                </div>
                <Button type="submit" variant="destructive" className="w-full">Terapkan Perubahan</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* --- KONTEN: OVERRIDE DANA --- */}
        {activeTab === "expenses" && (
          <Card className="max-w-2xl border-orange-200 shadow-md">
            <CardHeader className="bg-orange-50 rounded-t-lg">
              <CardTitle className="text-orange-700">Persetujuan Paksa Dana</CardTitle>
              <CardDescription>Setujui atau tolak dana dengan melewati divisi Finance.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleOverrideExpense} className="space-y-4">
                {message && message.type && (
                  <div className={`p-3 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                <div className="space-y-2">
                  <Label>ID Pengajuan Dana</Label>
                  <Input type="number" value={expenseId} onChange={(e) => setExpenseId(e.target.value)} placeholder="Contoh: 1" required />
                </div>
                <div className="space-y-2">
                  <Label>Keputusan</Label>
                  <select className={selectClass} value={expenseStatus} onChange={(e) => setExpenseStatus(e.target.value)}>
                    <option value="approved">Approved (Setujui)</option>
                    <option value="rejected">Rejected (Tolak)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Eksekusi Dana</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}