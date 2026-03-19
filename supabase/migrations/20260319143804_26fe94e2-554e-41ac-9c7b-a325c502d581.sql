
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table (for patients)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialization TEXT,
  license_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Prediction history table
CREATE TABLE public.prediction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT[] NOT NULL DEFAULT '{}',
  predicted_diseases JSONB NOT NULL DEFAULT '[]',
  risk_score NUMERIC,
  overall_risk TEXT,
  full_result JSONB,
  prediction_type TEXT NOT NULL DEFAULT 'symptom',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;

-- Doctor notes table
CREATE TABLE public.doctor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctor_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- user_roles: users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- profiles: patients can CRUD their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- profiles: doctors can read all patient profiles
CREATE POLICY "Doctors can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'doctor'));

-- doctors: doctors can read their own record
CREATE POLICY "Doctors can read own record" ON public.doctors
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- prediction_history: patients can read/insert their own
CREATE POLICY "Patients can read own predictions" ON public.prediction_history
  FOR SELECT TO authenticated USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert own predictions" ON public.prediction_history
  FOR INSERT TO authenticated WITH CHECK (patient_id = auth.uid());

-- prediction_history: doctors can read all
CREATE POLICY "Doctors can read all predictions" ON public.prediction_history
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'doctor'));

-- doctor_notes: doctors can CRUD their own notes
CREATE POLICY "Doctors can read own notes" ON public.doctor_notes
  FOR SELECT TO authenticated USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert notes" ON public.doctor_notes
  FOR INSERT TO authenticated WITH CHECK (
    doctor_id = auth.uid() AND public.has_role(auth.uid(), 'doctor')
  );

CREATE POLICY "Doctors can update own notes" ON public.doctor_notes
  FOR UPDATE TO authenticated USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own notes" ON public.doctor_notes
  FOR DELETE TO authenticated USING (doctor_id = auth.uid());

-- doctor_notes: patients can read notes about them
CREATE POLICY "Patients can read their notes" ON public.doctor_notes
  FOR SELECT TO authenticated USING (patient_id = auth.uid());

-- Trigger to auto-assign patient role on profile creation
CREATE OR REPLACE FUNCTION public.assign_patient_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_patient_role();

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;
