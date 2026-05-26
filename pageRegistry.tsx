
import React from 'react';

// Import all page components
import LoginPage from './pages/LoginPage';
import PublicHomepage from './pages/PublicHomepage'; // P-00
import PublicHomepageV2 from './pages/PublicHomepageV2'; // P-00-V2
import CurrentWebsitePage from './pages/CurrentWebsitePage'; // P-00a
import Web2Page from './pages/Web2Page'; // P-00b
import AboutUsPage from './pages/AboutUsPage'; // P-01
import OurServicesPage from './pages/OurServicesPage'; // P-02
import AsphaltRoofingPage from './pages/AsphaltRoofingPage'; // P-02a
import MembraneRoofingPage from './pages/MembraneRoofingPage'; // P-02b
import GuttersPage from './pages/GuttersPage'; // P-02c
import IceManagementPage from './pages/IceManagementPage'; // P-02d
import RoofComponentsPage from './pages/RoofComponentsPage'; // P-02e
import Tpo60Page from './pages/Tpo60Page'; // P-02b-1
import Tpo80Page from './pages/Tpo80Page'; // P-02b-2
import PvcPage from './pages/PvcPage'; // P-02b-3
import DurationPerformancePage from './pages/DurationPerformancePage'; // P-02a-1
import DurationFlexPage from './pages/DurationFlexPage'; // P-02a-2
import DesignerPackagePage from './pages/DesignerPackagePage'; // P-02a-3
import PremiumDesignerPackagePage from './pages/PremiumDesignerPackagePage'; // P-02a-4
import DurationSpecificationPrint from './pages/DurationSpecificationPrint'; // P-02a-SPEC
import ScopeOfWorkPage from './pages/ScopeOfWorkPage'; // P-Scope
import OurProcessPage from './pages/OurProcessPage'; // P-03
import FinancingPage from './pages/FinancingPage'; // P-04
import ContactPage from './pages/ContactPage'; // P-05
import PasswordResetPage from './pages/PasswordResetPage'; // P-07
import ContractorSignupPage from './pages/ContractorSignupPage'; // P-09
import PublicCareersPage from './pages/PublicCareersPage'; // P-10
import JobApplicationPage from './pages/JobApplicationPage'; // P-11
import EmployeeHomepage from './pages/EmployeeHomepage'; // E-01
import GlobalNavCustomerLookup from './pages/GlobalNavCustomerLookup'; // E-02
import CustomerInputPage from './pages/CustomerInputPage'; // E-02a
import EmployeePipelinePage from './pages/EmployeePipelinePage'; // E-05
import IncomeActionatorPage from './pages/IncomeActionatorPage'; // E-16
import ReportingPage from './pages/ReportingPage'; // E-18
import EmployeeInfoPage from './pages/EmployeeInfoPage'; // E-21
import EmployeeTimeoffPage from './pages/EmployeeTimeoffPage'; // E-22 / E-04
import EstimateToolPage from './pages/EstimateToolPage'; // E-27 / P-12
import EstimatePricingPage from './pages/EstimatePricingPage'; // A-03
import EstimateBackendApiPage from './pages/EstimateBackendApiPage'; // A-04
import QuoteBuilderToolPage from './pages/QuoteBuilderToolPage'; // E-23
import LineItemCatalogPage from './pages/LineItemCatalogPage'; // A-05 / E-19
import LineItemProfilePage from './pages/LineItemProfilePage'; // A-06 / E-20
import ContactsVendorsPage from './pages/ContactsVendorsPage'; // E-24
import ContactVendorProfilePage from './pages/ContactVendorProfilePage'; // E-25
import CompanyPage from './pages/CompanyPage'; // E-08 (Company Profile)
import PropertyPage from './pages/PropertyPage'; // E-11 (List)
import PropertyProfilePage from './pages/PropertyProfilePage'; // E-12 (Details)
import ProjectProfilePage from './pages/ProjectProfilePage'; // E-15 (Project Profile)
import WeatherGuideWidgetPage from './pages/WeatherGuideWidgetPage'; // E-38
import CustomerProjectMapPage from './pages/CustomerProjectMapPage'; // E-06
import CustomerHomepage from './pages/CustomerHomepage'; // C-01
import CustomerDashboard from './pages/CustomerDashboard'; // C-02
import CustomerProjectProfilePage from './pages/CustomerProjectProfilePage'; // C-03
import ContractorHomepage from './pages/ContractorHomepage'; // CO-01
import ContractorAdminPanelPage from './pages/ContractorAdminPanelPage'; // CO-03
import ContractorFinancialsPage from './pages/ContractorFinancialsPage'; // CO-07
import NewProjectBidsPage from './pages/NewProjectBidsPage'; // CO-05
import SupplierHomepage from './pages/SupplierHomepage'; // S-01
import SupplierProfilePage from './pages/SupplierProfilePage'; // S-04
import UserManagementPage from './pages/UserManagementPage'; // A-02
import AdminDashboardPage from './pages/AdminDashboardPage'; // A-01
import RoleManagementPage from './pages/RoleManagementPage'; // SA-01
import CustomerTrackerPage from './pages/CustomerTrackerPage'; // C-Tracker
import SimulationGuidePage from './pages/SimulationGuidePage'; // (Simulation)
import ChatbotTestingPage from './pages/ChatbotTestingPage'; // E-TEST
import RHIVEBrandingPage from './pages/RHIVEBrandingPage'; // E-39
import InsurancePage from './pages/InsurancePage'; // P-13
import PreConversionRecordPage from './pages/PreConversionRecordPage'; // (Simulation)
import UniversalLandingPage from './pages/UniversalLandingPage'; // P-Landing
import MaintenancePage from './pages/MaintenancePage'; // P-14
import FirestoreDebugPage from './pages/FirestoreDebugPage'; // DEBUG

