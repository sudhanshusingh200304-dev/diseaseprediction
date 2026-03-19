import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { symptoms as symptomList, predictDisease } from '@/data/symptoms';
import { LogOut, Stethoscope, History, User, Activity, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface PredictionRecord {
  id: string;
  symptoms: string[];
  predicted_diseases: any;
  risk_score: number | null;
  overall_risk: string | null;
  prediction_type: string;
  created_at: string;
}

interface DoctorNote {
  id: string;
  note: string;
  created_at: string;
}

const PatientDashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [history, setHistory] = useState<PredictionRecord[]>([]);
  const [doctorNotes, setDoctorNotes] = useState<DoctorNote[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [activeTab, setActiveTab] = useState<'predict' | 'history' | 'notes'>('predict');
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/patient/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      fetchHistory();
      fetchDoctorNotes();
    }
  }, [user]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('prediction_history')
      .select('*')
      .eq('patient_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setHistory(data as PredictionRecord[]);
  };

  const fetchDoctorNotes = async () => {
    const { data } = await supabase
      .from('doctor_notes')
      .select('id, note, created_at')
      .eq('patient_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) setDoctorNotes(data);
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    setIsPredicting(true);
    const results = predictDisease(selectedSymptoms);
    setPredictions(results);

    // Save to history
    const topDiseases = results.slice(0, 3).map(r => ({
      name: r.disease.name,
      score: Math.round(r.matchScore),
      severity: r.disease.severity,
    }));

    await supabase.from('prediction_history').insert({
      patient_id: user!.id,
      symptoms: selectedSymptoms,
      predicted_diseases: topDiseases,
      risk_score: results[0]?.matchScore || 0,
      overall_risk: results[0]?.disease.severity || 'unknown',
      prediction_type: 'symptom',
    });

    await fetchHistory();
    setIsPredicting(false);
    toast.success('Prediction complete!');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  const categories = [...new Set(symptomList.map(s => s.category))];

  return (
    <>
      <Helmet><title>Patient Dashboard - HealthPredict</title></Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-primary shadow-soft">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">HealthPredict</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium hidden sm:inline">{profile?.full_name || 'Patient'}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 container mx-auto px-4 max-w-5xl">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Hello, <span className="text-gradient">{profile?.full_name?.split(' ')[0] || 'there'}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">How are you feeling today?</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'predict' as const, icon: Activity, label: 'Symptom Checker' },
              { key: 'history' as const, icon: History, label: 'History' },
              { key: 'notes' as const, icon: Clock, label: 'Doctor Notes' },
            ].map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className="gap-2"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>

          {/* Predict Tab */}
          {activeTab === 'predict' && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                <h2 className="text-lg font-bold mb-4">Select Your Symptoms</h2>
                {categories.map(cat => (
                  <div key={cat} className="mb-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {symptomList.filter(s => s.category === cat).map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSymptom(s.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            selectedSymptoms.includes(s.id)
                              ? 'gradient-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button onClick={handlePredict} disabled={isPredicting || selectedSymptoms.length === 0} className="w-full mt-4 gap-2">
                  {isPredicting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Activity className="w-4 h-4" />}
                  Predict Diseases
                </Button>
              </div>

              {predictions.length > 0 && (
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 animate-slide-up">
                  <h2 className="text-lg font-bold mb-4">Top Predictions</h2>
                  <div className="space-y-3">
                    {predictions.slice(0, 3).map((p, i) => (
                      <div key={p.disease.id} className="p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                            <h3 className="font-semibold">{p.disease.name}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            p.disease.severity === 'severe' ? 'bg-destructive/10 text-destructive' :
                            p.disease.severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {Math.round(p.matchScore)}% match
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{p.disease.description}</p>
                        <a href={p.disease.wikiLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block">Learn more →</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
              <h2 className="text-lg font-bold mb-4">Prediction History</h2>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No predictions yet. Try the symptom checker!</p>
              ) : (
                <div className="space-y-3">
                  {history.map(h => (
                    <div key={h.id} className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <button
                        onClick={() => setExpandedHistory(expandedHistory === h.id ? null : h.id)}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{new Date(h.created_at).toLocaleDateString()} {new Date(h.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{h.prediction_type}</span>
                          {expandedHistory === h.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>
                      {expandedHistory === h.id && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Symptoms: {h.symptoms.join(', ')}</p>
                          <div className="space-y-1">
                            {(Array.isArray(h.predicted_diseases) ? h.predicted_diseases : []).map((d: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span>{d.name}</span>
                                <span className="font-medium">{d.score}% match</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Doctor Notes Tab */}
          {activeTab === 'notes' && (
            <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
              <h2 className="text-lg font-bold mb-4">Notes from Your Doctor</h2>
              {doctorNotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No doctor notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {doctorNotes.map(n => (
                    <div key={n.id} className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <p className="text-sm">{n.note}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PatientDashboard;
