import { CameraData, CalculationResults, DensityResult } from '../types/index';

export const calculateCameraDensity = (camera: CameraData, movementRate: number): number => {
  // Convert angles from degrees to radians
  const angleLeftRadians = camera.detectionAngleLeft * (Math.PI / 180);
  const angleRightRadians = camera.detectionAngleRight * (Math.PI / 180);
  
  const denominator = 
    camera.trapNights * 
    movementRate * 
    camera.detectionDistance * 
    (2 + angleRightRadians + angleLeftRadians);
  
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

  // Calculate standard deviation
  const standardDeviation = perCamera.length > 1
    ? Math.sqrt(
        perCamera.reduce((sum, result) => 
          sum + Math.pow(result.density - averageDensity, 2), 0
        ) / (perCamera.length - 1)
      )
    : 0;

  // Calculate total trap nights
  const totalTrapNights = cameras.reduce((sum, camera) => sum + camera.trapNights, 0);

  // Calculate average detection rate (deer per trap night for each camera, then average)
  const detectionRates = cameras.map(camera => 
    camera.trapNights > 0 ? camera.totalDeer / camera.trapNights : 0
  );
  const averageDetectionRate = detectionRates.length > 0
    ? detectionRates.reduce((sum, rate) => sum + rate, 0) / detectionRates.length
    : 0;

  // Calculate average angles
  const averageAngleLeft = cameras.length > 0
    ? cameras.reduce((sum, camera) => sum + camera.detectionAngleLeft, 0) / cameras.length
    : 0;
  
  const averageAngleRight = cameras.length > 0
    ? cameras.reduce((sum, camera) => sum + camera.detectionAngleRight, 0) / cameras.length
    : 0;

  return {
    perCamera,
    averageDensity,
    standardDeviation,
    totalTrapNights,
    averageDetectionRate,
    averageAngleLeft,
    averageAngleRight
  };
};
