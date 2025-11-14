import React, { useState } from 'react';
import { CameraData, CalculationResults } from './types/index';
import { calculateAllDensities } from './utils/calculations';
import { CameraInputForm } from './components/CameraInputForm';
import { BulkUploadForm } from './components/BulkUploadForm';
import { CameraDataTable } from './components/CameraDataTable';
import { ResultsDisplay } from './components/ResultsDisplay';
import './App.css';

type InputMethod = 'setup' | 'manual' | 'bulk';

export const App: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('setup');
  const [totalCameras, setTotalCameras] = useState(0);
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [movementRate, setMovementRate] = useState<number | null>(null);

  const handleStartManual = (count: number) => {
    setTotalCameras(count);
    setInputMethod('manual');
    setCameras([]);
    setResults(null);
  };

  const handleAddCamera = (camera: CameraData) => {
    setCameras([...cameras, camera]);
  };

  const handleLoadBulkCameras = (newCameras: CameraData[]) => {
    setCameras(newCameras);
    setTotalCameras(newCameras.length);
    setInputMethod('setup');
  };

  const handleUpdateCamera = (id: string, updates: Partial<CameraData>) => {
    setCameras(cameras.map(cam => cam.id === id ? { ...cam, ...updates } : cam));
  };

  const handleDeleteCamera = (id: string) => {
    setCameras(cameras.filter(cam => cam.id !== id));
  };

  const handleCalculate = () => {
    if (cameras.length === 0) {
      alert('Please add at least one camera');
      return;
    }
    if (movementRate === null || movementRate <= 0) {
      alert('Please enter a valid deer movement rate greater than 0');
      return;
    }
    const calculatedResults = calculateAllDensities(cameras, movementRate);
    setResults(calculatedResults);
  };

  const handleReset = () => {
    setInputMethod('setup');
    setTotalCameras(0);
    setCameras([]);
    setResults(null);
    setMovementRate(null);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-header-content">
          <h1>🦌 Deer Denominator</h1>
          <p>Calculate deer density from camera trap data</p>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {inputMethod === 'setup' && (
          <div className="space-y-6">
            <div className="setup-card">
              <h2>Get Started</h2>

              <div className="space-y-4">
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>How would you like to input your camera data?</p>

                <div className="option-grid">
                  <button
                    onClick={() => setInputMethod('bulk')}
                    className="option-button"
                  >
                    <h3>📤 Bulk Upload</h3>
                    <p>Upload Excel/CSV or paste data</p>
                  </button>

                  <div className="manual-input-box">
                    <h3>📝 Manual Entry</h3>
                    <p>Enter number of cameras:</p>
                    <div className="input-group">
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g., 5"
                        id="cameraCount"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('cameraCount') as HTMLInputElement;
                          const count = parseInt(input?.value || '0');
                          if (count > 0) handleStartManual(count);
                          else alert('Please enter a valid number');
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                </div>

                <div className="movement-rate-box">
                  <h3>🦌 Deer Movement Rate *</h3>
                  <p>Average daily distance traveled (miles/day):</p>
                  <div className="input-group">
                    <input
                      type="number"
                      min="0.01"
                      step="0.1"
                      value={movementRate ?? ''}
                      onChange={(e) => setMovementRate(e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="Required - e.g., 0.5"
                      required
                    />
                  </div>
                </div>
              </div>

              {cameras.length > 0 && (
                <div className="section-divider">
                  <div className="section-header">
                    <h3>Loaded Data: {cameras.length} camera(s)</h3>
                    <button
                      onClick={handleReset}
                      className="btn-secondary"
                    >
                      Reset
                    </button>
                  </div>
                  <CameraDataTable
                    cameras={cameras}
                    onUpdateCamera={handleUpdateCamera}
                    onDeleteCamera={handleDeleteCamera}
                  />
                  <button
                    onClick={handleCalculate}
                    className="btn-success btn-block"
                    style={{ marginTop: '24px' }}
                  >
                    Calculate Density
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {inputMethod === 'bulk' && (
          <div className="space-y-6">
            <button
              onClick={() => setInputMethod('setup')}
              className="btn-secondary"
              style={{ marginBottom: '16px' }}
            >
              ← Back
            </button>
            <BulkUploadForm onLoadCameras={handleLoadBulkCameras} />
            {cameras.length > 0 && (
              <>
                <CameraDataTable
                  cameras={cameras}
                  onUpdateCamera={handleUpdateCamera}
                  onDeleteCamera={handleDeleteCamera}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleCalculate}
                    className="flex-1 btn-success btn-large"
                  >
                    Calculate Density
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-secondary btn-large"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {inputMethod === 'manual' && cameras.length < totalCameras && (
          <div className="space-y-6">
            <button
              onClick={() => setInputMethod('setup')}
              className="btn-secondary"
              style={{ marginBottom: '16px' }}
            >
              ← Back
            </button>
            <CameraInputForm
              onAddCamera={handleAddCamera}
              totalCameras={totalCameras}
              currentCount={cameras.length}
            />
            {cameras.length > 0 && (
              <>
                <CameraDataTable
                  cameras={cameras}
                  onUpdateCamera={handleUpdateCamera}
                  onDeleteCamera={handleDeleteCamera}
                />
                <button
                  onClick={handleReset}
                  className="btn-secondary btn-large"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        )}

        {inputMethod === 'manual' && cameras.length >= totalCameras && (
          <div className="space-y-6">
            <button
              onClick={() => setInputMethod('setup')}
              className="btn-secondary"
              style={{ marginBottom: '16px' }}
            >
              ← Back
            </button>
            <div className="alert alert-success">
              <p style={{ fontWeight: 600 }}>✓ All {totalCameras} cameras entered!</p>
            </div>
            <CameraDataTable
              cameras={cameras}
              onUpdateCamera={handleUpdateCamera}
              onDeleteCamera={handleDeleteCamera}
            />
            <div className="flex gap-4">
              <button
                onClick={handleCalculate}
                className="flex-1 btn-success btn-large"
              >
                Calculate Density
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary btn-large"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <ResultsDisplay results={results} />
            <button
              onClick={handleReset}
              className="btn-primary btn-block"
            >
              Start Over
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
