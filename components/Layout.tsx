import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, BookOpen, FlaskConical, Mail, ExternalLink, Lock, LogOut, KeyRound } from 'lucide-react';
import { LAB_NAME, UNIVERSITY_NAME } from '../constants';
import { useLab } from '../context/LabContext';

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-zinc-900 text-white shadow-md' 
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
        }`
      }
    >
      <Icon size={20} strokeWidth={2} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, login, logout, changePassword } = useLab();
  
  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Change Password Modal State
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(passwordInput)) {
      setIsLoginModalOpen(false);
      setPasswordInput('');
      setLoginError(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginError(true);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim()) {
      changePassword(newPassword.trim());
      alert('Password changed successfully.');
      setIsChangePassOpen(false);
      setNewPassword('');
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setPasswordInput('');
    setLoginError(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 border-r border-zinc-100 bg-white p-6 z-20">
        <div className="mb-10 pl-2">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">{LAB_NAME}</h1>
          <p className="text-sm text-zinc-400 font-medium">{UNIVERSITY_NAME}</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/research" icon={FlaskConical} label="Research" />
          <NavItem to="/members" icon={Users} label="Members" />
          <NavItem to="/publications" icon={BookOpen} label="Publications" />
          <NavItem to="/contact" icon={Mail} label="Contact" />
        </nav>

        <div className="pt-6 border-t border-zinc-100">
           <a 
            href="https://psychology.chungbuk.ac.kr/" 
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-900 transition-colors text-sm"
          >
            <ExternalLink size={16} />
            <span>Dept. of Psychology</span>
          </a>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-zinc-100 z-50 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-900">{LAB_NAME}</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg active:scale-95 transition-transform"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden pt-20 px-4 pb-6 flex flex-col animate-in slide-in-from-top-4 duration-200">
           <nav className="space-y-2">
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/research" icon={FlaskConical} label="Research" />
            <NavItem to="/members" icon={Users} label="Members" />
            <NavItem to="/publications" icon={BookOpen} label="Publications" />
            <NavItem to="/contact" icon={Mail} label="Contact" />
          </nav>
          
          <div className="mt-8 pt-8 border-t border-zinc-100">
            <a 
              href="https://psychology.chungbuk.ac.kr/" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-900 transition-colors rounded-xl hover:bg-zinc-50"
            >
              <ExternalLink size={20} />
              <span className="font-medium">Dept. of Psychology</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:px-12 md:py-10 px-5 py-24 max-w-5xl mx-auto w-full">
        {isAdmin && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm animate-in slide-in-from-top-2 shadow-sm">
            <span className="font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Admin Mode Active
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsChangePassOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md border border-red-100 hover:bg-red-50 transition-colors"
              >
                <KeyRound size={14} /> Password
              </button>
              <button 
                onClick={logout} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md border border-red-100 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        )}
        <Outlet />
        
        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-400 text-sm pb-10">
          <p>© {new Date().getFullYear()} {LAB_NAME}. All rights reserved.</p>
          <button 
            onClick={isAdmin ? logout : openLoginModal}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            title={isAdmin ? "Logout" : "Admin Login"}
          >
            {isAdmin ? <LogOut size={16} /> : <Lock size={16} />}
          </button>
        </footer>
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Admin Login</h2>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                <input
                  autoFocus
                  type="password"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    loginError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                {loginError && (
                  <p className="text-red-500 text-sm mt-2 font-medium">Incorrect password. Please try again.</p>
                )}
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-zinc-900 text-white font-medium py-3 rounded-xl hover:bg-zinc-800 active:scale-95 transition-all"
              >
                Access Admin Mode
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePassOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsChangePassOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Change Password</h2>
              <button onClick={() => setIsChangePassOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
                <input
                  autoFocus
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};