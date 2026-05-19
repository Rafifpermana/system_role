import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminHeadDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  
  // State Navigasi
  const [activeTab, setActiveTab] = useState("create_task");

  // State Form Pembuatan Tugas
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskMessage, setTaskMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Laporan
  const [reportData, setReportData] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Ambil data laporan jika tab "reports" aktif
  useEffect(() => {
    if (activeTab === "reports") {
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/tasks", {
        title,
        description
      });
      setTaskMessage({ type: "success", text: `Sukses! ${response.data.message} (ID: ${response.data.taskId})` });
      setTitle(""); 
      setDescription("");
    } catch (error) {
      setTaskMessage({ type: "error", text: error.response?.data?.message || "Gagal membuat tugas" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- SIDEBAR ADMIN HEAD --- */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-500 tracking-wider">HEAD ADMIN</h2>
          <p className="text-sm text-slate-400 mt-1">Pusat Kendali Operasional</p>
        </div>

        <div className="mb-6 pb-6 border-b border-slate-700">
          <p className="text-sm text-slate-500">Log in sebagai:</p>
          <p className="text-lg font-semibold">{username}</p>
        </div>

        <nav className="flex-1 space-y-3">
          <Button 
            variant={activeTab === "create_task" ? "secondary" : "ghost"} 
            className="w-full justify-start text-left"
            onClick={() => setActiveTab("create_task")}
          >
            📝 Buat Tugas Baru
          </Button>
          <Button 
            variant={activeTab === "reports" ? "secondary" : "ghost"} 
            className="w-full justify-start text-left"
            onClick={() => setActiveTab("reports")}
          >
            📊 Laporan Operasional
          </Button>
        </nav>

        <Button onClick={handleLogout} variant="destructive" className="w-full mt-auto">
          Logout Sistem
        </Button>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-800">
            {activeTab === "create_task" && "Inisiasi Tugas Pengiriman"}
            {activeTab === "reports" && "Ringkasan Laporan Operasional"}
          </h1>
        </header>

        {/* --- TAB: BUAT TUGAS BARU --- */}
        {activeTab === "create_task" && (
          <Card className="max-w-2xl shadow-md border-blue-200">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <CardTitle className="text-blue-800">Form Tugas Logistik</CardTitle>
              <CardDescription>Buat instruksi pengiriman baru untuk diteruskan ke tim Admin.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateTask} className="space-y-4">
                {taskMessage && taskMessage.type && (
                  <div className={`p-4 text-sm rounded-md font-medium border ${taskMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {taskMessage.text}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Tugas / Nama Barang</Label>
                  <Input 
                    id="title"
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Contoh: Pengiriman 50 Kardus ke Gudang A" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Lengkap & Alamat</Label>
                  <textarea 
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Tuliskan rute, kontak penerima, dan instruksi khusus di sini..." 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan ke Database..." : "Terbitkan Tugas"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* --- TAB: LAPORAN (Sama seperti overview Supervisor) --- */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {isLoadingReport ? (
              <p className="text-slate-500 animate-pulse">Menarik data analitik...</p>
            ) : reportData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-slate-100 rounded-t-lg">
                    <CardTitle className="text-slate-700">Status Seluruh Tugas</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {reportData.ringkasan_tugas?.length > 0 ? (
                        reportData.ringkasan_tugas.map((tugas, idx) => (
                          <li key={idx} className="flex justify-between items-center border-b pb-2">
                            <span className="capitalize font-medium text-slate-600">{tugas.status}</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                              {tugas.total_tugas} Tugas
                            </span>
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Belum ada data tugas di sistem.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-slate-100 rounded-t-lg">
                    <CardTitle className="text-slate-700">Status Dana Operasional</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {reportData.ringkasan_dana?.length > 0 ? (
                        reportData.ringkasan_dana.map((dana, idx) => (
                          <li key={idx} className="flex justify-between items-center border-b pb-2">
                            <span className="capitalize font-medium text-slate-600">{dana.status}</span>
                            <span className="text-slate-800 font-bold">
                              Rp {Number(dana.total_dana).toLocaleString('id-ID')}
                            </span>
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Belum ada data pengeluaran operasional.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-red-500">Gagal memuat data laporan dari server.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}