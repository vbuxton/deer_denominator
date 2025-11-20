export interface CameraData {
  id: string;
  trapNights: number;
  totalDeer: number;
  detectionDistance: number;
  detectionAngleLeft: number;
  detectionAngleRight: number;
}

export interface DensityResult {
  cameraId: string;
  density: number;
}

export interface CalculationResults {
  perCamera: DensityResult[];
  averageDensity: number;
  standardDeviation: number;
  totalTrapNights: number;
  averageDetectionRate: number;
  averageAngleLeft: number;
  averageAngleRight: number;
}
