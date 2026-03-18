import { useState } from 'react';
import { User, Heart, Activity, Cigarette, Dumbbell, Users, Stethoscope, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthFormData } from '@/types/health-prediction';

const symptomOptions = [
  'Frequent Urination', 'Excessive Thirst', 'Blurred Vision', 'Fatigue',
  'Chest Pain', 'Shortness of Breath', 'Dizziness', 'Headache',
  'Numbness in Extremities', 'Unexplained Weight Loss', 'Slow Healing Wounds',
  'Joint Pain', 'Swelling in Legs', 'Irregular Heartbeat'
];

interface Props {
  onSubmit: (data: HealthFormData) => void;
  isLoading: boolean;
}

const HealthDataForm = ({ onSubmit, isLoading }: Props) => {
  const [formData, setFormData] = useState<HealthFormData>({
    age: 30,
    gender: 'male',
    bmi: 22,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    glucoseLevel: 90,
    cholesterol: 180,
    smokingStatus: 'never',
    activityLevel: 'moderate',
    familyHistory: false,
    symptoms: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (formData.age < 1 || formData.age > 120) e.age = 'Age must be 1–120';
    if (formData.bmi < 10 || formData.bmi > 60) e.bmi = 'BMI must be 10–60';
    if (formData.bloodPressureSystolic < 70 || formData.bloodPressureSystolic > 250) e.bloodPressureSystolic = 'Systolic BP must be 70–250';
    if (formData.bloodPressureDiastolic < 40 || formData.bloodPressureDiastolic > 150) e.bloodPressureDiastolic = 'Diastolic BP must be 40–150';
    if (formData.glucoseLevel < 30 || formData.glucoseLevel > 500) e.glucoseLevel = 'Glucose must be 30–500';
    if (formData.cholesterol < 100 || formData.cholesterol > 400) e.cholesterol = 'Cholesterol must be 100–400';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const toggleSymptom = (s: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter(x => x !== s)
        : [...prev.symptoms, s],
    }));
  };

  const handleReset = () => {
    setFormData({
      age: 30, gender: 'male', bmi: 22, bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80, glucoseLevel: 90, cholesterol: 180,
      smokingStatus: 'never', activityLevel: 'moderate', familyHistory: false, symptoms: [],
    });
    setErrors({});
  };

  const updateField = (field: keyof HealthFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const InputField = ({ label, icon: Icon, field, unit, min, max }: {
    label: string; icon: any; field: keyof HealthFormData; unit?: string; min: number; max: number;
  }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
        <Icon className="w-4 h-4 text-primary" /> {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={formData[field] as number}
          onChange={e => updateField(field, Number(e.target.value))}
          min={min} max={max}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
        />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{unit}</span>}
      </div>
      {errors[field] && <p className="text-destructive text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  const SelectField = ({ label, icon: Icon, field, options }: {
    label: string; icon: any; field: keyof HealthFormData; options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
        <Icon className="w-4 h-4 text-primary" /> {label}
      </label>
      <select
        value={formData[field] as string}
        onChange={e => updateField(field, e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Info */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Age" icon={User} field="age" unit="years" min={1} max={120} />
          <SelectField label="Gender" icon={User} field="gender" options={[
            { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' },
          ]} />
          <InputField label="BMI (Body Mass Index)" icon={Activity} field="bmi" unit="kg/m²" min={10} max={60} />
        </div>
      </div>

      {/* Vital Signs */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" /> Vital Signs & Lab Results
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Systolic Blood Pressure" icon={Heart} field="bloodPressureSystolic" unit="mmHg" min={70} max={250} />
          <InputField label="Diastolic Blood Pressure" icon={Heart} field="bloodPressureDiastolic" unit="mmHg" min={40} max={150} />
          <InputField label="Fasting Glucose Level" icon={Activity} field="glucoseLevel" unit="mg/dL" min={30} max={500} />
          <InputField label="Total Cholesterol" icon={Activity} field="cholesterol" unit="mg/dL" min={100} max={400} />
        </div>
      </div>

      {/* Lifestyle */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" /> Lifestyle Factors
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField label="Smoking Status" icon={Cigarette} field="smokingStatus" options={[
            { value: 'never', label: 'Never Smoked' }, { value: 'former', label: 'Former Smoker' },
            { value: 'current_light', label: 'Current (Light)' }, { value: 'current_heavy', label: 'Current (Heavy)' },
          ]} />
          <SelectField label="Physical Activity Level" icon={Dumbbell} field="activityLevel" options={[
            { value: 'sedentary', label: 'Sedentary' }, { value: 'light', label: 'Light Exercise' },
            { value: 'moderate', label: 'Moderate Exercise' }, { value: 'active', label: 'Very Active' },
          ]} />
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Family History of Chronic Disease</span>
              <div
                onClick={() => updateField('familyHistory', !formData.familyHistory)}
                className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${formData.familyHistory ? 'bg-primary' : 'bg-secondary'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${formData.familyHistory ? 'left-6' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-muted-foreground">{formData.familyHistory ? 'Yes' : 'No'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" /> Current Symptoms (Optional)
        </h3>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map(s => (
            <button
              key={s} type="button"
              onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                formData.symptoms.includes(s)
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Analyzing...</>
          ) : (
            <>Get AI Health Prediction <ArrowRight className="w-5 h-5" /></>
          )}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={handleReset}>
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default HealthDataForm;
