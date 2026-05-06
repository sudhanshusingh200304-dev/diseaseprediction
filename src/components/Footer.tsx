import { Stethoscope, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import InstallAppButton from './InstallAppButton';

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-primary">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">HealthPredict</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/predict" className="text-muted-foreground hover:text-primary transition-colors">
              Symptom Checker
            </Link>
            <Link to="/health-info" className="text-muted-foreground hover:text-primary transition-colors">
              Health Info
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <InstallAppButton />
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for better health
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HealthPredict. For educational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
