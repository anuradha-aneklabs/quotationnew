import React from 'react';
import timelineIcon from '../../../../assets/Preview/timeline icon.svg';
import logo from '../../../../assets/peoplexlogo.svg';
import editIcon from '../../../../assets/Preview/EditIcon.svg';
import downloadIcon from '../../../../assets/Preview/DownloadIcon.svg';
import scopeIcon from '../../../../assets/Preview/Scope.svg';
import outstandingIcon from '../../../../assets/Preview/TotalOutstanding.svg';
import gstIcon from '../../../../assets/Preview/GST.svg';
import discountIcon from '../../../../assets/Preview/Discount.svg';

function numToWords(num) {
  // simplified for mockup
  return "Indian Rupees " + num.toLocaleString() + " Only";
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['bg-[#1A9F9A]', 'bg-[#1E6BDE]'];

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

export default function PreviewStep({ formData, onSave, onEdit }) {
  // Calculations
  const baseCost = formData.modules.reduce((sum, m) => {
    return sum + m.functionalities.reduce((fs, f) => {
      return fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0);
    }, 0);
  }, 0);

  const totalEffort = formData.modules.reduce((sum, m) => {
    return sum + m.functionalities.reduce((fs, f) => fs + (Number(f.effort) || 0), 0);
  }, 0);

  const uniqueTeamMembers = new Set();
  formData.modules.forEach(m => {
    m.functionalities.forEach(f => {
      f.teamAllocations.forEach(tm => {
        if (tm.memberId) uniqueTeamMembers.add(tm.memberId);
      });
    });
  });

  const discountValue = Number(formData.discountValue) || 0;
  const discountType = formData.discountType || 'Percentage (%)';
  const isPercentage = discountType.toLowerCase().includes('percent');
  const discountAmount = isPercentage ? (baseCost * (discountValue / 100)) : discountValue;
  const discountedBase = Math.max(0, baseCost - discountAmount);
  const gstAmount = discountedBase * 0.18;
  const finalAmount = discountedBase + gstAmount;

  const avgRate = totalEffort > 0 ? (baseCost / totalEffort) : 0;
  const totalDuration = formData.projectStartDate && formData.projectEndDate
    ? Math.ceil(Math.abs(new Date(formData.projectEndDate) - new Date(formData.projectStartDate)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  const projectStart = formData.projectStartDate ? new Date(formData.projectStartDate) : null;
  const projectEnd = formData.projectEndDate ? new Date(formData.projectEndDate) : null;

  // Build DISPLAY range: always show EXACTLY 3 full months from project start month
  const displayStart = projectStart ? new Date(projectStart.getFullYear(), projectStart.getMonth(), 1) : null;
  
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
    return { mod, idx, start, end, durDays };
  });

  const displayEnd = displayStart ? new Date(displayStart.getFullYear(), displayStart.getMonth() + 3, 0) : null;

  const allDates = (displayStart && displayEnd) ? getDatesInRange(displayStart, displayEnd) : [];
  const monthGroups = groupByMonth(allDates);

  const getBarStyle = (start, end) => {
    if (!start || !end || !displayStart || allDates.length === 0) return null;
    const startIdx = Math.max(0, Math.round((start - displayStart) / (1000 * 60 * 60 * 24)));
    const endIdx = Math.min(allDates.length - 1, Math.round((end - displayStart) / (1000 * 60 * 60 * 24)));
    
    if (startIdx >= allDates.length) return null;
    
    const leftPct = (startIdx / allDates.length) * 100;
    const displayEndIdx = Math.min(endIdx, allDates.length - 1);
    const widthPct = Math.max(0, ((displayEndIdx - startIdx + 1) / allDates.length) * 100);
    
    if (widthPct <= 0) return null;
    
    return { left: `${leftPct}%`, width: `${widthPct}%` };
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIdx = displayStart ? Math.round((today - displayStart) / (1000 * 60 * 60 * 24)) : -1;
  const todayPct = allDates.length > 0 && todayIdx >= 0 && todayIdx < allDates.length
    ? (todayIdx / allDates.length) * 100 : -1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10 font-Inter">

      {/* Header Actions */}
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
          <div>
            <h2 className="text-lg font-bold text-[#040715]">6. Preview</h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onEdit} className="flex items-center px-4 py-1.5 border border-[#E9ECEF] text-[11px] font-bold rounded-[8px] text-[#46505F] hover:bg-gray-100 transition-colors bg-[#FAFAFA] shadow-sm h-8">
              <img src={editIcon} alt="Edit" className="h-3.5 w-3.5 mr-2" />
              Edit Quotation
            </button>
            <button className="flex items-center px-4 py-1.5 border border-[#1A9F9A] text-[11px] font-bold rounded-[8px] text-[#1A9F9A] hover:bg-teal-50 transition-colors bg-white shadow-sm h-8">
              <img src={downloadIcon} alt="Download" className="h-3.5 w-3.5 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
        <hr className="border-t border-[#E9ECEF]" />
      </div>

      {/* A4 Document Wrapper */}
      <div className="bg-white border border-gray-200 shadow-sm mx-auto overflow-hidden text-gray-800 p-6 sm:p-10 w-full max-w-[1300px] rounded-[10px]">

        {/* Document Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Aneka QuotePro" className="h-14 object-contain" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
              <div className="flex flex-col sm:items-end text-[10px] space-y-1 text-left sm:text-right mt-1 sm:mt-0">
                <p><span className="font-medium text-[#46505F]">Date :</span> <span className="font-medium text-[#040715]">{formData.proposalDate || '10 Jun 2026'}</span></p>
                <p><span className="font-medium text-[#46505F]">Valid Till :</span> <span className="font-medium text-[#040715]">{formData.validTill || '15 Jun 2026'}</span></p>
              </div>
              <div className="text-left sm:text-right">
                <h2 className="text-[22px] font-semibold text-[#1A9F9A] uppercase mb-1 leading-none tracking-tight">QUOTATION</h2>
                <p className="text-[13px] font-semibold text-[#040715]">{formData.quotationNumber || 'QTN-202608-0006'}</p>
              </div>
            </div>
          </div>
          <hr className="border-t border-[#E9ECEF]" />
        </div>

        {/* Address Blocks */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 mb-6 text-[11px]">
          <div className="w-full sm:w-1/2 sm:pr-4">
            <p className="text-[10px] font-semibold text-[#46505F] uppercase mb-1">FROM,</p>
            <p className="font-bold text-[#040715] mb-1 text-[12px]">
              {formData.companyDetails?.companyName || 'American Chase - Headquarters'}
              {formData.companyDetails?.branchName && ` - ${formData.companyDetails.branchName}`}
            </p>
            <p className="text-[#46505F] mb-2 leading-relaxed">
              {formData.companyDetails?.branchAddress1 || '123 Tech Lane,'}<br />
              {formData.companyDetails?.branchCity || 'Mumbai'} - {formData.companyDetails?.branchPincode || '400001'}, {formData.companyDetails?.branchState || 'Maharashtra'}, {formData.companyDetails?.branchCountry || 'India'}
            </p>
            <p className="text-[#040715] font-semibold mb-1">
              PAN: <span className="text-[#46505F] font-medium">{formData.companyDetails?.pan || 'ABCDE1234F'}</span> | GSTIN: <span className="text-[#46505F] font-medium">{formData.companyDetails?.gstin || '27ABCDE1234F1Z5'}</span>
            </p>
            <p className="text-[#040715] font-semibold break-all">
              Email: <span className="text-[#46505F] font-medium">{formData.companyDetails?.email || formData.companyDetails?.branchEmail || 'contact@techcorp.com'}</span> <span className="hidden sm:inline font-medium text-[#E9ECEF] mx-1">|</span><br className="sm:hidden" /> Website: <span className="text-[#46505F] font-medium">{formData.companyDetails?.website || 'https://techcorp.com'}</span>
            </p>
          </div>
          <div className="w-full sm:w-[40%] sm:pl-28">
            <p className="text-[10px] font-semibold text-[#46505F] uppercase mb-1">TO,</p>
            <p className="font-bold text-[#040715] mb-1 text-[12px]">{formData.clientName || 'TechCorp Solutions'}</p>
            <p className="text-[#46505F] mb-2 leading-relaxed">{formData.billingAddress || '52 Royal Plaza,\nIndore -400001, Madhya Pradesh, India'}</p>
            <p className="text-[#040715] font-semibold mb-1 break-all">
              PAN: <span className="text-[#46505F] font-medium">{formData.panNumber || 'ABCDE1234F'}</span> | GSTIN: <span className="text-[#46505F] font-medium">{formData.gstNumber || '27ABCDE1234F1Z5'}</span>
            </p>
            <p className="text-[#040715] font-semibold break-all">
              Email: <span className="text-[#46505F] font-medium">{formData.email || 'rahul@techcorp.in'}</span> <span className="hidden sm:inline font-medium text-[#E9ECEF] mx-1">|</span><br className="sm:hidden" /> Phone: <span className="text-[#46505F] font-medium">{formData.phone || '9876543210'}</span>
            </p>
          </div>
        </div>

        {/* Subject & Scope */}
        <div className="bg-[#F0F7F7] rounded-lg p-4 mb-6 text-[11px]">
          <div className="flex mb-1.5">
            <span className="font-bold text-[#1A9F9A] w-20 shrink-0">Subject :</span>
            <span className="font-bold text-[#040715]">{formData.proposalTitle || 'Cloud Infrastructure Setup'}</span>
          </div>
          <div className="flex">
            <span className="font-bold text-[#1A9F9A] w-20 shrink-0">Scope :</span>
            <span className="text-[#46505F] font-medium">{formData.projectSummary || 'Cloud set up master'}</span>
          </div>
        </div>

        {/* 1. Scope of Work & Commercial Summary */}
        <div className="bg-white rounded-xl border border-[#E9ECEF] py-6 mb-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 px-6">
            <img src={scopeIcon} alt="Scope" className="h-5 w-5" />
            <h3 className="text-[14px] font-bold text-[#040715]">1. Scope of Work & Commercial Summary</h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-[11px] min-w-[800px]">
              <thead>
                <tr className="bg-[#ECF2F2] border-y border-[#E9ECEF] text-[#040715]">
                  <th className="py-3 pl-6 pr-3 font-semibold text-center w-[5%] text-[12px]">#</th>
                  <th className="py-3 pl-3 pr-24 font-semibold w-[28%] text-[12px]">Module/Feature</th>
                  <th className="py-3 pl-3 pr-24 font-semibold w-[42%] text-[12px]">Description</th>
                  <th className="py-3 px-3 font-semibold text-center w-[10%] text-[12px]">Total Effort</th>
                  <th className="py-3 pl-3 pr-6 font-semibold text-center w-[15%] text-[12px]">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {formData.modules.map((m, idx) => {
                  const effort = m.functionalities.reduce((s, f) => s + (Number(f.effort) || 0), 0);
                  return (
                  <React.Fragment key={idx}>
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-4 pl-6 pr-3 text-center font-medium text-[#040715] text-[11px] align-top">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-4 pl-3 pr-24 font-semibold text-[#040715] text-[11px] align-top">{m.name}</td>
                      <td className="py-4 pl-3 pr-24 text-[#46505F] text-[11px] align-top">{m.description}</td>
                      <td className="py-4 px-3 text-center font-semibold text-[#46505F] text-[11px] align-top">{effort} Hrs</td>
                      <td className="py-4 pl-3 pr-6 text-center text-[#1A9F9A] font-medium text-[11px] align-top">
                        {formData.projectStartDate ? new Date(formData.projectStartDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : '01 Jun 2026'} • {formData.projectEndDate ? new Date(formData.projectEndDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : '03 Jun 2026'}
                      </td>
                    </tr>
                    {idx < formData.modules.length - 1 && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="mx-6 border-b border-[#E9ECEF]"></div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="mx-6 border-b border-[#E9ECEF] mb-4"></div>
                  </td>
                </tr>
                <tr className="text-[#1A9F9A]">
                  <td colSpan={5} className="p-0 pb-4">
                    <div className="mx-6 bg-[#F6F9F9]  flex items-center py-3">
                       <div className="flex-1 text-right font-semibold text-[11px] pr-3">Total Effort</div>
                       <div className="w-32 text-center font-bold text-[11px]">{totalEffort} Hrs</div>
                       <div className="w-[168px]"></div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Commercial Summary Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-6 bg-white pb-2">

            <div className="flex flex-wrap items-center gap-12 lg:gap-18">
              {/* Base Cost */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#EBFCF2] rounded-[8px] shrink-0">
                  <img src={outstandingIcon} alt="Total Outstanding" className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[12px] text-[#5F6A80] font-medium leading-tight mb-0.5">Total Outstanding Amount (Excl. GST)</p>
                  <p className="text-[14px] font-semibold text-[#040715]">₹ {baseCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              {/* GST */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#EBF9FF] rounded-[8px] shrink-0">
                  <img src={gstIcon} alt="GST" className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[12px] text-[#5F6A80] font-medium leading-tight mb-0.5">GST 18%</p>
                  <p className="text-[14px] font-semibold text-[#040715]">₹ {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              {/* Discount */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#FFF1F1] rounded-[8px] shrink-0">
                  <img src={discountIcon} alt="Discount" className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[12px] text-[#5F6A80] font-medium leading-tight mb-0.5">Discount</p>
                  <p className="text-[14px] font-semibold text-[#E53935]">- ₹ {discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            {/* Final Amount */}
            <div className="flex flex-col justify-center items-center text-center gap-1 py-3 px-6 bg-[#F6FFFA] rounded-[8px] border border-[#CEECEB] w-full lg:w-max shadow-[0_2px_15px_rgba(26,159,154,0.15)] mt-2 lg:mt-0">
              <p className="text-[12px] text-[#1A9F9A] font-medium">Final Outstanding Amount</p>
              <p className="text-[16px] font-bold text-[#1A9F9A]">
                ₹ {finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

          </div>
        </div>

        {/* 2. Timeline Overview */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6EBEB]">
            <div className="flex items-center gap-2 ">
              <img src={timelineIcon} alt="Timeline" className="h-4 w-4" />
              <h3 className="text-[14px] font-bold text-[#040715]">2. Timeline Overview</h3>
            </div>
            <p className="text-[12px] text-[#46505F] font-medium">
              {formData.projectStartDate ? new Date(formData.projectStartDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : '01 Jun 2026'} • {formData.projectEndDate ? new Date(formData.projectEndDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : '01 Jul 2026'}
            </p>
          </div>

          <div className="border border-gray-100 rounded-[8px] overflow-x-auto">
            <div style={{ minWidth: '800px' }}>
              {/* Month Row */}
              <div className="flex border-b border-[#E9ECEF] bg-[#F6F9F9]">
                <div className="w-[200px] shrink-0 px-4 py-3 border-r border-[#E9ECEF] text-[12px] font-bold text-[#040715] flex items-center">
                  Milestone / Phase
                </div>
                <div className="flex flex-1">
                  {monthGroups.map((mg, mIdx) => (
                    <div
                      key={mIdx}
                      className="border-r border-[#E9ECEF] last:border-0 text-center text-[11px] font-bold text-[#040715] py-3"
                      style={{ width: `${(mg.dates.length / allDates.length) * 100}%` }}
                    >
                      {MONTH_NAMES[mg.month]} {mg.year}
                    </div>
                  ))}
                </div>
              </div>

              {/* Week/Day markers Row */}
              <div className="flex border-b border-[#E9ECEF] bg-[#F6F9F9]">
                <div className="w-[200px] shrink-0 border-r border-[#E9ECEF]" />
                <div className="flex flex-1 relative h-7">
                  {monthGroups.map((mg, mIdx) => {
                    const daysInMonth = mg.dates.length;
                    const weekAnchors = mg.dates.filter(d => d.getDay() === 1).map(d => d.getDate());
                    
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
                              <span className="text-[9px] text-gray-400 px-1">{String(anchor).padStart(2, '0')}</span>
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
                    No modules defined.
                  </div>
                ) : (
                  moduleTimelines.map(({ mod, idx, start, end, durDays }) => {
                    const barStyle = getBarStyle(start, end);
                    const color = COLORS[idx % COLORS.length];
                    return (
                      <div key={idx} className="flex group border-b border-[#E9ECEF] last:border-0" style={{ minHeight: 48 }}>
                        <div className="w-[200px] shrink-0 px-4 py-3 border-r border-[#E9ECEF] flex items-start gap-2 bg-white">
                          <div className="w-5 h-5 flex items-center justify-center border border-gray-200 rounded-[4px] shrink-0">
                            <span className="text-[10px] font-bold text-[#040715]">{String(idx + 1).padStart(2, '0')}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-[#040715] truncate" title={mod.name}>{mod.name || `Module ${idx + 1}`}</p>
                            <p className="text-[10px] text-gray-500">{durDays} Days</p>
                          </div>
                        </div>
                        <div className="flex-1 relative flex items-center bg-white">
                          {/* Grid vertical lines */}
                          <div className="absolute inset-0 flex pointer-events-none">
                            {monthGroups.map((mg, mIdx) => {
                              const daysInMonth = mg.dates.length;
                              return (
                                <div key={mIdx} className="relative border-r border-[#E9ECEF] last:border-0 h-full"
                                  style={{ width: `${(daysInMonth / allDates.length) * 100}%` }}>
                                  {mg.dates.filter(d => d.getDay() === 1).map(d => d.getDate()).map((anchor) => {
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
                              className={`group absolute h-4 ${color} rounded-full z-10 flex items-center px-1.5 shadow-sm ml-1`}
                              style={{ ...barStyle, minWidth: '20px' }}
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
        </div>

        {/* Important Notes */}
        <div className="bg-white border border-[#E9ECEF] rounded-[8px] p-5 text-[12px] text-[#040715] shadow-sm mb-6">
          <h3 className="text-[14px] font-bold text-[#1A9F9A] mb-3">Important Notes</h3>
          <ul className="list-disc pl-4 space-y-2">
            <li className=''>This quotation is valid till {formData.validTill || '2026-08-31'}.</li>
            <li>All payments to be made as per agreed payment terms mentioned in the proposal.</li>
            <li>Taxes will be charged as applicable at the time of invoicing.</li>
            <li>Any additional scope of work will be charged extra.</li>
          </ul>
        </div>

      </div>

      {/* Buttons are handled by the parent container */}
    </div>
  );
}
