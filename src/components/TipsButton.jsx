import { useState } from 'react';
import { HelpCircle, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function TipsButton({ tips, name }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition select-none"
        aria-label={`Tips for ${name || 'this requirement'}`}
      >
        <HelpCircle size={18} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb size={18} className="text-primary" /> Quick tips
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground mb-3">
            {name ? `Finish “${name}” faster:` : 'Finish this task faster:'}
          </p>
          <p className="text-sm leading-relaxed text-foreground/90">
            {tips || 'Practical tips for this requirement will be available soon.'}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}