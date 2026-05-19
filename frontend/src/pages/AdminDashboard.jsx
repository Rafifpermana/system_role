import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // State Navigasi & Data
  const [activeTab, setActiveTab] = useState("pending_tasks");
  const [tasks, setTasks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Penugasan (Assign)
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [message, setMessage] = useState("");

  // Load data saat tab berubah
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Ambil semua tugas
      const taskRes = await api.get("/tasks");
      // Filter hanya yang masih pending untuk daftar penugasan
      setTasks(taskRes.data.data);

      // Ambil daftar driver
      const driverRes = await api.get("/drivers");
      setDrivers(driverRes.data.data);
    } catch (error) {
      console.error("Gagal memuat data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.post("/tasks/assign-bulk", {
        driverId: selectedDriverId,
        taskIds: [parseInt(selectedTaskId)]
      });
      setMessage({ type: "success", text: response.data.message });
      loadData(); // Refresh data
      setSelectedTaskId(""); setSelectedDriverId("");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal menugaskan driver" });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const selectClass = "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- SIDEBAR ADMIN --- */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-500 tracking-wider">ADMIN</h2>
          <p className="text-sm text-slate-400 mt-1">Manajemen Dispatcher</p>
        </div>

        <nav className="flex-1 space-y-3">
          <Button 
            variant={activeTab === "pending_tasks" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("pending_tasks")}
          >
            📋 Daftar Tugas
          </Button>
          <Button 
            variant={activeTab === "assign_driver" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("assign_driver")}
          >
            🚚 Penugasan Driver
          </Button>
        </nav>

        <Button onClick={handleLogout} variant="destructive" className="w-full mt-auto">
          Logout
        </Button>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 border-b pb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">
            {activeTab === "pending_tasks" ? "Monitoring Tugas" : "Plotting Penugasan Supir"}
          </h1>
          <Button onClick={loadData} variant="outline" size="sm">🔄 Refresh Data</Button>
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded-md border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* --- TAB: DAFTAR TUGAS --- */}
        {activeTab === "pending_tasks" && (
          <div className="grid gap-4">
            {isLoading ? <p>Memuat tugas...</p> : (
              tasks.map((task) => (
                <Card key={task.id} className="shadow-sm border-l-4 border-l-blue-500">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{task.title}</h3>
                      <p className="text-sm text-slate-500">{task.description}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">ID: {task.id}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${task.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* --- TAB: PENUGASAN DRIVER --- */}
        {activeTab === "assign_driver" && (
          <Card className="max-w-xl shadow-md">
            <CardHeader>
              <CardTitle>Assign Driver ke Tugas</CardTitle>
              <CardDescription>Pilih tugas pending dan supir yang tersedia.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignTask} className="space-y-6">
                <div className="space-y-2">
                  <Label>Pilih Tugas (Hanya yang Pending)</Label>
                  <select 
                    className={selectClass}
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Tugas --</option>
                    {tasks.filter(t => t.status === 'pending').map(t => (
                      <option key={t.id} value={t.id}>[ID: {t.id}] {t.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Pilih Driver Pelaksana</Label>
                  <select 
                    className={selectClass}
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Driver --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.username} (ID: {d.id})</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Konfirmasi Penugasan
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}