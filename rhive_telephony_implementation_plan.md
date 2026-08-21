# RHIVE Telephony Suite & 3-Bot Specialist Swarm Architecture

**Target Number:** `+1 (435) 417-6637` (Main Line)  
**Hunni Direct:** `+1 (743) 887-6637`  
**Framework:** 3-Node Specialized Voice Agent Swarm  
**Voice Engine:** `gemini-3.1-flash-tts-preview` (Voice: `Kore`)  
**Core Telephony Rule:** **Estimates are Ballpark; Quotes are Certified.** Zero Cold Transfers.

---

## 🏗️ The 3 Specialized Voice Bots

```mermaid
flowchart TD
    %% ENTRY POINT
    Caller([📞 Caller: +1 435-417-6637]) --> Greeting[🎵 Node 1: Audio Message Greeting\n01_RHIVE_10s_Hybrid_Welcome_Menu.mp3]
    Greeting --> IVR[🎛️ Node 2: IVR Menu Engine\nIVR Test 1]
    
    %% IVR ROUTING TO SPECIALIZED BOTS
    IVR -->|Key 1: Instant Estimate / Ballpark| Bot2[⚡ Bot 2: Hunni Instant Estimate Bot\nBallpark Pricing & SMS Portal Link]
    IVR -->|Key 2: Certified Quote / Leak / Inspection| Bot3[📋 Bot 3: Hunni Certified Quote Bot\nOn-Site Inspection & Insurance Claim]
    IVR -->|Key 3: Existing Project / Billing| Bot1[🛡️ Bot 1: Hunni Reception & Triage Bot\nInfo Gather & Warm Transfer to Kara]
    IVR -->|Key 4: Trade Partners / GC Ops| Bot1
    IVR -->|Key 8: Vendor Solicitations| Voicemail[📼 Route: Procurement Voicemail Box]
    IVR -->|Timeout / Silence / Speech| Bot1
    
    %% BOT 1 ACTIONS (RECEPTION & WARM TRANSFER)
    subgraph Bot_1 [🛡️ BOT 1: RECEPTION, TRIAGE & WARM TRANSFER]
        Bot1 --> B1_SpamCheck{Spam / Vendor Pitch?}
        B1_SpamCheck -->|Yes| B1_Hangup[Hang Up Immediately]
        B1_SpamCheck -->|No| B1_Gather[Capture Caller Name, Project Address, & Intent]
        B1_Gather --> B1_Announce[Step-by-Step Warm Announcement to Caller]
        B1_Announce --> B1_WarmKara[Warm Transfer to Kara 801-441-0024]
        B1_Announce --> B1_WarmMichael[Warm Transfer to Michael 801-449-1451]
    end

    %% BOT 2 ACTIONS (INSTANT ESTIMATE / BALLPARK)
    subgraph Bot_2 [⚡ BOT 2: INSTANT ESTIMATE & SMS LINK]
        Bot2 --> B2_Address[Capture Property Address]
        B2_Address --> B2_Ballpark[Satellite Ballpark Range: $450-$650/sq]
        B2_Ballpark --> B2_SendSMS[Trigger SMS with Link: https://rhiveconstruction.com]
        B2_SendSMS --> B2_Verify[Verify Name, Mobile #, & Email]
        B2_Verify --> B2_CRMSync[💾 Sync to CRM Stage: ESTIMATE Bucket]
    end

    %% BOT 3 ACTIONS (CERTIFIED QUOTE & INSPECTION)
    subgraph Bot_3 [📋 BOT 3: CERTIFIED QUOTE & INSPECTION SCHEDULER]
        Bot3 --> B3_Diagnose{Diagnose Scope}
        B3_Diagnose -->|Retail Replacement| B3_Retail[Capture Roof Age & Material Specs\nBook 15-Min On-Site Attic/Decking Inspection]
        B3_Diagnose -->|Insurance Storm Claim| B3_Insurance[Capture Storm Date, Carrier, Claim #\nBook Adjuster Meeting Representation]
        B3_Diagnose -->|Active Leak Emergency| B3_Leak[Capture Leak Room & Severity\nTrigger Emergency Tech Dispatch Alert]
        B3_Retail & B3_Insurance & B3_Leak --> B3_Verify[Verify Full Contact Dossier]
        B3_Verify --> B3_CRMSync[💾 Sync to CRM Stage: QUOTE Bucket]
    end
```

---

## 📊 Core Business Rule: Estimate vs. Quote Lockdown

| Parameter | ⚡ ESTIMATE (Bot 2) | 📋 QUOTE (Bot 3) |
|---|---|---|
| **Definition** | **Ballpark Preliminary Range** | **Certified Guaranteed Contract Price** |
| **Method** | Satellite AI Imagery / Online Tool | 15-Min On-Site Decking, Attic & Surface Inspection |
| **Pricing Delivery** | Instant SMS Link to `rhiveconstruction.com` | Certified Digital Proposal (24–48h) or On-Site Handshake |
| **Pipeline Board Bucket** | **`Estimate`** Bucket | **`Quote`** Bucket |
| **Required Data** | Street Address + Mobile # | Roof Age, Specs, Storm Date/Carrier, or Leak Severity |

---

## 🛠️ JustCall Workflow Setup & Node Mapping

### Node 1: Audio Message (Greeting)
* **Custom Message Upload:** [`01_RHIVE_10s_Hybrid_Welcome_Menu.mp3`](file:///c:/Users/mjrob/OneDrive/Desktop/App%20Repo%20s/MJR_EPA/scratch/hybrid_ivr_audio/01_RHIVE_10s_Hybrid_Welcome_Menu.mp3)

### Node 2: IVR Menu Engine (`IVR Test 1`)
* **Key 1 (Instant Estimates & Ballparks):** $\rightarrow$ AI Voice Agent: **`Hunni - Instant Estimate Bot`**
* **Key 2 (Certified Quotes, Leaks & Storm Claims):** $\rightarrow$ AI Voice Agent: **`Hunni - Certified Quote Bot`**
* **Key 3 (Existing Projects, Billing, Permits):** $\rightarrow$ AI Voice Agent: **`Hunni - Reception & Triage Bot`** *(Warm Transfer to Kara)*
* **Key 4 (Trade Partners & General Contractor Ops):** $\rightarrow$ AI Voice Agent: **`Hunni - Reception & Triage Bot`** *(Warm Transfer to Michael)*
* **Key 8 (Vendor Solicitations):** $\rightarrow$ **Voicemail Box** *(Procurement)*
* **Timeout / Spoken Silence:** $\rightarrow$ AI Voice Agent: **`Hunni - Reception & Triage Bot`**
