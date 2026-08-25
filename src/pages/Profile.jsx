import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Settings, LogOut, ChevronRight, Mail, Trash2, AlertTriangle, Loader2, BarChart3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [businessCount, setBusinessCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.UserBusiness.list().then((b) => setBusinessCount(b.length)).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // Permanently remove the user's data. RLS scopes these to the current user.
      await base44.entities.UserBusiness.deleteMany({}).catch(() => {});
      await base44.entities.ChecklistItem.deleteMany({}).catch(() => {});
      await base44.entities.Notification.deleteMany({}).catch(() => {});
      // The platform auth account itself cannot be removed via the SDK, so we log out.
      base44.auth.logout('/login');
    } catch (e) {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const initials = (user?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="px-6 pt-[calc(3rem+env(safe-area-inset-top))]">
      <h1 className="font-heading text-2xl font-semibold tracking-tight mb-6 select-none">Profile</h1>

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
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left select-none"
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
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left select-none"
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
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left select-none"
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

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Analytics Dashboard</p>
              <p className="text-xs text-muted-foreground">User onboarding funnel and drop-off</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-8 select-none">
        <Link to="/privacy-policy" className="hover:text-foreground transition">Privacy</Link>
        <span className="text-border">·</span>
        <Link to="/terms-of-service" className="hover:text-foreground transition">Terms</Link>
        <span className="text-border">·</span>
        <Link to="/disclaimer" className="hover:text-foreground transition">Disclaimer</Link>
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-destructive/30 transition text-left select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <LogOut size={18} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-destructive">Log Out</p>
          </div>
        </button>
      </div>

      <div className="mt-3">
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger asChild>
            <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-destructive/30 transition text-left select-none">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                <Trash2 size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently remove your saved data</p>
              </div>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-destructive" /> Delete account?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your saved businesses, checklists and notifications. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-10 select-none">BusinessSetup · Test data version</p>
    </div>
  );
}