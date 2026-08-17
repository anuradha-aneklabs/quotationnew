import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Layers, Activity, Clock, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchEmployees } from '../../../../services/employeeService'; // Reusing service for team members!

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
    <div className="space-y-4 animate-in fade-in duration-300 pb-10">

      {/* Top Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <p className="text-xs text-gray-500 mb-5">Define modules, functionalities and estimate effort. Add team members and allocate hours with rate.</p>
        
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Project Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={formData.projectStartDate}
                onChange={(e) => setFormData(prev => ({ ...prev, projectStartDate: e.target.value }))}
                className={`pl-8 pr-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-2 ${errors.projectStartDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'}`}
              />
              <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Project End Date</label>
            <div className="relative">
              <input
                type="date"
                value={formData.projectEndDate}
                onChange={(e) => setFormData(prev => ({ ...prev, projectEndDate: e.target.value }))}
                className={`pl-8 pr-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-2 ${errors.projectEndDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'}`}
              />
              <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Total Duration</label>
            <div className="bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200 min-w-[80px] text-center">
              <span className="text-xs font-bold text-gray-900">{projectDurationDays} Days</span>
            </div>
          </div>
          <div className="flex-1"></div>
          <button
            onClick={handleAddModule}
            className="flex items-center text-xs font-bold text-gray-700 hover:text-indigo-600 transition-colors mb-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Module
          </button>
        </div>
      </div>

      {errors.modules && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center">
          {errors.modules}
        </div>
      )}

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50/80 text-indigo-600 rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Modules</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{totals.modules}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-50/80 text-cyan-600 rounded-xl shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Functionalities</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{totals.functionalities}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50/80 text-purple-600 rounded-xl shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Effort (Hours)</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{totals.effort} Hrs</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50/80 text-blue-600 rounded-xl shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Duration</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{projectDurationDays} Days</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50/80 text-emerald-600 rounded-xl shrink-0">
            <IndianRupee className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Cost (INR)</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">₹ {totals.cost.toLocaleString()}</p>
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
              <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap shadow-sm border border-indigo-100/50">
                    Module {mIdx + 1}
                    
                  </div>
                  <div className='flex-[1.5] flex flex-col items-center md:items-start'>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Module Name</p>
                  <input
                    type="text"
                    value={module.name}
                    onChange={(e) => updateModule(module.id, 'name', e.target.value)}
                    placeholder="Module Name (e.g. Backend)"
                    className={`text-base font-bold text-gray-900 bg-transparent focus:outline-none border-b-2 py-1 flex-1 max-w-[200px] ${errors[`module_${mIdx}_name`] ? 'border-red-500' : 'border-transparent hover:border-gray-200 focus:border-indigo-500 transition-colors'}`}
                  />
                  </div>
                </div>

                <div className="flex-[1.5] flex flex-col items-center md:items-start">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Module Description</p>
                   <input
                     type="text"
                     value={module.description}
                     onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                     placeholder="e.g. Core API Services"
                     className="w-full text-sm text-gray-600 bg-transparent focus:outline-none border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-500 py-1 text-center md:text-left transition-colors"
                   />
                </div>

                <div className="flex items-center gap-8 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Module Duration</p>
                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        value={module.duration}
                        onChange={(e) => updateModule(module.id, 'duration', e.target.value)}
                        className="w-12 text-center text-sm font-bold bg-transparent focus:outline-none border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-500 transition-colors"
                        placeholder="0"
                      />
                      <span className="text-sm font-bold text-gray-900 ml-1">Days</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Total Effort (Hours)</p>
                    <p className="text-sm font-bold text-gray-900">{moduleEffort} Hrs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Total Cost (INR)</p>
                    <p className="text-sm font-bold text-gray-900">₹ {moduleCost.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => toggleCollapse(module.id)} 
                      className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-100"
                    >
                      {collapsedModules[module.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                    </button>
                    <button onClick={() => deleteModule(module.id)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Functionalities & Team Allocation Split */}
              {!collapsedModules[module.id] && (
              <div className="flex flex-col xl:flex-row gap-6 p-6 bg-white">
                
                {/* Left: Functionalities */}
                <div className="flex-[1.2] p-5 flex flex-col min-w-0 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-sm font-bold text-gray-900">Functionalities</h3>
                    <button
                      onClick={() => handleAddFunctionality(module.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Functionality
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs mb-2">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-700">
                          <th className="pb-2 font-bold w-6">#</th>
                          <th className="pb-2 font-bold min-w-[120px]">Functionality</th>
                          <th className="pb-2 font-bold min-w-[150px]">Description</th>
                          <th className="pb-2 font-bold text-center w-20">Effort (Hours)</th>
                          <th className="pb-2 font-bold text-center w-24">Duration (Days)</th>
                          <th className="pb-2 font-bold text-center w-10">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {module.functionalities.map((func, fIdx) => (
                          <tr key={func.id} className="border-b border-gray-100 last:border-0 group">
                            <td className="py-2 text-gray-500 align-top">{fIdx + 1}</td>
                            <td className="py-2 pr-2 align-top">
                              <input
                                type="text"
                                value={func.name}
                                onChange={(e) => updateFunctionality(module.id, func.id, 'name', e.target.value)}
                                placeholder="Name"
                                className={`w-full bg-transparent focus:outline-none border-b py-0.5 ${errors[`module_${mIdx}_func_${fIdx}_name`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-200 focus:border-indigo-500'}`}
                              />
                            </td>
                            <td className="py-2 pr-2 align-top">
                              <input
                                type="text"
                                value={func.description}
                                onChange={(e) => updateFunctionality(module.id, func.id, 'description', e.target.value)}
                                placeholder="Description"
                                className="w-full text-gray-500 bg-transparent focus:outline-none border-b border-transparent group-hover:border-gray-200 focus:border-indigo-500 py-0.5"
                              />
                            </td>
                            <td className="py-2 px-1 align-top">
                              <input
                                type="number"
                                min="0" step="any"
                                value={func.effort}
                                onChange={(e) => updateFunctionality(module.id, func.id, 'effort', e.target.value)}
                                className={`w-full text-center bg-transparent focus:outline-none border-b py-0.5 ${errors[`module_${mIdx}_func_${fIdx}_effort`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-200 focus:border-indigo-500'}`}
                              />
                            </td>
                            <td className="py-2 px-1 align-top">
                              <input
                                type="number"
                                min="0" step="any"
                                value={func.duration}
                                onChange={(e) => updateFunctionality(module.id, func.id, 'duration', e.target.value)}
                                className={`w-full text-center bg-transparent focus:outline-none border-b py-0.5 ${errors[`module_${mIdx}_func_${fIdx}_duration`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-200 focus:border-indigo-500'}`}
                              />
                            </td>
                            <td className="py-2 align-top text-center pt-2.5">
                              <button onClick={() => deleteFunctionality(module.id, func.id)} className="text-gray-400 hover:text-red-500">
                                <Trash2 className="h-3.5 w-3.5 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-indigo-50/30">
                          <td colSpan={3} className="py-2 text-right font-bold text-indigo-600 pr-4">Total</td>
                          <td className="py-2 text-center font-bold text-indigo-600">{moduleEffort}</td>
                          <td className="py-2 text-center font-bold text-indigo-600">{functionalitiesDurationTotal}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  {errors[`module_${mIdx}_func`] && <p className="text-xs text-red-500 mt-1">{errors[`module_${mIdx}_func`]}</p>}
                </div>

                {/* Right: Team Effort Allocation */}
                <div className="flex-[1.3] p-5 flex flex-col min-w-0 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-sm font-bold text-gray-900">Team Effort Allocation</h3>
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
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Team Member
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs mb-2">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-700">
                          <th className="pb-2 font-bold min-w-[120px]">Team Member</th>
                          <th className="pb-2 font-bold min-w-[100px]">Role</th>
                          <th className="pb-2 font-bold text-center w-20">Effort (Hours)</th>
                          <th className="pb-2 font-bold text-center w-24">Rate / Hour</th>
                          <th className="pb-2 font-bold text-center w-24">Total Cost </th>
                          <th className="pb-2 font-bold text-center w-10">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {module.functionalities.map((func, fIdx) => 
                          func.teamAllocations.map((tm, tIdx) => (
                            <React.Fragment key={tm.id}>
                              <tr className="group hover:bg-gray-50">
                                <td className="py-2 pr-2">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[8px] font-bold uppercase shrink-0">
                                      {employees.find(e => String(e.id) === String(tm.memberId))?.name?.substring(0, 2) || 'UN'}
                                    </div>
                                    <select
                                      value={String(tm.memberId || '')}
                                      onChange={(e) => updateTeamMember(module.id, func.id, tm.id, 'memberId', e.target.value)}
                                      className="w-full bg-transparent border-0 focus:ring-0 text-xs text-gray-700 p-0 cursor-pointer focus:outline-none"
                                    >
                                      <option value="">Select...</option>
                                      {employees.map(emp => (
                                        <option key={emp.id} value={String(emp.id)}>{emp.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </td>
                                <td className="py-2 pr-2 text-gray-500 truncate">{tm.role || '-'}</td>
                                <td className="py-2 px-1">
                                  <input
                                    type="number"
                                    min="0" step="any"
                                    value={tm.effort}
                                    onChange={(e) => updateTeamMember(module.id, func.id, tm.id, 'effort', e.target.value)}
                                    className={`w-full text-center bg-transparent focus:outline-none border-b py-0.5 ${errors[`module_${mIdx}_func_${fIdx}_team`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-300 focus:border-indigo-500'}`}
                                    placeholder="0"
                                  />
                                </td>
                                <td className="py-2 text-center text-gray-500">₹ {tm.rate || '0'}</td>
                                <td className="py-2 text-center font-medium">₹ {(Number(tm.cost) || 0).toLocaleString()}</td>
                                <td className="py-2 text-center">
                                  <button onClick={() => deleteTeamMember(module.id, func.id, tm.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-3.5 w-3.5 mx-auto" />
                                  </button>
                                </td>
                              </tr>
                              {tIdx === func.teamAllocations.length - 1 && errors[`module_${mIdx}_func_${fIdx}_team`] && (
                                <tr>
                                  <td colSpan={6} className="py-1">
                                    <div className="text-[10px] text-red-500 bg-red-50 p-1.5 rounded border border-red-100 flex items-center gap-1">
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
                        <tr className="bg-indigo-50/30">
                          <td colSpan={2} className="py-2 pl-3 font-bold text-indigo-600">Total</td>
                          <td className="py-2 text-center font-bold text-indigo-600">{moduleEffort} Hrs</td>
                          <td></td>
                          <td className="py-2 text-center font-bold text-indigo-600">₹ {moduleCost.toLocaleString()}</td>
                          <td></td>
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
        <div className="mt-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-sm">
          <div className="flex-shrink-0 min-w-[120px]">
            <h3 className="text-lg font-bold text-gray-900">Grand Total</h3>
            <p className="text-sm font-medium text-indigo-600">{totals.modules} Modules</p>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-start lg:justify-center gap-6 md:gap-10">
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-indigo-500 shadow-sm border border-indigo-50/50"><Calendar className="h-5 w-5" /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Project Start Date</p>
                  <p className="text-sm font-bold text-gray-900">{formData.projectStartDate ? new Date(formData.projectStartDate).toLocaleDateString('en-GB') : '-'}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-indigo-500 shadow-sm border border-indigo-50/50"><Calendar className="h-5 w-5" /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Project End Date</p>
                  <p className="text-sm font-bold text-gray-900">{formData.projectEndDate ? new Date(formData.projectEndDate).toLocaleDateString('en-GB') : '-'}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-indigo-500 shadow-sm border border-indigo-50/50"><Calendar className="h-5 w-5" /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Days</p>
                  <p className="text-sm font-bold text-gray-900">{projectDurationDays} Days</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-indigo-500 shadow-sm border border-indigo-50/50"><Clock className="h-5 w-5" /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Effort (Hours)</p>
                  <p className="text-sm font-bold text-gray-900">{totals.effort} Hrs</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 lg:pl-8 lg:border-l border-indigo-200/60 pt-4 lg:pt-0">
             <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm border border-indigo-50/50"><IndianRupee className="h-6 w-6" /></div>
             <div className="text-left lg:text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Cost (INR)</p>
                <p className="text-xl font-bold text-indigo-600">₹ {totals.cost.toLocaleString()}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
