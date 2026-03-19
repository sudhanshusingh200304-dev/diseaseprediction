import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Stethoscope, Search, Users, FileText, ChevronDown, ChevronUp, Send, ShieldCheck } from 'lucide-react';

interface PatientProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  created_at: string;
}

interface PredictionRecord {
  id: string;
  symptoms: string[];
  predicted_diseases: any;
  risk_score: number | null;
  overall_risk: string | null;
  prediction_type: string;
  created_at: string;
}

interface NoteRecord {
  id: string;
  note: string;
  created_at: string;
}

const DoctorDashboard = () => {
  const { user, signOut, loading: authLoading, role } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [patientHistory, setPatientHistory] = useState<PredictionRecord[]>([]);
  const [patientNotes, setPatientNotes] = useState<NoteRecord[]>([]);
  const [newNote, setNewNote] = useState('');
  const [doctorName, setDoctorName] = useState('Doctor');
  const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || role !== 'doctor')) navigate('/doctor/login');
  }, [authLoading, user, role, navigate]);

  useEffect(() => {
    if (user && role === 'doctor') {
      fetchPatients();
      fetchDoctorName();
    }
  }, [user, role]);

  const fetchDoctorName = async () => {
    const { data } = await supabase.from('doctors').select('full_name').eq('user_id', user!.id).maybeSingle();
    if (data) setDoctorName(data.full_name);
  };

  const fetchPatients = async () => {
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    if (data) setPatients(data as PatientProfile[]);
  };

  const selectPatient = async (patient: PatientProfile) => {
    setSelectedPatient(patient);
    // Fetch patient history
    const { data: histData } = await supabase
      .from('prediction_history')
      .select('*')
      .eq('patient_id', patient.user_id)
      .order('created_at', { ascending: false });
    if (histData) setPatientHistory(histData as PredictionRecord[]);

    // Fetch doctor's notes for this patient
    const { data: notesData } = await supabase
      .from('doctor_notes')
      .select('id, note, created_at')
      .eq('patient_id', patient.user_id)
      .eq('doctor_id', user!.id)
      .order('created_at', { ascending: false });
    if (notesData) setPatientNotes(notesData);
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedPatient) return;
    const { error } = await supabase.from('doctor_notes').insert({
      doctor_id: user!.id,
      patient_id: selectedPatient.user_id,
      note: newNote.trim(),
    });
    if (error) { toast.error('Failed to add note'); return; }
    toast.success('Note added');
    setNewNote('');
    selectPatient(selectedPatient); // Refresh
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredPatients = patients.filter(p =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <>
      <Helmet><title>Doctor Dashboard - HealthPredict</title></Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-primary shadow-soft">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">HealthPredict</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">Doctor</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium hidden sm:inline">Dr. {doctorName.split(' ').pop()}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome, <span className="text-gradient">Dr. {doctorName.split(' ').pop()}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{patients.length} patients registered</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">Patients</h2>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No patients found</p>
                  ) : (
                    filteredPatients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => selectPatient(p)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          selectedPatient?.id === p.id
                            ? 'gradient-primary text-primary-foreground'
                            : 'bg-secondary/50 hover:bg-secondary border border-border'
                        }`}
                      >
                        <p className="font-medium text-sm">{p.full_name}</p>
                        <p className={`text-xs ${selectedPatient?.id === p.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{p.email}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Patient Detail */}
            <div className="lg:col-span-2 space-y-6">
              {!selectedPatient ? (
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a patient to view their profile and history</p>
                </div>
              ) : (
                <>
                  {/* Profile Card */}
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                    <h2 className="text-lg font-bold mb-4">Patient Profile</h2>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selectedPatient.full_name}</span></div>
                      <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selectedPatient.email}</span></div>
                      <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selectedPatient.phone || 'N/A'}</span></div>
                      <div><span className="text-muted-foreground">Gender:</span> <span className="font-medium">{selectedPatient.gender || 'N/A'}</span></div>
                      <div><span className="text-muted-foreground">Registered:</span> <span className="font-medium">{new Date(selectedPatient.created_at).toLocaleDateString()}</span></div>
                    </div>
                  </div>

                  {/* Prediction History */}
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-bold">Prediction History</h2>
                    </div>
                    {patientHistory.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No predictions yet</p>
                    ) : (
                      <div className="space-y-3">
                        {patientHistory.map(h => (
                          <div key={h.id} className="p-3 rounded-xl bg-secondary/50 border border-border">
                            <button
                              onClick={() => setExpandedPrediction(expandedPrediction === h.id ? null : h.id)}
                              className="w-full flex items-center justify-between"
                            >
                              <span className="text-sm font-medium">{new Date(h.created_at).toLocaleString()}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{h.prediction_type}</span>
                                {expandedPrediction === h.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </button>
                            {expandedPrediction === h.id && (
                              <div className="mt-3 pt-3 border-t border-border text-sm">
                                <p className="text-xs text-muted-foreground mb-2">Symptoms: {h.symptoms.join(', ')}</p>
                                {(Array.isArray(h.predicted_diseases) ? h.predicted_diseases : []).map((d: any, i: number) => (
                                  <div key={i} className="flex justify-between py-1">
                                    <span>{d.name}</span>
                                    <span className="font-medium">{d.score}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Doctor Notes */}
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                    <h2 className="text-lg font-bold mb-4">Your Notes for {selectedPatient.full_name.split(' ')[0]}</h2>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add a note or recommendation..."
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addNote()}
                      />
                      <Button onClick={addNote} disabled={!newNote.trim()} size="sm" className="gap-2">
                        <Send className="w-4 h-4" /> Add
                      </Button>
                    </div>
                    {patientNotes.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">No notes yet</p>
                    ) : (
                      <div className="space-y-2">
                        {patientNotes.map(n => (
                          <div key={n.id} className="p-3 rounded-xl bg-secondary/50 border border-border">
                            <p className="text-sm">{n.note}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DoctorDashboard;
