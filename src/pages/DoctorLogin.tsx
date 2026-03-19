import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, LogIn, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;

      // Verify doctor role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'doctor')
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        throw new Error('Access denied. This account is not authorized as a doctor.');
      }

      toast.success('Welcome, Doctor!');
      navigate('/doctor/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Doctor Login - HealthPredict</title>
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Doctor Login</h1>
            </div>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              Authorized healthcare professionals only. No public registration.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                Sign In as Doctor
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/patient/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to Patient Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
