import React, { useState } from 'react';
import iconDate from '../../../../assets/Timeline/ProjectStartAndEndDate.svg';
import iconTotal from '../../../../assets/Timeline/TotalDays.svg';

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
  'bg-[#1A9F9A]', 'bg-[#1E6BDE]'
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
        <div className="flex border-b border-[#E9ECEF] bg-[#F8F9FA]">
          <div className="w-[180px] shrink-0 px-4 py-2 border-r border-[#E9ECEF] text-[11px] font-bold text-[#040715] flex items-center">
            Milestone / Phase
          </div>
          <div className="flex flex-1">
            {monthGroups.map((mg, mIdx) => (
              <div
                key={mIdx}
                className="border-r border-[#E9ECEF] last:border-0 text-center text-[10px] font-bold text-[#040715] py-2"
                style={{ width: `${(mg.dates.length / allDates.length) * 100}%` }}
              >
                {MONTH_NAMES[mg.month]} {mg.year}
              </div>
            ))}
          </div>
        </div>

        {/* Week/Day markers Row */}
        <div className="flex border-b border-[#E9ECEF] bg-[#F8F9FA]">
          <div className="w-[180px] shrink-0 border-r border-[#E9ECEF]" />
          <div className="flex flex-1 relative h-7">
            {monthGroups.map((mg, mIdx) => {
              const daysInMonth = mg.dates.length;
              const weekAnchors = [1, 8, 15, 22];
              
              return (
                <div
                  key={mIdx}
                  className="relative border-r border-[#E9ECEF] last:border-0 h-full"
                  style={{ width: `${(daysInMonth / allDates.length) * 100}%` }}
                >
                  {weekAnchors.map((anchor, aIdx) => {
                    const anchorDate = mg.dates.find(d => d.getDate() === anchor);
                    if (!anchorDate) return null;
                    const leftPct = ((anchor - 1) / daysInMonth) * 100;
                    return (
                      <div
                        key={aIdx}
                        className="absolute top-0 bottom-0 flex flex-col justify-center border-l border-[#E9ECEF]/50"
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
                <div key={mod.id} className="flex group hover:bg-gray-50/50 transition-colors" style={{ minHeight: 48 }}>
                  <div className="w-[180px] shrink-0 px-4 py-2 border-r border-[#E9ECEF] flex items-center gap-2">
                    <div className="w-5 h-5 rounded-[4px] border border-[#E9ECEF] bg-white text-[#5F6A80] flex items-center justify-center text-[10px] font-medium shrink-0 shadow-sm">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[11px] font-medium text-[#040715] line-clamp-1 leading-tight">{mod.name || `Module ${idx + 1}`}</p>
                      <p className="text-[9px] text-[#46505F] leading-tight">{durDays} Days</p>
                    </div>
                  </div>
                  <div className="flex-1 relative flex items-center border-b border-[#E9ECEF] group-last:border-0">
                    {/* Grid vertical lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {monthGroups.map((mg, mIdx) => {
                        const daysInMonth = mg.dates.length;
                        return (
                          <div key={mIdx} className="relative border-r border-[#E9ECEF] last:border-0 h-full"
                            style={{ width: `${(daysInMonth / allDates.length) * 100}%` }}>
                            {[1, 8, 15, 22].map((anchor) => {
                              const anchorDate = mg.dates.find(d => d.getDate() === anchor);
                              if (!anchorDate) return null;
                              const leftPct = ((anchor - 1) / daysInMonth) * 100;
                              return (
                                <div key={anchor} className="absolute top-0 bottom-0 border-l border-[#E9ECEF]/30" style={{ left: `${leftPct}%` }} />
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
                        className={`absolute h-4 ${color} rounded-full z-10 flex items-center px-1.5 shadow-sm`}
                        style={{ ...barStyle, minWidth: '20px' }}
                        title={`${mod.name}: ${start?.toLocaleDateString()} - ${end?.toLocaleDateString()}`}
                      >
                        <span className="text-white text-[8px] font-medium whitespace-nowrap overflow-hidden">
                          {durDays}D
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
          <tr className="border-b border-[#E9ECEF] bg-[#ECF2F2]">
            <th className="px-4 py-3 text-[12px] font-bold text-[#040715]">#</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#040715]">Module/Phase</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#040715]">Start Date</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#040715]">End Date</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#040715] text-center">Duration (Days)</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#040715] text-center">Effort (Hrs)</th>
            <th className="px-4 py-3 text-[12px] font-bold text-[#040715] text-right">Cost (INR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {formData.modules.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">No modules defined.</td></tr>
          ) : moduleTimelines.map(({ mod, idx, start, end, durDays, effort, cost }) => {
            const color = COLORS[idx % COLORS.length];
            return (
              <tr key={mod.id} className="border-b border-[#E9ECEF] last:border-0 hover:bg-gray-50/50 transition-colors bg-white">
                <td className="px-4 py-3">
                  <span className="text-[12px] font-semibold text-[#040715]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] font-semibold text-[#040715]">{mod.name || `Module ${idx + 1}`}</p>
                  {mod.description && <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{mod.description}</p>}
                </td>
                <td className="px-4 py-3 text-[12px] font-medium text-[#040715]">
                  {start ? start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-4 py-3 text-[12px] font-medium text-[#040715]">
                  {end ? end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-4 py-3 text-[12px] text-center font-medium text-[#040715]">{durDays} Days</td>
                <td className="px-4 py-3 text-[12px] text-center font-medium text-[#040715]">{effort} Hrs</td>
                <td className="px-4 py-3 text-[12px] text-right font-semibold text-[#040715]">
                  ₹ {cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
        {formData.modules.length > 0 && (
          <tfoot className="border-t border-[#E9ECEF]">
            <tr className="bg-[#F5F8F8]">
              <td colSpan={4} className="px-4 py-3 text-[14px] font-Inter font-semibold leading-[1.4] text-[#1A9F9A]">Grand Total</td>
              <td className="px-4 py-3 text-[14px] font-Inter font-semibold leading-[1.4] text-[#1A9F9A] text-center">{totalDays} Days</td>
              <td className="px-4 py-3 text-[14px] font-Inter font-semibold leading-[1.4] text-[#1A9F9A] text-center">
                {formData.modules.reduce((s, m) => s + m.functionalities.reduce((fs, f) => fs + (Number(f.effort) || 0), 0), 0)} Hrs
              </td>
              <td className="px-4 py-3 text-[14px] font-Inter font-semibold leading-[1.4] text-[#1A9F9A] text-right">
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
    <div className="font-Inter animate-in fade-in duration-300 flex flex-col flex-1 h-full min-h-0">
      <div className="pb-4">
        <h2 className="text-[18px] font-bold text-[#040715]">5. Timeline</h2>
      </div>
      <hr className="border-t border-[#E9ECEF]" />

      <div className="pt-5 space-y-5">

      {/* Top Dates Card + View Toggle */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Project Start Date Card */}
          <div className="flex items-center gap-2 border border-[#E9ECEF] rounded-md py-1.5 px-3 bg-white min-w-max">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-[#EFFAF8] rounded-md">
              <img src={iconDate} alt="Start Date" className="w-3.5 h-3.5 object-contain" />
            </div>
            <div>
              <p className="text-[10px] text-[#5F6A80] font-Inter font-medium mb-0.5">Project Start Date</p>
              <p className="text-[12px] font-Inter font-semibold text-[#0D1933]">
                {projectStart ? projectStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'}
              </p>
            </div>
          </div>
          
          {/* Project End Date Card */}
          <div className="flex items-center gap-2 border border-[#E9ECEF] rounded-md py-1.5 px-3 bg-white min-w-max">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-[#EFFAF8] rounded-md">
              <img src={iconDate} alt="End Date" className="w-3.5 h-3.5 object-contain" />
            </div>
            <div>
              <p className="text-[10px] text-[#5F6A80] font-Inter font-medium mb-0.5">Project End Date</p>
              <p className="text-[12px] font-Inter font-semibold text-[#0D1933]">
                {projectEnd ? projectEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'}
              </p>
            </div>
          </div>
          
          {/* Total Duration Card */}
          <div className="flex items-center gap-2 border border-[#E9ECEF] rounded-md py-1.5 px-3 bg-white min-w-max">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-[#EFFAF8] rounded-md">
              <img src={iconTotal} alt="Total Duration" className="w-3.5 h-3.5 object-contain" />
            </div>
            <div>
              <p className="text-[10px] text-[#5F6A80] font-Inter font-medium mb-0.5">Total Duration</p>
              <p className="text-[12px] font-Inter font-semibold text-[#0D1933]">{totalDays} Days</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-[#E9ECEF] rounded-[8px] p-1">
            <button
              onClick={() => setViewMode('Gantt View')}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors ${viewMode === 'Gantt View' ? 'bg-[#1A9F9A] text-white' : 'text-[#46505F] hover:bg-gray-50'}`}
            >
              Gantt View
            </button>
            <button
              onClick={() => setViewMode('Table View')}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors ${viewMode === 'Table View' ? 'bg-[#1A9F9A] text-white' : 'text-[#46505F] hover:bg-gray-50'}`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'Gantt View' ? renderGantt() : renderTable()}
      
      </div>
    </div>
  );
}
