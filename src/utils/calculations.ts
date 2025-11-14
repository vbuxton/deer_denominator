import { CameraData, CalculationResults, DensityResult } from '../types/index';

export const calculateCameraDensity = (camera: CameraData, movementRate: number): number => {
  const denominator = 
    camera.trapNights * 
    movementRate * 
    camera.detectionDistance * 
    (2 + camera.detectionAngleRight + camera.detectionAngleLeft);
  
  if (denominator === 0) return 0;
  
  return camera.totalDeer / denominator;
};

export const calculateAllDensities = (cameras: CameraData[], movementRate: number): CalculationResults => {
  const perCamera: DensityResult[] = cameras.map(camera => ({
    cameraId: camera.id,
    density: calculateCameraDensity(camera, movementRate)
  }));

  const averageDensity = perCamera.length > 0
    ? perCamera.reduce((sum, result) => sum + result.density, 0) / perCamera.length
    : 0;

  return {
    perCamera,
    averageDensity
  };
};
