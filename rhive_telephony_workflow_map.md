# RHIVE Telephony Topology & Autonomous Intake Workflow Map

```mermaid
flowchart TD
    %% INBOUND ENTRY POINT
    Caller([📞 Inbound Caller: +1 435-417-6637]) --> Greeting[🎵 Node 1: Audio Message Greeting\n01_RHIVE_10s_Hybrid_Welcome_Menu.mp3]
    
    %% IVR MENU
    Greeting --> IVR[🎛️ Node 2: IVR Menu Engine\nIVR Test 1]
    
    %% KEYPAD ROUTING
    IVR -->|Key 1: New Projects & Quotes| HunniIntake[🤖 AI Voice Agent: Michael Copy / Hunni\nIntake & Estimation Engine]
    IVR -->|Key 2: Emergency Leak / Tarp| HunniEmergency[⚡ AI Voice Agent: Michael Copy\nPriority Emergency Dispatch]
    IVR -->|Key 3: Project Status / Billing| KaraTransfer[👤 Forward Call: Kara Robinson\n+1 801-441-0024]
    IVR -->|Key 4: Trade Partners / GC Ops| MichaelTransfer[👤 Forward Call: Michael Robinson\n+1 801-449-1451]
    IVR -->|Key 8: Vendor Solicitations| Voicemail[📼 Route: Procurement Voicemail Box]
    IVR -->|Timeout / Silence / Speech| HunniIntake
    
    %% HUNNI INTAKE DECISION TREE
    subgraph Hunni_Intake_Engine [🤖 HUNNI INTAKE & TRIAGE DECISION TREE]
        HunniIntake --> Q_Address[📍 Step 1: Capture Property Address & Scope]
        Q_Address --> Diagnose{Diagnose Customer Need}
        
        %% PATH A: INSTANT ESTIMATE
        Diagnose -->|Customer Wants Quick Online Ballpark| PathA[📱 PATH A: Instant Online Estimate]
        PathA --> SendSMS[Send SMS to Caller with Link:\nhttps://rhiveconstruction.com]
        
        %% PATH B: RETAIL INSPECTION (NO INSURANCE)
        Diagnose -->|Customer Wants In-Person Estimate / No Insurance| PathB[📅 PATH B: Retail Roof Inspection]
        PathB --> BookRetail[Capture Roof Age & Signs of Wear\nBook 15-Min On-Site Slot with Michael / Team]
        
        %% PATH C: INSURANCE CLAIM INSPECTION
        Diagnose -->|Storm / Hail / Wind Damage / Insurance Claim| PathC[🛡️ PATH C: Insurance Claim Inspection]
        PathC --> BookInsurance[Capture Storm Date, Carrier & Claim #\nBook Adjuster Meeting Representation Slot]
        
        %% PATH D: ACTIVE LEAK / EMERGENCY
        Diagnose -->|Active Water Intrusion| PathD[🚨 PATH D: Emergency Leak Response]
        PathD --> DispatchLeak[Capture Leak Room & Severity\nTrigger Emergency Tech Dispatch Alert]
        
        %% CONTACT VERIFICATION
        SendSMS --> VerifyContact[📝 Step 3: Verify Full Name, Mobile #, & Email]
        BookRetail --> VerifyContact
        BookInsurance --> VerifyContact
        DispatchLeak --> VerifyContact
        
        %% CRM DOSSIER SYNC
        VerifyContact --> CRMSync[💾 Sync Customer Dossier & Pipeline Stage\nEstimate Bucket vs. Quote Bucket]
    end
```

---

## 🛠️ JustCall Workflow Canvas Connection Matrix

| Workflow Node | Target Destination | Voice / Audio Config | Failover / Unanswered |
|---|---|---|---|
| **Start / Inbound** | Node 1: `Audio Message` | Number: `+1 (435) 417-6637` | — |
| **Node 1 (`Audio Message`)** | Node 2: `IVR Test 1` | `01_RHIVE_10s_Hybrid_Welcome_Menu.mp3` | Next Step |
| **`IVR Test 1` (Key 1)** | `AI Voice Agent` | Agent: **`Michael Copy`** | Voicemail / Michael |
| **`IVR Test 1` (Key 2)** | `AI Voice Agent` | Agent: **`Michael Copy`** (Emergency Priority) | Michael `(801) 449-1451` |
| **`IVR Test 1` (Key 3)** | `Forward Call` | Number: **`+1 (801) 441-0024`** *(Kara)* | Kara Voicemail |
| **`IVR Test 1` (Key 4)** | `Forward Call` | Number: **`+1 (801) 449-1451`** *(Michael)* | Michael Voicemail |
| **`IVR Test 1` (Key 8)** | `Voicemail` | Procurement Greeting | Voicemail Box |
| **`IVR Test 1` (Timeout)** | `AI Voice Agent` | Agent: **`Michael Copy`** | Voicemail / Michael |
