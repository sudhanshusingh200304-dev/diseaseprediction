import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { age, gender, bmi, bloodPressureSystolic, bloodPressureDiastolic, glucoseLevel, cholesterol, smokingStatus, activityLevel, familyHistory, symptoms } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an advanced AI health risk assessment model. You analyze patient health data and provide risk predictions.

IMPORTANT: You are NOT providing a medical diagnosis. You are providing a risk assessment for educational purposes only.

Given the patient data, you must respond with ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "overallRisk": "Low" | "Moderate" | "High" | "Very High",
  "riskScore": <number 0-100>,
  "conditions": [
    {
      "name": "<condition name>",
      "risk": "Low" | "Moderate" | "High",
      "probability": <number 0-100>,
      "explanation": "<brief explanation>"
    }
  ],
  "riskFactors": [
    {
      "factor": "<factor name>",
      "impact": "Positive" | "Neutral" | "Negative",
      "detail": "<brief detail>"
    }
  ],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "summary": "<2-3 sentence overall health risk summary>"
}

Analyze for these conditions based on the input data:
- Type 2 Diabetes risk
- Cardiovascular Disease risk  
- Hypertension risk
- Metabolic Syndrome risk
- General health risk

Consider BMI categories: <18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, 30+ obese.
Consider blood pressure: <120/80 normal, 120-129/<80 elevated, 130-139/80-89 high stage 1, 140+/90+ high stage 2.
Consider glucose: <100 normal, 100-125 prediabetes, 126+ diabetes range.
Consider cholesterol: <200 desirable, 200-239 borderline, 240+ high.

Be thorough but remember this is educational only.`;

    const userPrompt = `Patient Health Data:
- Age: ${age} years
- Gender: ${gender}
- BMI: ${bmi}
- Blood Pressure: ${bloodPressureSystolic}/${bloodPressureDiastolic} mmHg
- Fasting Glucose Level: ${glucoseLevel} mg/dL
- Total Cholesterol: ${cholesterol} mg/dL
- Smoking Status: ${smokingStatus}
- Physical Activity Level: ${activityLevel}
- Family History of Chronic Disease: ${familyHistory ? "Yes" : "No"}
${symptoms && symptoms.length > 0 ? `- Current Symptoms: ${symptoms.join(", ")}` : "- No current symptoms reported"}

Please analyze this data and provide a comprehensive health risk assessment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the JSON response, handling potential markdown wrapping
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse prediction results" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("health-predict error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
