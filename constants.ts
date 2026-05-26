
import { PageGroup, ProjectStage } from './types';

// --- ESTIMATOR MATH CONSTANTS ---
export const METERS_TO_FEET = 3.28084;
export const SQ_METERS_TO_SQ_FEET = METERS_TO_FEET * METERS_TO_FEET; // 10.7639
export const SQ_FEET_PER_SQUARE = 100;

// Material Calculation Ratios
export const WASTE_FACTOR_PERCENT = 10; // Default 10% waste
export const BUNDLES_PER_SQUARE = 3; // Standard 3-tab shingles
export const STARTER_LINEAR_FEET_PER_BUNDLE = 100;
export const RIDGE_CAP_LINEAR_FEET_PER_BUNDLE = 33;
export const ICE_WATER_SQ_FEET_PER_ROLL = 65;
export const UNDERLAYMENT_SQ_FEET_PER_ROLL = 1000; // 10 squares
export const DRIP_EDGE_FEET_PER_PIECE = 10;

// --- CRM NAVIGATION CONSTANTS ---

export const PROJECT_STAGES: ProjectStage[] = [
    'Lead', 'Estimate', 'Quote', 'Sign & Verify', 'Schedule', 'Pre-Installation', 'Install', 'Punch List', 'Invoicing', 'Completed', 'Past Customer'
];

