import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PredictionTheory from '@/components/PredictionTheory';
import HealthInfoSection from '@/components/HealthInfoSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>HealthPredict - AI-Powered Symptom Analysis & Health Predictions</title>
        <meta name="description" content="Understand your health with our intelligent symptom analyzer. Get potential health condition insights based on your symptoms using advanced prediction algorithms." />
      </Helmet>
      
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <PredictionTheory />
          <HealthInfoSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
