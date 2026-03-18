import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HealthDataForm from '@/components/health-predict/HealthDataForm';
import PredictionResults from '@/components/health-predict/PredictionResults';
import { HealthFormData, PredictionResult } from '@/types/health-prediction';
import { supabase } from '@/integrations/supabase/client';

const AIPredict = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formSnapshot, setFormSnapshot] = useState<HealthFormData | null>(null);

  const handleSubmit = async (data: HealthFormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const { data: response, error } = await supabase.functions.invoke('health-predict', { body: data });

      if (error) {
        throw new Error(error.message || 'Prediction failed');
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      setResult(response as PredictionResult);
      setFormSnapshot(data);
      toast.success('Health risk assessment complete!');
    } catch (err: any) {
      console.error('Prediction error:', err);
      toast.error(err.message || 'Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !formSnapshot) return;

    const report = `
HEALTH RISK ASSESSMENT REPORT
Generated: ${new Date().toLocaleDateString()}
================================

PATIENT DATA:
- Age: ${formSnapshot.age}
- Gender: ${formSnapshot.gender}
- BMI: ${formSnapshot.bmi}
- Blood Pressure: ${formSnapshot.bloodPressureSystolic}/${formSnapshot.bloodPressureDiastolic} mmHg
- Glucose: ${formSnapshot.glucoseLevel} mg/dL
- Cholesterol: ${formSnapshot.cholesterol} mg/dL
- Smoking: ${formSnapshot.smokingStatus}
- Activity: ${formSnapshot.activityLevel}
- Family History: ${formSnapshot.familyHistory ? 'Yes' : 'No'}
${formSnapshot.symptoms.length > 0 ? `- Symptoms: ${formSnapshot.symptoms.join(', ')}` : ''}

================================
OVERALL RISK: ${result.overallRisk} (${result.riskScore}%)

SUMMARY:
${result.summary}

CONDITION RISKS:
${result.conditions.map(c => `- ${c.name}: ${c.risk} (${c.probability}%) — ${c.explanation}`).join('\n')}

RISK FACTORS:
${result.riskFactors.map(f => `- ${f.factor} [${f.impact}]: ${f.detail}`).join('\n')}

RECOMMENDATIONS:
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

================================
DISCLAIMER: This is an AI-generated assessment for educational purposes only.
Consult a healthcare professional for medical advice.
`.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  return (
    <>
      <Helmet>
        <title>AI Health Prediction - HealthPredict</title>
        <meta name="description" content="Get an AI-powered health risk assessment based on your vital signs, lifestyle factors, and symptoms." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 gradient-hero">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                AI Health <span className="text-gradient">Prediction</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enter your health data below to receive an AI-powered risk assessment for common chronic conditions. Your data is not stored.
              </p>
            </div>

            <HealthDataForm onSubmit={handleSubmit} isLoading={isLoading} />

            {result && (
              <div className="mt-10">
                <PredictionResults result={result} onDownload={handleDownload} />
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AIPredict;
