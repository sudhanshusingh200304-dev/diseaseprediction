import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Home, Activity, Info, Brain, UserCircle, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { user, role } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg gradient-primary shadow-soft group-hover:shadow-hover transition-all duration-300">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">HealthPredict</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/predict">
              <Button variant={isActive('/predict') ? 'default' : 'ghost'} size="sm" className="gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Predict</span>
              </Button>
            </Link>
            <Link to="/ai-predict">
              <Button variant={isActive('/ai-predict') ? 'default' : 'ghost'} size="sm" className="gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">AI Predict</span>
              </Button>
            </Link>
            <Link to="/health-info">
              <Button variant={isActive('/health-info') ? 'default' : 'ghost'} size="sm" className="gap-2">
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Health Info</span>
              </Button>
            </Link>
            
            {/* Auth buttons */}
            {user ? (
              <Link to={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}>
                <Button variant="outline" size="sm" className="gap-2">
                  {role === 'doctor' ? <ShieldCheck className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link to="/patient/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
