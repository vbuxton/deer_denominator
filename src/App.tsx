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
          <h1>Wildlife Density Estimator</h1>
        </div>
      </header>

      {/* Description and Logos Section */}
      <div className="info-section">
        <div className="info-content">
          <img src="/deer_denominator/cooperative-logo.png" alt="Cooperative Unit Logo" className="info-logo info-logo-left" />
          <p className="project-description">
            This tool allows users to enter data from motion-triggered game cameras to calculate wildlife density using the Random Encounter Model, a methodology first developed by Rowcliffe et al. (2008). It was developed for white-tailed deer but should be applicable to most wildlife species that are reliably detected on camera. Users must provide several parameters. First, the number of cameras and the total number of trap nights from each camera. Then the total number of the focal species detected on each camera. For each camera, users must also know the detection distance (in km) and the detection angles on either side of the camera (degrees). Finally, users must provide the best estimate for distance moved per day for the study species in the region (this is best derived from radiotelemetry data or literature). Data can be input manually or a csv can be uploaded. Refer to the literature referenced in the footer for more details on how to measure these parameters and what the study design assumptions are. Density will be provided as an average of each camera output with standard deviation and should be interpreted as the estimated number of individuals per km.
          </p>
          <img src="/deer_denominator/msu-logo.png" alt="MSU Logo" className="info-logo info-logo-right" />
        </div>
      </div>

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
                    <p>Upload CSV or paste data</p>
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
            <div className="card">
              <h3>🦌 Deer Movement Rate *</h3>
              <p>Average daily distance traveled (km/day):</p>
              <div className="input-group">
                <input
                  type="number"
                  min="0.01"
                  step="0.1"
                  value={movementRate ?? ''}
                  onChange={(e) => setMovementRate(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Required - e.g., 0.8"
                  required
                />
              </div>
            </div>
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
            <div className="card">
              <h3>🦌 Deer Movement Rate *</h3>
              <p>Average daily distance traveled (km/day):</p>
              <div className="input-group">
                <input
                  type="number"
                  min="0.01"
                  step="0.1"
                  value={movementRate ?? ''}
                  onChange={(e) => setMovementRate(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Required - e.g., 0.8"
                  required
                />
              </div>
            </div>
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
            <div className="card">
              <h3>🦌 Deer Movement Rate *</h3>
              <p>Average daily distance traveled (km/day):</p>
              <div className="input-group">
                <input
                  type="number"
                  min="0.01"
                  step="0.1"
                  value={movementRate ?? ''}
                  onChange={(e) => setMovementRate(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Required - e.g., 0.8"
                  required
                />
              </div>
            </div>
            <CameraDataTable
              cameras={cameras}
              onUpdateCamera={handleUpdateCamera}
              onDeleteCamera={handleDeleteCamera}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setTotalCameras(totalCameras + 1)}
                className="btn-secondary btn-large"
              >
                Add More Cameras
              </button>
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

      {/* Footer */}
      <footer className="app-footer-bar">
        <div className="footer-bar-content">
          <span className="footer-contact">For questions, contact Brett DeGregorio at degreg12@msu.edu</span>
          <span className="footer-credit">Application design by Valerie Buxton</span>
        </div>
      </footer>
    </div>
  );
};
