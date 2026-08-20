import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchEmployees } from '../../../../services/employeeService';
import calendarIcon from '../../../../assets/proposal detail/calendar.svg';
import totalModuleIcon from '../../../../assets/module management/total-module.svg';
import totalFuncIcon from '../../../../assets/module management/total-functionalities.svg';
import totalEffortIcon from '../../../../assets/module management/total-effort.svg';
import totalDurationIcon from '../../../../assets/module management/total-duration.svg';
import totalCostIcon from '../../../../assets/module management/total-cost.svg';
import deleteIcon from '../../../../assets/module management/delete.svg';
import grandCalendarIcon from '../../../../assets/module management/grand-calendar.svg';
import grandRupeeIcon from '../../../../assets/module management/grand-rupee.svg';
import grandTimeIcon from '../../../../assets/module management/grand-time.svg';
import arrowDownIcon from '../../../../assets/clientInformation/arrow-down.svg';

const AutoResizeTextarea = ({ value, onChange, placeholder, className, showTooltip }) => {
  const textareaRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = () => {
    if (textareaRef.current) {
      setIsOverflowing(textareaRef.current.scrollHeight > textareaRef.current.clientHeight + 4);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = (textareaRef.current.scrollHeight + 2) + 'px';
      checkOverflow();
    }
  }, [value]);

  return (
    <div className="relative group/tooltip w-full h-full">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={onChange}
        onMouseEnter={checkOverflow}
        placeholder={placeholder}
        className={`${className} resize-none overflow-hidden`}
      />
      {showTooltip && isOverflowing && value && (
        <div className="absolute z-[100] hidden group-hover/tooltip:block bg-gray-900 text-white text-[12px] p-3 rounded-lg shadow-xl w-[320px] left-0 top-full mt-1 whitespace-pre-wrap leading-relaxed pointer-events-none">
          {value}
        </div>
      )}
    </div>
  );
};

