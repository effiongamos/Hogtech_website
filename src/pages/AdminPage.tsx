import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Bell,
  Briefcase,
  Settings,
  Vote,
  GraduationCap,
  MessageSquare,
  LogOut,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { CompanySettings, Announcement, PortfolioItem } from '../types/index.ts';
import { LazyImage } from '../components/LazyImage.tsx';

interface AdminPageProps {
  onDataUpdated: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onDataUpdated }) => {
  const [token, setToken] = useState<string>(() => localStorage.getItem('hogtech_admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'submissions' | 'announcements' | 'portfolio' | 'settings' | 'poll'>('submissions');

  // Admin Data state
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Announcement edit form
  const [editingAnn, setEditingAnn] = useState<any | null>(null);
  // Portfolio edit form
  const [editingPort, setEditingPort] = useState<any | null>(null);
  // Settings form
  const [settingsForm, setSettingsForm] = useState<CompanySettings | null>(null);

  const fetchAdminData = async (authToken = token) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        setToken('');
        localStorage.removeItem('hogtech_admin_token');
        return;
      }
      const data = await res.json();
      setAdminData(data);
      setSettingsForm(data.settings);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      setToken(data.token);
      localStorage.setItem('hogtech_admin_token', data.token);
      fetchAdminData(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid passcode');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('hogtech_admin_token');
  };

  // Save Announcement
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingAnn),
      });
      if (!res.ok) throw new Error('Failed to save announcement');
      setEditingAnn(null);
      setSaveStatus('Announcement saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
      fetchAdminData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchAdminData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save Portfolio Item
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPort) return;

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPort),
      });
      if (!res.ok) throw new Error('Failed to save portfolio');
      setEditingPort(null);
      setSaveStatus('Portfolio item saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
      fetchAdminData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete portfolio item');
      fetchAdminData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save Company Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSaveStatus('Company contact and profile settings updated!');
      setTimeout(() => setSaveStatus(''), 3000);
      fetchAdminData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update Submission Status
  const handleUpdateStatus = async (type: string, id: string, status: string) => {
    try {
      await fetch('/api/admin/submission-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, id, status }),
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Login View
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center mx-auto shadow">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              Hogtech Admin Portal
            </h2>
            <p className="text-xs text-slate-500">
              Authorized access for Hogtech Int’l Ventures management and content administrators.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Administrator Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin key (default: hogtech2026)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: The pre-configured security key is <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">hogtech2026</code>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              <span>Enter Management Console</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">
              Hogtech Int’l Ventures Administration
            </h1>
            <p className="text-xs text-slate-400">
              Persistent Database Management · Live Synchronized
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAdminData()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Inbound Inquiries & Orders</span>
          {adminData?.submissions && (
            <span className="bg-teal-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {adminData.submissions.serviceRequests.length +
                adminData.submissions.trainingRegistrations.length +
                adminData.submissions.contactMessages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'announcements'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>News & Announcements</span>
          <span className="text-[10px] opacity-70">({adminData?.announcements?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Portfolio Projects</span>
          <span className="text-[10px] opacity-70">({adminData?.portfolio?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Company & Social Settings</span>
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS & LEADS */}
      {activeTab === 'submissions' && adminData && (
        <div className="space-y-8">
          {/* Service Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Service Quote Requests ({adminData.submissions.serviceRequests.length})</span>
            </h3>

            {adminData.submissions.serviceRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No service requests submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminData.submissions.serviceRequests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500 font-mono whitespace-nowrap">{req.timestamp}</td>
                        <td className="p-3 font-semibold text-slate-900">{req.fullName}</td>
                        <td className="p-3 text-slate-700">{req.phoneOrEmail}</td>
                        <td className="p-3">
                          <span className="font-medium text-slate-900">{req.serviceCategory}</span>
                          <span className="block text-[11px] text-slate-500">{req.serviceItem}</span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs">{req.details || '—'}</td>
                        <td className="p-3">
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateStatus('serviceRequest', req.id, e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Training Registrations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Training Registrations ({adminData.submissions.trainingRegistrations.length})</span>
            </h3>

            {adminData.submissions.trainingRegistrations.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No course enrollments submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Program</th>
                      <th className="p-3">Schedule</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminData.submissions.trainingRegistrations.map((trn: any) => (
                      <tr key={trn.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500 font-mono whitespace-nowrap">{trn.timestamp}</td>
                        <td className="p-3 font-semibold text-slate-900">{trn.fullName}</td>
                        <td className="p-3 text-slate-700">{trn.phone}</td>
                        <td className="p-3 font-medium text-teal-800">{trn.program}</td>
                        <td className="p-3 text-slate-600">{trn.preferredSchedule}</td>
                        <td className="p-3">
                          <select
                            value={trn.status}
                            onChange={(e) => handleUpdateStatus('trainingRegistration', trn.id, e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="enrolled">Enrolled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Contact Inquiries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-teal-600" />
              <span>Contact Messages ({adminData.submissions.contactMessages.length})</span>
            </h3>

            {adminData.submissions.contactMessages.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No contact messages received yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Sender</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminData.submissions.contactMessages.map((msg: any) => (
                      <tr key={msg.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500 font-mono whitespace-nowrap">{msg.timestamp}</td>
                        <td className="p-3 font-semibold text-slate-900">{msg.name}</td>
                        <td className="p-3 text-slate-700">{msg.contact}</td>
                        <td className="p-3 font-medium text-slate-900">{msg.subject}</td>
                        <td className="p-3 text-slate-600 max-w-sm">{msg.message}</td>
                        <td className="p-3">
                          <select
                            value={msg.status}
                            onChange={(e) => handleUpdateStatus('contactMessage', msg.id, e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS MANAGER */}
      {activeTab === 'announcements' && adminData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">
              News & Announcements
            </h3>
            <button
              onClick={() =>
                setEditingAnn({
                  title: '',
                  category: 'General Announcement',
                  date: 'October 2026',
                  summary: '',
                  content: '',
                  published: true,
                  badge: '',
                })
              }
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </button>
          </div>

          {/* Edit / Create Announcement Form */}
          {editingAnn && (
            <form onSubmit={handleSaveAnnouncement} className="bg-slate-50 border border-slate-300 rounded-2xl p-6 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-slate-900">
                {editingAnn.id ? 'Edit Announcement' : 'New Announcement'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingAnn.title}
                    onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={editingAnn.category}
                    onChange={(e) => setEditingAnn({ ...editingAnn, category: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Date</label>
                  <input
                    type="text"
                    value={editingAnn.date}
                    onChange={(e) => setEditingAnn({ ...editingAnn, date: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={editingAnn.badge || ''}
                    onChange={(e) => setEditingAnn({ ...editingAnn, badge: e.target.value })}
                    placeholder="e.g. Open for Admission"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingAnn.summary}
                  onChange={(e) => setEditingAnn({ ...editingAnn, summary: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Content / Details</label>
                <textarea
                  rows={3}
                  value={editingAnn.content}
                  onChange={(e) => setEditingAnn({ ...editingAnn, content: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingAnn.published}
                  onChange={(e) => setEditingAnn({ ...editingAnn, published: e.target.checked })}
                />
                <label htmlFor="published" className="text-slate-800 font-medium">
                  Published and visible to website visitors
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAnn(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          )}

          {/* List of Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminData.announcements.map((ann: any) => (
              <div
                key={ann.id}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 relative hover:shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-teal-700">{ann.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ann.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {ann.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{ann.summary}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{ann.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingAnn(ann)}
                      className="p-1.5 text-slate-600 hover:text-teal-700 rounded hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PORTFOLIO MANAGER */}
      {activeTab === 'portfolio' && adminData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Work Portfolio Projects
            </h3>
            <button
              onClick={() =>
                setEditingPort({
                  title: '',
                  category: 'Printing & Editorial',
                  description: '',
                  image: '/src/assets/images/portfolio_event_programs_1791613507577.jpg',
                  completionDate: 'October 2026',
                  clientType: 'Corporate Client',
                })
              }
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portfolio Project</span>
            </button>
          </div>

          {editingPort && (
            <form onSubmit={handleSavePortfolio} className="bg-slate-50 border border-slate-300 rounded-2xl p-6 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-slate-900">
                {editingPort.id ? 'Edit Project' : 'New Project'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPort.title}
                    onChange={(e) => setEditingPort({ ...editingPort, title: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={editingPort.category}
                    onChange={(e) => setEditingPort({ ...editingPort, category: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Printing & Editorial">Printing & Editorial</option>
                    <option value="Custom Stationery">Custom Stationery</option>
                    <option value="Branding & Graphics">Branding & Graphics</option>
                    <option value="Computer Training">Computer Training</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Image URL / Path</label>
                  <input
                    type="text"
                    required
                    value={editingPort.image}
                    onChange={(e) => setEditingPort({ ...editingPort, image: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Completion Date</label>
                  <input
                    type="text"
                    value={editingPort.completionDate || ''}
                    onChange={(e) => setEditingPort({ ...editingPort, completionDate: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingPort.description}
                  onChange={(e) => setEditingPort({ ...editingPort, description: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPort(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminData.portfolio.map((port: any) => (
              <div
                key={port.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div className="h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <LazyImage
                    src={port.image}
                    alt={port.title}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none">
                    {port.category}
                  </span>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-sm text-slate-900">{port.title}</h4>
                  <p className="text-slate-600 line-clamp-2">{port.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-mono text-[11px]">{port.completionDate}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPort(port)}
                        className="p-1.5 text-slate-600 hover:text-teal-700 rounded hover:bg-slate-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(port.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPANY & SOCIAL SETTINGS */}
      {activeTab === 'settings' && settingsForm && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-xs shadow-sm">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Company Profile & Contact Information
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Changes made here are permanently saved to the server and appear instantly on the website and WhatsApp integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Business Name</label>
              <input
                type="text"
                value={settingsForm.businessName}
                onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Slogan</label>
              <input
                type="text"
                value={settingsForm.slogan}
                onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Physical Address</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Opening Hours</label>
              <input
                type="text"
                value={settingsForm.openingHours}
                onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official Telephone Number</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                placeholder="2348030000000"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official Email Address</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs">Official Social Media URLs</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={settingsForm.facebookUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Instagram Profile URL</label>
                <input
                  type="url"
                  value={settingsForm.instagramUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">TikTok Account URL</label>
                <input
                  type="url"
                  value={settingsForm.tiktokUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">LinkedIn Page URL</label>
                <input
                  type="url"
                  value={settingsForm.linkedinUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes to Database</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
