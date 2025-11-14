import React from 'react';
import { CameraData } from '../types/index';

interface CameraDataTableProps {
  cameras: CameraData[];
  onUpdateCamera: (id: string, camera: Partial<CameraData>) => void;
  onDeleteCamera: (id: string) => void;
}

export const CameraDataTable: React.FC<CameraDataTableProps> = ({
  cameras,
  onUpdateCamera,
  onDeleteCamera,
}) => {
  if (cameras.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h2>Camera Data Review</h2>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Camera</th>
              <th>Trap Nights</th>
              <th>Total Deer</th>
              <th>Detection Distance</th>
              <th>Angle Left</th>
              <th>Angle Right</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((camera) => (
              <tr key={camera.id}>
                <td>{camera.id}</td>
                <td>
                  <input
                    type="number"
                    value={camera.trapNights}
                    onChange={(e) => onUpdateCamera(camera.id, { trapNights: parseFloat(e.target.value) })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={camera.totalDeer}
                    onChange={(e) => onUpdateCamera(camera.id, { totalDeer: parseFloat(e.target.value) })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={camera.detectionDistance}
                    onChange={(e) => onUpdateCamera(camera.id, { detectionDistance: parseFloat(e.target.value) })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={camera.detectionAngleLeft}
                    onChange={(e) => onUpdateCamera(camera.id, { detectionAngleLeft: parseFloat(e.target.value) })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={camera.detectionAngleRight}
                    onChange={(e) => onUpdateCamera(camera.id, { detectionAngleRight: parseFloat(e.target.value) })}
                  />
                </td>
                <td>
                  <button
                    onClick={() => onDeleteCamera(camera.id)}
                    className="table-action-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
