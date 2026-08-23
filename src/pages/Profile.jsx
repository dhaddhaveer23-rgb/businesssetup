import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Settings, LogOut, ChevronRight, Mail, User as UserIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [businessCount, setBusinessCount] = useState(0);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.UserBusiness.list().then((b) => setBusinessCount(b.length)).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  const initials = (user?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="px-6 pt-12">
      <h1 className="font-heading text-2xl font-semibold tracking-tight mb-6">Profile</h1>

      <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border mb-6">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{user?.full_name || 'New user'}</p>
          <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
            <Mail size={13} /> {user?.email || '—'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => navigate('/my-businesses')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
            <Briefcase size={18} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">My Businesses</p>
            <p className="text-xs text-muted-foreground">{businessCount} saved businesses</p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </button>

        <button
          onClick={() => navigate('/select-country')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
            <Settings size={18} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Settings</p>
            <p className="text-xs text-muted-foreground">Country and preferences</p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </button>

        <Link
          to="/contact"
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
            <Mail size={18} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Contact</p>
            <p className="text-xs text-muted-foreground">Questions, feedback or corrections</p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Link>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-8">
        <Link to="/privacy-policy" className="hover:text-foreground transition">Privacy</Link>
        <span className="text-border">·</span>
        <Link to="/terms-of-service" className="hover:text-foreground transition">Terms</Link>
        <span className="text-border">·</span>
        <Link to="/disclaimer" className="hover:text-foreground transition">Disclaimer</Link>
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-destructive/30 transition text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <LogOut size={18} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-destructive">Log Out</p>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-10">BusinessSetup · Test data version</p>
    </div>
  );
}