
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
    'Stage 1: LEAD (Intake)',
    'Stage 2: ESTIMATE (Property Data)',
    'Stage 3: QUOTE (Pricing Options)',
    'Stage 4: SIGN & VERIFY (Agreement)',
    'Stage 5: SCHEDULE (Queue)',
    'Stage 6: PRE-INSTALLATION (Prep)',
    'Stage 7: INSTALL (In Progress)',
    'Stage 8: PUNCH LIST (Quality Control)',
    'Stage 9: INVOICING (Balance Due)',
    'Stage 10: COMPLETED (Paid)',
    'Stage 11: PAST CUSTOMER (Referral System)'
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
            { id: 'P-02c', name: 'Roof Upgrades', userType: 'Public', description: 'Service Detail', parentId: 'P-02' },
            { id: 'P-02e', name: 'Additional Trades', userType: 'Public', description: 'Service Detail', parentId: 'P-02' },
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
        label: 'CORE COMMAND',
        pages: [
            { id: 'E-01', name: 'Dashboard', userType: 'Employee' },
            { id: 'E-02', name: 'Customer Lookup', userType: 'Employee' },
            { id: 'E-02a', name: 'Customer Input', userType: 'Employee' },
            { id: 'E-03', name: 'AI Assistant', userType: 'Employee' },
            { id: 'E-04', name: 'Calendar', userType: 'Employee' },
        ]
    },
    {
        userType: 'Admin',
        label: 'FINANCIAL CONTROL',
        pages: [
            { id: 'E-16', name: 'Income Actionator', userType: 'Admin' },
            { id: 'E-17', name: 'Commission Compass', userType: 'Admin' },
        ]
    },
    {
        userType: 'Employee',
        label: 'PIPELINE STAGES',
        pages: [
            { id: 'E-05', name: 'Pipeline Overview', userType: 'Employee' },
            { id: 'E-26', name: 'Stage 1: LEAD (Intake)', userType: 'Employee', category: 'Stages' },
            { id: 'E-27', name: 'Stage 2: ESTIMATE (Property Data)', userType: 'Employee', category: 'Stages' },
            { id: 'E-28', name: 'Stage 3: QUOTE (Pricing Options)', userType: 'Employee', category: 'Stages' },
            { id: 'E-29', name: 'Stage 4: SIGN & VERIFY (Agreement)', userType: 'Employee', category: 'Stages' },
            { id: 'E-30', name: 'Stage 5: SCHEDULE (Queue)', userType: 'Employee', category: 'Stages' },
            { id: 'E-31', name: 'Stage 6: PRE-INSTALLATION (Prep)', userType: 'Employee', category: 'Stages' },
            { id: 'E-32', name: 'Stage 7: INSTALL (In Progress)', userType: 'Employee', category: 'Stages' },
            { id: 'E-33', name: 'Stage 8: PUNCH LIST (Quality Control)', userType: 'Employee', category: 'Stages' },
            { id: 'E-34', name: 'Stage 9: INVOICING (Balance Due)', userType: 'Employee', category: 'Stages' },
            { id: 'E-36', name: 'Stage 10: COMPLETED (Paid)', userType: 'Employee', category: 'Stages' },
            { id: 'E-37', name: 'Stage 11: PAST CUSTOMER (Referral System)', userType: 'Employee', category: 'Stages' },
        ]
    },
    {
        userType: 'Employee',
        label: 'RECORD PROFILES',
        pages: [
            { id: 'E-08', name: 'Account', userType: 'Employee' },
            { id: 'E-10', name: 'Contact', userType: 'Employee' },
            { id: 'E-12', name: 'Property', userType: 'Employee' },
            { id: 'E-15', name: 'Project', userType: 'Employee' },
            { id: 'E-25', name: 'Vendor', userType: 'Employee' },
        ]
    },
    {
        userType: 'Employee',
        label: 'TOOLS & SUPPORT',
        pages: [
            { id: 'E-06', name: 'Project Map', userType: 'Employee' },
            { id: 'E-14', name: 'Project Hub', userType: 'Employee' },
            { id: 'E-23', name: 'Quote Builder', userType: 'Employee' },
            { id: 'E-38', name: 'Weather Guide', userType: 'Employee' },
            { id: 'E-21', name: 'My Info', userType: 'Employee' },
            { id: 'E-22', name: 'Timeoff Request', userType: 'Employee' },
        ]
    },
    {
        userType: 'Admin',
        label: 'MANAGEMENT TOOLS',
        pages: [
            { id: 'E-18', name: 'Report Builder', userType: 'Admin' },
            { id: 'E-19', name: 'Line Item Catalog', userType: 'Admin' },
        ]
    },
    {
        userType: 'Admin',
        label: 'ADMINISTRATION',
        pages: [
            { id: 'A-01', name: 'Admin Dashboard', userType: 'Admin' },
            { id: 'A-02', name: 'User Management', userType: 'Admin' },
            { id: 'A-03', name: 'Estimate Pricing', userType: 'Admin' },
            { id: 'A-04', name: 'Backend & API', userType: 'Admin' },
            { id: 'A-05', name: 'Line Item Master', userType: 'Admin' },
        ]
    },
    {
        userType: 'Super Admin',
        label: 'SYSTEM CONTROL',
        pages: [
            { id: 'SA-01', name: 'Role Management', userType: 'Super Admin' },
            { id: 'SA-02', name: 'Global Settings', userType: 'Super Admin' },
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
