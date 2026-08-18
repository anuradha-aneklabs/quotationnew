import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

// Helper: generate all dates between two dates (inclusive)
function getDatesInRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endD = new Date(end);
  endD.setHours(0, 0, 0, 0);
  while (cur <= endD) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// Helper: group dates by month
function groupByMonth(dates) {
  const months = [];
  let cur = null;
  dates.forEach(d => {
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!cur || cur.key !== key) {
      cur = { key, year: d.getFullYear(), month: d.getMonth(), dates: [] };
      months.push(cur);
    }
    cur.dates.push(d);
  });
  return months;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = [
  'bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-teal-500',
  'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500'
];

export default function TimelineStep({ formData }) {
  const [viewMode, setViewMode] = useState('Gantt View');

  const projectStart = formData.projectStartDate ? new Date(formData.projectStartDate) : null;
  const projectEnd = formData.projectEndDate ? new Date(formData.projectEndDate) : null;

  const totalDays = (projectStart && projectEnd)
    ? Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Build DISPLAY range: always show at least 4 full months from project start month
  const displayStart = projectStart ? new Date(projectStart.getFullYear(), projectStart.getMonth(), 1) : null;
  const displayEnd = (() => {
    if (!displayStart) return null;
    // End at project end or at least 4 months, whichever is greater
    const minEnd = new Date(displayStart);
    minEnd.setMonth(minEnd.getMonth() + 4);
    minEnd.setDate(0); // last day of that month
    if (projectEnd && projectEnd > minEnd) {
      // extend to end of project end month
      const extEnd = new Date(projectEnd.getFullYear(), projectEnd.getMonth() + 1, 0);
      return extEnd;
    }
    return minEnd;
  })();

  const allDates = (displayStart && displayEnd) ? getDatesInRange(displayStart, displayEnd) : [];
  const monthGroups = groupByMonth(allDates);

  // Calculate module start/end dates based on sequential scheduling
  let cursor = projectStart ? new Date(projectStart) : null;
  const moduleTimelines = formData.modules.map((mod, idx) => {
    const durDays = Number(mod.duration) || 0;
    const start = cursor ? new Date(cursor) : null;
    let end = null;
    if (start && durDays > 0) {
      end = new Date(start);
      const calendarDays = Math.max(1, Math.ceil(durDays));
      end.setDate(end.getDate() + calendarDays - 1);
      cursor = new Date(end);
      cursor.setDate(cursor.getDate() + 1);
    }
    const effort = mod.functionalities.reduce((s, f) => s + (Number(f.effort) || 0), 0);
    const cost = mod.functionalities.reduce((ms, f) =>
      ms + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0), 0);
    return { mod, idx, start, end, durDays, effort, cost };
  });

  // Gantt: calculate bar position based on displayStart (not projectStart)
  const getBarStyle = (start, end) => {
    if (!start || !end || !displayStart || allDates.length === 0) return null;
    const startIdx = Math.max(0, Math.round((start - displayStart) / (1000 * 60 * 60 * 24)));
    const endIdx = Math.min(allDates.length - 1, Math.round((end - displayStart) / (1000 * 60 * 60 * 24)));
    const leftPct = (startIdx / allDates.length) * 100;
    const widthPct = Math.max(1, ((endIdx - startIdx + 1) / allDates.length) * 100);
    return { left: `${leftPct}%`, width: `${widthPct}%` };
  };

  // Today marker - based on displayStart
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIdx = displayStart ? Math.round((today - displayStart) / (1000 * 60 * 60 * 24)) : -1;
  const todayPct = allDates.length > 0 && todayIdx >= 0 && todayIdx < allDates.length
    ? (todayIdx / allDates.length) * 100 : -1;

  const renderGantt = () => (
    <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-x-auto">
      <div className="min-w-[800px]">

        {/* Month Row */}
        <div className="flex border-b border-gray-200 bg-gray-50/70">
          <div className="w-[220px] shrink-0 p-3 border-r border-gray-200 text-xs font-bold text-gray-700 flex items-center">
            Milestone / Phase
          </div>
          <div className="flex flex-1">
            {monthGroups.map((mg, mIdx) => (
              <div
                key={mIdx}
                className="border-r border-gray-200 last:border-0 text-center text-[10px] font-bold text-gray-700 py-2"
                style={{ width: `${(mg.dates.length / allDates.length) * 100}%` }}
              >
                {MONTH_NAMES[mg.month]} {mg.year}
              </div>
            ))}
          </div>
        </div>

        {/* Week/Day markers Row */}
        <div className="flex border-b border-gray-200 bg-white">
          <div className="w-[220px] shrink-0 border-r border-gray-200" />
          <div className="flex flex-1 relative h-7">
            {monthGroups.map((mg, mIdx) => {
              const daysInMonth = mg.dates.length;
              const weekAnchors = [1, 8, 15, 22];
              
              return (
                <div
                  key={mIdx}
                  className="relative border-r border-gray-200 last:border-0 h-full"
                  style={{ width: `${(daysInMonth / allDates.length) * 100}%` }}
                >
                  {weekAnchors.map((anchor, aIdx) => {
                    const anchorDate = mg.dates.find(d => d.getDate() === anchor);
                    if (!anchorDate) return null;
                    const leftPct = ((anchor - 1) / daysInMonth) * 100;
                    return (
                      <div
                        key={aIdx}
                        className="absolute top-0 bottom-0 flex flex-col justify-center border-l border-gray-100"
                        style={{ left: `${leftPct}%` }}
                      >
                        <span className="text-[9px] text-gray-400 px-1">{anchor}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* Today label */}
            {todayPct >= 0 && todayPct <= 100 && (
              <div
                className="absolute top-0 z-10 flex flex-col items-center"
                style={{ left: `${todayPct}%`, transform: 'translateX(-50%)' }}
              >
                <div className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold leading-none">Today</div>
              </div>
            )}
          </div>
        </div>

        {/* Module Rows */}
        <div className="bg-white">
          {formData.modules.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No modules defined. Please add modules in Step 3 to view the timeline.
            </div>
          ) : (
            moduleTimelines.map(({ mod, idx, start, end, durDays }) => {
              const barStyle = getBarStyle(start, end);
              const color = COLORS[idx % COLORS.length];
              return (
                <div key={mod.id} className="flex border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors" style={{ minHeight: 52 }}>
                  <div className="w-[220px] shrink-0 p-3 border-r border-gray-200 flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full ${color} text-white flex items-center justify-center text-[11px] font-bold shrink-0`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{mod.name || `Module ${idx + 1}`}</p>
                      <p className="text-[10px] text-gray-400">{durDays} Days</p>
                    </div>
                  </div>
                  <div className="flex-1 relative flex items-center">
                    {/* Grid vertical lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {monthGroups.map((mg, mIdx) => {
                        const daysInMonth = mg.dates.length;
                        return (
                          <div key={mIdx} className="relative border-r border-gray-100 last:border-0 h-full"
                            style={{ width: `${(daysInMonth / allDates.length) * 100}%` }}>
                            {[1, 8, 15, 22].map((anchor) => {
                              const anchorDate = mg.dates.find(d => d.getDate() === anchor);
                              if (!anchorDate) return null;
                              const leftPct = ((anchor - 1) / daysInMonth) * 100;
                              return (
                                <div key={anchor} className="absolute top-0 bottom-0 border-l border-gray-100/50" style={{ left: `${leftPct}%` }} />
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                    {/* Today vertical line */}
                    {todayPct >= 0 && todayPct <= 100 && (
                      <div className="absolute top-0 bottom-0 w-px bg-red-400 border-l border-dashed border-red-400 z-10"
                        style={{ left: `${todayPct}%` }} />
                    )}
                    {/* Gantt Bar */}
                    {barStyle && (
                      <div
                        className={`absolute h-5 ${color} rounded-full shadow-sm z-10 flex items-center px-2`}
                        style={{ ...barStyle, minWidth: '24px' }}
                        title={`${mod.name}: ${start?.toLocaleDateString()} - ${end?.toLocaleDateString()}`}
                      >
                        <span className="text-white text-[9px] font-bold whitespace-nowrap overflow-hidden">
                          {durDays}d
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/70">
            <th className="px-4 py-3 text-xs font-bold text-gray-700">#</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-700">Module / Phase</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-700">Start Date</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-700">End Date</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-700 text-center">Duration (Days)</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-700 text-center">Effort (Hrs)</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-700 text-right">Cost (INR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {formData.modules.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">No modules defined.</td></tr>
          ) : moduleTimelines.map(({ mod, idx, start, end, durDays, effort, cost }) => {
            const color = COLORS[idx % COLORS.length];
            return (
              <tr key={mod.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className={`w-6 h-6 rounded-full ${color} text-white flex items-center justify-center text-[11px] font-bold`}>
                    {idx + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{mod.name || `Module ${idx + 1}`}</p>
                  {mod.description && <p className="text-xs text-gray-400 mt-0.5">{mod.description}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {start ? start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {end ? end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-center font-medium text-indigo-600">{durDays}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">{effort} Hrs</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
                  ₹ {cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
        {formData.modules.length > 0 && (
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-indigo-50/30">
              <td colSpan={4} className="px-4 py-3 text-xs font-bold text-indigo-600">Grand Total</td>
              <td className="px-4 py-3 text-xs font-bold text-indigo-600 text-center">{totalDays} Days</td>
              <td className="px-4 py-3 text-xs font-bold text-indigo-600 text-center">
                {formData.modules.reduce((s, m) => s + m.functionalities.reduce((fs, f) => fs + (Number(f.effort) || 0), 0), 0)} Hrs
              </td>
              <td className="px-4 py-3 text-xs font-bold text-emerald-600 text-right">
                ₹ {formData.modules.reduce((s, m) =>
                  s + m.functionalities.reduce((fs, f) =>
                    fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0), 0), 0
                ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">5. Timeline</h2>
          <p className="text-xs text-gray-500">Define the overall project timeline and key milestones.</p>
        </div>
      </div>

      {/* Top Dates Card + View Toggle */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-4 border border-gray-200 rounded-xl py-2 px-1 w-full md:w-max shadow-sm bg-white overflow-x-auto">
          <div className="flex items-center px-5 border-r border-gray-100 min-w-max">
            <Calendar className="h-4 w-4 text-indigo-400 mr-3" />
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Project Start Date</p>
              <p className="text-xs font-bold text-gray-900">
                {projectStart ? projectStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center px-5 border-r border-gray-100 min-w-max">
            <Calendar className="h-4 w-4 text-indigo-400 mr-3" />
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Project End Date</p>
              <p className="text-xs font-bold text-gray-900">
                {projectEnd ? projectEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center px-5 min-w-max">
            <Clock className="h-4 w-4 text-indigo-400 mr-3" />
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Total Duration</p>
              <p className="text-xs font-bold text-gray-900">{totalDays} Days</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-indigo-200 p-0.5 rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('Gantt View')}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-colors ${viewMode === 'Gantt View' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-500 hover:text-indigo-600 border border-transparent'}`}
            >
              Grant View
            </button>
            <button
              onClick={() => setViewMode('Table View')}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-colors ${viewMode === 'Table View' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-500 hover:text-indigo-600 border border-transparent'}`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'Gantt View' ? renderGantt() : renderTable()}
    </div>
  );
}
