# 🏛️ RHIVE JUSTCALL AGENTIC AUTOMATION MASTER SPECIFICATION
## Industry-Leading Standards for Before, During, and After Call Orchestration

**Target Agent:** `Michael Copy` (`Hunni` — Inbound Qualification & Telephony Concierge)  
**Main Inbound Number:** `+1 (435) 417-6637`  
**Direct Voice Agent ID:** `#agent_ee8db0f736e6bce2db54394f2b` (`+1 314-937-6637`)  
**Architecture:** 3-Phase Agentic Execution (Pre-Call $\rightarrow$ In-Call $\rightarrow$ Post-Call)

---

## 🧭 EXECUTIVE AGENTIC LIFECYCLE MAP

```mermaid
flowchart TD
    %% BEFORE CALL
    subgraph Phase1 [⚡ PHASE 1: BEFORE CALL (PRE-CALL INTELLIGENCE)]
        Inbound[Inbound Call Ringing: +1 435-417-6637] --> FetchContext[Fetch Context Webhook: Caller ID Lookup]
        FetchContext --> InjectVars[Inject Dynamic Variables:\nCallerName, PastDossier, ZipCode, LocalWeather]
        InjectVars --> AudioInit[Audio Engine Initialization:\n0s Latency, Noise Cancellation ON, 45s Silence Timeout]
    end

    %% DURING CALL
    subgraph Phase2 [🎙️ PHASE 2: DURING CALL (LIVE AGENTIC ORCHESTRATION)]
        AudioInit --> Greeting[Greeting & Property Address Intake]
        Greeting --> Tool1[🛠️ Tool 1: Live Address Validation & Geocoding Webhook]
        Tool1 --> Qualify[Systematic Project Intake: Scope, Roof Age, Funding/Storm]
        
        Qualify --> Branch{Agentic Triage Engine}
        
        %% BRANCH ACTIONS
        Branch -->|Ballpark Online Request| Tool2[📲 Tool 2: Mid-Call Instant SMS\nTexts: https://rhiveconstruction.com]
        Branch -->|Repair <15 Yrs| Tool3[📸 Tool 3: Mid-Call Photo Request SMS\nTexts Photo Upload Link]
        Branch -->|Insurance / Commercial / >15 Yrs| Tool4[📅 Tool 4: Google Calendar Booking Webhook\nChecks 'RHIVE Project Inspections' & Locks 15-Min Slot]
        Branch -->|Human Escalation / AI Dislike| Tool5[👤 Tool 5: Pre-Transfer Intercept & Warm Transfer\nCaptures Name & Address -> Forwards to Michael / Kara]
    end

    %% AFTER CALL
    subgraph Phase3 [💾 PHASE 3: AFTER CALL (ECOSYSTEM SYNC & DISPATCH)]
        Tool2 & Tool3 & Tool4 --> WrapUp[Call Termination & Audio Encoding]
        WrapUp --> PostHook[📡 Action 1: Post-Call CRM Dispatch Webhook\nSends 14-Field JSON to JobNimbus / GHL / Sheets]
        WrapUp --> PostSMS[📱 Action 2: Customer Confirmation SMS + Calendar Invite]
        WrapUp --> InternalAlert[🚨 Action 3: Internal Executive Dispatch Alert\nSends Rich Brief + Audio URL + Transcript to Google Chat / Michael]
        WrapUp --> StageTag[🏷️ Action 4: Auto-Pipeline Triage Tagging\n'Estimate Bucket' vs 'Quote Bucket']
    end
```

---

## ⚡ PHASE 1: BEFORE CALL (PRE-CALL INTELLIGENCE)

Before the caller hears Hunni speak, JustCall initializes the call context and fetches CRM data:

