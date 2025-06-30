import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const sampleImages = [
  {
    label: 'Sample Part 1',
    src: '/sample-part.jpg',
    defects: [
      { type: 'Crack', severity: 'High', location: 'Edge', box: { left: 60, top: 40, width: 60, height: 30 } },
      { type: 'Warping', severity: 'Medium', location: 'Center', box: { left: 120, top: 100, width: 50, height: 25 } },
    ],
  },
  {
    label: 'Sample Part 2',
    src: '/sample-part2.jpg',
    defects: [
      { type: 'Misalignment', severity: 'Low', location: 'Corner', box: { left: 180, top: 60, width: 40, height: 20 } },
    ],
  },
];

const randomDefectTypes = [
  { type: 'Crack', severity: 'High' },
  { type: 'Warping', severity: 'Medium' },
  { type: 'Misalignment', severity: 'Low' },
  { type: 'Scratch', severity: 'Low' },
  { type: 'Dent', severity: 'Medium' },
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDefects(imgWidth: number, imgHeight: number) {
  const count = getRandomInt(1, 3);
  return Array.from({ length: count }).map(() => {
    const { type, severity } = randomDefectTypes[getRandomInt(0, randomDefectTypes.length - 1)];
    return {
      type,
      severity,
      location: ['Edge', 'Center', 'Corner'][getRandomInt(0, 2)],
      box: {
        left: getRandomInt(20, imgWidth - 80),
        top: getRandomInt(20, imgHeight - 60),
        width: getRandomInt(30, 70),
        height: getRandomInt(20, 40),
      },
    };
  });
}

export default function QualityInspection() {
  const [selectedSample, setSelectedSample] = useState<number | null>(0);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [defects, setDefects] = useState<any[]>(sampleImages[0].defects);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionResults, setInspectionResults] = useState([
    { date: '2024-06-21', defects: 2 },
    { date: '2024-06-22', defects: 1 },
    { date: '2024-06-23', defects: 3 },
    { date: '2024-06-24', defects: 0 },
    { date: '2024-06-25', defects: 2 },
    { date: '2024-06-26', defects: 1 },
    { date: '2024-06-27', defects: 3 },
  ]);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleSampleChange = (idx: number) => {
    setSelectedSample(idx);
    setUploadedImg(null);
    setDefects(sampleImages[idx].defects);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImg(ev.target?.result as string);
        setSelectedSample(null);
        setDefects([]);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSimulate = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedSample !== null) {
        setDefects(sampleImages[selectedSample].defects);
      } else if (uploadedImg && imgRef.current) {
        // Simulate random defects for uploaded image
        setDefects(generateRandomDefects(imgRef.current.width, imgRef.current.height));
      }
      // Optionally update chart with a new result
      setInspectionResults(prev => [
        ...prev.slice(-6),
        { date: '2024-06-28', defects: selectedSample !== null ? sampleImages[selectedSample].defects.length : getRandomInt(1, 3) }
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const displayImg = uploadedImg || (selectedSample !== null ? sampleImages[selectedSample].src : null);
  const displayDefects = defects || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Quality Inspection with Computer Vision</h1>
      <p className="text-gray-600 mb-6 text-lg">
        AI-driven vision systems inspect parts for defects during manufacturing (e.g., cracks, warping, misalignment).<br/>
        Reduces reliance on manual inspection and speeds up production.
      </p>

      {/* Image Upload & Sample Selector */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex gap-2 items-center">
          <label className="font-medium">Sample:</label>
          {sampleImages.map((img, idx) => (
            <button
              key={img.src}
              className={`px-3 py-1 rounded border ${selectedSample === idx && !uploadedImg ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => handleSampleChange(idx)}
            >
              {img.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-medium">Upload:</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
        <button
          className="ml-auto px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSimulate}
          disabled={isLoading || !displayImg}
        >
          {isLoading ? 'Running...' : 'Run Inspection'}
        </button>
      </div>

      {/* Sample Inspection Image with Defect Overlay */}
      <div className="mb-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-80 h-56 border rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {displayImg ? (
            <img
              ref={imgRef}
              src={displayImg}
              alt="Part Inspection"
              className="object-cover w-full h-full"
              style={{ filter: 'grayscale(0.2)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image selected</div>
          )}
          {/* Defect overlays */}
          {displayDefects.map((defect, i) => (
            <div
              key={i}
              className="absolute border-2 border-red-500 rounded"
              style={{ left: defect.box.left, top: defect.box.top, width: defect.box.width, height: defect.box.height }}
            >
              <span className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded">{defect.type}</span>
            </div>
          ))}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg mb-2">Detected Defects</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-semibold">Defect Type</th>
                  <th className="px-3 py-2 text-left font-semibold">Severity</th>
                  <th className="px-3 py-2 text-left font-semibold">Location</th>
                </tr>
              </thead>
              <tbody>
                {displayDefects.map((defect, idx) => (
                  <tr key={idx}>
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
                  </tr>
                ))}
                {displayDefects.length === 0 && !isLoading && (
                  <tr><td colSpan={3} className="text-center text-gray-400 py-4">No defects detected yet.</td></tr>
                )}
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