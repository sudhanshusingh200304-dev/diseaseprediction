import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import SymptomChecker from '@/components/SymptomChecker';
import Footer from '@/components/Footer';

const Predict = () => {
  return (
    <>
      <Helmet>
        <title>Symptom Checker - HealthPredict</title>
        <meta name="description" content="Select your symptoms and get potential health condition predictions. Our intelligent algorithm analyzes your symptoms to provide helpful insights." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Symptom <span className="text-gradient">Checker</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select at least 2 symptoms you're experiencing to get potential health condition predictions. Remember, this is for educational purposes only.
              </p>
            </div>
            
            <SymptomChecker />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Predict;
