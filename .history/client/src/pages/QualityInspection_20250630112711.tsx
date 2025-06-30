import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// If you have a Toaster or toast hook, import it:
// import { useToast } from '@/hooks/use-toast';

type Defect = {
  type: string;
  severity: string;
  location: string;
  box: { left: number; top: number; width: number; height: number };
  time: number;
};

const videoSrc = '/Aircraft Defect Analysis.mp4';
const videoDefects: Defect[] = [
  { type: 'Crack', severity: 'High', location: 'Fuselage', box: { left: 100, top: 60, width: 80, height: 40 }, time: 2 },
  { type: 'Dent', severity: 'Medium', location: 'Wing', box: { left: 200, top: 120, width: 60, height: 30 }, time: 5 },
  { type: 'Warping', severity: 'Low', location: 'Tail', box: { left: 150, top: 90, width: 50, height: 25 }, time: 8 },
  { type: 'Crack', severity: 'High', location: 'Fuselage', box: { left: 120, top: 80, width: 60, height: 30 }, time: 12 },
];

const initialMetrics = {
  accuracy: 0.93,
  precision: 0.89,
  recall: 0.91,
  f1: 0.90,
};

const inspectionResults = [
  { date: '2024-06-21', defects: 2 },
  { date: '2024-06-22', defects: 1 },
  { date: '2024-06-23', defects: 3 },
  { date: '2024-06-24', defects: 0 },
  { date: '2024-06-25', defects: 2 },
  { date: '2024-06-26', defects: 1 },
  { date: '2024-06-27', defects: 3 },
];

const defectTypes = Array.from(new Set(videoDefects.map(d => d.type)));
const severities = Array.from(new Set(videoDefects.map(d => d.severity)));

export default function QualityInspection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [isTraining, setIsTraining] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [inlineMessage, setInlineMessage] = useState<string | null>(null);

  // If you have a toast hook, use it:
  // const { toast } = useToast();

  // Filter defects for current time and filters
  const visibleDefects = videoDefects.filter(d =>
    Math.abs(d.time - currentTime) < 1 &&
    (selectedType === 'All' || d.type === selectedType) &&
    (selectedSeverity === 'All' || d.severity === selectedSeverity)
  );

  // All defects for summary table (filtered)
  const filteredDefects = videoDefects.filter(d =>
    (selectedType === 'All' || d.type === selectedType) &&
    (selectedSeverity === 'All' || d.severity === selectedSeverity)
  );

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTrain = () => {
    setIsTraining(true);
    setInlineMessage(null);
    setTimeout(() => {
      setIsTraining(false);
      // Slightly improve metrics
      setMetrics(m => ({
        accuracy: Math.min(1, +(m.accuracy + 0.01).toFixed(2)),
        precision: Math.min(1, +(m.precision + 0.01).toFixed(2)),
        recall: Math.min(1, +(m.recall + 0.01).toFixed(2)),
        f1: Math.min(1, +(m.f1 + 0.01).toFixed(2)),
      }));
      setInlineMessage('Model training complete! Metrics updated.');
      // Show toast if available, else fallback to alert
      // if (typeof toast === 'function') toast('Model training complete! Metrics updated.');
      else alert('Model training complete! Metrics updated.');
    }, 1500);
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setInlineMessage(null);
    setTimeout(() => {
      setIsEvaluating(false);
      setInlineMessage('Evaluation complete! See results below.');
      // if (typeof toast === 'function') toast('Evaluation complete! See results below.');
      else alert('Evaluation complete! See results below.');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Quality Inspection with Computer Vision</h1>
      <p className="text-gray-600 mb-6 text-lg">
        AI-driven vision systems inspect aircraft parts for defects during manufacturing. This dashboard simulates a YOLO-based model for defect detection and model training.
      </p>

      {inlineMessage && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-800 font-medium">
          {inlineMessage}
        </div>
      )}

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Video and overlays */}
        <div className="col-span-2">
          <div className="relative w-full h-80 border rounded-xl overflow-hidden bg-gray-100">
            <video
              ref={videoRef}
              src={videoSrc}
              width={640}
              height={320}
              controls
              onTimeUpdate={handleTimeUpdate}
              className="object-cover w-full h-full"
              style={{ filter: 'grayscale(0.2)' }}
            />
            {/* Defect overlays for current time */}
            {visibleDefects.map((defect, i) => (
              <div
                key={i}
                className="absolute border-2 border-red-500 rounded"
                style={{ left: defect.box.left, top: defect.box.top, width: defect.box.width, height: defect.box.height }}
              >
                <span className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded">{defect.type}</span>
              </div>
            ))}
          </div>
          {/* Timeline with defect markers */}
          <div className="relative w-full h-8 mt-2 flex items-center">
            <div className="w-full h-2 bg-gray-200 rounded-full relative">
              {videoDefects.map((d, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-2 w-2 rounded-full bg-red-500 cursor-pointer"
                  style={{ left: `${(d.time / 15) * 100}%` }}
                  title={`Defect: ${d.type} at ${d.time}s`}
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = d.time;
                  }}
                />
              ))}
            </div>
            <span className="ml-4 text-xs text-gray-500">Timeline</span>
          </div>
        </div>
        {/* Side panel: controls and metrics */}
        <div className="flex flex-col gap-6">
          {/* Model controls */}
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="font-semibold mb-2">Model Training Controls</div>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50"
              onClick={handleTrain}
              disabled={isTraining}
            >
              {isTraining ? 'Training...' : 'Train Model'}
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 disabled:opacity-50"
              onClick={handleEvaluate}
              disabled={isEvaluating}
            >
              {isEvaluating ? 'Evaluating...' : 'Evaluate Model'}
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-600 text-white font-semibold shadow hover:bg-gray-700"
              onClick={() => alert('Exported results!')}
            >
              Export Results
            </button>
          </div>
          {/* Metrics panel */}
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="font-semibold mb-2">Model Metrics</div>
            <div className="flex flex-col gap-1 text-sm">
              <div>Accuracy: <span className="font-bold text-blue-700">{(metrics.accuracy * 100).toFixed(1)}%</span></div>
              <div>Precision: <span className="font-bold text-blue-700">{(metrics.precision * 100).toFixed(1)}%</span></div>
              <div>Recall: <span className="font-bold text-blue-700">{(metrics.recall * 100).toFixed(1)}%</span></div>
              <div>F1 Score: <span className="font-bold text-blue-700">{(metrics.f1 * 100).toFixed(1)}%</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Defect summary and filters */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="font-semibold text-lg flex-1">Detected Defects</div>
          <div className="flex gap-2 items-center">
            <label className="text-sm">Type:</label>
            <select className="border rounded px-2 py-1 text-sm" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="All">All</option>
              {defectTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <label className="text-sm ml-2">Severity:</label>
            <select className="border rounded px-2 py-1 text-sm" value={selectedSeverity} onChange={e => setSelectedSeverity(e.target.value)}>
              <option value="All">All</option>
              {severities.map(sev => <option key={sev} value={sev}>{sev}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-semibold">Defect Type</th>
                <th className="px-3 py-2 text-left font-semibold">Severity</th>
                <th className="px-3 py-2 text-left font-semibold">Location</th>
                <th className="px-3 py-2 text-left font-semibold">Timestamp (s)</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefects.map((defect, idx) => (
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
                  <td className="px-3 py-2">{defect.time}</td>
                </tr>
              ))}
              {filteredDefects.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400 py-4">No defects detected.</td></tr>
              )}
            </tbody>
          </table>
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