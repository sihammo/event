import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { LogOut, Users, User, Mail, Phone, Calendar, Trash2 } from 'lucide-react';

interface Registration {
  type: 'solo' | 'team' | 'visitor';
  data: any;
  timestamp: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwnYIrLoy_8DqpqFQFPil4HaJRVJVegWclthFD_hPMjqa7_s_J6A9KbPrGlfW6J8oezA/exec';

  useEffect(() => {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/admin');
      return;
    }

    // Load registrations from localStorage
    loadRegistrations();
  }, [navigate]);

  const loadRegistrations = async () => {
    setIsLoading(true);
    try {
      // Add a timestamp to avoid caching
      const response = await fetch(`${GOOGLE_SHEET_URL}?t=${Date.now()}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setRegistrations(data);
        // Also sync with localStorage for offline view
        localStorage.setItem('registrations', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      // Fallback to localStorage
      const localData = JSON.parse(localStorage.getItem('registrations') || '[]');
      setRegistrations(localData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const handleDelete = (index: number) => {
    const updatedRegistrations = registrations.filter((_, i) => i !== index);
    setRegistrations(updatedRegistrations);
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const soloRegistrations = registrations.filter(r => r.type === 'solo');
  const teamRegistrations = registrations.filter(r => r.type === 'team');
  const visitorRegistrations = registrations.filter(r => r.type === 'visitor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#1a1f35] p-4 md:p-8">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                ADMIN DASHBOARD
              </h1>
              <p className="text-blue-200/70 mt-1">Auto Club Event Registrations</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-600/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-200/70 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {registrations.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-blue-200/70 text-sm">Solo Registrations</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {soloRegistrations.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-blue-200/70 text-sm">Team Registrations</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {teamRegistrations.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-blue-200/70 text-sm">Visitor Registrations</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {visitorRegistrations.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Registrations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-blue-300 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            All Registrations
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-200/50">Fetching data from Google Sheets...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-blue-400/30 mx-auto mb-4" />
              <p className="text-blue-200/50 text-lg">No registrations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-slate-900/30 border border-blue-500/20 rounded-xl p-5 hover:border-blue-400/40 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${
                        registration.type === 'solo'
                          ? 'bg-blue-500/20'
                          : registration.type === 'team' ? 'bg-cyan-500/20' : 'bg-purple-500/20'
                      } flex items-center justify-center`}>
                        {registration.type === 'solo' ? (
                          <User className="w-5 h-5 text-blue-400" />
                        ) : registration.type === 'team' ? (
                          <Users className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <User className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {registration.type === 'solo' ? 'Solo Registration' : registration.type === 'team' ? 'Team Registration' : 'Visitor Registration'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-blue-200/60">
                          <Calendar className="w-4 h-4" />
                          {formatDate(registration.timestamp)}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {registration.type === 'solo' || registration.type === 'visitor' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-blue-200/80">
                        <User className={`w-4 h-4 ${registration.type === 'visitor' ? 'text-purple-400/60' : 'text-blue-400/60'}`} />
                        <span>{registration.type === 'visitor' ? registration.data.name : `${registration.data.firstName} ${registration.data.lastName}`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200/80">
                        <Mail className={`w-4 h-4 ${registration.type === 'visitor' ? 'text-purple-400/60' : 'text-blue-400/60'}`} />
                        <span>{registration.data.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200/80">
                        <Phone className={`w-4 h-4 ${registration.type === 'visitor' ? 'text-purple-400/60' : 'text-blue-400/60'}`} />
                        <span>{registration.data.phone}</span>
                      </div>
                      {registration.type === 'solo' && (
                        <div className="flex items-center gap-2 text-blue-200/80">
                          <span className="capitalize">{registration.data.gender}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {registration.data.members.map((member: any, memberIndex: number) => (
                        <div key={memberIndex} className="bg-slate-900/40 rounded-lg p-3 border border-cyan-500/10">
                          <p className="text-cyan-300 font-medium mb-2 text-sm">Member {memberIndex + 1}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-blue-200/80">
                              <User className="w-4 h-4 text-cyan-400/60" />
                              <span>{member.firstName} {member.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-200/80">
                              <Mail className="w-4 h-4 text-cyan-400/60" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-200/80">
                              <Phone className="w-4 h-4 text-cyan-400/60" />
                              <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-200/80">
                              <span className="capitalize">{member.gender}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
