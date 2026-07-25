
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CircuitryBackground } from '../components/CircuitryBackground';
import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ActivityDetail {
  tag: string;
  title: string;
  desc: string;
  meta: { label: string; value: string }[];
}

interface Activity {
  icon: string;
  title: string;
  detail: string;
  badge?: { label: string; color: 'pink' | 'gold' | 'cyan' | 'indigo' | 'green' };
  variant?: 'primary' | 'secondary' | 'support' | 'system' | 'supply';
  detail_modal: ActivityDetail;
}

interface BpmNote {
  id: string;
  title: string;
  body: string;
  createdAt: Date | null;
  author?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const STAGES = [
  { id: 'S1', name: 'LEAD', sub: 'Intake' },
  { id: 'S2', name: 'ESTIMATE', sub: 'Property Data' },
  { id: 'S3', name: 'QUOTE', sub: 'Pricing Options' },
  { id: 'S4', name: 'SIGN', sub: 'Agreement' },
  { id: 'S5', name: 'SCHEDULE', sub: 'Queue' },
  { id: 'S6', name: 'PRE-INSTALL', sub: 'Prep' },
  { id: 'S7', name: 'INSTALL', sub: 'In Progress' },
  { id: 'S8', name: 'PUNCH LIST', sub: 'Quality Control' },
  { id: 'S9', name: 'INVOICING', sub: 'Balance Due' },
  { id: 'S10', name: 'COMPLETED', sub: 'Paid' },
  { id: 'S11', name: 'PAST CUSTOMER', sub: 'Referral' },
];

const ROLES: { icon: string; name: string; desc: string; color: string }[] = [
  { icon: '👤', name: 'Customer', desc: 'Property owner or commercial contact', color: '#60a5fa' },
  { icon: '💼', name: 'Sales Rep / Employee', desc: 'RHIVE internal staff', color: '#ec028b' },
  { icon: '⚙️', name: 'Admin', desc: 'Financial control & oversight', color: '#e2ab49' },
  { icon: '🦺', name: 'Contractor', desc: 'Field installation crew', color: '#818cf8' },
  { icon: '🏭', name: 'Supplier', desc: 'Material vendors & distributors', color: '#4ade80' },
  { icon: '🤖', name: 'System', desc: 'Firebase automation', color: '#22d3ee' },
];

// Null means empty cell (dash)
type CellData = Activity | null;

const SWIMLANES: CellData[][] = [
  // ── Customer ────────────────────────────────────────────────────────────────
  [
    { icon: '📞', title: 'Initiates Contact', detail: 'Phone · web form · estimate tool · referral', badge: { label: 'Entry Point', color: 'pink' }, variant: 'primary', detail_modal: { tag: 'S1 · Customer', title: 'Initiates Contact', desc: 'Customer makes first contact via phone, website form, estimate tool, or referral. Provides property address, contact details, and intent (ballpark vs firm quote). May submit damage photos.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Channel', value: 'Phone / Web / Referral' }, { label: 'Output', value: 'First Contact Logged' }] } },
    { icon: '🏠', title: 'Property Access', detail: 'Allows aerial or in-person roof survey', variant: undefined, detail_modal: { tag: 'S2 · Customer', title: 'Provides Property Access', desc: 'Customer grants access to property for aerial data collection or in-person inspection. Answers questions about roof age, existing layers, and damage extent.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Action', value: 'Property Access' }, { label: 'Output', value: 'Survey Data Captured' }] } },
    { icon: '📋', title: 'Reviews Quote', detail: 'Selects package · reviews financing options', badge: { label: 'Decision Point', color: 'gold' }, variant: undefined, detail_modal: { tag: 'S3 · Customer', title: 'Reviews Quote', desc: 'Customer reviews pricing presentation with package options (Duration / Flex / Designer / Premium Designer). Evaluates financing options if needed. Requests revisions or approves.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Decision', value: 'Select Package' }, { label: 'Options', value: 'Duration / Flex / Designer / Premium' }, { label: 'Output', value: 'Approval or Revision' }] } },
    { icon: '✍️', title: 'Signs Agreement', detail: 'E-signature · insurance carrier verification', badge: { label: 'Key Milestone', color: 'pink' }, variant: 'primary', detail_modal: { tag: 'S4 · Customer', title: 'Signs Agreement', desc: 'Customer receives digital contract. Reviews scope of work, warranty terms, and payment schedule. Signs electronically. Provides insurance carrier info if applicable.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Action', value: 'E-Signature' }, { label: 'Legal', value: 'Agreement + Warranty Terms' }, { label: 'Output', value: 'Signed Contract' }] } },
    { icon: '📅', title: 'Confirms Date', detail: 'SMS/email confirmation · pre-install checklist', variant: undefined, detail_modal: { tag: 'S5 · Customer', title: 'Confirms Install Date', desc: 'Customer receives scheduling notification via SMS/email. Confirms install date and time window. Reviews pre-install checklist (move vehicles, secure pets, trim branches).', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Channel', value: 'SMS / Email / Portal' }, { label: 'Output', value: 'Date Confirmed' }] } },
    { icon: '🔔', title: 'Property Ready', detail: 'Material drop-off alert · install day reminder', variant: undefined, detail_modal: { tag: 'S6 · Customer', title: 'Property Ready', desc: 'Customer receives material delivery notification and install day reminder. Ensures property is ready — vehicles moved, pets secured, access points clear.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Action', value: 'Property Prep' }, { label: 'Output', value: 'Ready-State Confirmed' }] } },
    { icon: '📡', title: 'Tracks Progress', detail: 'Live updates via Customer Portal C-02/C-03', variant: undefined, detail_modal: { tag: 'S7 · Customer', title: 'Tracks Progress', desc: 'Customer monitors real-time project status via the Customer Portal (C-02 My Projects / C-03 Project Profile). Views crew on-site status and estimated completion.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Platform', value: 'Customer Portal C-02/C-03' }, { label: 'Output', value: 'Live Progress Visibility' }] } },
    { icon: '🔎', title: 'Final Walkthrough', detail: 'Reviews punch list · signs off on quality', badge: { label: 'Approval', color: 'gold' }, variant: undefined, detail_modal: { tag: 'S8 · Customer', title: 'Final Walkthrough', desc: 'Customer performs walkthrough with project manager. Reviews punch list items. Signs off on completed work or flags deficiencies requiring remediation before payment release.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Action', value: 'Quality Walkthrough' }, { label: 'Output', value: 'Sign-Off or Remediation Request' }] } },
    { icon: '💳', title: 'Pays Invoice', detail: 'Card · ACH · check · financing via portal', badge: { label: 'Revenue', color: 'pink' }, variant: 'primary', detail_modal: { tag: 'S9 · Customer', title: 'Pays Invoice', desc: 'Customer receives final itemized invoice via email or portal. Submits payment via credit card, ACH, check, or financing plan. Receives payment confirmation and receipt.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Methods', value: 'Card / ACH / Check / Financing' }, { label: 'Output', value: 'Payment Confirmed' }] } },
    { icon: '🏆', title: 'Receives Warranty', detail: 'Warranty docs · photos · portal record', variant: undefined, detail_modal: { tag: 'S10 · Customer', title: 'Receives Warranty', desc: 'Customer receives warranty documentation, final installation photos, and project summary. Full project record accessible in customer portal.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Output', value: 'Warranty Docs + Final Photos + Project Record' }] } },
    { icon: '🌟', title: 'Referral Program', detail: 'Seasonal reminders · referral incentives', badge: { label: 'Lifecycle', color: 'gold' }, variant: 'secondary', detail_modal: { tag: 'S11 · Customer', title: 'Referral Program', desc: 'Customer enrolled into RHIVE past-customer referral program. Receives seasonal maintenance reminders, referral incentive links, and re-engagement campaigns at 6-month and 1-year intervals.', meta: [{ label: 'Role', value: 'Customer' }, { label: 'Program', value: 'RHIVE Referral System' }, { label: 'Output', value: 'Referrals + Repeat Business' }] } },
  ],
  // ── Sales Rep / Employee ─────────────────────────────────────────────────────
  [
    { icon: '🖥️', title: 'Intake & Triage', detail: 'E-02a · dupe check · notes · auto-stage', badge: { label: 'Core Action', color: 'pink' }, variant: 'primary', detail_modal: { tag: 'S1 · Sales Rep', title: 'Intake & Triage', desc: 'Opens New Project form (E-02a). Searches by phone or address for existing records. Records DISC personality, contact info, rough notes. System auto-triages to Estimate or Quote bucket.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'E-02a New Project' }, { label: 'Output', value: 'Project Created + Auto-Triaged' }] } },
    { icon: '📐', title: 'Roof Survey', detail: 'Aerial + field measurement → property profile E-12', badge: { label: 'Data Capture', color: 'pink' }, variant: 'primary', detail_modal: { tag: 'S2 · Sales Rep', title: 'Roof Survey', desc: 'Conducts aerial measurement via Google Solar API or in-person inspection. Captures square footage, pitch, facets, layers, and roof features (chimneys, skylights, swamp coolers). Enters data into property profile E-12.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'E-12 Property Profile' }, { label: 'API', value: 'Google Solar' }, { label: 'Output', value: 'Roof Report + Measurement Data' }] } },
    { icon: '🛠️', title: 'Build Quote', detail: 'E-23 Quote Builder · pricing · delivery', badge: { label: 'Sales Tool', color: 'pink' }, variant: 'primary', detail_modal: { tag: 'S3 · Sales Rep', title: 'Build & Send Quote', desc: 'Builds quote using Quote Builder (E-23). Selects material package, add-ons (gutters, heat trace), and applies pitch-based labor rates. Calculates waste factor and total squares. Sends quote to customer.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'E-23 Quote Builder' }, { label: 'Output', value: 'Priced Quote Delivered' }] } },
    { icon: '📝', title: 'Send Contract', detail: 'Digital agreement · insurance verification', variant: 'primary', detail_modal: { tag: 'S4 · Sales Rep', title: 'Send Contract', desc: 'Sends digital contract for e-signature. Records insurance claim data and any supplemental info. Updates pipeline stage after signature confirmation.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'Sign & Verify E-29' }, { label: 'Output', value: 'Executed Contract' }] } },
    { icon: '🗓️', title: 'Schedule Install', detail: 'Production calendar · Google Calendar sync', variant: 'primary', detail_modal: { tag: 'S5 · Sales Rep', title: 'Schedule Install', desc: 'Assigns job to production calendar. Coordinates crew availability and material delivery windows. Checks permit requirements. Books install date and syncs to Google Calendar. Customer notification sent.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'Schedule E-30 + Google Calendar' }, { label: 'Output', value: 'Confirmed Install Date' }] } },
    { icon: '✅', title: 'Pre-Install Check', detail: 'Material confirm · permit · final customer call', variant: 'secondary', detail_modal: { tag: 'S6 · Sales Rep', title: 'Pre-Install Coordination', desc: 'Verifies material order status with supplier. Confirms permit pull. Coordinates crew and equipment. Final pre-install call with customer to confirm readiness.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Action', value: 'Pre-Install Coordination' }, { label: 'Output', value: 'Go/No-Go Confirmation' }] } },
    { icon: '📊', title: 'Monitor Install', detail: 'Production Board E-14 · live status mgmt', variant: undefined, detail_modal: { tag: 'S7 · Sales Rep', title: 'Monitor Installation', desc: 'Monitors install via Production Board (E-14). Handles customer questions and escalations from contractor crew. Updates project status in real-time throughout the day.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'Production Board E-14' }, { label: 'Output', value: 'Active Progress Management' }] } },
    { icon: '🔧', title: 'QC Walkthrough', detail: 'Punch List E-33 · defect log · remediation', badge: { label: 'Quality Gate', color: 'gold' }, variant: 'secondary', detail_modal: { tag: 'S8 · Sales Rep', title: 'QC Walkthrough', desc: 'Conducts post-install quality walkthrough. Records punch list items in system (E-33). Assigns remediation tasks to contractor if needed. Signs off when all deficiencies are resolved.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'Punch List E-33' }, { label: 'Output', value: 'Quality Approval + Sign-Off' }] } },
    { icon: '🧾', title: 'Generate Invoice', detail: 'Invoicing E-34 · itemized billing · collection', variant: 'secondary', detail_modal: { tag: 'S9 · Sales Rep', title: 'Generate Invoice', desc: 'Generates final invoice with itemized costs from approved quote. Sends to customer via email/portal. Follows up on payment collection. Records received payment in system.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'Invoicing E-34' }, { label: 'Output', value: 'Invoice Sent + Payment Tracked' }] } },
    { icon: '🎯', title: 'Project Closeout', detail: 'Close record · photos · warranty · commission', variant: undefined, detail_modal: { tag: 'S10 · Sales Rep', title: 'Project Closeout', desc: 'Marks project Completed on pipeline. Uploads final installation photos. Delivers warranty docs. Sends customer satisfaction survey. Updates commission records for payout.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Action', value: 'Project Closeout' }, { label: 'Output', value: 'Closed Record + Commission Log' }] } },
    { icon: '🔄', title: 'Referral Tracking', detail: 'E-37 past customer · outreach · conversion', variant: undefined, detail_modal: { tag: 'S11 · Sales Rep', title: 'Referral Tracking', desc: 'Monitors past customer outreach results via E-37. Logs referral activity and tracks conversion to new projects. Manages re-engagement schedule for seasonal campaigns.', meta: [{ label: 'Role', value: 'Employee' }, { label: 'Tool', value: 'Past Customer E-37' }, { label: 'Output', value: 'Referral Pipeline Management' }] } },
  ],
  // ── Admin ────────────────────────────────────────────────────────────────────
  [
    null,
    { icon: '💡', title: 'Pricing Config', detail: 'A-03 pricing rules · pitch tables · margins', badge: { label: 'Config', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S2 · Admin', title: 'Pricing Configuration', desc: 'Admin maintains pitch-based cost tables in Estimate Pricing panel (A-03). Sets material overhead rates and profit margins that power the Quote Builder engine for all sales reps.', meta: [{ label: 'Role', value: 'Admin' }, { label: 'Tool', value: 'A-03 Estimate Pricing' }, { label: 'Output', value: 'Active Pricing Rules Engine' }] } },
    null, null, null,
    { icon: '📦', title: 'PO Approval', detail: 'Material PO review · budget validation', variant: 'secondary', detail_modal: { tag: 'S6 · Admin', title: 'PO Approval', desc: 'Reviews and approves material purchase orders submitted by sales reps. Manages per-job material budget. Cross-references supplier price lists from S-02 to validate costs.', meta: [{ label: 'Role', value: 'Admin' }, { label: 'Tool', value: 'Income Actionator E-16' }, { label: 'Output', value: 'Approved Purchase Order' }] } },
    null, null,
    { icon: '💰', title: 'Revenue Control', detail: 'E-16 Income Actionator · reconciliation', badge: { label: 'Financial', color: 'gold' }, variant: 'secondary', detail_modal: { tag: 'S9 · Admin', title: 'Revenue Control', desc: 'Monitors payment collection via Income Actionator (E-16). Reconciles payments against invoices. Tracks outstanding balances. Manages commission calculations and payouts to sales reps.', meta: [{ label: 'Role', value: 'Admin' }, { label: 'Tool', value: 'Income Actionator E-16' }, { label: 'Output', value: 'Revenue Reconciliation + Commissions' }] } },
    { icon: '📈', title: 'KPI Reporting', detail: 'E-18 Report Builder · profitability analytics', badge: { label: 'Analytics', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S10 · Admin', title: 'KPI Reporting', desc: 'Runs performance reports via Report Builder (E-18). Analyzes revenue per rep, job profitability, material costs vs estimates, and closeout rates. Closes accounting period.', meta: [{ label: 'Role', value: 'Admin' }, { label: 'Tool', value: 'Report Builder E-18' }, { label: 'Output', value: 'KPI Reports + Period Close' }] } },
    null,
  ],
  // ── Contractor ───────────────────────────────────────────────────────────────
  [
    { icon: '📋', title: 'Vetting & Signup', detail: 'P-09 · license · insurance · compliance docs', badge: { label: 'Onboarding', color: 'indigo' }, variant: 'support', detail_modal: { tag: 'S1 · Contractor', title: 'Vetting & Onboarding', desc: 'New contractors apply via P-09 Contractor Signup. Vetting includes license verification, insurance validation, and compliance document upload. Onboarded to contractor portal after approval.', meta: [{ label: 'Role', value: 'Contractor' }, { label: 'Tool', value: 'P-09 Contractor Signup' }, { label: 'Output', value: 'Vetted + Onboarded to Portal' }] } },
    null,
    { icon: '💼', title: 'Submit Bid', detail: 'CO-05 Available Jobs · rate card submission', variant: 'support', detail_modal: { tag: 'S3 · Contractor', title: 'Submit Bid', desc: 'Contractor reviews available jobs via CO-05 and submits rate card or bid for specific projects matching their service area and capacity. Admin reviews and assigns.', meta: [{ label: 'Role', value: 'Contractor' }, { label: 'Tool', value: 'CO-05 Available Jobs' }, { label: 'Output', value: 'Bid Submitted for Review' }] } },
    null,
    { icon: '🗺️', title: 'Accept Assignment', detail: 'CO-06 My Jobs + CO-08 Map · crew confirm', variant: 'support', detail_modal: { tag: 'S5 · Contractor', title: 'Accept Assignment', desc: 'Receives job assignment notification. Views job location on contractor map (CO-08). Confirms availability for scheduled install date. Coordinates subcontractor crew if needed.', meta: [{ label: 'Role', value: 'Contractor' }, { label: 'Tool', value: 'CO-06 My Jobs / CO-08 Map' }, { label: 'Output', value: 'Assignment Accepted + Crew Confirmed' }] } },
    { icon: '📍', title: 'Site Preparation', detail: 'Scope review · staging · safety protocols', variant: 'support', detail_modal: { tag: 'S6 · Contractor', title: 'Site Preparation', desc: 'Reviews full scope of work and specifications. Confirms material staging plan and dumpster placement. Reviews safety protocols. Coordinates delivery timing with supplier.', meta: [{ label: 'Role', value: 'Contractor' }, { label: 'Action', value: 'Pre-Install Prep' }, { label: 'Output', value: 'Scope Review + Site Plan Ready' }] } },
    { icon: '🔨', title: 'Execute Install', detail: 'Full installation · progress photos · daily log', badge: { label: 'Core Work', color: 'indigo' }, variant: 'support', detail_modal: { tag: 'S7 · Contractor', title: 'Execute Installation', desc: 'Executes full roof installation per approved scope of work. Records daily progress and uploads photos via contractor portal. Manages crew on-site. Reports completion or issues to RHIVE PM.', meta: [{ label: 'Role', value: 'Contractor' }, { label: 'Tool', value: 'CO-06 My Jobs' }, { label: 'Output', value: 'Installation Complete' }] } },
    { icon: '🧹', title: 'Cleanup & Fix', detail: 'Punch list fixes · debris removal · sign-off', variant: 'support', detail_modal: { tag: 'S8 · Contractor', title: 'Site Cleanup & Punch List', desc: 'Completes punch list deficiency remediation per RHIVE PM feedback. Performs full site cleanup — removes debris, nails (magnet sweep), and dumpster. Files completion report.', meta: [{ label: 'Role', value: 'Contractor' }, { label: 'Action', value: 'Punch List Remediation + Cleanup' }, { label: 'Output', value: 'Site Cleared + Sign-Off' }] } },
    null,
    { icon: '💵', title: 'Receives Payment', detail: 'CO-07 My Payments · contractor payout', variant: 'support', detail_modal: { tag: 'S10 · Contractor', title: 'Receives Payment', desc: 'Receives contractor payment from RHIVE per agreed rate. Views payment status and history in CO-07 My Payments. Accesses completed project record for future reference.', meta: [{ label: 'Role', value: 'Contractor' }, { label: 'Tool', value: 'CO-07 My Payments' }, { label: 'Output', value: 'Contractor Payout Released' }] } },
    null,
  ],
  // ── Supplier ─────────────────────────────────────────────────────────────────
  [
    null, null,
    { icon: '💲', title: 'Price Lists', detail: 'S-02 real-time pricing feed for quotes', badge: { label: 'Pricing Feed', color: 'green' }, variant: 'supply', detail_modal: { tag: 'S3 · Supplier', title: 'Price List Management', desc: 'Supplier maintains real-time material price lists via S-02 My Price Lists portal. RHIVE sales accesses supplier pricing during quote building to ensure cost accuracy.', meta: [{ label: 'Role', value: 'Supplier' }, { label: 'Tool', value: 'S-02 My Price Lists' }, { label: 'Output', value: 'Real-Time Pricing Feed' }] } },
    null, null,
    { icon: '🚚', title: 'Fulfill PO', detail: 'S-03 PO processing · site delivery', badge: { label: 'Fulfillment', color: 'green' }, variant: 'supply', detail_modal: { tag: 'S6 · Supplier', title: 'Fulfill Purchase Order', desc: 'Receives confirmed purchase order from RHIVE. Processes order, confirms material availability, and schedules delivery to job site per installation timeline. Updates S-03 order status.', meta: [{ label: 'Role', value: 'Supplier' }, { label: 'Tool', value: 'S-03 Purchase Orders' }, { label: 'Output', value: 'Materials Delivered to Site' }] } },
    null, null, null, null, null,
  ],
  // ── System / AI ──────────────────────────────────────────────────────────────
  [
    { icon: '⚡', title: 'Geocode + Triage', detail: 'Address validate · dupe check · notes · auto-stage', badge: { label: 'Automated', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S1 · System', title: 'Geocode, Dedupe & Triage', desc: 'On intake: validates address via Google Geocoding API (IndexedDB cached). Checks Firestore for duplicate records by phone and address. Auto-formats phone numbers. Auto-assigns pipeline stage by triage rules.', meta: [{ label: 'APIs', value: 'Google Geocoding' }, { label: 'DB', value: 'Firestore' }, { label: 'Cache', value: 'IndexedDB' }, { label: 'Output', value: 'Clean Record + Auto-Stage' }] } },
    { icon: '🛰️', title: 'Aerial Data Pull', detail: 'Google Solar API → facets · pitch · sq auto-calc', badge: { label: 'API Call', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S2 · System', title: 'Aerial Data Collection', desc: 'Google Solar API fetches roof facet data for the property address. Calculates pitch degrees, facet area in m², and total roof square footage. Auto-converts to roofing squares and feeds the estimate engine.', meta: [{ label: 'API', value: 'Google Solar API' }, { label: 'Output', value: 'Roof Report Auto-Generated' }] } },
    { icon: '🧮', title: 'Pricing Engine', detail: 'Bundles · rolls · waste · pitch rates · totals', badge: { label: 'Calculation', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S3 · System', title: 'Pricing Calculation Engine', desc: 'Quote Builder applies pitch-based labor rates, material overhead, and profit margins from Admin pricing config. Auto-calculates shingle bundles, underlayment rolls, drip edge, waste factor, and total squares. Produces itemized cost breakdown.', meta: [{ label: 'Logic', value: 'Pricing Engine' }, { label: 'Output', value: 'Auto-Calculated Quote Breakdown' }] } },
    { icon: '📨', title: 'Contract Delivery', detail: 'JustCall SMS/email · Firestore stage advance', badge: { label: 'Automated', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S4 · System', title: 'Contract Delivery & Stage Advance', desc: 'Digital contract sent via email. JustCall integration logs communication event. Firestore document updated with signed status, timestamp, and insurance data. Pipeline stage auto-advances on confirmation.', meta: [{ label: 'Integrations', value: 'JustCall + Firestore' }, { label: 'Output', value: 'Signed Record + Stage Advanced' }] } },
    { icon: '📡', title: 'Calendar Sync', detail: 'Google Calendar API · JustCall SMS notify', badge: { label: 'Sync', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S5 · System', title: 'Calendar Sync & Notifications', desc: 'Google Calendar API syncs scheduled install date to employee and contractor calendars. JustCall triggers automated SMS confirmation to customer. Production Board (E-14) updates with new scheduled entry.', meta: [{ label: 'Integrations', value: 'Google Calendar + JustCall' }, { label: 'Output', value: 'Calendars Synced + SMS Sent' }] } },
    null, null, null,
    { icon: '⚙️', title: 'Auto-Invoice', detail: 'Invoice generate · payment gateway · commission calc', badge: { label: 'Automated', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S9 · System', title: 'Auto Invoice & Commission', desc: 'Invoice auto-generated from approved project quote and line items. Payment gateway processes transaction. Firestore payment status updated. Commission calculation triggered automatically for assigned sales rep.', meta: [{ label: 'Logic', value: 'Invoice + Commission Engine' }, { label: 'Output', value: 'Payment Confirmed + Commission Queued' }] } },
    { icon: '🔒', title: 'Auto-Archive', detail: 'Stage close · warranty gen · KPI update', badge: { label: 'Automated', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S10 · System', title: 'Stage Completion & Archival', desc: 'System marks project Completed in Firestore. Warranty document auto-generated. Project archived and moved to Past Customer segment. Admin KPI dashboard counters updated.', meta: [{ label: 'Action', value: 'Stage Close + Archive' }, { label: 'Output', value: 'Closed Record + KPI Update' }] } },
    { icon: '🔁', title: 'Re-Engagement', detail: 'Scheduled campaigns · referral link tracking', badge: { label: 'Automation', color: 'cyan' }, variant: 'system', detail_modal: { tag: 'S11 · System', title: 'Re-Engagement Automation', desc: 'Automated re-engagement campaigns triggered at 6-month and 1-year intervals post-completion. Unique referral tracking links generated per customer. System monitors referral conversion events and logs to CRM.', meta: [{ label: 'Logic', value: 'Re-engagement + Referral Tracking' }, { label: 'Output', value: 'Campaign Triggers + Referral Conversion Logs' }] } },
  ],
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  pink:   'bg-[rgba(236,2,139,0.2)] text-[#ec028b] border border-[rgba(236,2,139,0.4)]',
  gold:   'bg-[rgba(226,171,73,0.2)] text-[#e2ab49] border border-[rgba(226,171,73,0.4)]',
  cyan:   'bg-[rgba(34,211,238,0.15)] text-[#22d3ee] border border-[rgba(34,211,238,0.3)]',
  indigo: 'bg-[rgba(99,102,241,0.2)] text-[#818cf8] border border-[rgba(99,102,241,0.4)]',
  green:  'bg-[rgba(34,197,94,0.15)] text-[#4ade80] border border-[rgba(34,197,94,0.3)]',
};

const CARD_STYLES: Record<string, string> = {
  primary:   'border-[rgba(236,2,139,0.5)] bg-[rgba(236,2,139,0.06)]',
  secondary: 'border-[rgba(226,171,73,0.4)] bg-[rgba(226,171,73,0.05)]',
  support:   'border-[rgba(99,102,241,0.4)] bg-[rgba(99,102,241,0.05)]',
  system:    'border-[rgba(34,211,238,0.35)] bg-[rgba(34,211,238,0.04)]',
  supply:    'border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.04)]',
  default:   'border-[rgba(55,65,81,0.8)] bg-[rgba(10,10,20,0.85)]',
};

const ActivityCard: React.FC<{ cell: Activity; onOpen: (d: ActivityDetail) => void }> = ({ cell, onOpen }) => {
  const cardStyle = CARD_STYLES[cell.variant ?? 'default'];
  return (
    <button
      id={`bpm-card-${cell.title.replace(/\s+/g, '-').toLowerCase()}`}
      onClick={() => onOpen(cell.detail_modal)}
      className={`relative w-full p-2.5 border text-center cursor-pointer transition-all duration-200
        hover:-translate-y-0.5 hover:border-[#ec028b] hover:shadow-[0_0_16px_rgba(236,2,139,0.4)]
        focus:outline-none focus:ring-1 focus:ring-[#ec028b]
        ${cardStyle}`}
      style={{ clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}
      aria-label={`${cell.title} — click for details`}
    >
      <span className="text-base block mb-1 leading-none">{cell.icon}</span>
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.3px] text-white leading-tight mb-1">
        {cell.title}
      </div>
      <div className="text-[8px] text-[#9ca3af] leading-snug">{cell.detail}</div>
      {cell.badge && (
        <span className={`inline-flex items-center text-[7px] font-bold px-1.5 py-0.5 rounded-full mt-1 uppercase tracking-[0.5px] ${BADGE_STYLES[cell.badge.color]}`}>
          {cell.badge.label}
        </span>
      )}
    </button>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const DetailModal: React.FC<{ detail: ActivityDetail | null; onClose: () => void }> = ({ detail, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!detail) return null;

  return (
    <div
      id="bpm-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bpm-modal-title"
    >
      <div
        className="bg-[#08090f] border border-[#ec028b] shadow-[0_0_40px_rgba(236,2,139,0.4),0_0_80px_rgba(236,2,139,0.1)] max-w-lg w-[90%] p-7 relative"
        style={{ clipPath: 'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)' }}
      >
        <button
          id="bpm-modal-close"
          onClick={onClose}
          aria-label="Close detail panel"
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[13px] text-[#ec028b] border border-[rgba(236,2,139,0.3)] bg-[rgba(236,2,139,0.1)] hover:bg-[#ec028b] hover:text-white transition-all duration-200 cursor-pointer"
        >
          ✕
        </button>

        <p className="text-[9px] font-bold tracking-[2px] text-[#ec028b] uppercase mb-1.5 opacity-80 font-[Orbitron,sans-serif]">
          {detail.tag}
        </p>
        <h2 id="bpm-modal-title" className="text-lg font-bold text-white mb-3 leading-tight">
          {detail.title}
        </h2>
        <p className="text-[12.5px] text-[#9ca3af] leading-relaxed mb-4">{detail.desc}</p>

        <div className="flex flex-wrap gap-2">
          {detail.meta.map((m, i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5 px-3 py-2 bg-white/[0.03] border border-[rgba(55,65,81,0.8)] rounded flex-1 min-w-[90px]"
            >
              <span className="text-[8px] text-[#6b7280] uppercase tracking-[1px] font-semibold">{m.label}</span>
              <span className="text-[11px] font-semibold text-white">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Notes Modal ──────────────────────────────────────────────────────────────

const NotesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [notes, setNotes] = useState<BpmNote[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Real-time listener for notes
  useEffect(() => {
    const q = query(collection(db, 'bpm_notes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const fetched: BpmNote[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? '',
          body: data.body ?? '',
          createdAt: data.createdAt?.toDate?.() ?? null,
          author: data.author ?? '',
        };
      });
      setNotes(fetched);
    });
    return () => unsub();
  }, []);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = async () => {
    if (!title.trim()) { setError('Please enter a note title.'); return; }
    if (!body.trim()) { setError('Please enter note content.'); return; }
    setError('');
    setSaving(true);
    try {
      await addDoc(collection(db, 'bpm_notes'), {
        title: title.trim(),
        body: body.trim(),
        createdAt: serverTimestamp(),
        author: 'RHIVE Team',
      });
      setTitle('');
      setBody('');
    } catch (err) {
      setError('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'bpm_notes', id));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div
      id="bpm-notes-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bpm-notes-modal-title"
    >
      <div
        className="bg-[#08090f] border border-[rgba(236,2,139,0.6)] shadow-[0_0_50px_rgba(236,2,139,0.35),0_0_100px_rgba(236,2,139,0.08)] w-[90%] max-w-2xl relative flex flex-col"
        style={{
          clipPath: 'polygon(22px 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%,0 22px)',
          maxHeight: '88vh',
        }}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-[rgba(55,65,81,0.6)] flex-shrink-0">
          <div>
            <p className="font-[Orbitron,sans-serif] text-[9px] font-bold tracking-[3px] text-[#ec028b] uppercase mb-1 opacity-80">
              ⬡ BPM · NOTES
            </p>
            <h2
              id="bpm-notes-modal-title"
              className="text-xl font-bold text-white leading-tight font-[Orbitron,sans-serif]"
            >
              Process Notes
            </h2>
          </div>
          <button
            id="bpm-notes-modal-close"
            onClick={onClose}
            aria-label="Close notes panel"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] text-[#ec028b] border border-[rgba(236,2,139,0.3)] bg-[rgba(236,2,139,0.08)] hover:bg-[#ec028b] hover:text-white transition-all duration-200 cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-6">

          {/* ── Add Note Form ── */}
          <div className="p-5 border border-[rgba(236,2,139,0.25)] bg-[rgba(236,2,139,0.04)] space-y-4"
            style={{ clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
          >
            <p className="font-[Orbitron,sans-serif] text-[9px] font-bold tracking-[2.5px] text-[#ec028b] uppercase opacity-80">
              + Add Note
            </p>

            {/* Title input */}
            <div>
              <label
                htmlFor="bpm-note-title"
                className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-[1.5px] mb-1.5"
              >
                Title
              </label>
              <input
                id="bpm-note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                maxLength={120}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(55,65,81,0.9)] text-white text-sm px-3.5 py-2.5 outline-none focus:border-[#ec028b] focus:shadow-[0_0_0_2px_rgba(236,2,139,0.15)] transition-all duration-200 placeholder-[#4b5563]"
                style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}
              />
            </div>

            {/* Body textarea */}
            <div>
              <label
                htmlFor="bpm-note-body"
                className="block text-[10px] font-semibold text-[#9ca3af] uppercase tracking-[1.5px] mb-1.5"
              >
                Content
              </label>
              <textarea
                id="bpm-note-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your note here..."
                rows={4}
                maxLength={1000}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(55,65,81,0.9)] text-white text-sm px-3.5 py-2.5 outline-none focus:border-[#ec028b] focus:shadow-[0_0_0_2px_rgba(236,2,139,0.15)] transition-all duration-200 placeholder-[#4b5563] resize-none"
                style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}
              />
              <p className="text-[9px] text-[#4b5563] text-right mt-1">{body.length}/1000</p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[11px] text-[#ec028b] bg-[rgba(236,2,139,0.08)] border border-[rgba(236,2,139,0.2)] px-3 py-2">
                ⚠ {error}
              </p>
            )}

            {/* Save button */}
            <div className="flex justify-end">
              <button
                id="bpm-note-save"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-white bg-[#ec028b] hover:bg-[rgba(236,2,139,0.85)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_14px_rgba(236,2,139,0.4)]"
                style={{ clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}
              >
                {saving ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <span>✦</span> Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Notes List ── */}
          <div>
            <p className="font-[Orbitron,sans-serif] text-[9px] font-bold tracking-[2.5px] text-[#6b7280] uppercase mb-3 flex items-center gap-2">
              <span
                className="inline-block w-8 h-px"
                style={{ background: 'linear-gradient(90deg,#ec028b,transparent)' }}
              />
              Saved Notes ({notes.length})
            </p>

            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="text-3xl mb-3 opacity-30">📝</span>
                <p className="text-[12px] text-[#4b5563]">No notes yet. Add your first note above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border border-[rgba(55,65,81,0.7)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(236,2,139,0.3)] transition-all duration-200 group relative"
                    style={{ clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}
                  >
                    {/* Note header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-white leading-tight truncate">
                          {note.title}
                        </h3>
                        {note.createdAt && (
                          <p className="text-[9px] text-[#4b5563] mt-0.5 font-[Orbitron,sans-serif] tracking-[0.5px]">
                            {formatDate(note.createdAt)}
                          </p>
                        )}
                      </div>
                      <button
                        id={`bpm-note-delete-${note.id}`}
                        onClick={() => handleDelete(note.id)}
                        disabled={deletingId === note.id}
                        aria-label={`Delete note: ${note.title}`}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[10px] text-[#6b7280] border border-[rgba(55,65,81,0.6)] bg-[rgba(10,10,20,0.8)] hover:border-[#ec028b] hover:text-[#ec028b] transition-all duration-200 cursor-pointer disabled:opacity-30"
                        style={{ clipPath: 'polygon(4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%,0 4px)' }}
                      >
                        {deletingId === note.id ? (
                          <span className="w-2 h-2 border border-[#ec028b]/50 border-t-[#ec028b] rounded-full animate-spin" />
                        ) : (
                          '✕'
                        )}
                      </button>
                    </div>
                    {/* Note body */}
                    <p className="text-[12px] text-[#9ca3af] leading-relaxed whitespace-pre-wrap">
                      {note.body}
                    </p>
                    {/* Pink accent line on left */}
                    <div
                      className="absolute left-0 top-2 bottom-2 w-[2px]"
                      style={{ background: 'linear-gradient(180deg,transparent,rgba(236,2,139,0.5),transparent)' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

const InternalBpmPage: React.FC = () => {
  const [modal, setModal] = useState<ActivityDetail | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const openModal = useCallback((d: ActivityDetail) => setModal(d), []);
  const closeModal = useCallback(() => setModal(null), []);
  const openNotes = useCallback(() => setNotesOpen(true), []);
  const closeNotes = useCallback(() => setNotesOpen(false), []);

  return (
    <div className="relative min-h-screen bg-black text-white font-[Rubik,sans-serif] overflow-x-auto">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CircuitryBackground backgroundColor="#000000" dotColor="#ec028b" lineColor="236, 2, 139" />
      </div>

      {/* Detail Modal */}
      <DetailModal detail={modal} onClose={closeModal} />

      {/* Notes Modal */}
      {notesOpen && <NotesModal onClose={closeNotes} />}

      {/* Page Content */}
      <div className="relative z-10 px-8 pt-7 pb-14" style={{ minWidth: '1400px' }}>

        {/* ── Header ── */}
        <header className="text-center mb-8 pb-6 border-b border-[rgba(55,65,81,0.8)] relative">
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-48"
            style={{ background: 'linear-gradient(90deg, transparent, #ec028b, transparent)' }}
          />
          <p className="font-[Orbitron,sans-serif] text-[10px] font-bold tracking-[4px] text-[#ec028b] uppercase mb-2.5 opacity-80">
            ⬡ RHIVE CONSTRUCTION OS · VERSION 1.0
          </p>
          <h1
            className="font-[Orbitron,sans-serif] text-3xl font-black mb-2.5 leading-tight"
            style={{ background: 'linear-gradient(135deg,#fff 0%,#ec028b 60%,#e2ab49 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            End-to-End Business Process Map
          </h1>

          {/* Add Note Button — upper right */}
          <button
            id="bpm-add-note-btn"
            onClick={openNotes}
            aria-label="Open process notes"
            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#ec028b] border border-[rgba(236,2,139,0.5)] bg-[rgba(236,2,139,0.07)] hover:bg-[#ec028b] hover:text-white transition-all duration-200 shadow-[0_0_12px_rgba(236,2,139,0.25)] hover:shadow-[0_0_20px_rgba(236,2,139,0.5)] group"
            style={{ clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
          >
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Note
          </button>
        </header>

        {/* ── Legend ── */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {[
            { color: 'rgba(236,2,139,0.7)', label: 'Customer / Sales Activity' },
            { color: 'rgba(226,171,73,0.7)', label: 'Admin / Financial' },
            { color: 'rgba(99,102,241,0.7)', label: 'Contractor Activity' },
            { color: 'rgba(34,211,238,0.7)', label: 'System Automated' },
            { color: 'rgba(34,197,94,0.7)', label: 'Supplier / Materials' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-[#9ca3af]">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>

        {/* ── Triage Banner ── */}
        <div className="mb-6 p-5 bg-[rgba(10,10,20,0.7)] border border-[rgba(55,65,81,0.8)] border-l-[3px] border-l-[#ec028b] rounded flex flex-wrap gap-9">
          <div className="flex-1 min-w-[260px]">
            <p className="font-[Orbitron,sans-serif] text-[10px] font-bold tracking-[2px] text-[#ec028b] uppercase mb-3">
              ⚡ Intake Auto-Routing
            </p>
            <div className="flex items-start gap-2.5 mb-2">
              <span className="text-lg flex-shrink-0 mt-0.5">💰</span>
              <div>
                <p className="text-[11.5px] font-semibold text-white mb-1">Path A → <span className="text-[#e2ab49]">ESTIMATE Bucket (Stage 2)</span></p>
                <p className="text-[10.5px] text-[#9ca3af] leading-relaxed">Intent = "Need A Ballpark Price" AND no active leak / emergency tarp / inspection required</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-lg flex-shrink-0 mt-0.5">🔥</span>
              <div>
                <p className="text-[11.5px] font-semibold text-white mb-1">Path B → <span className="text-[#ec028b]">QUOTE Bucket (Stage 3)</span></p>
                <p className="text-[10.5px] text-[#9ca3af] leading-relaxed">Intent = "Need A Firm Quote" OR active leak present OR emergency tarp OR inspection required</p>
              </div>
            </div>
          </div>

          <div className="w-px bg-[rgba(55,65,81,0.8)] self-stretch flex-shrink-0" />

          <div className="flex-1 min-w-[260px]">
            <p className="font-[Orbitron,sans-serif] text-[10px] font-bold tracking-[2px] text-[#ec028b] uppercase mb-3">
              🛡️ Smart Guards & Automation
            </p>
            <div className="flex items-start gap-2.5 mb-2">
              <span className="text-lg flex-shrink-0 mt-0.5">🔍</span>
              <div>
                <p className="text-[11.5px] font-semibold text-white mb-1">Duplicate / Collision Detection</p>
                <p className="text-[10.5px] text-[#9ca3af] leading-relaxed">Every search checks Firestore for existing address or phone records. Match triggers Merge/Relate flow.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-lg flex-shrink-0 mt-0.5">🗺️</span>
              <div>
                <p className="text-[11.5px] font-semibold text-white mb-1">Geo-Boundary Enforcement</p>
                <p className="text-[10.5px] text-[#9ca3af] leading-relaxed">Out-of-service addresses block scheduling and route to a third-party referral module automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Swimlane Table ── */}
        <div className="flex flex-col">

          {/* Stage header row */}
          <div
            className="grid sticky top-0 z-10 bg-[rgba(0,0,0,0.97)] backdrop-blur-md border-b-2 border-[rgba(236,2,139,0.3)] py-2.5"
            style={{ gridTemplateColumns: '150px repeat(11,1fr)' }}
          >
            <div className="border-r border-[rgba(55,65,81,0.8)] flex items-center justify-center px-2">
              <span className="font-[Orbitron,sans-serif] text-[8.5px] text-[#6b7280] tracking-[2px]">ROLE</span>
            </div>
            {STAGES.map((s) => (
              <div key={s.id} className="flex flex-col items-center justify-center px-1 py-1">
                <span className="font-[Orbitron,sans-serif] text-[8px] font-bold text-[#ec028b] tracking-[1px] mb-1">{s.id}</span>
                <span className="text-[9.5px] font-semibold text-white text-center uppercase tracking-[0.3px] leading-tight">{s.name}</span>
                <span className="text-[7.5px] text-[#6b7280] text-center mt-0.5">{s.sub}</span>
              </div>
            ))}
          </div>

          {/* Swimlane rows */}
          {SWIMLANES.map((row, ri) => (
            <div
              key={ri}
              className="grid border-b border-[rgba(55,65,81,0.3)] last:border-b-0"
              style={{ gridTemplateColumns: '150px repeat(11,1fr)', minHeight: '130px' }}
            >
              {/* Role label */}
              <div className="flex flex-col items-center justify-center px-2 py-4 border-r border-[rgba(55,65,81,0.8)] sticky left-0 z-[5] bg-[rgba(0,0,0,0.97)] backdrop-blur-md gap-1">
                <span className="text-[22px] leading-none">{ROLES[ri].icon}</span>
                <span
                  className="font-[Orbitron,sans-serif] text-[8.5px] font-bold text-center uppercase tracking-[1px] leading-tight"
                  style={{ color: ROLES[ri].color }}
                >
                  {ROLES[ri].name}
                </span>
                <span className="text-[8px] text-[#6b7280] text-center leading-tight">{ROLES[ri].desc}</span>
              </div>

              {/* Cells */}
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  className="flex items-center justify-center p-2 border-r border-[rgba(55,65,81,0.2)] last:border-r-0"
                >
                  {cell ? (
                    <ActivityCard cell={cell} onOpen={openModal} />
                  ) : (
                    <div className="w-9 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(55,65,81,0.8),transparent)' }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Footer Notes ── */}
        <div className="mt-8 pt-5 border-t border-[rgba(55,65,81,0.8)] grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          {[
            { title: '🏗️ Project Types', text: 'Residential, Commercial, and Government projects follow the same 11-stage pipeline with type-specific config — commercial adds parent company hierarchy, multi-contact billing roles, and per-building property tracking.' },
            { title: '🔌 System Integrations', text: 'Google Geocoding API · Google Solar API · Google Calendar API · JustCall (SMS/phone) · Firebase Firestore (cloud DB) · Firebase Auth (role-based access control)' },
            { title: '📦 Material Systems', text: 'Asphalt shingles (Duration, Flex, Designer, Premium Designer), TPO/PVC membrane, gutter defense systems, heat trace ice management, and supplemental roof components — all calculated through the unified pricing engine.' },
            { title: '🔐 Role Access Matrix', text: 'Super Admin → Admin → Employee → Customer / Contractor / Supplier. Each role has a dedicated portal with stage-appropriate tools. Firebase Auth enforces access at every route level.' },
            { title: '📡 Offline Resilience', text: 'Address lookups cached in IndexedDB to reduce API costs. Intake submissions created offline are queued locally and synced to Firestore on reconnection, with automatic collision detection and merge logic.' },
          ].map(({ title, text }) => (
            <div key={title} className="p-3.5 border border-[rgba(55,65,81,0.5)] rounded bg-white/[0.02]">
              <p className="font-[Orbitron,sans-serif] text-[9px] font-bold text-[#e2ab49] tracking-[2px] uppercase mb-2">{title}</p>
              <p className="text-[10.5px] text-[#9ca3af] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Footer stamp */}
        <p className="text-center mt-7 text-[9.5px] text-[#6b7280] font-[Orbitron,sans-serif] tracking-[2px]">
          RHIVE CONSTRUCTION OS · BUSINESS PROCESS MAP · VERSION 1.0 · 2026
        </p>
      </div>
    </div>
  );
};

export default InternalBpmPage;
