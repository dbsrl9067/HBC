import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, BookOpen, FlaskConical, Mail, ExternalLink, Lock, LogOut, RefreshCw } from 'lucide-react';
import { LAB_NAME, LAB_NAME_KO, UNIVERSITY_NAME, UNIVERSITY_NAME_KO } from '../constants';
import { useLab } from '../context/LabContext';

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm group ${
          isActive 
            ? 'text-zinc-900 font-semibold bg-zinc-100' 
            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
        }`
      }
    >
      <Icon size={18} strokeWidth={2} className="opacity-70 group-hover:opacity-100" />
      <span>{label}</span>
    </NavLink>
  );
};

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, login, logout, resetData, changePassword } = useLab();
  
  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Change Password Modal State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setPasswordInput('');
    setLoginError(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) return;
    
    setIsChangingPassword(true);
    try {
      await changePassword(newPasswordInput);
      setIsChangePasswordModalOpen(false);
      setNewPasswordInput('');
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar - Minimalist Style */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-zinc-100/50 px-8 pt-16 pb-8 z-20 flex-shrink-0">
        <div className="mb-12">
          <h1 className="text-lg font-bold tracking-tight text-zinc-900">{LAB_NAME_KO}</h1>
          <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">{UNIVERSITY_NAME_KO}</p>
          <p className="text-[10px] text-zinc-300 -mt-0.5">{UNIVERSITY_NAME}</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/research" icon={FlaskConical} label="Research" />
          <NavItem to="/members" icon={Users} label="People" />
          <NavItem to="/publications" icon={BookOpen} label="Publications" />
          <NavItem to="/contact" icon={Mail} label="Contact" />
        </nav>

        <div className="pt-6 mt-6 border-t border-zinc-50">
           <a 
            href="https://psychology.chungbuk.ac.kr/" 
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-600 transition-colors text-xs font-medium"
          >
            <ExternalLink size={14} />
            <span>Dept. of Psychology</span>
          </a>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-zinc-100 z-50 px-4 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-zinc-900">{LAB_NAME_KO}</h1>
          <span className="text-[10px] text-zinc-400 -mt-1">{UNIVERSITY_NAME_KO}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-600 hover:bg-zinc-50 rounded-lg active:scale-95 transition-transform"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden pt-20 px-6 pb-6 flex flex-col animate-in slide-in-from-top-4 duration-200">
           <nav className="space-y-2">
            <NavItem to="/" icon={Home} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/research" icon={FlaskConical} label="Research" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/members" icon={Users} label="People" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/publications" icon={BookOpen} label="Publications" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/contact" icon={Mail} label="Contact" onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
          
          <div className="mt-8 pt-8 border-t border-zinc-100">
            <a 
              href="https://psychology.chungbuk.ac.kr/" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-3 text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50 text-sm"
            >
              <ExternalLink size={16} />
              <span className="font-medium">Dept. of Psychology</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:px-16 md:py-16 px-6 py-24 w-full">
        <div className="max-w-5xl">
          {isAdmin && (
          <div className="mb-8 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs animate-in slide-in-from-top-2">
            <span className="font-semibold text-zinc-600 flex items-center gap-2">
              <Lock size={12} /> Admin Mode
            </span>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsChangePasswordModalOpen(true)} 
                className="flex items-center gap-1 hover:bg-zinc-200 px-2 py-1 rounded transition-colors font-medium text-zinc-600"
              >
                <Lock size={12} /> Change Pwd
              </button>
              <button 
                onClick={resetData} 
                className="flex items-center gap-1 hover:bg-zinc-200 px-2 py-1 rounded transition-colors font-medium text-zinc-600"
                title="Populate database with default data"
              >
                <RefreshCw size={12} /> Reset DB
              </button>
              <button onClick={logout} className="flex items-center gap-1 hover:bg-zinc-200 px-2 py-1 rounded transition-colors font-medium text-zinc-600">
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>
        )}
        
        <Outlet />
        
        {/* Footer */}
        <footer className="mt-32 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-300 text-xs pb-12">
          <p>© {new Date().getFullYear()} {LAB_NAME}. All rights reserved.</p>
          <button 
            onClick={isAdmin ? logout : openLoginModal}
            className="p-2 hover:bg-zinc-50 rounded-full transition-colors text-zinc-300 hover:text-zinc-500"
            title={isAdmin ? "Logout" : "Admin Login"}
          >
            <Lock size={14} />
          </button>
        </footer>
      </div>
    </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 w-full max-w-sm relative z-10 p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-900">Admin Login</h2>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  autoFocus
                  type="password"
                  className={`w-full px-4 py-3 rounded-lg bg-zinc-50 border outline-none transition-all text-sm ${
                    loginError 
                      ? 'border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-50' 
                      : 'border-zinc-100 focus:border-zinc-300 focus:ring-2 focus:ring-zinc-50'
                  }`}
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                {loginError && (
                  <p className="text-red-500 text-xs mt-2 font-medium">Incorrect password.</p>
                )}
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-zinc-900 text-white font-medium py-3 rounded-lg hover:bg-zinc-800 active:scale-95 transition-all text-sm"
              >
                Access
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setIsChangePasswordModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 w-full max-w-sm relative z-10 p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-900">Change Admin Password</h2>
              <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <input
                  autoFocus
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 border border-zinc-100 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-50 transition-all text-sm"
                  placeholder="Enter new password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isChangingPassword}
                className="w-full bg-zinc-900 text-white font-medium py-3 rounded-lg hover:bg-zinc-800 active:scale-95 transition-all text-sm disabled:opacity-50"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};