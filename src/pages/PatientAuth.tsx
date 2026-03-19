import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, UserPlus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientAuth = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!form.fullName.trim()) { toast.error('Name is required'); setLoading(false); return; }
        
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.user) throw new Error('Signup failed');

        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id,
          full_name: form.fullName.trim(),
          email: form.email,
          phone: form.phone || null,
        });
        if (profileError) throw profileError;

        toast.success('Account created! Please check your email to verify.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Patient {isSignup ? 'Sign Up' : 'Login'} - HealthPredict</title>
      </Helmet>
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 group">
            <div className="p-2 rounded-lg gradient-primary shadow-soft">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">HealthPredict</span>
          </Link>

          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              {isSignup ? 'Create Patient Account' : 'Patient Login'}
            </h1>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              {isSignup ? 'Sign up to track your health predictions' : 'Sign in to your account'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <>
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : isSignup ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isSignup ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline">
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/doctor/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Are you a doctor? Login here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientAuth;
