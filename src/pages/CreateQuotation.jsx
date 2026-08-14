import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import QuotationStepper from '../components/quotations/form/QuotationStepper';
import ClientInfoStep from '../components/quotations/form/steps/ClientInfoStep';
import ProposalDetailsStep from '../components/quotations/form/steps/ProposalDetailsStep';
import ModuleManagementStep from '../components/quotations/form/steps/ModuleManagementStep';
import CommercialStep from '../components/quotations/form/steps/CommercialStep';
import TimelineStep from '../components/quotations/form/steps/TimelineStep';
import PreviewStep from '../components/quotations/form/steps/PreviewStep';
import { validateStep1, validateStep2 } from '../utils/quotationValidation';
import * as quotationService from '../services/quotationService';

export default function CreateQuotation({ setCurrentView, editId = null }) {
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
    quotationNumber: `QTN-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(Math.random() * 1000).toString().padStart(4,'0')}`,
    proposalDate: new Date().toISOString().split('T')[0],
    validTill: '',
    revision: '1.0',
    preparedBy: '',
    designation: '',
    department: '',
    projectSummary: '',
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
        if (currentStep === 1) {
          const res = await quotationService.getQuotation(createdQuoteId);
          // populate formData with res.data...
        } else if (currentStep === 3) {
          const res = await quotationService.getScopesTree(createdQuoteId);
          if (res.data?.modules) {
             setFormData(prev => ({ ...prev, modules: res.data.modules }));
          }
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
    if (name === 'phone') newValue = value.replace(/\D/g, '').slice(0, 10);
    else if (name === 'pincode') newValue = value.replace(/\D/g, '').slice(0, 6);

    setFormData(prev => {
      const newData = { ...prev, [name]: newValue };
      if (name === 'isShippingSameAsBilling') {
        newData.shippingAddress = newValue ? prev.billingAddress : '';
      }
      return newData;
    });
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const mapStep1Payload = () => ({
    client_id: formData.clientId || 12,
    title: formData.proposalTitle,
    proposal_date: formData.proposalDate,
    valid_till: formData.validTill,
    billing_address: formData.billingAddress,
    shipping_address: formData.shippingAddress,
    pincode: formData.pincode,
    wizard_step: 1
  });

  const handleNext = async () => {
    let stepErrors = {};
    if (currentStep === 1) stepErrors = validateStep1(formData);
    else if (currentStep === 2) stepErrors = validateStep2(formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      if (currentStep === 1) {
        if (!createdQuoteId) {
          const res = await quotationService.createQuotation(mapStep1Payload());
          setCreatedQuoteId(res.data.id);
          setFormData(prev => ({ ...prev, quotationNumber: res.data.quotation_number }));
        } else {
          await quotationService.updateQuotation(createdQuoteId, mapStep1Payload());
        }
      } else if (currentStep === 2) {
        await quotationService.updateQuotation(createdQuoteId, { ...mapStep1Payload(), wizard_step: 2 });
      } else if (currentStep === 3) {
        await quotationService.syncScopes(createdQuoteId, { modules: formData.modules });
        await quotationService.updateQuotation(createdQuoteId, { 
          project_start_date: formData.projectStartDate, 
          project_end_date: formData.projectEndDate,
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
      alert(err.message || "Failed to save step.");
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
      alert("Quotation saved successfully!");
      setCurrentView('Quotations');
    } catch (err) {
      console.error(err);
      alert("Final submit failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;

    switch(currentStep) {
      case 1: return <ClientInfoStep formData={formData} handleChange={handleChange} errors={errors} setFormData={setFormData} />;
      case 2: return <ProposalDetailsStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 3: return <ModuleManagementStep formData={formData} setFormData={setFormData} errors={errors} />;
      case 4: return <CommercialStep formData={formData} handleChange={handleChange} />;
      case 5: return <TimelineStep formData={formData} />;
      case 6: return <PreviewStep formData={formData} onSave={handleSaveQuotation} isSaving={isSaving} />;
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
              {isSaving ? <><Loader2 className="animate-spin h-4 w-4 mr-2"/> Saving...</> : 'Save & Next'}
              {!isSaving && <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
