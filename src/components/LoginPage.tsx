import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { RoleName } from '../types';
import { Activity, ShieldCheck, Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from './common/Button';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@hospital.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<RoleName>('Super Admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, selectedRole);
      setIsLoading(false);
    }, 600);
  };

  const rolesList: RoleName[] = [
    'Super Admin',
    'Hospital Admin',
    'Doctor',
    'Nurse',
    'Receptionist',
    'Pharmacist',
    'Lab Technician',
    'Accountant',
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-medblue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-tealbrand-600/20 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-medblue-600 to-tealbrand-500 flex items-center justify-center shadow-lg shadow-medblue-500/30">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AURA HEALTH</h1>
            <p className="text-xs text-medblue-300 font-medium tracking-wide uppercase">Enterprise Hospital Suite</p>
          </div>
        </div>
        <h2 className="mt-6 text-center text-xl font-semibold text-slate-200">
          Sign in to Clinical Portal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-700/60 sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Quick Role Selector (Demo)
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-700">
                {rolesList.slice(0, 4).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      if (role === 'Super Admin') setEmail('admin@hospital.com');
                      if (role === 'Hospital Admin') setEmail('hadmin@hospital.com');
                      if (role === 'Doctor') setEmail('robert.chen@hospital.com');
                      if (role === 'Nurse') setEmail('clara@hospital.com');
                    }}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all text-center truncate ${
                      selectedRole === role
                        ? 'bg-medblue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 transition-colors"
                  placeholder="name@hospital.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-medblue-500 focus:border-medblue-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-medblue-600 focus:ring-medblue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-300">
                  Remember session
                </label>
              </div>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to admin@hospital.com'); }} className="text-xs font-medium text-medblue-400 hover:text-medblue-300">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="teal"
              size="lg"
              className="w-full font-semibold shadow-lg shadow-tealbrand-600/20 mt-2"
              isLoading={isLoading}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Sign In as {selectedRole}
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-700/60 pt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> HIPAA Compliant
            </span>
            <span>v2.4.0 Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
};
