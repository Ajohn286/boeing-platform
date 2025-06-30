import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const sampleDefects = [
  {
    id: 1,
    image: '/sample-part.jpg', // Replace with a real image path if available
    type: 'Crack',
    severity: 'High',
    location: 'Edge',
    timestamp: '2024-06-27 10:15',
  },
  {
    id: 2,
    image: '/sample-part.jpg',
    type: 'Warping',
    severity: 'Medium',
    location: 'Center',
    timestamp: '2024-06-27 10:12',
  },
  {
    id: 3,
    image: '/sample-part.jpg',
    type: 'Misalignment',
    severity: 'Low',
    location: 'Corner',
    timestamp: '2024-06-27 10:10',
  },
];

const inspectionResults = [
  { date: '2024-06-21', defects: 2 },
  { date: '2024-06-22', defects: 1 },
  { date: '2024-06-23', defects: 3 },
  { date: '2024-06-24', defects: 0 },
  { date: '2024-06-25', defects: 2 },
  { date: '2024-06-26', defects: 1 },
  { date: '2024-06-27', defects: 3 },
];

export default function QualityInspection() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Quality Inspection with Computer Vision</h1>
      <p className="text-gray-600 mb-6 text-lg">
        AI-driven vision systems inspect parts for defects during manufacturing (e.g., cracks, warping, misalignment).<br/>
        Reduces reliance on manual inspection and speeds up production.
      </p>

      {/* Sample Inspection Image with Defect Overlay */}
      <div className="mb-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-80 h-56 border rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src="/sample-part.jpg"
            alt="Sample Part Inspection"
            className="object-cover w-full h-full"
            style={{ filter: 'grayscale(0.2)' }}
          />
          {/* Example defect overlay (red box) */}
          <div
            className="absolute border-2 border-red-500 rounded"
            style={{ left: '60px', top: '40px', width: '60px', height: '30px' }}
          >
            <span className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded">Crack</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg mb-2">Detected Defects</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-semibold">Image</th>
                  <th className="px-3 py-2 text-left font-semibold">Defect Type</th>
                  <th className="px-3 py-2 text-left font-semibold">Severity</th>
                  <th className="px-3 py-2 text-left font-semibold">Location</th>
                  <th className="px-3 py-2 text-left font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sampleDefects.map(defect => (
                  <tr key={defect.id}>
                    <td className="px-3 py-2">
                      <img src={defect.image} alt={defect.type} className="w-12 h-8 object-cover rounded border" />
                    </td>
                    <td className="px-3 py-2">{defect.type}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-xs ${
                        defect.severity === 'High' ? 'bg-red-100 text-red-700' :
                        defect.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {defect.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2">{defect.location}</td>
                    <td className="px-3 py-2">{defect.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inspection Results Chart */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Inspection Results Over Time</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={inspectionResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="defects" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 