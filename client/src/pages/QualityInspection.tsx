import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// If you have a Toaster or toast hook, import it:
// import { useToast } from '@/hooks/use-toast';

type Defect = {
  type: string;
  severity: string;
  location: string;
  box: { left: number; top: number; width: number; height: number };
  time: number;
};

// Video now served from public/media directory
const turbofanVideoSrc = "/media/turbofan.mp4.mp4";

const videoSrc = turbofanVideoSrc;
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

// YOLO Model Evaluation Data
const yoloEvaluationData = {
  training: {
    epochs: 100,
    batchSize: 16,
    learningRate: 0.001,
    loss: 0.0234,
    valLoss: 0.0312,
    trainingTime: '2h 34m',
    gpuUtilization: '87%',
    memoryUsage: '8.2GB'
  },
  evaluation: {
    mAP50: 0.894,
    mAP50_95: 0.723,
    precision: 0.891,
    recall: 0.912,
    f1Score: 0.901,
    inferenceTime: '23ms',
    fps: 43.5,
    totalDetections: 1247,
    falsePositives: 89,
    falseNegatives: 67,
    truePositives: 1091
  },
  classPerformance: [
    { name: 'Crack', precision: 0.92, recall: 0.89, f1: 0.90, count: 456 },
    { name: 'Dent', precision: 0.87, recall: 0.91, f1: 0.89, count: 234 },
    { name: 'Warping', precision: 0.85, recall: 0.88, f1: 0.86, count: 189 },
    { name: 'Corrosion', precision: 0.91, recall: 0.94, f1: 0.92, count: 368 }
  ],
  confusionMatrix: {
    truePositives: 1091,
    falsePositives: 89,
    falseNegatives: 67,
    trueNegatives: 12450
  }
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
  const [showMetricsPopup, setShowMetricsPopup] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [evaluationType, setEvaluationType] = useState<'training' | 'evaluation' | null>(null);

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
      setMetrics(m => ({
        accuracy: Math.min(1, +(m.accuracy + 0.01).toFixed(2)),
        precision: Math.min(1, +(m.precision + 0.01).toFixed(2)),
        recall: Math.min(1, +(m.recall + 0.01).toFixed(2)),
        f1: Math.min(1, +(m.f1 + 0.01).toFixed(2)),
      }));
      setInlineMessage('Model training complete! Metrics updated.');
      setEvaluationType('training');
      setShowMetricsPopup(true);
      setShowDetailedReport(true);
    }, 1500);
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setInlineMessage(null);
    setTimeout(() => {
      setIsEvaluating(false);
      setInlineMessage('Evaluation complete! See results below.');
      setEvaluationType('evaluation');
      setShowMetricsPopup(true);
      setShowDetailedReport(true);
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
              loop
              autoPlay
              muted
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

      {/* YOLO Model Evaluation Report */}
      {showDetailedReport && (
        <div className="bg-white border rounded-xl p-6 shadow-sm mt-8">
          <h2 className="font-semibold text-xl mb-6">YOLO Model Evaluation Report</h2>
          
          {/* Training Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Training Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Epochs:</span>
                  <span className="font-semibold">{yoloEvaluationData.training.epochs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Batch Size:</span>
                  <span className="font-semibold">{yoloEvaluationData.training.batchSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning Rate:</span>
                  <span className="font-semibold">{yoloEvaluationData.training.learningRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Time:</span>
                  <span className="font-semibold">{yoloEvaluationData.training.trainingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>GPU Utilization:</span>
                  <span className="font-semibold">{yoloEvaluationData.training.gpuUtilization}</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <span className="font-semibold">{yoloEvaluationData.training.memoryUsage}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Performance Metrics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>mAP@0.5:</span>
                  <span className="font-semibold text-green-600">{(yoloEvaluationData.evaluation.mAP50 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>mAP@0.5:0.95:</span>
                  <span className="font-semibold text-blue-600">{(yoloEvaluationData.evaluation.mAP50_95 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Precision:</span>
                  <span className="font-semibold text-purple-600">{(yoloEvaluationData.evaluation.precision * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Recall:</span>
                  <span className="font-semibold text-orange-600">{(yoloEvaluationData.evaluation.recall * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>F1 Score:</span>
                  <span className="font-semibold text-red-600">{(yoloEvaluationData.evaluation.f1Score * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Inference Time:</span>
                  <span className="font-semibold">{yoloEvaluationData.evaluation.inferenceTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>FPS:</span>
                  <span className="font-semibold">{yoloEvaluationData.evaluation.fps}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Class Performance Chart */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">Class Performance Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Precision by Class</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={yoloEvaluationData.classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="precision" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Detection Count by Class</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={yoloEvaluationData.classPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {yoloEvaluationData.classPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">Confusion Matrix</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-700">{yoloEvaluationData.confusionMatrix.truePositives}</div>
                  <div className="text-sm text-green-600">True Positives</div>
                </div>
                <div className="bg-red-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-700">{yoloEvaluationData.confusionMatrix.falsePositives}</div>
                  <div className="text-sm text-red-600">False Positives</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-700">{yoloEvaluationData.confusionMatrix.falseNegatives}</div>
                  <div className="text-sm text-orange-600">False Negatives</div>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-700">{yoloEvaluationData.confusionMatrix.trueNegatives}</div>
                  <div className="text-sm text-blue-600">True Negatives</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Detection Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{yoloEvaluationData.evaluation.totalDetections}</div>
                <div className="text-sm text-gray-600">Total Detections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{yoloEvaluationData.evaluation.truePositives}</div>
                <div className="text-sm text-gray-600">Correct Detections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{yoloEvaluationData.evaluation.falsePositives}</div>
                <div className="text-sm text-gray-600">False Alarms</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{yoloEvaluationData.evaluation.falseNegatives}</div>
                <div className="text-sm text-gray-600">Missed Defects</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Popup */}
      {showMetricsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {evaluationType === 'training' ? 'YOLO Training Results' : 'YOLO Evaluation Results'}
              </h2>
              <button
                onClick={() => setShowMetricsPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {(yoloEvaluationData.evaluation.mAP50 * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-600">mAP@0.5</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {(yoloEvaluationData.evaluation.f1Score * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-600">F1 Score</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Precision:</span>
                <span className="font-semibold">{(yoloEvaluationData.evaluation.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Recall:</span>
                <span className="font-semibold">{(yoloEvaluationData.evaluation.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Inference Time:</span>
                <span className="font-semibold">{yoloEvaluationData.evaluation.inferenceTime}</span>
              </div>
              <div className="flex justify-between">
                <span>FPS:</span>
                <span className="font-semibold">{yoloEvaluationData.evaluation.fps}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Detections:</span>
                <span className="font-semibold">{yoloEvaluationData.evaluation.totalDetections}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowMetricsPopup(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowMetricsPopup(false);
                  // Scroll to detailed report
                  document.querySelector('[data-detailed-report]')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                View Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 