export const PAGE_GROUPS: PageGroup[] = [
    {
        userType: 'All',
        pages: [
            { id: 'P-01', name: 'About Us', userType: 'Public', description: 'Mission, Vision & Values' },
            { id: 'P-02', name: 'Our Services', userType: 'Public', description: 'Residential & Commercial Solutions' },
            { id: 'P-02a', name: 'Asphalt Roofing', userType: 'Public', description: 'Service Detail', parentId: 'P-02' },
            { id: 'P-02a-1', name: 'O.C. DURATION Package', userType: 'Public', description: 'Package Detail', parentId: 'P-02a' },
            { id: 'P-02a-2', name: 'O.C. FLEX Package', userType: 'Public', description: 'Package Detail', parentId: 'P-02a' },
            { id: 'P-02a-3', name: 'DESIGNER Package', userType: 'Public', description: 'Package Detail', parentId: 'P-02a' },
            { id: 'P-02a-4', name: 'PREMIUM DESIGNER Package', userType: 'Public', description: 'Package Detail', parentId: 'P-02a' },
            { id: 'P-02b', name: 'Membrane Roofing', userType: 'Public', description: 'Service Detail', parentId: 'P-02' },
            { id: 'P-02c', name: 'Gutter Defense Systems', userType: 'Public', description: 'Seamless Gutter Hub', parentId: 'P-02' },
            { id: 'P-02d', name: 'Ice Management', userType: 'Public', description: 'Heat Trace Systems', parentId: 'P-02' },
            { id: 'P-02e', name: 'Roof Components/Options', userType: 'Public', description: 'Technical Peripheral Hub', parentId: 'P-02' },
            { id: 'P-03', name: 'Our Process', userType: 'Public', description: 'The 10-Stage Journey' },
            { id: 'P-04', name: 'Financing', userType: 'Public', description: 'RPSP & Payment Options' },
            { id: 'P-05', name: 'Contact', userType: 'Public', description: 'Directory & Lead Gen' },
            { id: 'P-07', name: 'Password Reset', userType: 'Public', description: 'Secure Account Recovery' },
            { id: 'P-09', name: 'CONTRACTOR SIGNUP', userType: 'Public', description: 'Vendor Vetting & Onboarding' },
            { id: 'P-10', name: 'PUBLIC CAREERS', userType: 'Public', description: 'Recruitment & Brand Manifesto' },
            { id: 'P-11', name: 'JOB APPLICATION', userType: 'Public', description: 'Candidate Intake Wizard' },
            { id: 'P-12', name: 'ESTIMATE TOOL', userType: 'Public', description: 'Instant Pricing Engine' },
            { id: 'P-00', name: 'Home', userType: 'Public', description: 'RHIVE Main Gateway' },
            { id: 'P-00a', name: 'LIVE WEBSITE', userType: 'Public', description: 'Production Environment' },
        ]
    },
    {
        userType: 'Employee',
        pages: [
            { id: 'A-01', name: 'Admin Admin Dashboard', userType: 'Employee' },
            { id: 'A-02', name: 'Admin User Management', userType: 'Employee' },
            { id: 'A-03', name: 'Admin ESTIMATE PRICING', userType: 'Employee' },
            { id: 'A-04', name: 'Admin ESTIMATE BACK END + API', userType: 'Employee' },
            { id: 'A-05', name: 'Admin LINE ITEM CATALOG', userType: 'Employee' },
            { id: 'A-06', name: 'Admin LINE ITEM PROFILE', userType: 'Employee' },
        ]
    },
    {
        userType: 'Employee',
        pages: [
            { id: 'E-01', name: 'Employee Dashboard', userType: 'Employee' },
            { id: 'E-02', name: 'GLOBAL NAV - CUSTOMER LOOKUP', userType: 'Employee' },
            { id: 'E-02a', name: 'CUSTOMER INPUT PAGE', userType: 'Employee' },
            { id: 'E-03', name: 'AI ASSISTANT (GLOBAL)', userType: 'Employee' },
            { id: 'E-04', name: 'CALENDAR', userType: 'Employee' },
            { id: 'E-05', name: 'PIPELINE', userType: 'Employee' },
            { id: 'E-06', name: 'CUSTOMER PROJECT MAP', userType: 'Employee' },
            { id: 'E-07', name: 'MY ACCOUNTS (CRM)', userType: 'Employee' },
            { id: 'E-08', name: 'ACCOUNT PROFILE', userType: 'Employee' },
            { id: 'E-09', name: 'MY CONTACTS (CRM)', userType: 'Employee' },
            { id: 'E-10', name: 'CONTACT PROFILE', userType: 'Employee' },
            { id: 'E-11', name: 'MY PROPERTIES (CRM)', userType: 'Employee' },
            { id: 'E-12', name: 'PROPERTY PROFILE', userType: 'Employee' },
            { id: 'E-14', name: 'PROJECT HUB', userType: 'Employee' },
            { id: 'E-15', name: 'PROJECT PROFILE', userType: 'Employee' },
            { id: 'E-16', name: 'INCOME ACTIONATOR', userType: 'Employee' },
            { id: 'E-17', name: 'COMMISSION COMPASS', userType: 'Employee' },
            { id: 'E-18', name: 'REPORT BUILDER', userType: 'Employee' },
            { id: 'E-19', name: 'LINE ITEM CATALOG', userType: 'Employee' },
            { id: 'E-20', name: 'LINE ITEM PROFILE', userType: 'Employee' },
            { id: 'E-21', name: 'MY INFO', userType: 'Employee' },
            { id: 'E-22', name: 'EMPLOYEE TIMEOFF', userType: 'Employee' },
            { id: 'E-23', name: 'QUOTE BUILDER TOOL', userType: 'Employee' },
            { id: 'E-24', name: 'CONTACTS/VENDORS', userType: 'Employee' },
            { id: 'E-25', name: 'CONTACT/VENDOR PROFILES', userType: 'Employee' },
            { id: 'E-26', name: 'LEAD STAGE PAGE', userType: 'Employee' },
            { id: 'E-27', name: 'ESTIMATE STAGE PAGE', userType: 'Employee' },
            { id: 'E-28', name: 'QUOTE STAGE PAGE', userType: 'Employee' },
            { id: 'E-29', name: 'SIGN & VERIFY PAGE', userType: 'Employee' },
            { id: 'E-30', name: 'SCHEDULE STAGE PAGE', userType: 'Employee' },
            { id: 'E-31', name: 'PRE INSTALLATION STAGE PAGE', userType: 'Employee' },
            { id: 'E-32', name: 'INSTALL STAGE PAGE', userType: 'Employee' },
            { id: 'E-33', name: 'PUNCH LIST STAGE PAGE', userType: 'Employee' },
            { id: 'E-34', name: 'INVOICING STAGE PAGE', userType: 'Employee' },
            { id: 'E-35', name: 'PAYMENTS modular PAGE', userType: 'Employee' },
            { id: 'E-36', name: 'COMPLETED STAGE PAGE', userType: 'Employee' },
            { id: 'E-37', name: 'PAST CUSTOMER STAGE PAGE', userType: 'Employee' },
            { id: 'E-38', name: 'WEATHER GUIDE WIDGET', userType: 'Employee' },
            { id: 'E-39', name: 'BRADING', userType: 'Employee' },
        ]
    },
    {
        userType: 'Customer',
        pages: [
            { id: 'C-01', name: 'Customer Homepage', userType: 'Customer', description: 'Welcome' },
            { id: 'C-02', name: 'MY PROJECTS', userType: 'Customer', description: 'Active Project Status' },
            { id: 'C-03', name: 'CUSTOMER PROJECT PROFILE', userType: 'Customer', description: 'Job Specific Details' },
            { id: 'C-04', name: 'MY PROFILE', userType: 'Customer', description: 'Personal Settings' },
            { id: 'P-12', name: 'ESTIMATE TOOL', userType: 'Customer', description: 'Public Calculator' },
        ]
    },
    {
        userType: 'Contractor',
        pages: [
            { id: 'CO-01', name: 'Contractor Homepage', userType: 'Contractor', description: 'Active Assignments' },
            { id: 'CO-02', name: 'ONBOARDING', userType: 'Contractor', description: 'Vetting Process' },
            { id: 'CO-03', name: 'MY PROFILE & DOCS', userType: 'Contractor', description: 'Compliance & Safety' },
            { id: 'CO-04', name: 'MY SERVICES & PRICING', userType: 'Contractor', description: 'Rate Cards' },
            { id: 'CO-05', name: 'AVAILABLE JOBS', userType: 'Contractor', description: 'Bidding Opportunities' },
            { id: 'CO-06', name: 'MY JOBS', userType: 'Contractor', description: 'Current Active Projects' },
            { id: 'CO-07', name: 'MY PAYMENTS', userType: 'Contractor', description: 'Financial Status' },
            { id: 'CO-08', name: 'Contractor Map', userType: 'Contractor', description: 'Geographical Pipeline' },
        ]
    },
    {
        userType: 'Supplier',
        pages: [
            { id: 'S-01', name: 'Supplier Homepage', userType: 'Supplier', description: 'Orders & Bids' },
            { id: 'S-02', name: 'MY PRICE LISTS', userType: 'Supplier', description: 'Pricing Management' },
            { id: 'S-03', name: 'PURCHASE ORDERS', userType: 'Supplier', description: 'Project Fulfillment' },
            { id: 'S-04', name: 'MY COMPANY PROFILE', userType: 'Supplier', description: 'Business & Legal Data' },
        ]
    }
];
