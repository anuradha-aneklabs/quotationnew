import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import QuotationStepper from '../components/quotations/form/QuotationStepper';
import ClientInfoStep from '../components/quotations/form/steps/ClientInfoStep';
import ProposalDetailsStep from '../components/quotations/form/steps/ProposalDetailsStep';
import ModuleManagementStep from '../components/quotations/form/steps/ModuleManagementStep';
import CommercialStep from '../components/quotations/form/steps/CommercialStep';
import TimelineStep from '../components/quotations/form/steps/TimelineStep';
import PreviewStep from '../components/quotations/form/steps/PreviewStep';
import { validateStep1, validateStep2, validateStep3 } from '../utils/quotationValidation';
import * as quotationService from '../services/quotationService';
import { useToast } from '../contexts/ToastContext';

export default function CreateQuotation({ setCurrentView, editId = null }) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [createdQuoteId, setCreatedQuoteId] = useState(editId);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Client Info
    clientId: '',
    clientName: '',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    currency: 'INR - Indian Rupee (₹)',
    gstNumber: '',
    panNumber: '',
    logo: null,
    billingAddress: '',
    shippingAddress: '',
    isShippingSameAsBilling: false,
    pincode: '',
    country: '',
    state: '',
    city: '',

    // Step 2: Proposal Details
    proposalTitle: '',
    sector: '',
    quotationNumber: `QTN-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
    proposalDate: new Date().toISOString().split('T')[0],
    validTill: '',
    revision: '1.0',
    preparedBy: '',
    designation: '',
    department: '',
    projectSummary: '',
    companyId: '',
    branchId: '',
    engagementType: 'Fixed Price',
    pricingCurrency: 'USD - US Dollar ($)',
    exchangeRate: '83.0000',

    // Step 3: Module Management
    projectStartDate: '',
    projectEndDate: '',
    modules: [],

    // Step 4: Commercial
    discountType: 'Percentage (%)',
    discountValue: 0,
  });

  // Mount API Calls when step changes
  useEffect(() => {
    const loadStepData = async () => {
      if (!createdQuoteId) return;

      setIsLoading(true);
      try {
        if (currentStep === 1 || currentStep === 2) {
          const res = await quotationService.getQuotation(createdQuoteId);
          if (res.data) {
            const data = res.data;

            // Try to fetch missing client fields (like state, city) directly from the Client API
            let clientState = data.client_state || '';
            let clientCity = data.client_city || '';
            let clientCountry = data.client_country || '';

            if (data.client_id) {
              try {
                const { fetchClients } = await import('../services/clientService.js');
                const allClients = await fetchClients();
                const matchedClient = allClients.find(c => c.id === data.client_id);
                if (matchedClient) {
                  clientState = clientState || matchedClient.state || '';
                  clientCity = clientCity || matchedClient.city || '';
                  clientCountry = clientCountry || matchedClient.country || '';
                }
              } catch (e) { console.error('Could not load client details for edit map', e); }
            }

            setFormData(prev => ({
              ...prev,
              clientId: data.client_id || prev.clientId,
              clientName: data.client_company || prev.clientName,
              contactPerson: data.client_contact_person || prev.contactPerson,
              phone: data.client_phone || prev.phone,
              email: data.client_email || prev.email,
              website: data.client_website || prev.website,
              currency: data.client_currency || prev.currency,
              gstNumber: data.client_gst_number || prev.gstNumber,
              panNumber: data.client_pan_number || prev.panNumber,
              logo: data.logo || prev.logo,
              billingAddress: data.billing_address || prev.billingAddress,
              shippingAddress: data.shipping_address || prev.shippingAddress,
              pincode: data.pincode || prev.pincode,
              country: clientCountry || prev.country,
              state: clientState || prev.state,
              city: clientCity || prev.city,
              proposalTitle: data.title || prev.proposalTitle,
              proposalDate: data.proposal_date || prev.proposalDate,
              validTill: data.valid_till || prev.validTill,
              quotationNumber: data.quotation_number || prev.quotationNumber,
              // Other Step 2 fields from API if they exist
              sector: data.sector || prev.sector,
              revision: data.revision_version || prev.revision,
              preparedBy: data.prepared_by_id || prev.preparedBy,
              designation: data.prepared_by_designation || prev.designation,
              department: data.prepared_by_department || prev.department,
              companyId: data.company_id || prev.companyId,
              branchId: data.branch_id || prev.branchId,
              engagementType: data.engagement_type || prev.engagementType,
              pricingCurrency: data.pricing_currency || prev.pricingCurrency,
              exchangeRate: data.exchange_rate || prev.exchangeRate,
            }));
          }
        } else if (currentStep === 3) {
          const [quoteRes, scopesRes] = await Promise.all([
            quotationService.getQuotation(createdQuoteId),
            quotationService.getScopesTree(createdQuoteId)
          ]);

          let allEmployees = [];
          try {
            const { fetchEmployees } = await import('../services/employeeService.js');
            allEmployees = await fetchEmployees();
          } catch (e) {
            console.error("Failed to load employees for edit mapping");
          }

          setFormData(prev => {
            const newData = { ...prev };
            if (quoteRes.data) {
              newData.projectStartDate = quoteRes.data.project_start_date || prev.projectStartDate;
              newData.projectEndDate = quoteRes.data.project_end_date || prev.projectEndDate;
            }

            // The API response could have modules directly on .data, or nested
            let rawModules = scopesRes.data?.modules || scopesRes.data || scopesRes.modules || scopesRes.data?.data?.modules || scopesRes.data?.data?.quotations?.modules || [];
            if (!Array.isArray(rawModules) && rawModules.data) rawModules = rawModules.data; // fallback unwrapping
            if (!Array.isArray(rawModules)) rawModules = [];

            if (rawModules.length > 0) {
              newData.modules = rawModules.map(m => {
                // Backend returns teamAllocations at module level, put them in first functionality
                const moduleTeamAllocations = (m.teamAllocations || []).map(tm => {
                  const memberId = String(tm.employeeId || tm.employee_id || tm.memberId || tm.member_id || '');
                  const mappedTm = {
                    id: tm.id || Date.now().toString(),
                    memberId: memberId,
                    role: tm.role || '',
                    effort: String(tm.effort || ''),
                    rate: String(tm.rate || ''),
                    cost: Number(tm.total_cost || tm.cost || 0)
                  };

                  // Auto-fill rate/role from employees list if not already present
                  if (memberId) {
                    const emp = allEmployees.find(e => String(e.id) === memberId);
                    if (emp) {
                      mappedTm.rate = mappedTm.rate || String(emp.hourly_rate).replace('₹', '');
                      mappedTm.role = mappedTm.role || emp.role || emp.designation || '';
                      const effortNum = Number(mappedTm.effort) || 0;
                      const rateNum = Number(mappedTm.rate) || 0;
                      mappedTm.cost = effortNum * rateNum;
                    }
                  }
                  return mappedTm;
                });

                const functionalities = (m.functionalities || []).map((f, fIdx) => ({
                  id: f.id || Date.now().toString(),
                  name: f.name || '',
                  description: f.description || '',
                  effort: String(f.effort || ''),
                  duration: String(f.duration || ''),
                  // Put all team allocations in the first functionality
                  teamAllocations: fIdx === 0 ? moduleTeamAllocations : []
                }));

                return {
                  id: m.id || Date.now().toString(),
                  name: m.name || '',
                  description: m.description || '',
                  duration: String(m.durationDays || m.duration || ''),
                  functionalities
                };
              });
            }
            return newData;
          });
        } else if (currentStep === 4) {
          const res = await quotationService.getCommercial(createdQuoteId);
          if (res.data) {
            setFormData(prev => ({
              ...prev,
              discountType: res.data.discount_type || prev.discountType,
              discountValue: res.data.discount_value || prev.discountValue
            }));
          }
        } else if (currentStep === 5) {
          const res = await quotationService.getMilestones(createdQuoteId);
          // Auto populate timeline logic if needed
        } else if (currentStep === 6) {
          const res = await quotationService.getSummary(createdQuoteId);
          // Override formData with full summary mapping if needed
        }
      } catch (err) {
        console.error("Failed to load step data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStepData();
  }, [currentStep, createdQuoteId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'pincode') {
      newValue = value.replace(/\D/g, '').slice(0, 6);
    } else if (name === 'panNumber') {
      newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    } else if (name === 'gstNumber') {
      newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
    }

    setFormData(prev => {
      let newData = { ...prev, [name]: newValue };
      if (name === 'isShippingSameAsBilling') {
        newData.shippingAddress = newValue ? prev.billingAddress : '';
      }

      if (name === 'pricingCurrency') {
        if (newValue.includes('USD')) newData.exchangeRate = '1 USD = 83.0000 INR';
        else if (newValue.includes('EUR')) newData.exchangeRate = '1 EUR = 90.0000 INR';
        else if (newValue.includes('GBP')) newData.exchangeRate = '1 GBP = 105.0000 INR';
        else newData.exchangeRate = '1 INR = 1.0000 INR';
      }

      return newData;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const mapStep1Payload = () => ({
    client_id: formData.clientId || null,
    title: formData.proposalTitle,
    proposal_date: formData.proposalDate || null,
    valid_till: formData.validTill || null,
    billing_address: formData.billingAddress,
    shipping_address: formData.shippingAddress,
    pincode: formData.pincode,
    wizard_step: 1
  });

  const mapStep2Payload = () => ({
    ...mapStep1Payload(),
    sector: formData.sector,
    revision_version: formData.revision,
    prepared_by_id: formData.preparedBy || null,
    prepared_by_designation: formData.designation,
    prepared_by_department: formData.department,
    engagement_type: formData.engagementType,
    pricing_currency: formData.pricingCurrency,
    exchange_rate: parseFloat(formData.exchangeRate?.split(' ')[3]) || 1.0,
    description: formData.projectSummary,
    company_id: formData.companyId || null,
    branch_id: formData.branchId || null,
    wizard_step: 2
  });

  const handleNext = async () => {
    let stepErrors = {};
    if (currentStep === 1) stepErrors = validateStep1(formData);
    else if (currentStep === 2) stepErrors = validateStep2(formData);
    else if (currentStep === 3) stepErrors = validateStep3(formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      // Common logic to sync client-level details
      if ((currentStep === 1 || currentStep === 2) && formData.clientId) {
        try {
          const { updateClient } = await import('../services/clientService.js');
          await updateClient(formData.clientId, {
            company_name: formData.clientName,
            contact_person: formData.contactPerson,
            phone: formData.phone,
            email: formData.email,
            address: formData.billingAddress,
            pan_number: formData.panNumber,
            gst_number: formData.gstNumber,
            country: formData.country,
            state: formData.state,
            city: formData.city
          });
        } catch (e) {
          console.error('Failed to update client details on save:', e);
        }
      }

      if (currentStep === 1) {
        if (!createdQuoteId) {
          const res = await quotationService.createQuotation(mapStep2Payload());
          setCreatedQuoteId(res.data.id);
          setFormData(prev => ({ ...prev, quotationNumber: res.data.quotation_number }));
        } else {
          await quotationService.updateQuotation(createdQuoteId, mapStep2Payload());
        }
      } else if (currentStep === 2) {
        await quotationService.updateQuotation(createdQuoteId, mapStep2Payload());
      } else if (currentStep === 3) {
        const mapStep3Payload = () => {
          const parseId = (id) => (id && id.toString().length > 10) ? undefined : id;
          return {
            modules: formData.modules.map(m => {
              // Flatten all teamAllocations from every functionality into module level (backend expects this)
              const allTeamAllocations = m.functionalities.flatMap(f =>
                f.teamAllocations.map(tm => ({
                  id: parseId(tm.id),
                  employeeId: tm.memberId,
                  role: tm.role,
                  effort: Number(tm.effort) || 0,
                  rate: Number(tm.rate) || 0,
                  cost: Number(tm.cost) || 0
                }))
              );
              return {
                id: parseId(m.id),
                name: m.name,
                description: m.description,
                durationDays: Number(m.duration) || 0,
                functionalities: m.functionalities.map(f => ({
                  id: parseId(f.id),
                  name: f.name,
                  description: f.description,
                  effort: Number(f.effort) || 0,
                  duration: Number(f.duration) || 0
                })),
                teamAllocations: allTeamAllocations
              };
            })
          };
        };

        let calculatedDays = 0;
        if (formData.projectStartDate && formData.projectEndDate) {
          const start = new Date(formData.projectStartDate);
          const end = new Date(formData.projectEndDate);
          if (!isNaN(start) && !isNaN(end)) {
            calculatedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            if (calculatedDays < 0) calculatedDays = 0;
          }
        }

        await quotationService.syncScopes(createdQuoteId, mapStep3Payload());
        await quotationService.updateQuotation(createdQuoteId, {
          project_start_date: formData.projectStartDate || null,
          project_end_date: formData.projectEndDate || null,
          total_timeline_days: calculatedDays,
          wizard_step: 3
        });
      } else if (currentStep === 4) {
        await quotationService.saveCommercial(createdQuoteId, {
          discount_type: formData.discountType,
          discount_value: formData.discountValue,
          wizard_step: 4
        });
      } else if (currentStep === 5) {
        // Mock bulk save
        await quotationService.bulkSaveMilestones(createdQuoteId, { milestones: [] });
        await quotationService.updateQuotation(createdQuoteId, { wizard_step: 5 });
      }

      if (currentStep < 6) setCurrentStep(prev => prev + 1);
    } catch (err) {
      console.error("API Save Error:", err);
      showToast(err.message || "Failed to save step.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSaveQuotation = async () => {
    setIsSaving(true);
    try {
      if (createdQuoteId) {
        await quotationService.saveCommercial(createdQuoteId, { wizard_step: 6 });
      }
      showToast("Quotation saved successfully!", 'success');
      setCurrentView('Quotations');
    } catch (err) {
      console.error(err);
      showToast("Final submit failed.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;

    switch (currentStep) {
      case 1: return <ClientInfoStep formData={formData} handleChange={handleChange} errors={errors} setFormData={setFormData} />;
      case 2: return <ProposalDetailsStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 3: return <ModuleManagementStep formData={formData} setFormData={setFormData} errors={errors} />;
      case 4: return <CommercialStep formData={formData} handleChange={handleChange} />;
      case 5: return <TimelineStep formData={formData} />;
      case 6: return <PreviewStep formData={formData} onSave={handleSaveQuotation} isSaving={isSaving} onEdit={() => setCurrentStep(1)} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50 -mx-6 -mt-6 pt-4 px-4 pb-0">
      <div className="flex items-center mb-4">
        <button
          onClick={() => setCurrentView('Quotations')}
          className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Quotations
        </button>
      </div>

      <QuotationStepper currentStep={currentStep} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {renderStep()}
        </div>

        <div className="p-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || isSaving}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center
              ${currentStep === 1 || isSaving
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              disabled={isSaving}
              className={`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isSaving ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...</> : 'Save & Next'}
              {!isSaving && <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
