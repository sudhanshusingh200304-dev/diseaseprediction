import { Helmet } from 'react-helmet-async';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HealthInfoCard from '@/components/HealthInfoCard';
import Footer from '@/components/Footer';
import { healthInfo, diseases } from '@/data/symptoms';

const HealthInfo = () => {
  return (
    <>
      <Helmet>
        <title>Health Conditions Information - HealthPredict</title>
        <meta name="description" content="Learn about various health conditions, their symptoms, and find reliable information from trusted sources like Wikipedia." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Health <span className="text-gradient">Information Center</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore comprehensive information about various health conditions. Click on any card to learn more from trusted sources.
              </p>
            </div>

            {/* Major Health Categories */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Major Health Categories</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthInfo.map((info) => (
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
            </section>

            {/* Conditions Database */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Conditions in Our Database</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {diseases.map((disease) => (
                  <a
                    key={disease.id}
                    href={disease.wikiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {disease.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{disease.description}</p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        disease.severity === 'mild' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : disease.severity === 'moderate' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-rose-100 text-rose-700'
                      }`}>
                        {disease.severity}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Trusted Sources */}
            <section className="mt-16">
              <div className="bg-accent/50 rounded-2xl p-8 border border-primary/20">
                <h2 className="text-xl font-bold mb-4 text-center">Trusted Health Resources</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'WHO', url: 'https://www.who.int/' },
                    { name: 'CDC', url: 'https://www.cdc.gov/' },
                    { name: 'Mayo Clinic', url: 'https://www.mayoclinic.org/' },
                    { name: 'WebMD', url: 'https://www.webmd.com/' },
                  ].map((source) => (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card hover:bg-card/80 border border-border hover:border-primary/30 transition-all group"
                    >
                      <span className="font-semibold group-hover:text-primary transition-colors">{source.name}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HealthInfo;
