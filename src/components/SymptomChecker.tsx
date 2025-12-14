import { useState, useMemo } from 'react';
import { Search, X, CheckCircle2, AlertTriangle, ExternalLink, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { symptoms, predictDisease, Disease } from '@/data/symptoms';

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = [...new Set(symptoms.map(s => s.category))];
    return cats;
  }, []);

  const filteredSymptoms = useMemo(() => {
    return symptoms.filter(symptom => {
      const matchesSearch = symptom.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || symptom.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const groupedSymptoms = useMemo(() => {
    const groups: Record<string, typeof symptoms> = {};
    filteredSymptoms.forEach(symptom => {
      if (!groups[symptom.category]) {
        groups[symptom.category] = [];
      }
      groups[symptom.category].push(symptom);
    });
    return groups;
  }, [filteredSymptoms]);

  const predictions = useMemo(() => {
    if (!showResults) return [];
    return predictDisease(selectedSymptoms);
  }, [selectedSymptoms, showResults]);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
    setShowResults(false);
  };

  const handlePredict = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setShowResults(false);
    setSearchQuery('');
    setActiveCategory(null);
  };

  const getSeverityColor = (severity: Disease['severity']) => {
    switch (severity) {
      case 'mild': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'severe': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Symptom Selection Panel */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold mb-4">Select Your Symptoms</h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    !activeCategory 
                      ? 'gradient-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat 
                        ? 'gradient-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms List */}
            <div className="p-6 max-h-[500px] overflow-y-auto">
              {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {categorySymptoms.map(symptom => (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          selectedSymptoms.includes(symptom.id)
                            ? 'bg-primary/10 border-2 border-primary text-primary'
                            : 'bg-secondary/50 border-2 border-transparent hover:border-primary/30 hover:bg-secondary'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedSymptoms.includes(symptom.id)
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {selectedSymptoms.includes(symptom.id) && (
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="font-medium">{symptom.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Selected Symptoms</h2>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {selectedSymptoms.length}
                </span>
              </div>

              {/* Selected Symptoms Tags */}
              <div className="flex flex-wrap gap-2 mb-4 min-h-[60px]">
                {selectedSymptoms.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No symptoms selected yet</p>
                ) : (
                  selectedSymptoms.map(id => {
                    const symptom = symptoms.find(s => s.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {symptom?.name}
                        <button onClick={() => toggleSymptom(id)} className="hover:bg-primary/20 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="hero" 
                  className="flex-1"
                  onClick={handlePredict}
                  disabled={selectedSymptoms.length < 2}
                >
                  Predict
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Prediction Results */}
            {showResults && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Possible Conditions</h3>
                
                {predictions.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No matching conditions found. Try selecting more symptoms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {predictions.map(({ disease, matchScore }) => (
                      <div 
                        key={disease.id} 
                        className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold">{disease.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(disease.severity)}`}>
                            {disease.severity}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Match Score</span>
                            <span className="font-semibold text-primary">{Math.round(matchScore)}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full gradient-primary rounded-full transition-all duration-500"
                              style={{ width: `${matchScore}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{disease.description}</p>
                        
                        <a 
                          href={disease.wikiLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          Learn more on Wikipedia
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      This is not a medical diagnosis. Please consult a healthcare professional for accurate diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