export default function ModuleManagementStep({ formData, setFormData, errors }) {
  const [employees, setEmployees] = useState([]);
  const [collapsedModules, setCollapsedModules] = useState({});

  const toggleCollapse = (moduleId) => {
    setCollapsedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  useEffect(() => {
    // Fetch real employees for the dropdown
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to load employees for dropdown", err);
      }
    };
    loadEmployees();
  }, []);

  const handleAddModule = () => {
    const newModule = {
      id: Date.now().toString(),
      name: '',
      description: '',
      duration: '',
      functionalities: []
    };
    setFormData(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };

  const handleAddFunctionality = (moduleId) => {
    const newFunc = {
      id: Date.now().toString(),
      name: '',
      description: '',
      effort: '',
      duration: '',
      teamAllocations: []
    };
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId ? { ...m, functionalities: [...m.functionalities, newFunc] } : m
      )
    }));
  };

  const handleAddTeamMember = (moduleId, funcId) => {
    const newMember = {
      id: Date.now().toString(),
      memberId: '',
      role: '',
      effort: '',
      rate: '',
      cost: 0
    };
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId ? {
          ...m,
          functionalities: m.functionalities.map(f =>
            f.id === funcId ? { ...f, teamAllocations: [...f.teamAllocations, newMember] } : f
          )
        } : m
      )
    }));
  };

  const updateModule = (moduleId, field, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId ? { ...m, [field]: value } : m
      )
    }));
  };

  const updateFunctionality = (moduleId, funcId, field, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === moduleId) {
          const newFunctionalities = m.functionalities.map(f => {
            if (f.id === funcId) {
              const updated = { ...f, [field]: value };
              if (field === 'effort') {
                const effortHours = Number(value) || 0;
                updated.duration = effortHours > 0 ? String(effortHours / 8) : '';
              }
              return updated;
            }
            return f;
          });

          const totalDuration = newFunctionalities.reduce((sum, f) => sum + (Number(f.duration) || 0), 0);

          return {
            ...m,
            functionalities: newFunctionalities,
            duration: totalDuration > 0 ? String(totalDuration) : ''
          };
        }
        return m;
      })
    }));
  };

  const updateTeamMember = (moduleId, funcId, memberId, field, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId ? {
          ...m,
          functionalities: m.functionalities.map(f =>
            f.id === funcId ? {
              ...f,
              teamAllocations: f.teamAllocations.map(tm => {
                if (tm.id === memberId) {
                  let finalValue = value;
                  if (field === 'effort') {
                    const newEffort = Number(value) || 0;

                    // Calculate total module effort
                    const moduleEffort = m.functionalities.reduce((sum, funcObj) => sum + (Number(funcObj.effort) || 0), 0);

                    // Calculate other team members' effort across the entire module
                    const allOtherTeamEffort = m.functionalities.reduce((sum, funcObj) => {
                      return sum + funcObj.teamAllocations.reduce((s, t) => {
                        return s + (t.id === memberId ? 0 : (Number(t.effort) || 0));
                      }, 0);
                    }, 0);

                    if (newEffort + allOtherTeamEffort > moduleEffort) {
                      finalValue = String(Math.max(0, moduleEffort - allOtherTeamEffort));
                    }
                  }

                  const updated = { ...tm, [field]: finalValue };
                  // If employee selected, auto-fill rate and role
                  if (field === 'memberId') {
                    const emp = employees.find(e => String(e.id) === String(finalValue) || String(e.employee_code) === String(finalValue));
                    if (emp) {
                      updated.rate = String(emp.hourly_rate).replace('₹', '');
                      updated.role = emp.role || emp.designation || '';
                    }
                  }
                  // Calculate cost
                  const effortNum = Number(updated.effort) || 0;
                  const rateNum = Number(updated.rate) || 0;
                  updated.cost = effortNum * rateNum;
                  return updated;
                }
                return tm;
              })
            } : f
          )
        } : m
      )
    }));
  };

  const deleteModule = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    }));
  };

  const deleteFunctionality = (moduleId, funcId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === moduleId) {
          const newFunctionalities = m.functionalities.filter(f => f.id !== funcId);
          const totalDuration = newFunctionalities.reduce((sum, f) => sum + (Number(f.duration) || 0), 0);
          return {
            ...m,
            functionalities: newFunctionalities,
            duration: totalDuration > 0 ? String(totalDuration) : ''
          };
        }
        return m;
      })
    }));
  };

  const deleteTeamMember = (moduleId, funcId, memberId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId ? {
          ...m,
          functionalities: m.functionalities.map(f =>
            f.id === funcId ? {
              ...f,
              teamAllocations: f.teamAllocations.filter(tm => tm.id !== memberId)
            } : f
          )
        } : m
      )
    }));
  };

  // Calculations
  const calculateTotalDuration = () => {
    if (!formData.projectStartDate || !formData.projectEndDate) return 0;
    const start = new Date(formData.projectStartDate);
    const end = new Date(formData.projectEndDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const totals = formData.modules.reduce((acc, m) => {
    acc.modules++;
    acc.estimatedDays += Number(m.duration) || 0;
    m.functionalities.forEach(f => {
      acc.functionalities++;
      acc.effort += Number(f.effort) || 0;
      f.teamAllocations.forEach(tm => {
        acc.cost += Number(tm.cost) || 0;
      });
    });
    return acc;
  }, { modules: 0, functionalities: 0, effort: 0, cost: 0, estimatedDays: 0 });

  const projectDurationDays = calculateTotalDuration();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b-1 border-[#DEDEDE] pb-2">3. Module Management</h2>
      </div>

      {/* Top Section */}
      <div className="bg-white rounded-xl shadow-sm p-3">
        <p className="text-xs text-gray-500 mb-5">Define modules, functionalities and estimate effort. Add team members and allocate hours with rate.</p>

        <div className="flex flex-wrap items-end gap-6 justify-between">
          <div className="flex flex-wrap gap-6 w-full lg:w-auto">
            <div className="w-full sm:w-auto">
              <label className="block text-[14px] font-normal text-black mb-2">Project Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.projectStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectStartDate: e.target.value }))}
                  className={`w-full sm:w-48 pl-3 pr-10 py-2 border bg-[#FAFAFA] rounded-lg text-sm focus:outline-none focus:ring-2 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10 ${errors.projectStartDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <img src={calendarIcon} alt="calendar" className="w-5 h-5 opacity-70" />
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-[14px] font-normal text-black mb-2">Project End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.projectEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectEndDate: e.target.value }))}
                  className={`w-full sm:w-48 pl-3 pr-10 py-2 border bg-[#FAFAFA] rounded-lg text-sm focus:outline-none focus:ring-2 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10 ${errors.projectEndDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <img src={calendarIcon} alt="calendar" className="w-5 h-5 opacity-70" />
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-[14px] font-normal text-black mb-2">Total Duration</label>
              <div className="bg-[#FAFAFA] px-4 py-1.5 rounded-lg border border-gray-200 min-w-[100px] w-full sm:w-auto flex items-center h-[38px]">
                <span className="text-sm font-medium text-gray-900">{projectDurationDays} Days</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleAddModule}
            className="flex items-center justify-center text-xs font-medium text-[#1A9F9A] border border-[#1A9F9A] rounded-lg px-4 py-2 hover:bg-[#1A9F9A]/10 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Module
          </button>
        </div>

        {errors.modules && (
          <div className="p-2 mb-6 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center">
            {errors.modules}
          </div>
        )}
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 shadow-sm flex flex-col justify-center gap-1 h-[64px] relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[34px] h-[34px] bg-[#EEE2FF] rounded-lg flex items-center justify-center p-2">
            <img src={totalModuleIcon} alt="Modules" className="w-full h-full object-contain" />
          </div>
          <div className="ml-[46px]">
            <p className="text-[11px] text-gray-500 font-medium">Total Modules</p>
            <p className="text-[15px] font-bold text-gray-900 leading-tight">{totals.modules < 10 ? `0${totals.modules}` : totals.modules}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 shadow-sm flex flex-col justify-center gap-1 h-[64px] relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[34px] h-[34px] bg-[#E2FDFF] rounded-lg flex items-center justify-center p-2">
            <img src={totalFuncIcon} alt="Functionalities" className="w-full h-full object-contain" />
          </div>
          <div className="ml-[46px]">
            <p className="text-[11px] text-gray-500 font-medium">Total Functionalities</p>
            <p className="text-[15px] font-bold text-gray-900 leading-tight">{totals.functionalities}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 shadow-sm flex flex-col justify-center gap-1 h-[64px] relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[34px] h-[34px] bg-[#FAECFF] rounded-lg flex items-center justify-center p-2">
            <img src={totalEffortIcon} alt="Effort" className="w-full h-full object-contain" />
          </div>
          <div className="ml-[46px]">
            <p className="text-[11px] text-gray-500 font-medium">Total Effort (Hours)</p>
            <p className="text-[15px] font-bold text-gray-900 leading-tight">{totals.effort} Hrs</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 shadow-sm flex flex-col justify-center gap-1 h-[64px] relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[34px] h-[34px] bg-[#E2EEFF] rounded-lg flex items-center justify-center p-2">
            <img src={totalDurationIcon} alt="Duration" className="w-full h-full object-contain" />
          </div>
          <div className="ml-[46px]">
            <p className="text-[11px] text-gray-500 font-medium">Total Duration (Days)</p>
            <p className="text-[15px] font-bold text-gray-900 leading-tight">{projectDurationDays} Days</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 shadow-sm flex flex-col justify-center gap-1 h-[64px] relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[34px] h-[34px] bg-[#E2FFEF] rounded-lg flex items-center justify-center p-1.5">
            <img src={totalCostIcon} alt="Cost" className="w-full h-full object-contain" />
          </div>
          <div className="ml-[46px]">
            <p className="text-[11px] text-gray-500 font-medium">Total Cost (INR)</p>
            <p className="text-[15px] font-bold text-gray-900 leading-tight">₹ {totals.cost.toLocaleString()}</p>
          </div>
        </div>
      </div>


      {/* Modules List */}
      <div className="space-y-5">
        {formData.modules.map((module, mIdx) => {
          const moduleEffort = module.functionalities.reduce((sum, f) => sum + (Number(f.effort) || 0), 0);
          const functionalitiesDurationTotal = module.functionalities.reduce((sum, f) => sum + (Number(f.duration) || 0), 0);
          const moduleDuration = Number(module.duration) || 0;
          const moduleCost = module.functionalities.reduce((sum, f) => sum + f.teamAllocations.reduce((s, tm) => s + (Number(tm.cost) || 0), 0), 0);

          return (
            <div key={module.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">

              {/* Module Header */}
              <div className="p-4 relative after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[1px] after:bg-[#D0D0D0] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white">

                <div className="flex flex-col sm:flex-row items-start gap-4 w-full lg:flex-1">
                  <div className="bg-[#D6FAF8] text-[#1A9F9A] px-3 py-[.55rem] rounded-[5px] text-[14px] font-medium whitespace-nowrap mt-1">
                    Module {mIdx + 1 < 10 ? `0${mIdx + 1}` : mIdx + 1}
                  </div>
                  <div className='flex-1 flex flex-col items-start w-full'>
                    <AutoResizeTextarea
                      value={module.name}
                      onChange={(e) => updateModule(module.id, 'name', e.target.value)}
                      placeholder="Module Name (e.g. Login and registration)"
                      className={`w-full text-[14px] font-semibold text-[#040715] bg-transparent focus:outline-none border-b py-0 max-h-[60px] overflow-hidden ${errors[`module_${mIdx}_name`] ? 'border-red-500' : 'border-transparent hover:border-gray-200 focus:border-[#1A9F9A] transition-colors'}`}
                    />
                    <AutoResizeTextarea
                      value={module.description}
                      onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                      placeholder="Module Description"
                      className="w-full text-[11px] leading-[16px] text-gray-500 bg-transparent focus:outline-none border-b border-transparent hover:border-gray-200 focus:border-[#1A9F9A] transition-colors max-md:line-clamp-5 max-md:max-h-[85px] md:max-h-[60px] overflow-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto flex-shrink-0 mt-2 lg:mt-0">
                  <div className="text-center">
                    <p className="text-[12px] font-bold text-gray-900 mb-0.5">Duration</p>
                    <p className="text-[12px] font-bold text-[#1A9F9A]">{moduleDuration} Days</p>
                  </div>
                  <div className="w-[1px] h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-[12px] font-bold text-gray-900 mb-0.5">Efforts</p>
                    <p className="text-[12px] font-bold text-[#1A9F9A]">{moduleEffort} Hrs</p>
                  </div>
                  <div className="w-[1px] h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-[12px] font-bold text-gray-900 mb-0.5">Cost</p>
                    <p className="text-[12px] font-bold text-[#1A9F9A]">₹ {moduleCost.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button onClick={() => deleteModule(module.id)} className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded hover:bg-red-50  flex items-center justify-center">
                      <img src={deleteIcon} alt="delete" className="" />
                    </button>
                    <button
                      onClick={() => toggleCollapse(module.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-50 border border-gray-200 flex items-center justify-center"
                    >
                      {collapsedModules[module.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Functionalities & Team Allocation Split */}
              {!collapsedModules[module.id] && (
                <div className="flex flex-col xl:flex-row gap-6 p-4">

                  {/* Left: Functionalities */}
                  <div className="flex-[1.2] bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col min-w-0">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                      <h3 className="text-[15px] font-bold text-[#040715]">Functionalities</h3>
                      <button
                        onClick={() => handleAddFunctionality(module.id)}
                        className="text-[12px] text-[#1A9F9A] hover:text-[#13807c] font-bold flex items-center transition-colors"
                      >
                        + Add Functionality
                      </button>
                    </div>

                    <div className="overflow-x-auto pb-4">
                      <table className="w-full text-left text-[11px] mb-2">
                        <thead className='bg-[#ECF2F2]'>
                          <tr className="border-b border-gray-100 text-[#040715] text-[14px] bg-[#ECF2F2]">
                            <th className="py-3 font-semibold w-12 pl-3 align-top pt-4">#</th>
                            <th className="py-3 font-semibold min-w-[120px] align-top pt-4">Functionality</th>
                            <th className="py-3 font-semibold min-w-[150px] align-top pt-4">Description</th>
                            <th className="py-3 font-semibold w-16 align-top pt-4">Efforts<br />(Hrs)</th>
                            <th className="py-3 font-semibold w-16 align-top pt-4">Duration<br />(Days)</th>
                            <th className="py-3 font-semibold w-14 align-top pt-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {module.functionalities.map((func, fIdx) => (
                            <tr key={func.id} className="relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[1px] after:bg-gray-100 last:after:hidden group">
                              <td className="pb-3 pt-[16px] pl-2 text-[#040715] font-medium align-top">{fIdx + 1 < 10 ? `0${fIdx + 1}` : fIdx + 1}</td>
                              <td className="pt-[16px] pb-3 pr-4 align-top">
                                <AutoResizeTextarea
                                  value={func.name}
                                  onChange={(e) => updateFunctionality(module.id, func.id, 'name', e.target.value)}
                                  placeholder="Name"
                                  showTooltip={true}
                                  className={`w-full text-[#040715] font-semibold text-[14px] leading-[22px] bg-transparent focus:outline-none pb-1 line-clamp-3 max-h-[70px] overflow-hidden ${errors[`module_${mIdx}_func_${fIdx}_name`] ? 'border-b border-red-500' : 'border-b border-transparent group-hover:border-gray-200 focus:border-[#1A9F9A]'}`}
                                />
                              </td>
                              <td className="pt-[16px] pb-3 pr-2 align-top">
                                <AutoResizeTextarea
                                  value={func.description}
                                  onChange={(e) => updateFunctionality(module.id, func.id, 'description', e.target.value)}
                                  placeholder="Description"
                                  showTooltip={true}
                                  className="w-full text-[#46505F] text-[14px] font-meduim leading-[22px] bg-transparent focus:outline-none pb-1 border-b border-transparent group-hover:border-gray-200 focus:border-[#1A9F9A] line-clamp-3 max-h-[70px] overflow-hidden"
                                />
                              </td>
                              <td className="py-3 pr-4 align-top">
                                <input
                                  type="number"
                                  min="0" step="any"
                                  value={func.effort}
                                  onChange={(e) => updateFunctionality(module.id, func.id, 'effort', e.target.value)}
                                  className={`w-full text-left text-[12px] text-[#46505F] bg-transparent focus:outline-none border-b py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors[`module_${mIdx}_func_${fIdx}_effort`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-200 focus:border-[#1A9F9A]'}`}
                                />
                              </td>
                              <td className="py-3 pr-4 align-top">
                                <input
                                  type="number"
                                  min="0" step="any"
                                  value={func.duration}
                                  onChange={(e) => updateFunctionality(module.id, func.id, 'duration', e.target.value)}
                                  className={`w-full text-left text-[12px] text-[#46505F] bg-transparent focus:outline-none border-b py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors[`module_${mIdx}_func_${fIdx}_duration`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-200 focus:border-[#1A9F9A]'}`}
                                />
                              </td>
                              <td className="py-3 align-top pt-[18px]">
                                <button onClick={() => deleteFunctionality(module.id, func.id)} className="">
                                  <img src={deleteIcon} alt="delete" className="" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className=''>
                          <tr className="p-3">
                            <td colSpan={3} className="pt-4 pb-4 text-right font-bold text-[#1A9F9A] pr-12 bg-[#F5F8F8] shadow-[inset_12px_0_0_0_#ffffff]">Total</td>
                            <td className="pt-4 pb-4 text-left font-bold text-[#1A9F9A] bg-[#F5F8F8]">{moduleEffort}</td>
                            <td className="pt-4 pb-4 text-left font-bold text-[#1A9F9A] bg-[#F5F8F8]">{functionalitiesDurationTotal < 10 ? `0${functionalitiesDurationTotal}` : functionalitiesDurationTotal}</td>
                            <td className="bg-[#F5F8F8] shadow-[inset_-12px_0_0_0_#ffffff]"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {errors[`module_${mIdx}_func`] && <p className="text-xs text-red-500 mt-1 px-4 pb-2">{errors[`module_${mIdx}_func`]}</p>}
                  </div>

                  {/* Right: Team Effort Allocation */}
                  <div className="flex-[1.3] bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col min-w-0">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                      <h3 className="text-[15px] font-bold text-gray-900">Team Effort Allocation</h3>
                      <button
                        onClick={() => {
                          if (module.functionalities.length === 0) {
                            handleAddFunctionality(module.id);
                          }
                          setTimeout(() => {
                            const funcs = formData.modules.find(m => m.id === module.id)?.functionalities;
                            if (funcs && funcs.length > 0) {
                              handleAddTeamMember(module.id, funcs[funcs.length - 1].id);
                            }
                          }, 0);
                        }}
                        className="text-[12px] text-[#1A9F9A] hover:text-[#13807c] font-bold flex items-center transition-colors"
                      >
                        + Add Team Member
                      </button>
                    </div>

                    <div className="overflow-x-auto pb-4">
                      <table className="w-full text-left text-[11px] mb-2">
                        <thead>
                          <tr className="border-b border-gray-100 text-[#040715] text-[14px] bg-[#ECF2F2]">
                            <th className="py-3 font-semibold w-[250px] pl-6 align-top pt-4">Team Member</th>
                            <th className="py-3 font-semibold min-w-[80px] align-top pt-4">Role</th>
                            <th className="py-3 font-semibold text-center w-20 align-top pt-4">Efforts<br />(Hrs)</th>
                            <th className="py-3 font-semibold text-center w-18 align-top pt-4">Rate/Hr</th>
                            <th className="py-3 font-semibold text-center w-20 align-top pt-4">Total Cost</th>
                            <th className="py-3 font-semibold text-center w-12 pr-6 align-top pt-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {module.functionalities.map((func, fIdx) =>
                            func.teamAllocations.map((tm, tIdx) => (
                              <React.Fragment key={tm.id}>
                                <tr className="relative after:absolute after:bottom-0 after:left-6 after:right-6 after:h-[1px] after:bg-gray-100 last:after:hidden group hover:bg-gray-50">
                                  <td className="py-3 pr-2 pl-6">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employees.find(e => String(e.id) === String(tm.memberId))?.name || 'UN')}&background=random&color=fff`} alt="avatar" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="relative flex items-center">
                                        <select
                                          value={String(tm.memberId || '')}
                                          onChange={(e) => updateTeamMember(module.id, func.id, tm.id, 'memberId', e.target.value)}
                                          className="w-auto min-w-[150px] text-[14px] text-[#46505F] bg-transparent border-0 focus:ring-0 text-[11px] text-gray-900 font-medium p-0 pr-6 cursor-pointer focus:outline-none appearance-none relative z-10"
                                        >
                                          <option value="">Select...</option>
                                          {employees.map(emp => (
                                            <option key={emp.id} value={String(emp.id)}>{emp.name}</option>
                                          ))}
                                        </select>
                                        <div className="absolute right-2 pointer-events-none z-0">
                                          <img src={arrowDownIcon} alt="down" className="w-3 h-3 opacity-60" />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 pr-2 text-[14px] text-[#46505F] truncate">{tm.role || '-'}</td>
                                  <td className="py-3 px-1">
                                    <input
                                      type="number"
                                      min="0" step="any"
                                      value={tm.effort}
                                      onChange={(e) => updateTeamMember(module.id, func.id, tm.id, 'effort', e.target.value)}
                                      className={`w-full text-[12px] font-medium text-[#46505F] text-center bg-transparent focus:outline-none border-b py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors[`module_${mIdx}_func_${fIdx}_team`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-200 focus:border-[#1A9F9A]'}`}
                                      placeholder="0"
                                    />
                                  </td>
                                  <td className="py-3 text-center text-[12px] text-[#46505F]">₹ {tm.rate || '0'}</td>
                                  <td className="py-3 text-center font-medium text-[12px] text-[#46505F]">₹ {(Number(tm.cost) || 0).toLocaleString()}</td>
                                  <td className="py-3 text-center">
                                    <button onClick={() => deleteTeamMember(module.id, func.id, tm.id)} className=" hover:border-red-200">
                                      <img src={deleteIcon} alt="delete" className=" mx-auto" />
                                    </button>
                                  </td>
                                </tr>
                                {tIdx === func.teamAllocations.length - 1 && errors[`module_${mIdx}_func_${fIdx}_team`] && (
                                  <tr>
                                    <td colSpan={6} className="py-1">
                                      <div className="text-[12px] text-red-500 bg-red-50 p-1.5 rounded border border-red-100 flex items-center gap-1">
                                        <span className="font-bold">{func.name || `Functionality ${fIdx + 1}`}:</span> {errors[`module_${mIdx}_func_${fIdx}_team`]}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={2} className="pt-4 pb-4 text-center font-bold text-[#1A9F9A] bg-[#F5F8F8] shadow-[inset_12px_0_0_0_#ffffff]">Total</td>
                            <td className="pt-4 pb-4 text-center font-bold text-[#1A9F9A] bg-[#F5F8F8]">{moduleEffort} Hrs</td>
                            <td className="bg-[#F5F8F8]"></td>
                            <td className="pt-4 pb-4 text-center font-bold text-[#1A9F9A] bg-[#F5F8F8]">₹ {moduleCost.toLocaleString()}</td>
                            <td className="bg-[#F5F8F8] shadow-[inset_-12px_0_0_0_#ffffff]"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grand Total Footer */}
      {formData.modules.length > 0 && (
        <div className="mt-6 bg-[#F0FAF9] border border-[#E0F2F1] rounded-xl p-4 lg:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 lg:gap-6 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-6 w-full xl:w-auto">
            <div className="flex-shrink-0 min-w-[100px]">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Grand Total</h3>
              <p className="text-[12px] font-bold text-[#1A9F9A]">{totals.modules} Modules</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
              <div className=" p-2 flex items-center gap-3 min-w-[130px]">
                <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-100">
                  <img src={grandCalendarIcon} alt="calendar" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-[#5F6A80] font-medium leading-none mb-2">Project Start Date</p>
                  <p className="text-[12px] font-semibold text-[#040715] leading-none">{formData.projectStartDate ? new Date(formData.projectStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p>
                </div>
              </div>

              <div className=" p-2 flex items-center gap-3 min-w-[130px]">
                <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-100">
                  <img src={grandCalendarIcon} alt="calendar" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-[#5F6A80] font-medium leading-none mb-2">Project End Date</p>
                  <p className="text-[12px] font-semibold text-[#040715] leading-none">{formData.projectEndDate ? new Date(formData.projectEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p>
                </div>
              </div>

              <div className=" p-2 flex items-center gap-3 min-w-[130px]">
                <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-100">
                  <img src={grandCalendarIcon} alt="duration" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-[#5F6A80] font-medium leading-none mb-2">Total Days</p>
                  <p className="text-[12px] font-semibold text-[#040715] leading-none">{projectDurationDays} Days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-start xl:justify-end w-full xl:w-auto">
            <div className=" p-2 flex items-center gap-3 min-w-[130px]">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-100">
                <img src={grandTimeIcon} alt="effort" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#5F6A80] font-medium leading-none mb-2">Total Effort ( Hrs )</p>
                <p className="text-[12px] font-semibold text-[#040715] leading-none">{totals.effort} Hrs</p>
              </div>
            </div>

            <div className="p-2 flex items-center gap-3 min-w-[130px]">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-100">
                <img src={grandCalendarIcon} alt="duration" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#5F6A80] font-medium leading-none mb-2">Estimated Duration</p>
                <p className="text-[12px] font-semibold text-[#040715] leading-none">{totals.estimatedDays} Days</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-md p-2 shadow-sm flex items-center gap-3 min-w-[150px]">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                <img src={grandRupeeIcon} alt="cost" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[12px] text-[#5F6A80] font-medium leading-none mb-2">Total Cost (INR)</p>
                <p className="text-[15px] font-semibold text-[#040715] leading-none">₹ {totals.cost.toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}