// Specific stage pages
import LeadPage from './pages/LeadPage'; // E-26
import QuotePage from './pages/QuotePage'; // E-28
import SignAndVerifyPage from './pages/SignAndVerifyPage'; // E-29
import SchedulePage from './pages/SchedulePage'; // E-30
import PreInstallationPage from './pages/PreInstallationPage'; // E-31
import InstallPage from './pages/InstallPage'; // E-32
import PunchListPage from './pages/PunchListPage'; // E-33
import InvoicingPage from './pages/InvoicingPage'; // E-34
import PaymentsModularPage from './pages/PaymentsModularPage'; // E-35
import CompletedPage from './pages/CompletedPage'; // E-36
import PastCustomerPage from './pages/PastCustomerPage'; // E-37

const Placeholder = ({ name }: { name: string }) => (
  <div className="p-10 text-white font-mono">
    <h1 className="text-2xl font-bold text-[#ec028b] mb-4">{name}</h1>
    <p className="text-gray-400">Design Mockup: This module is currently under construction for original design verification.</p>
  </div>
);

export const pageComponentMap: Record<string, React.FC> = {
  // Public
  'P-00': PublicHomepage,
  'P-00-V2': PublicHomepageV2,
  'P-00a': CurrentWebsitePage,
  'P-00b': Web2Page,
  'P-01': AboutUsPage,
  'P-02': OurServicesPage,
  'P-02a': AsphaltRoofingPage,
  'P-02a-1': DurationPerformancePage,
  'P-02a-2': DurationFlexPage,
  'P-02a-3': DesignerPackagePage,
  'P-02a-4': PremiumDesignerPackagePage,
  'P-02a-SPEC': DurationSpecificationPrint,
  'P-Scope': ScopeOfWorkPage,
  'P-02b': MembraneRoofingPage,
  'P-02b-1': Tpo60Page,
  'P-02b-2': Tpo80Page,
  'P-02b-3': PvcPage,
  'P-02c': GuttersPage,
  'P-02d': IceManagementPage,
  'P-02e': RoofComponentsPage,
  'P-03': OurProcessPage,
  'P-05': ContactPage,
  'P-06': LoginPage,
  'P-07': PasswordResetPage,
  'P-04': FinancingPage,
  'P-09': ContractorSignupPage,
  'P-10': PublicCareersPage,
  'P-11': JobApplicationPage,
  'P-12': EstimateToolPage,
  'P-13': InsurancePage,
  'P-14': MaintenancePage,
  'P-Landing': UniversalLandingPage,

  // Admin (Employee World Section 1)
  'A-01': AdminDashboardPage,
  'A-02': UserManagementPage,
  'A-03': EstimatePricingPage,
  'A-04': EstimateBackendApiPage,
  'A-05': LineItemCatalogPage,
  'A-06': LineItemProfilePage,

  // Employee (Employee World Section 2)
  'E-01': EmployeeHomepage,
  'E-02': GlobalNavCustomerLookup,
  'E-02a': CustomerInputPage,
  'E-TEMP': PreConversionRecordPage,
  'E-03': () => <Placeholder name="AI ASSISTANT (GLOBAL)" />,
  'E-04': EmployeeTimeoffPage,
  'E-05': EmployeePipelinePage,
  'E-06': CustomerProjectMapPage,
  'E-07': () => <Placeholder name="MY ACCOUNTS (CRM)" />,
  'E-08': CompanyPage,
  'E-09': () => <Placeholder name="MY CONTACTS (CRM)" />,
  'E-10': ContactVendorProfilePage,
  'E-11': PropertyPage,
  'E-12': PropertyProfilePage,
  'E-14': () => <Placeholder name="PROJECT HUB" />,
  'E-15': ProjectProfilePage,
  'E-16': IncomeActionatorPage,
  'E-17': () => <Placeholder name="COMMISSION COMPASS" />,
  'E-18': ReportingPage,
  'E-19': LineItemCatalogPage,
  'E-20': LineItemProfilePage,
  'E-21': EmployeeInfoPage,
  'E-22': EmployeeTimeoffPage,
  'E-21a': () => <Placeholder name="EMPLOYEE PROFILE" />, // Added a missing slot
  'E-23': QuoteBuilderToolPage,
  'E-24': ContactsVendorsPage,
  'E-25': ContactVendorProfilePage,
  'E-26': LeadPage,
  'E-27': EstimateToolPage,
  'E-28': QuotePage,
  'E-29': SignAndVerifyPage,
  'E-30': SchedulePage,
  'E-31': PreInstallationPage,
  'E-32': InstallPage,
  'E-33': PunchListPage,
  'E-34': InvoicingPage,
  'E-35': PaymentsModularPage,
  'E-36': CompletedPage,
  'E-37': PastCustomerPage,
  'E-38': WeatherGuideWidgetPage,
  'E-39': RHIVEBrandingPage,

  // Customer
  'C-01': CustomerHomepage,
  'C-02': CustomerDashboard,
  'C-Tracker': CustomerTrackerPage,
  'C-03': CustomerProjectProfilePage,
  'C-04': () => <Placeholder name="MY PROFILE" />,

  // Contractor
  'CO-01': ContractorHomepage,
  'CO-02': () => <Placeholder name="ONBOARDING" />,
  'CO-03': ContractorAdminPanelPage,
  'CO-04': () => <Placeholder name="MY SERVICES & PRICING" />,
  'CO-05': NewProjectBidsPage,
  'CO-06': () => <Placeholder name="MY JOBS" />,
  'CO-07': ContractorFinancialsPage,
  'CO-08': () => <Placeholder name="Contractor Map" />,

  // Supplier
  'S-01': SupplierHomepage,
  'S-02': () => <Placeholder name="MY PRICE LISTS" />,
  'S-03': () => <Placeholder name="PURCHASE ORDERS" />,
  'S-04': SupplierProfilePage,

  // Simulation
  'E-SIM-GUIDE': SimulationGuidePage,
  'E-TEST': ChatbotTestingPage,
  'SA-01': RoleManagementPage,
  'SA-02': () => <Placeholder name="Global Settings" />,
  'DEBUG': FirestoreDebugPage,
};
