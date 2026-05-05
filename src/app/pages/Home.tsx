import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { User, Users, CheckCircle, Car, Loader } from 'lucide-react';

type RegistrationType = 'solo' | 'team' | 'visitor' | null;

interface MemberData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
}

interface SoloFormData extends MemberData {}

interface VisitorFormData {
  name: string;
  phone: string;
  email: string;
}

interface TeamFormData {
  members: [MemberData, MemberData, MemberData, MemberData, MemberData];
}

export default function Home() {
  const [registrationType, setRegistrationType] = useState<RegistrationType>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const soloForm = useForm<SoloFormData>();
  const teamForm = useForm<TeamFormData>();
  const visitorForm = useForm<VisitorFormData>();

  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyiimqnY_PhHIppNS6P6TjG4l6n68eytKIiDtt3sx__vngpdcx74N7l0gokbW1puWalBA/exec';

  const sendToSheet = async (type: 'solo' | 'team' | 'visitor', data: any) => {
    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ type, data }),
      });
      console.log('Submission attempt complete for:', type);
      return true;
    } catch (error) {
      console.error('Error sending to sheet:', error);
      return false;
    }
  };

  const onSoloSubmit = async (data: SoloFormData) => {
    setIsSubmitting(true);
    console.log('Solo Registration:', data);
    
    // Send to Google Sheets
    await sendToSheet('solo', data);

    // Store in localStorage for admin to view
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push({
      type: 'solo',
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('registrations', JSON.stringify(registrations));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const onTeamSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true);
    console.log('Team Registration:', data);
    
    // Send to Google Sheets
    await sendToSheet('team', data);

    // Store in localStorage for admin to view
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push({
      type: 'team',
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('registrations', JSON.stringify(registrations));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const onVisitorSubmit = async (data: VisitorFormData) => {
    setIsSubmitting(true);
    console.log('Visitor Registration:', data);
    
    // Send to Google Sheets
    await sendToSheet('visitor', data);

    // Store in localStorage for admin to view
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push({
      type: 'visitor',
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('registrations', JSON.stringify(registrations));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setRegistrationType(null);
    setIsSubmitted(false);
    soloForm.reset();
    teamForm.reset();
    visitorForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#1a1f35] flex items-center justify-center p-4 overflow-auto">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <img src="/logo.png" alt="Auto Club Logo" className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            AUTO CLUB
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-200/80 mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Event Registration
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a 
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-full hover:bg-yellow-500/30 transition shadow-[0_0_15px_rgba(234,179,8,0.2)] font-arabic"
            >
              متابعة مجريات المسابقة مباشرة 🏆
            </a>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!registrationType && !isSubmitted && !isSubmitting && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRegistrationType('solo')}
                className="group relative flex-1 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500/50 rounded-2xl p-8 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    Join Solo
                  </h3>
                  <p className="text-blue-200/70 text-center">
                    Register as an individual participant
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(14, 165, 233, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRegistrationType('team')}
                className="group relative flex-1 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/50 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <Users className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    Join as a Team
                  </h3>
                  <p className="text-cyan-200/70 text-center">
                    Register a team of 5 members
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRegistrationType('visitor')}
                className="group relative flex-1 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl p-8 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <User className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    Join as Visitor
                  </h3>
                  <p className="text-purple-200/70 text-center">
                    Register to attend the event
                  </p>
                </div>
              </motion.button>
            </motion.div>
          )}

          {registrationType === 'solo' && !isSubmitted && !isSubmitting && (
            <motion.div
              key="solo-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-blue-300 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Solo Registration
              </h2>

              <form onSubmit={soloForm.handleSubmit(onSoloSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-blue-200 mb-2 text-sm font-medium">
                      First Name *
                    </label>
                    <input
                      {...soloForm.register('firstName', { required: true })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="John"
                    />
                    {soloForm.formState.errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">This field is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-blue-200 mb-2 text-sm font-medium">
                      Last Name *
                    </label>
                    <input
                      {...soloForm.register('lastName', { required: true })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Doe"
                    />
                    {soloForm.formState.errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">This field is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 mb-2 text-sm font-medium">
                    Phone Number *
                  </label>
                  <input
                    {...soloForm.register('phone', { required: true, pattern: /^[0-9+\-\s()]+$/ })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="+1 234 567 8900"
                  />
                  {soloForm.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">Please enter a valid phone number</p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 mb-2 text-sm font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...soloForm.register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="john@example.com"
                  />
                  {soloForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">Please enter a valid email</p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 mb-2 text-sm font-medium">
                    Gender *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="male"
                        {...soloForm.register('gender', { required: true })}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="female"
                        {...soloForm.register('gender', { required: true })}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Female</span>
                    </label>
                  </div>
                  {soloForm.formState.errors.gender && (
                    <p className="text-red-400 text-sm mt-1">Please select a gender</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/30"
                  >
                    Submit Registration
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {registrationType === 'team' && !isSubmitted && !isSubmitting && (
            <motion.div
              key="team-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Team Registration (5 Members)
              </h2>

              <form onSubmit={teamForm.handleSubmit(onTeamSubmit)} className="space-y-8">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-slate-900/30 border border-cyan-500/20 rounded-xl p-5"
                  >
                    <h3 className="text-lg font-semibold text-cyan-300 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      Member {index + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-cyan-200 mb-2 text-sm font-medium">
                          First Name *
                        </label>
                        <input
                          {...teamForm.register(`members.${index}.firstName` as const, { required: true })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                          placeholder="First Name"
                        />
                      </div>

                      <div>
                        <label className="block text-cyan-200 mb-2 text-sm font-medium">
                          Last Name *
                        </label>
                        <input
                          {...teamForm.register(`members.${index}.lastName` as const, { required: true })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                          placeholder="Last Name"
                        />
                      </div>

                      <div>
                        <label className="block text-cyan-200 mb-2 text-sm font-medium">
                          Phone *
                        </label>
                        <input
                          {...teamForm.register(`members.${index}.phone` as const, { required: true })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                          placeholder="Phone Number"
                        />
                      </div>

                      <div>
                        <label className="block text-cyan-200 mb-2 text-sm font-medium">
                          Email *
                        </label>
                        <input
                          type="email"
                          {...teamForm.register(`members.${index}.email` as const, { required: true })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                          placeholder="Email"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-cyan-200 mb-2 text-sm font-medium">
                          Gender *
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="male"
                              {...teamForm.register(`members.${index}.gender` as const, { required: true })}
                              className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 focus:ring-2"
                            />
                            <span className="text-white text-sm">Male</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="female"
                              {...teamForm.register(`members.${index}.gender` as const, { required: true })}
                              className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 focus:ring-2"
                            />
                            <span className="text-white text-sm">Female</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30"
                  >
                    Submit Team Registration
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {registrationType === 'visitor' && !isSubmitted && !isSubmitting && (
            <motion.div
              key="visitor-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-purple-950/40 to-pink-950/40 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Visitor Registration
              </h2>

              <form onSubmit={visitorForm.handleSubmit(onVisitorSubmit)} className="space-y-5">
                <div>
                  <label className="block text-purple-200 mb-2 text-sm font-medium">
                    Full Name *
                  </label>
                  <input
                    {...visitorForm.register('name', { required: true })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="John Doe"
                  />
                  {visitorForm.formState.errors.name && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-purple-200 mb-2 text-sm font-medium">
                    Phone Number *
                  </label>
                  <input
                    {...visitorForm.register('phone', { required: true, pattern: /^[0-9+\-\s()]+$/ })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="+1 234 567 8900"
                  />
                  {visitorForm.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">Please enter a valid phone number</p>
                  )}
                </div>

                <div>
                  <label className="block text-purple-200 mb-2 text-sm font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...visitorForm.register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="john@example.com"
                  />
                  {visitorForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">Please enter a valid email</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30"
                  >
                    Submit Registration
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {isSubmitting && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-blue-500/20"
              >
                <Loader className="w-12 h-12 text-blue-400" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4 font-arabic">
                جاري التسجيل الآن...
              </h2>

              <p className="text-lg text-blue-200/80 font-arabic">
                الرجاء الانتظار قليلاً بينما نقوم بتأكيد تسجيلك في النظام.
                <br />
                لا تقم بتحديث الصفحة أو الخروج منها.
              </p>
            </motion.div>
          )}

          {isSubmitted && !isSubmitting && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-green-950/40 to-blue-950/40 border border-green-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-500/20"
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-green-300 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Registration Successful!
              </h2>

              <p className="text-lg text-green-200/80 mb-8">
                Your {registrationType} registration has been submitted successfully.
                <br />
                We'll contact you soon with event details.
              </p>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-blue-500 transition-all shadow-lg shadow-green-500/30"
              >
                Register Another
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
