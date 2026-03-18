export interface HealthFormData {
  age: number;
  gender: string;
  bmi: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  glucoseLevel: number;
  cholesterol: number;
  smokingStatus: string;
  activityLevel: string;
  familyHistory: boolean;
  symptoms: string[];
}

export interface ConditionRisk {
  name: string;
  risk: 'Low' | 'Moderate' | 'High';
  probability: number;
  explanation: string;
}

export interface RiskFactor {
  factor: string;
  impact: 'Positive' | 'Neutral' | 'Negative';
  detail: string;
}

export interface PredictionResult {
  overallRisk: 'Low' | 'Moderate' | 'High' | 'Very High';
  riskScore: number;
  conditions: ConditionRisk[];
  riskFactors: RiskFactor[];
  recommendations: string[];
  summary: string;
}
