import { Brain, Database, Cpu, ArrowRight } from 'lucide-react';

const PredictionTheory = () => {
  const steps = [
    {
      icon: Database,
      title: 'Symptom Collection',
      description: 'Users select their symptoms from a comprehensive list organized by body systems and categories.',
    },
    {
      icon: Cpu,
      title: 'Pattern Matching',
      description: 'Our algorithm compares selected symptoms against a curated medical dataset of known conditions.',
    },
    {
      icon: Brain,
      title: 'Probability Scoring',
      description: 'Each potential condition receives a match score based on symptom overlap and severity weighting.',
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How Our <span className="text-gradient">Prediction Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our symptom-based prediction system uses a sophisticated algorithm to analyze your symptoms and provide potential health insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-hover transition-all duration-300 h-full border border-border/50">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-soft group-hover:shadow-glow transition-all duration-300">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-soft">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 p-6 rounded-2xl bg-accent/50 border border-primary/20">
          <p className="text-center text-muted-foreground">
            <strong className="text-foreground">Important Disclaimer:</strong> This tool is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for accurate diagnosis and treatment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PredictionTheory;
