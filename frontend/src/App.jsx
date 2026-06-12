import { useState } from 'react';
import { ArrowRight, Sparkles, RefreshCcw, Loader2 } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [careerResult, setCareerResult] = useState(null);
  const [error, setError] = useState('');

  // Simple function to call your Node.js Backend
  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/guidance',  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: inputValue })
      });
      
      const result = await response.json();
      
      // Extracting the AI text
      const rawAiResponse = result.data || JSON.stringify(result);
      setCareerResult(rawAiResponse);

    } catch (err) {
      console.error(err);
      setError("Failed to connect to the backend. Is your Node.js server running on port 3000?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sandbox-container theme-purple">
      {/* Background Animation */}
      <ParticleBackground speed={1} density={80} style="nodes" accentColor="purple" />
      
      <div className="main-content">
        {/* The Popbox Modal */}
        <div className="popbox-modal">
          
          <div className="card-header">
            <Sparkles size={24} className="icon-glow" />
            <h2>LearnMate AI</h2>
          </div>

          {/* STEP 1: Show the Input Box */}
          {!careerResult && !isLoading && (
            <div className="input-section fade-in">
              <label>
                Tell us about yourself in detail. Write long, descriptive sentences explaining your hobbies, specific interests, academic strengths, and hidden talents so we can map out the perfect path for you:
              </label>
              <textarea 
                rows={6} 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="E.g., I have always been fascinated by how machines learn, so I spend my weekends building small Python scripts. I also enjoy painting and visual arts, which makes me highly attentive to details..."
              />
              {error && <p className="error-text">{error}</p>}
              
              <button className="btn btn-primary" onClick={handleAnalyze}>
                Reveal My Potential <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: Show a simple Loading Spinner */}
          {isLoading && (
            <div className="loading-section fade-in">
              <Loader2 className="spin" size={48} />
              <p>Consulting LearnMate AI Engine...</p>
            </div>
          )}

          {/* STEP 3: Show the Final AI Report */}
          {careerResult && !isLoading && (
            <div className="result-section fade-in">
              <h3>Your AI Diagnostic Summary</h3>
              <div className="result-box">
                <p>{careerResult}</p>
              </div>
              <button className="btn btn-muted" onClick={() => setCareerResult(null)}>
                <RefreshCcw size={16} /> Start Over
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}