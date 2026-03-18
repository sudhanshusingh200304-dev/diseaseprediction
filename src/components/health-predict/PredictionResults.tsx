import { AlertTriangle, Download, TrendingUp, TrendingDown, Minus, Shield, Lightbulb, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PredictionResult } from '@/types/health-prediction';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  result: PredictionResult;
  onDownload: () => void;
}

const riskColors: Record<string, string> = {
  'Low': 'hsl(152, 69%, 40%)',
  'Moderate': 'hsl(38, 92%, 50%)',
  'High': 'hsl(0, 84%, 55%)',
  'Very High': 'hsl(0, 72%, 40%)',
};

const riskBg: Record<string, string> = {
  'Low': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Moderate': 'bg-amber-100 text-amber-700 border-amber-200',
  'High': 'bg-rose-100 text-rose-700 border-rose-200',
  'Very High': 'bg-red-200 text-red-800 border-red-300',
};

const impactIcon = {
  Positive: <TrendingDown className="w-4 h-4 text-emerald-600" />,
  Neutral: <Minus className="w-4 h-4 text-amber-500" />,
  Negative: <TrendingUp className="w-4 h-4 text-rose-600" />,
};

const PredictionResults = ({ result, onDownload }: Props) => {
  const gaugeData = [
    { name: 'Risk', value: result.riskScore },
    { name: 'Remaining', value: 100 - result.riskScore },
  ];

  const conditionData = result.conditions.map(c => ({
    name: c.name.replace(/\s*risk$/i, ''),
    probability: c.probability,
    fill: riskColors[c.risk] || riskColors['Moderate'],
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Overall Risk */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gaugeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                  <Cell fill={riskColors[result.overallRisk]} />
                  <Cell fill="hsl(var(--secondary))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-20">
              <div className="text-3xl font-bold text-foreground">{result.riskScore}%</div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${riskBg[result.overallRisk]}`}>
                {result.overallRisk} Risk
              </span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Overall Health Risk Assessment</h3>
            <p className="text-muted-foreground">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Condition Risks Chart */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Condition Risk Breakdown
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conditionData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              <Bar dataKey="probability" radius={[0, 8, 8, 0]} barSize={24}>
                {conditionData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Detail cards */}
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {result.conditions.map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-secondary/50 border border-border">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm">{c.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${riskBg[c.risk]}`}>{c.risk}</span>
              </div>
              <p className="text-xs text-muted-foreground">{c.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="text-lg font-bold mb-4">Risk Factor Analysis</h3>
        <div className="space-y-3">
          {result.riskFactors.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              {impactIcon[f.impact]}
              <div>
                <h4 className="font-semibold text-sm">{f.factor}</h4>
                <p className="text-xs text-muted-foreground">{f.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" /> Health Recommendations
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-accent/30">
              <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-sm">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer + Download */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              This AI prediction is for <strong>educational purposes only</strong>. Always consult a qualified healthcare professional for medical advice.
            </p>
          </div>
        </div>
        <Button variant="outline" size="lg" onClick={onDownload} className="gap-2">
          <Download className="w-4 h-4" /> Download Report
        </Button>
      </div>

      {/* Learn More */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
        <p className="text-sm text-muted-foreground mb-2">Want to learn more about these conditions?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { name: 'Diabetes', url: 'https://en.wikipedia.org/wiki/Diabetes' },
            { name: 'Heart Disease', url: 'https://en.wikipedia.org/wiki/Cardiovascular_disease' },
            { name: 'Hypertension', url: 'https://en.wikipedia.org/wiki/Hypertension' },
          ].map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
              {l.name} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
