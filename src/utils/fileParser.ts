import Papa from 'papaparse';
import { CameraData } from '../types/index';

export const parseCSVString = (csvText: string): Promise<CameraData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const cameras = results.data.map((row: any, index: number) => ({
            id: `camera-${index}`,
            trapNights: parseFloat(row.trapNights || row['Trap Nights'] || 0),
            totalDeer: parseFloat(row.totalDeer || row['Total Deer'] || 0),
            detectionDistance: parseFloat(row.detectionDistance || row['Detection Distance'] || 0),
            detectionAngleLeft: parseFloat(row.detectionAngleLeft || row['Detection Angle Left'] || 0),
            detectionAngleRight: parseFloat(row.detectionAngleRight || row['Detection Angle Right'] || 0),
          }));
          resolve(cameras);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
};

export const parseCSVFile = (file: File): Promise<CameraData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSVString(text).then(resolve).catch(reject);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
