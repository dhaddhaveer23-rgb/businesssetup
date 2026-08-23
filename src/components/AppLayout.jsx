import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto w-full pb-[calc(6rem+env(safe-area-inset-bottom))] min-h-screen">
        <Outlet />
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-md mx-auto w-full pointer-events-auto">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}