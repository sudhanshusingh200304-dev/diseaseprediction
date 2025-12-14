// Symptom-Disease Mapping Dataset
// This will be replaced with user's actual dataset

export interface Symptom {
  id: string;
  name: string;
  category: string;
}

export interface Disease {
  id: string;
  name: string;
  symptoms: string[];
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  wikiLink: string;
}

export const symptoms: Symptom[] = [
  // General Symptoms
  { id: 'fever', name: 'Fever', category: 'General' },
  { id: 'fatigue', name: 'Fatigue', category: 'General' },
  { id: 'weakness', name: 'Weakness', category: 'General' },
  { id: 'weight_loss', name: 'Weight Loss', category: 'General' },
  { id: 'chills', name: 'Chills', category: 'General' },
  { id: 'sweating', name: 'Excessive Sweating', category: 'General' },
  
  // Head & Neurological
  { id: 'headache', name: 'Headache', category: 'Head & Neurological' },
  { id: 'dizziness', name: 'Dizziness', category: 'Head & Neurological' },
  { id: 'confusion', name: 'Confusion', category: 'Head & Neurological' },
  { id: 'memory_loss', name: 'Memory Loss', category: 'Head & Neurological' },
  
  // Respiratory
  { id: 'cough', name: 'Cough', category: 'Respiratory' },
  { id: 'shortness_breath', name: 'Shortness of Breath', category: 'Respiratory' },
  { id: 'chest_pain', name: 'Chest Pain', category: 'Respiratory' },
  { id: 'runny_nose', name: 'Runny Nose', category: 'Respiratory' },
  { id: 'sore_throat', name: 'Sore Throat', category: 'Respiratory' },
  { id: 'wheezing', name: 'Wheezing', category: 'Respiratory' },
  
  // Digestive
  { id: 'nausea', name: 'Nausea', category: 'Digestive' },
  { id: 'vomiting', name: 'Vomiting', category: 'Digestive' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'Digestive' },
  { id: 'constipation', name: 'Constipation', category: 'Digestive' },
  { id: 'abdominal_pain', name: 'Abdominal Pain', category: 'Digestive' },
  { id: 'loss_appetite', name: 'Loss of Appetite', category: 'Digestive' },
  { id: 'bloating', name: 'Bloating', category: 'Digestive' },
  
  // Skin
  { id: 'rash', name: 'Skin Rash', category: 'Skin' },
  { id: 'itching', name: 'Itching', category: 'Skin' },
  { id: 'skin_peeling', name: 'Skin Peeling', category: 'Skin' },
  { id: 'yellowish_skin', name: 'Yellowish Skin', category: 'Skin' },
  
  // Musculoskeletal
  { id: 'joint_pain', name: 'Joint Pain', category: 'Musculoskeletal' },
  { id: 'muscle_pain', name: 'Muscle Pain', category: 'Musculoskeletal' },
  { id: 'back_pain', name: 'Back Pain', category: 'Musculoskeletal' },
  { id: 'stiff_neck', name: 'Stiff Neck', category: 'Musculoskeletal' },
  
  // Other
  { id: 'frequent_urination', name: 'Frequent Urination', category: 'Urinary' },
  { id: 'burning_urination', name: 'Burning During Urination', category: 'Urinary' },
  { id: 'blurred_vision', name: 'Blurred Vision', category: 'Eyes' },
  { id: 'red_eyes', name: 'Red Eyes', category: 'Eyes' },
];

