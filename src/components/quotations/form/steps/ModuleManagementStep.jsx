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
      modules: prev.modules.map(m =>
        m.id === moduleId ? {
          ...m,
          functionalities: m.functionalities.map(f => {
            if (f.id === funcId) {
              const updated = { ...f, [field]: value };
              if (field === 'effort') {
                const effortHours = Number(value) || 0;
                updated.duration = effortHours > 0 ? String(effortHours / 8) : '';
              }
              return updated;
            }
            return f;
          })
        } : m
      )
    }));
  };

  const [teamErrors, setTeamErrors] = useState({});

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
                    const otherTeamEffort = f.teamAllocations
                      .filter(t => t.id !== memberId)
                      .reduce((sum, t) => sum + (Number(t.effort) || 0), 0);
                    const totalEffort = newEffort + otherTeamEffort;
                    const functionalityEffort = Number(f.effort) || 0;
                    
                    if (totalEffort > functionalityEffort) {
                      setTeamErrors(prev => ({
                        ...prev,
                        [`${moduleId}_${funcId}_${memberId}`]: `Limit exceeded. Total assigned (${totalEffort}h) exceeds available (${functionalityEffort}h).`
                      }));
                    } else {
                      setTeamErrors(prev => {
                        const newErrs = { ...prev };
                        delete newErrs[`${moduleId}_${funcId}_${memberId}`];
                        return newErrs;
                      });
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
      modules: prev.modules.map(m =>
        m.id === moduleId ? {
          ...m,
          functionalities: m.functionalities.filter(f => f.id !== funcId)
        } : m
      )
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
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totals = formData.modules.reduce((acc, m) => {
    acc.modules++;
    m.functionalities.forEach(f => {
      acc.functionalities++;
      acc.effort += Number(f.effort) || 0;
      f.teamAllocations.forEach(tm => {
        acc.cost += Number(tm.cost) || 0;
      });
    });
    return acc;
  }, { modules: 0, functionalities: 0, effort: 0, cost: 0 });

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
            <div className="bg-gray-50 px-4 py-1.5 rounded-lg border border-gray-200 min-w-[80px] text-center">
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">Total Modules</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">{totals.modules}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">Total Functionalities</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">{totals.functionalities}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">Total Effort (Hours)</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">{totals.effort} Hrs</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">Total Duration</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">{projectDurationDays} Days</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <IndianRupee className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">Total Cost (INR)</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">₹ {totals.cost.toLocaleString()}</p>
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
              <div className="p-3 border-b border-gray-200 flex flex-wrap md:flex-nowrap items-start gap-4 bg-white">
                <div className="text-indigo-600 font-bold text-xs pt-4 whitespace-nowrap w-16">Module {mIdx + 1}</div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Module Name</label>
                    <input
                      type="text"
                      value={module.name}
                      onChange={(e) => updateModule(module.id, 'name', e.target.value)}
                      placeholder="e.g. User Authentication"
                      className={`w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none border-b py-0.5 ${errors[`module_${mIdx}_name`] ? 'border-red-500' : 'border-transparent hover:border-gray-300 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Module Description</label>
                    <input
                      type="text"
                      value={module.description}
                      onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                      placeholder="Description..."
                      className="w-full text-xs text-gray-500 bg-transparent focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-indigo-500 py-0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 md:ml-auto">
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Module Duration</p>
                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        value={module.duration}
                        onChange={(e) => updateModule(module.id, 'duration', e.target.value)}
                        className="w-10 text-center text-xs font-bold bg-transparent focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-indigo-500"
                        placeholder="0"
                      />
                      <span className="text-xs font-bold text-gray-900 ml-1">Days</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Total Effort (Hours)</p>
                    <p className="text-xs font-bold text-gray-900">{moduleEffort} Hrs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Total Cost (INR)</p>
                    <p className="text-xs font-bold text-gray-900">₹ {moduleCost.toLocaleString()}</p>
                  </div>
                  <button onClick={() => deleteModule(module.id)} className="text-gray-400 hover:text-red-500 transition-colors mt-3">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => toggleCollapse(module.id)} 
                    className="text-gray-400 hover:text-indigo-600 transition-colors mt-3 ml-2"
                  >
                    {collapsedModules[module.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Functionalities & Team Allocation Split */}
              {!collapsedModules[module.id] && (
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                
                {/* Left: Functionalities */}
                <div className="flex-1 p-3 flex flex-col min-w-0">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-900">Functionalities</h3>
                    <button
                      onClick={() => handleAddFunctionality(module.id)}
                      className="text-[11px] text-gray-600 hover:text-indigo-600 font-medium flex items-center transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Functionality
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
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-indigo-50/30">
                          <td colSpan={3} className="py-2 text-right font-bold text-indigo-600 pr-4">Total</td>
                          <td className="py-2 text-center font-bold text-indigo-600">{moduleEffort}</td>
                          <td className="py-2 text-center font-bold text-indigo-600">{functionalitiesDurationTotal}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  {errors[`module_${mIdx}_func`] && <p className="text-xs text-red-500 mt-1">{errors[`module_${mIdx}_func`]}</p>}
                </div>

                {/* Right: Team Effort Allocation */}
                <div className="flex-[1.2] p-3 flex flex-col min-w-0 bg-gray-50/30">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-900">Team Effort Allocation</h3>
                    <button
                      onClick={() => {
                        // Add team member to the last functionality by default, or create one if none
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
                      className="text-[11px] text-gray-600 hover:text-indigo-600 font-medium flex items-center transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Team Member
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
                                      {employees.find(e => e.id === tm.memberId)?.name?.substring(0, 2) || 'UN'}
                                    </div>
                                    <select
                                      value={tm.memberId}
                                      onChange={(e) => updateTeamMember(module.id, func.id, tm.id, 'memberId', e.target.value)}
                                      className="w-full bg-transparent border-0 focus:ring-0 text-xs text-gray-700 p-0 cursor-pointer focus:outline-none"
                                    >
                                      <option value="">Select...</option>
                                      {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
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
                                    className={`w-full text-center bg-transparent focus:outline-none border-b py-0.5 ${teamErrors[`${module.id}_${func.id}_${tm.id}`] || errors[`module_${mIdx}_func_${fIdx}_team`] ? 'border-red-500' : 'border-transparent group-hover:border-gray-300 focus:border-indigo-500'}`}
                                    placeholder="0"
                                  />
                                  {teamErrors[`${module.id}_${func.id}_${tm.id}`] && (
                                    <div className="text-[9px] text-red-500 text-center leading-tight mt-0.5">
                                      {teamErrors[`${module.id}_${func.id}_${tm.id}`]}
                                    </div>
                                  )}
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
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-indigo-600">Grand Total</h3>
            <p className="text-xs text-gray-500">{totals.functionalities} Functionalities</p>
          </div>
          <div className="flex items-center gap-8 md:gap-12 text-center divide-x divide-gray-100">
            <div className="px-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Duration</p>
              <p className="text-sm font-bold text-gray-900">{projectDurationDays} Days</p>
            </div>
            <div className="px-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Effort (Hours)</p>
              <p className="text-sm font-bold text-gray-900">{totals.effort} Hrs</p>
            </div>
            <div className="px-4 text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Cost (INR)</p>
              <p className="text-lg font-bold text-indigo-600">₹ {totals.cost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
