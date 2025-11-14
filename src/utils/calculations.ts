import { CameraData, CalculationResults, DensityResult } from '../types/index';

const DEER_MOVEMENT_RATE = 0.5; // Default movement rate, can be made configurable

export const calculateCameraDensity = (camera: CameraData): number => {
  const denominator = 
    camera.trapNights * 
    DEER_MOVEMENT_RATE * 
    camera.detectionDistance * 
    (2 + camera.detectionAngleRight + camera.detectionAngleLeft);
  
  if (denominator === 0) return 0;
  
  return camera.totalDeer / denominator;
};

export const calculateAllDensities = (cameras: CameraData[]): CalculationResults => {
  const perCamera: DensityResult[] = cameras.map(camera => ({
    cameraId: camera.id,
    density: calculateCameraDensity(camera)
  }));

  const averageDensity = perCamera.length > 0
    ? perCamera.reduce((sum, result) => sum + result.density, 0) / perCamera.length
    : 0;

  return {
    perCamera,
    averageDensity
  };
};