### 1.1 `Fetch Context Webhook` Configuration
* **Setting:** Enabled in JustCall Agent Settings $\rightarrow$ `Before Call Actions`
* **Trigger:** On Incoming Ring (Before Call Connected)
* **Method:** `POST`
* **Target Webhook URL:** `https://api.rhiveconstruction.com/v1/telephony/context` *(or CRM Lookup)*
* **Inbound Payload from JustCall:**
```json
{
  "caller_number": "+18015551234",
  "call_sid": "CA1234567890abcdef",
  "called_number": "+14354176637",
  "timestamp": "2026-08-21T15:00:00Z"
}
```
* **Expected Return Payload (Injected into Hunni's Memory):**
```json
{
  "CallerName": "David Dukatz",
  "PropertyAddress": "11689 S Country Brook Ct, South Jordan, UT",
  "CustomerType": "Existing Contact",
  "ExistingProjectStatus": "Roof Replacement - Pending Proposal",
  "LocalWeather": "Sunny, 88°F, No Rain"
}
```

### 1.2 Acoustic & Voice Engine Settings
* **Greeting Mode:** `AI Agent starts with a predefined greeting message`
* **Pause Before Speaking:** `0 sec` *(Instant response eliminates awkward telephony silence)*
* **Smart Active Noise Cancellation:** `ON` *(Removes background road/wind noise for callers on mobile)*
* **Creativity / Temperature:** `0.2` *(Strict, predictable adherence to intake protocol)*
* **End Call on Silence:** `45 seconds`
* **Voicemail Detection (AMD):** `OFF` *(Required for inbound lines to prevent false AI disconnects)*

---

## 🎙️ PHASE 2: DURING CALL (LIVE AGENTIC TOOLS & ACTIONS)

During the active call, Hunni executes real-time function calls based on the caller's responses:

### 2.1 Tool 1: Live Address Validation & Geocoding Hook
* **Trigger:** As soon as the caller states their street address and city.
* **Function:** Validates spelling against USPS/Google Maps API and confirms county/jurisdiction.
* **Spoken Execution:** *"Let me verify that for you: 11689 South Country Brook Court in South Jordan, correct?"*

---

### 2.2 Tool 2: Mid-Call Instant Estimate SMS Trigger (Pathway A)
* **Trigger Condition:** Caller wants a quick ballpark price or online calculation.
* **Action:** Fires an SMS directly to `{{CallerNumber}}` while the caller is still speaking.
* **SMS Payload:**
```text
Hi {{CallerName}}! Here is your instant satellite roof estimate link from RHIVE Construction: https://rhiveconstruction.com

Open the link to see your property's 3 transparent pricing tiers in under 60 seconds!
```
* **Spoken Execution:** *"I am texting a direct link right now to your mobile phone: https://rhiveconstruction.com. You can open it, select your roof, and see instant pricing immediately."*

---

### 2.3 Tool 3: Mid-Call Repair Photo SMS Trigger (Pathway C - Roofs < 15 Yrs)
* **Trigger Condition:** Repair or active leak on a roof that is UNDER 15 years old.
* **Action:** Triggers an automated SMS requesting photo evidence.
* **SMS Payload:**
```text
Hi {{CallerName}}! This is Michael with RHIVE Construction. 

Please reply to this text with 2 or 3 photos of the leak area inside and the roof above it so we can review and prepare your rapid repair quote!
```
* **Spoken Execution:** *"I am sending an instant text from Michael to your phone right now. Simply reply with 2 or 3 photos of the leak, and we will sync them to your file for a rapid quote!"*

---

### 2.4 Tool 4: Google Calendar Real-Time Inspection Booking (Pathway D)
* **Trigger Condition:** Insurance claim, Commercial property, or Roofs OVER 15 years old.
* **Connected Calendar:** Google Calendar (`RHIVE Project Inspections`)
* **Slot Duration:** `15 minutes`
* **Scheduling Windows:** Tuesday Morning (9:00 AM – 12:00 PM) or Thursday Afternoon (1:00 PM – 4:00 PM).
* **Action:** Creates a Google Calendar Event and assigns Michael Robinson / Field Inspector.
* **Spoken Execution:** *"Fantastic, [Name]! Locking in your Tuesday morning inspection slot right now. You will receive an instant text confirmation. Have a great day!"*

---

### 2.5 Tool 5: Pre-Transfer Intercept & Live Warm Transfer (Zero Cold Transfers)
* **Trigger Condition:** Caller asks for a live human, person, representative, or manager at *any* point.
* **Mandatory Intercept Step:** Hunni MUST capture `CallerName` and `PropertyAddress` before dialing.
* **Spoken Intercept:** *"I would be happy to connect you with Michael right away! So he has your file open when he picks up, may I have your first and last name and the property address?"*
* **Forwarding Routes:**
  * **Sales / Human Escalation / Trade Ops:** `+1 (801) 449-1451` *(Michael Robinson)*
  * **Billing / Permits / Admin:** `+1 (801) 441-0024` *(Kara Robinson)*
* **Screen Pop Whisper:** Displays captured `CallerName`, `CallerNumber`, and `PropertyAddress` on Michael's/Kara's screen when answering.

---

## 💾 PHASE 3: AFTER CALL (POST-CALL ECOSYSTEM SYNCHRONIZATION)

Immediately upon call completion (hang-up), the following automated sequence fires:

### 3.1 Action 1: Post-Call CRM Webhook (14-Field Master Payload)
* **Trigger:** On Call Finished / Disconnected
* **Method:** `POST`
* **Target Endpoint:** `https://api.rhiveconstruction.com/v1/telephony/intake-sync` *(or Zapier/Make/GHL Webhook)*
* **Master 14-Field JSON Payload:**
```json
{
  "call_sid": "{{call.id}}",
  "call_duration_seconds": 184,
  "caller_name": "{{CallerName}}",
  "phone_number": "{{CallerNumber}}",
  "email_address": "{{DeliveryEmail}}",
  "property_address": "{{PropertyAddress}}",
  "city": "{{City}}",
  "project_scope": "{{ProjectScope}}", 
  "roof_age": "{{RoofAge}}",
  "triage_bucket": "{{TriageBucket}}",
  "selected_inspection_slot": "{{SelectedInspectionSlot}}",
  "disc_profile": "{{DiscProfile}}",
  "call_sentiment": "{{call.sentiment}}",
  "recording_url": "{{call.recording_url}}",
  "transcript": "{{call.transcript}}"
}
```

---

### 3.2 Action 2: Customer Post-Call Confirmation SMS
* **For On-Site Inspections:**
  > *"Hi {{CallerName}}, your RHIVE roof inspection is confirmed for {{SelectedInspectionSlot}} at {{PropertyAddress}}. Our inspector will call 30 minutes prior to arrival. Questions? Call/text (435) 417-6637."*
* **For Remote Certified Quotes:**
  > *"Hi {{CallerName}}, we have received your project details for {{PropertyAddress}}. Our team is analyzing your high-resolution satellite imagery. Your certified proposal will arrive at {{DeliveryEmail}} within 24-48 hours."*

---

### 3.3 Action 3: Internal Executive Dispatch Alert (Google Chat / SMS)
* **Target Space:** RHIVE Operations Google Chat / SMS to Michael (`801-449-1451`)
* **Alert Format:**
```text
🚨 NEW INBOUND INTAKE COMPLETED BY HUNNI
----------------------------------------
👤 Customer: David Dukatz
📞 Phone: (801) 555-1234
📍 Address: 11689 S Country Brook Ct, South Jordan
🏷️ Triage Bucket: Quote Bucket (On-Site Inspection)
📅 Inspection Slot: Thursday, 1:00 PM - 4:00 PM
🏠 Scope: Roof Replacement (Age: 18 yrs, Granule Loss)
🧠 DISC Profile: Driver / Conscientious
🎧 Call Recording: https://app.justcall.io/recording/CA12345
```

---

### 3.4 Action 4: Auto-Pipeline Triage Tagging
* **`Estimate Bucket`**: If caller requested instant ballpark pricing or received website calculator link.
* **`Quote Bucket - Remote`**: If residential replacement specs gathered for 24-48h satellite proposal.
* **`Quote Bucket - Repair Photos`**: If leak under 15 years old awaiting customer photo upload.
* **`Quote Bucket - On-Site Inspection`**: If inspection scheduled for insurance, commercial, or roofs >15 years old.
