import React, { useState } from 'react';
import { CameraData } from '../types/index';
import { parseCSVFile, parseCSVString } from '../utils/fileParser';

interface BulkUploadFormProps {
  onLoadCameras: (cameras: CameraData[]) => void;
}

export const BulkUploadForm: React.FC<BulkUploadFormProps> = ({ onLoadCameras }) => {
  const [pasteData, setPasteData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      if (!file.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }

      const cameras = await parseCSVFile(file);

      if (cameras.length === 0) {
        throw new Error('No data found in file');
      }

      onLoadCameras(cameras);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handlePaste = async () => {
    if (!pasteData.trim()) {
      setError('Please paste data first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cameras = await parseCSVString(pasteData);
      if (cameras.length === 0) {
        throw new Error('No valid data found in paste');
      }
      onLoadCameras(cameras);
      setPasteData('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Bulk Data Entry</h2>

      <div className="space-y-6">
        <div>
          <h3>Option 1: Upload File</h3>
          <div className="upload-container">
            <label style={{ cursor: 'pointer' }}>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
              <div>
                <p>Click to upload CSV file</p>
                <p>Supported format: .csv</p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <h3>Option 2: Copy & Paste</h3>
          <textarea
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            placeholder="Paste CSV data here (with headers: trapNights, totalDeer, detectionDistance, detectionAngleLeft, detectionAngleRight)"
            style={{ width: '100%', height: '128px' }}
          />
          <button
            onClick={handlePaste}
            disabled={loading}
            className="btn-success"
            style={{ marginTop: '16px' }}
          >
            {loading ? 'Processing...' : 'Load from Clipboard'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
