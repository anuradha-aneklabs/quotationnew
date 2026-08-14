import React, { useState } from 'react';
import { Calendar, Download } from 'lucide-react';

export default function TimelineStep({ formData }) {
  const [viewMode, setViewMode] = useState('Gantt View');

  const calculateTotalDuration = () => {
    if (!formData.projectStartDate || !formData.projectEndDate) return 0;
    const start = new Date(formData.projectStartDate);
    const end = new Date(formData.projectEndDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const projectDurationDays = calculateTotalDuration();

  const renderGanttTimeline = () => {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <div className="min-w-[1000px]">
          {/* Timeline Header (Months & Weeks) */}
          <div className="grid grid-cols-[350px_1fr] border-b border-gray-200 bg-gray-50/50">
            <div className="p-4 text-xs font-bold text-gray-700 border-r border-gray-200 flex items-center">
              Milestone / Phase
            </div>
            <div className="flex flex-col text-[10px] font-bold text-gray-700 text-center">
              <div className="flex w-full border-b border-gray-200 bg-white">
                <div className="flex-1 py-2 border-r border-gray-100">Aug 2026</div>
                <div className="flex-1 py-2 border-r border-gray-100">Sep 2026</div>
                <div className="flex-1 py-2 border-r border-gray-100">Oct 2026</div>
                <div className="flex-1 py-2 border-r border-gray-100">Nov 2026</div>
                <div className="flex-1 py-2 border-r border-gray-100">Dec 2026</div>
                <div className="flex-1 py-2">
                  Jan<br />2027
                </div>
              </div>
              <div className="flex w-full bg-white text-gray-500">
                {Array(6).fill(0).map((_, mIdx) => (
                  <div key={mIdx} className="flex-1 flex border-r border-gray-100 last:border-0 relative">
                    <div className="flex-1 py-1 border-r border-gray-100 text-[9px]">01</div>
                    <div className="flex-1 py-1 border-r border-gray-100 text-[9px]">08</div>
                    <div className="flex-1 py-1 border-r border-gray-100 text-[9px]">15</div>
                    <div className="flex-1 py-1 text-[9px] relative">
                      22
                      {/* Today marker (mocked in month 1, week 4) */}
                      {mIdx === 0 && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-20">
                          <div className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded leading-none font-bold">Today</div>
                          <div className="absolute top-full left-1/2 w-px h-64 bg-red-400 border-l border-dashed border-red-500 -translate-x-1/2"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modules Rows */}
          <div className="bg-white">
            {formData.modules.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No modules defined. Please add modules in Step 3 to view the timeline.
              </div>
            ) : (
              formData.modules.map((module, idx) => {
                const duration = Number(module.duration) || 0;
                // Fake visual calculation for mockup
                const widthPercent = Math.max(5, Math.min(100, (duration / (projectDurationDays || 30)) * 100));
                const marginPercent = Math.min(80, idx * 5);

                return (
                  <div key={module.id} className="grid grid-cols-[350px_1fr] border-b border-gray-100 last:border-0 relative hover:bg-gray-50/50 transition-colors group">
                    <div className="p-4 border-r border-gray-200 flex items-start gap-4">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{module.name || `Module ${idx + 1}`}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{module.description || 'No description'}</p>
                      </div>
                    </div>

                    <div className="relative flex items-center py-6 px-4">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex">
                        {Array(6).fill(0).map((_, mIdx) => (
                          <div key={mIdx} className="flex-1 flex border-r border-gray-100 last:border-0">
                            <div className="flex-1 border-r border-gray-100/50"></div>
                            <div className="flex-1 border-r border-gray-100/50"></div>
                            <div className="flex-1 border-r border-gray-100/50"></div>
                            <div className="flex-1"></div>
                          </div>
                        ))}
                      </div>

                      {/* Gantt Bar */}
                      <div className="relative z-10 flex items-center" style={{ marginLeft: `${marginPercent}%`, width: '100%' }}>
                        <div
                          className="h-3 bg-indigo-500 rounded-full shadow-sm"
                          style={{ width: `${widthPercent}%` }}
                        ></div>
                        <span className="ml-3 text-[10px] font-bold text-gray-700 whitespace-nowrap">{duration} Days</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">5. Timeline</h2>
          <p className="text-xs text-gray-500">Define the overall project timeline and key milestones.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-indigo-200 p-0.5 rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('Gantt View')}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-colors ${viewMode === 'Gantt View' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-500 hover:text-indigo-600 border border-transparent'}`}
            >
              Gantt View
            </button>
            <button
              onClick={() => setViewMode('Table View')}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-colors ${viewMode === 'Table View' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-500 hover:text-indigo-600 border border-transparent'}`}
            >
              Table View
            </button>
          </div>
          <button className="flex items-center px-4 py-1.5 border border-gray-200 text-[11px] font-bold rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm ml-2">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </button>
        </div>
      </div>

      {/* Top Dates Card */}
      <div className="flex flex-wrap items-center gap-4 border border-gray-200 rounded-xl py-2 px-1 w-max shadow-sm bg-white">
        <div className="flex items-center px-5 border-r border-gray-100">
          <Calendar className="h-4 w-4 text-indigo-400 mr-3" />
          <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Project Start Date</p>
            <p className="text-xs font-bold text-gray-900">{formData.projectStartDate || 'Not set'}</p>
          </div>
        </div>
        <div className="flex items-center px-5 border-r border-gray-100">
          <Calendar className="h-4 w-4 text-indigo-400 mr-3" />
          <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Project End Date</p>
            <p className="text-xs font-bold text-gray-900">{formData.projectEndDate || 'Not set'}</p>
          </div>
        </div>
        <div className="flex items-center px-5">
          <Clock className="h-4 w-4 text-indigo-400 mr-3" />
          <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Total Duration</p>
            <p className="text-xs font-bold text-gray-900">{projectDurationDays} Days</p>
          </div>
        </div>
      </div>

      {renderGanttTimeline()}
    </div>
  );
}

// Dummy clock icon component since it wasn't imported from lucide
function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
