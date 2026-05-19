import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [activeTab, setActiveTab] = useState("my_tasks");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMyTasks();
  }, []);

  const loadMyTasks = async () => {
    setIsLoading(true);
    try {
      // Mengambil semua tugas (Nanti di backend harusnya di-filter berdasarkan ID Driver ini)
      const response = await api.get("/tasks"); 
      
      // Filter sementara di Frontend: Hanya tampilkan tugas yang di-assign, in_progress, atau completed
      // Asumsi: Di backend Anda, API /tasks mengembalikan tugas milik supir yang sedang login jika dia role-nya driver
      setTasks(response.data.data);
    } catch (error) {
      console.error("Gagal memuat tugas", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    setMessage("");
    try {
      // Memanggil API untuk update status tugas
      const response = await api.put(`/tasks/${taskId}/status`, {
        status: newStatus,
        note: `Status diupdate oleh supir: ${newStatus}`
      });
      
      setMessage({ type: "success", text: response.data.message || `Tugas berhasil diubah menjadi ${newStatus}` });
      loadMyTasks(); // Refresh daftar tugas
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal mengupdate status tugas" });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- SIDEBAR DRIVER --- */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-lg z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-500 tracking-wider">DRIVER</h2>
          <p className="text-sm text-slate-400 mt-1">Eksekutor Lapangan</p>
        </div>

        <div className="mb-6 pb-6 border-b border-slate-700">
          <p className="text-sm text-slate-500">Log in sebagai:</p>
          <p className="text-lg font-semibold uppercase">{username}</p>
        </div>

        <nav className="flex-1 space-y-3">
          <Button 
            variant={activeTab === "my_tasks" ? "secondary" : "ghost"} 
            className="w-full justify-start text-left"
            onClick={() => setActiveTab("my_tasks")}
          >
            🚚 Tugas Saya Hari Ini
          </Button>
        </nav>

        <Button onClick={handleLogout} variant="destructive" className="w-full mt-auto">
          Logout Sistem
        </Button>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Daftar Pengiriman</h1>
            <p className="text-slate-500 mt-1">Pastikan selalu update status saat barang diantar.</p>
          </div>
          <Button onClick={loadMyTasks} variant="outline">🔄 Refresh</Button>
        </header>

        {message && message.type && (
          <div className={`mb-6 p-4 rounded-md border font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <p className="text-slate-500 animate-pulse">Menarik data penugasan...</p>
          ) : tasks.length > 0 ? (
            // Hanya tampilkan tugas yang bukan "pending" (artinya sudah di-assign ke driver)
            tasks.filter(t => t.status !== 'pending' && t.status !== 'cancelled').map((task) => (
              <Card key={task.id} className="shadow-md border-t-4 border-t-yellow-400">
                <CardHeader className="bg-white pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-slate-800">{task.title}</CardTitle>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      task.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <CardDescription className="text-slate-500 mt-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 bg-slate-50 border-t border-slate-100 rounded-b-lg">
                  <p className="text-xs text-slate-500 font-mono mb-4">Task ID: {task.id}</p>
                  
                  {/* Tombol Aksi Berdasarkan Status */}
                  <div className="flex gap-3">
                    {task.status === 'assigned' && (
                      <Button 
                        onClick={() => handleUpdateStatus(task.id, 'in_progress')} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        🚀 Mulai Jalan (In Progress)
                      </Button>
                    )}
                    
                    {task.status === 'in_progress' && (
                      <Button 
                        onClick={() => handleUpdateStatus(task.id, 'completed')} 
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        ✅ Selesai (Barang Sampai)
                      </Button>
                    )}

                    {task.status === 'completed' && (
                      <Button disabled className="w-full bg-slate-200 text-slate-500 border border-slate-300">
                        Tugas Selesai
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 bg-white border border-dashed border-slate-300 rounded-lg">
              <p className="text-slate-500 text-lg">Hore! Belum ada tugas pengiriman untuk Anda hari ini.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}