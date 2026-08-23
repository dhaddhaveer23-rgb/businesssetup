import { useState } from 'react';
import { Mail, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// NOTE: Replace this email with your official support address once your
// custom domain and mailbox are configured.
const SUPPORT_EMAIL = 'hello@businesssetup.app';

export default function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`BusinessSetup enquiry from ${name || 'a user'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto w-full px-6 pt-12 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 hover:text-foreground transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-heading text-3xl font-semibold tracking-tight mb-2">Contact</h1>
        <p className="text-muted-foreground mb-8">
          Questions, feedback or corrections? We'd love to hear from you.
        </p>

        <div className="space-y-3 mb-8">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-medium text-sm">Email us</p>
              <p className="text-xs text-muted-foreground">{SUPPORT_EMAIL}</p>
            </div>
          </a>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="font-medium text-sm">Response time</p>
              <p className="text-xs text-muted-foreground">We aim to reply within 2 business days</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-border bg-card outline-none focus:border-primary transition"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-border bg-card outline-none focus:border-primary transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full p-3.5 rounded-2xl border border-border bg-card outline-none focus:border-primary transition resize-none"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 py-3.5"
          >
            <Send size={17} /> Send message
          </button>
        </form>
      </div>
    </div>
  );
}