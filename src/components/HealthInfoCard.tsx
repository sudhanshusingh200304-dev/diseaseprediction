import { ExternalLink, Heart, Activity, Wind, Brain, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface HealthInfoCardProps {
  title: string;
  description: string;
  icon: string;
  wikiLink: string;
  color: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Activity,
  Wind,
  Brain,
  Shield,
  Zap,
};

const HealthInfoCard = ({ title, description, icon, wikiLink, color }: HealthInfoCardProps) => {
  const IconComponent = iconMap[icon] || Activity;

  return (
    <div className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 border border-border/50 hover:border-primary/30">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {description}
      </p>
      
      <a 
        href={wikiLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block"
      >
        <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary">
          Learn More
          <ExternalLink className="w-4 h-4" />
        </Button>
      </a>
    </div>
  );
};

export default HealthInfoCard;
