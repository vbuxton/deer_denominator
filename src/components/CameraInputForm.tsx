import React, { useState } from 'react';
import { CameraData } from '../types/index';

interface CameraInputFormProps {
  onAddCamera: (camera: CameraData) => void;
  totalCameras: number;
  currentCount: number;
}

export const CameraInputForm: React.FC<CameraInputFormProps> = ({
  onAddCamera,
  totalCameras,
  currentCount,
}) => {
  const [formData, setFormData] = useState({
    trapNights: '',
    totalDeer: '',
    detectionDistance: '',
    detectionAngleLeft: '',
    detectionAngleRight: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = Object.keys(formData) as (keyof typeof formData)[];

    fields.forEach(field => {
      const value = parseFloat(formData[field]);
      if (isNaN(value) || formData[field].trim() === '') {
        newErrors[field] = 'Required field';
      } else if (value < 0) {
        newErrors[field] = 'Must be positive';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const camera: CameraData = {
      id: `camera-${currentCount + 1}`,
      trapNights: parseFloat(formData.trapNights),
      totalDeer: parseFloat(formData.totalDeer),
      detectionDistance: parseFloat(formData.detectionDistance),
      detectionAngleLeft: parseFloat(formData.detectionAngleLeft),
      detectionAngleRight: parseFloat(formData.detectionAngleRight),
    };

    onAddCamera(camera);
    setFormData({
      trapNights: '',
      totalDeer: '',
      detectionDistance: '',
      detectionAngleLeft: '',
      detectionAngleRight: '',
    });
    setErrors({});
  };

  const isComplete = currentCount >= totalCameras;

  return (
    <div className="card">
      <h2>Manual Camera Input</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Camera {currentCount + 1} of {totalCameras}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-2">
          <div className="form-group">
            <label>Trap Nights</label>
            <input
              type="number"
              name="trapNights"
              value={formData.trapNights}
              onChange={handleChange}
              placeholder="e.g., 30"
            />
            {errors.trapNights && <p className="error-message">{errors.trapNights}</p>}
          </div>

          <div className="form-group">
            <label>Total Deer Detections</label>
            <input
              type="number"
              name="totalDeer"
              value={formData.totalDeer}
              onChange={handleChange}
              placeholder="e.g., 45"
            />
            {errors.totalDeer && <p className="error-message">{errors.totalDeer}</p>}
          </div>

          <div className="form-group">
            <label>Detection Distance (meters)</label>
            <input
              type="number"
              name="detectionDistance"
              value={formData.detectionDistance}
              onChange={handleChange}
              placeholder="e.g., 15"
            />
            {errors.detectionDistance && <p className="error-message">{errors.detectionDistance}</p>}
          </div>

          <div className="form-group">
            <label>Detection Angle Left (degrees)</label>
            <input
              type="number"
              name="detectionAngleLeft"
              value={formData.detectionAngleLeft}
              onChange={handleChange}
              placeholder="e.g., 30"
            />
            {errors.detectionAngleLeft && <p className="error-message">{errors.detectionAngleLeft}</p>}
          </div>

          <div className="form-group">
            <label>Detection Angle Right (degrees)</label>
            <input
              type="number"
              name="detectionAngleRight"
              value={formData.detectionAngleRight}
              onChange={handleChange}
              placeholder="e.g., 30"
            />
            {errors.detectionAngleRight && <p className="error-message">{errors.detectionAngleRight}</p>}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isComplete} className="btn-primary">
            Add Camera
          </button>
        </div>
      </form>
    </div>
  );
};