export const diseases: Disease[] = [
  {
    id: 'common_cold',
    name: 'Common Cold',
    symptoms: ['runny_nose', 'sore_throat', 'cough', 'fatigue', 'headache'],
    description: 'A viral infection of your nose and throat (upper respiratory tract).',
    severity: 'mild',
    wikiLink: 'https://en.wikipedia.org/wiki/Common_cold'
  },
  {
    id: 'flu',
    name: 'Influenza (Flu)',
    symptoms: ['fever', 'cough', 'fatigue', 'muscle_pain', 'headache', 'chills'],
    description: 'A contagious respiratory illness caused by influenza viruses.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Influenza'
  },
  {
    id: 'covid19',
    name: 'COVID-19',
    symptoms: ['fever', 'cough', 'fatigue', 'shortness_breath', 'loss_appetite', 'muscle_pain'],
    description: 'An infectious disease caused by the SARS-CoV-2 virus.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/COVID-19'
  },
  {
    id: 'gastroenteritis',
    name: 'Gastroenteritis',
    symptoms: ['diarrhea', 'vomiting', 'nausea', 'abdominal_pain', 'fever'],
    description: 'An infection of the gut (intestines), usually caused by a virus or bacteria.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Gastroenteritis'
  },
  {
    id: 'migraine',
    name: 'Migraine',
    symptoms: ['headache', 'nausea', 'blurred_vision', 'dizziness', 'fatigue'],
    description: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Migraine'
  },
  {
    id: 'diabetes',
    name: 'Diabetes Mellitus',
    symptoms: ['frequent_urination', 'fatigue', 'blurred_vision', 'weight_loss', 'weakness'],
    description: 'A metabolic disease that causes high blood sugar.',
    severity: 'severe',
    wikiLink: 'https://en.wikipedia.org/wiki/Diabetes'
  },
  {
    id: 'arthritis',
    name: 'Arthritis',
    symptoms: ['joint_pain', 'muscle_pain', 'fatigue', 'weakness', 'stiff_neck'],
    description: 'Inflammation of one or more joints, causing pain and stiffness.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Arthritis'
  },
  {
    id: 'bronchitis',
    name: 'Bronchitis',
    symptoms: ['cough', 'chest_pain', 'fatigue', 'shortness_breath', 'wheezing'],
    description: 'Inflammation of the lining of bronchial tubes, which carry air to and from the lungs.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Bronchitis'
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    symptoms: ['cough', 'fever', 'shortness_breath', 'chest_pain', 'fatigue', 'chills'],
    description: 'An infection that inflames the air sacs in one or both lungs.',
    severity: 'severe',
    wikiLink: 'https://en.wikipedia.org/wiki/Pneumonia'
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    symptoms: ['burning_urination', 'frequent_urination', 'abdominal_pain', 'fever', 'fatigue'],
    description: 'An infection in any part of your urinary system.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Urinary_tract_infection'
  },
  {
    id: 'allergic_reaction',
    name: 'Allergic Reaction',
    symptoms: ['rash', 'itching', 'runny_nose', 'red_eyes', 'wheezing'],
    description: 'An immune system response to a foreign substance.',
    severity: 'mild',
    wikiLink: 'https://en.wikipedia.org/wiki/Allergy'
  },
  {
    id: 'hepatitis',
    name: 'Hepatitis',
    symptoms: ['yellowish_skin', 'fatigue', 'abdominal_pain', 'nausea', 'loss_appetite'],
    description: 'An inflammation of the liver, commonly caused by a viral infection.',
    severity: 'severe',
    wikiLink: 'https://en.wikipedia.org/wiki/Hepatitis'
  },
  {
    id: 'anemia',
    name: 'Anemia',
    symptoms: ['fatigue', 'weakness', 'dizziness', 'shortness_breath', 'headache'],
    description: 'A condition in which you lack enough healthy red blood cells.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Anemia'
  },
  {
    id: 'food_poisoning',
    name: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'fever'],
    description: 'An illness caused by eating contaminated food.',
    severity: 'moderate',
    wikiLink: 'https://en.wikipedia.org/wiki/Foodborne_illness'
  },
  {
    id: 'meningitis',
    name: 'Meningitis',
    symptoms: ['headache', 'fever', 'stiff_neck', 'confusion', 'nausea'],
    description: 'An inflammation of the membranes surrounding your brain and spinal cord.',
    severity: 'severe',
    wikiLink: 'https://en.wikipedia.org/wiki/Meningitis'
  },
];

// Prediction algorithm
export function predictDisease(selectedSymptoms: string[]): { disease: Disease; matchScore: number }[] {
  if (selectedSymptoms.length === 0) return [];

  const predictions = diseases.map(disease => {
    const matchingSymptoms = disease.symptoms.filter(s => selectedSymptoms.includes(s));
    const matchScore = (matchingSymptoms.length / disease.symptoms.length) * 100;
    return { disease, matchScore };
  });

  return predictions
    .filter(p => p.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

export const healthInfo = [
  {
    id: 1,
    title: 'Cardiovascular Disease',
    description: 'Heart and blood vessel conditions including coronary artery disease, heart attacks, and stroke.',
    icon: 'Heart',
    wikiLink: 'https://en.wikipedia.org/wiki/Cardiovascular_disease',
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 2,
    title: 'Diabetes',
    description: 'A chronic condition that affects how your body processes blood sugar (glucose).',
    icon: 'Activity',
    wikiLink: 'https://en.wikipedia.org/wiki/Diabetes',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 3,
    title: 'Respiratory Diseases',
    description: 'Conditions affecting the lungs and breathing, including asthma, COPD, and pneumonia.',
    icon: 'Wind',
    wikiLink: 'https://en.wikipedia.org/wiki/Respiratory_disease',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 4,
    title: 'Mental Health',
    description: 'Conditions affecting mood, thinking, and behavior including depression and anxiety.',
    icon: 'Brain',
    wikiLink: 'https://en.wikipedia.org/wiki/Mental_disorder',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 5,
    title: 'Infectious Diseases',
    description: 'Diseases caused by organisms like bacteria, viruses, fungi, or parasites.',
    icon: 'Shield',
    wikiLink: 'https://en.wikipedia.org/wiki/Infectious_disease',
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 6,
    title: 'Autoimmune Disorders',
    description: 'Conditions where the immune system mistakenly attacks healthy cells in the body.',
    icon: 'Zap',
    wikiLink: 'https://en.wikipedia.org/wiki/Autoimmune_disease',
    color: 'from-cyan-500 to-teal-600'
  },
];
