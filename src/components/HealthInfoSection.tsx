import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import HealthInfoCard from './HealthInfoCard';
import { healthInfo } from '@/data/symptoms';

const HealthInfoSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Common <span className="text-gradient">Health Conditions</span>
            </h2>
            <p className="text-muted-foreground">
              Learn about various health conditions and their symptoms
            </p>
          </div>
          <Link to="/health-info">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthInfo.slice(0, 6).map((info) => (
            <HealthInfoCard
              key={info.id}
              title={info.title}
              description={info.description}
              icon={info.icon}
              wikiLink={info.wikiLink}
              color={info.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthInfoSection;
