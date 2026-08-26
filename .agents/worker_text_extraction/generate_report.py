import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# The set of line numbers in texts.txt that belong to Michael Robinson
MICHAEL_LINES = {
    2270, 2276, 2278, 2282, 2283, 2286, 2289, 2295, 2296, 2299, 2302, 2305, 2306, 2309, 
    2311, 2314, 2317, 2320, 2323, 2326, 2328, 2331, 2334, 2337, 2344, 2347, 2350, 2353, 
    2354, 2357, 2362, 2365, 2368, 2371, 2374, 2377, 2380, 2383, 2386, 2389, 2392, 2395, 
    2398, 2402, 2405, 2408, 2425, 2426, 2429, 2432, 2435, 2438, 2441, 2444, 2447, 2450, 
    2472, 2473, 2476, 2479, 2482, 2487, 2488, 2491, 2494, 2497, 2500, 2503, 2506, 2509, 
    2512, 2521, 2522, 2525, 2528, 2531, 2532, 2535, 2538, 2541, 2544, 2545, 2548, 2551, 
    2554, 2559, 2562, 2564, 2565, 2570, 2573, 2574, 2577, 2580, 2583, 2586, 2589, 2592, 
    2595, 2598
}

def map_relative_date(header):
    h_lower = header.lower()
    if "jan 3" in h_lower:
        return "January 3, 2025"
    if "jan 8" in h_lower:
        return "January 8, 2025"
    if "jan 16" in h_lower:
        return "January 16, 2025"
    if "jan 26" in h_lower:
        return "January 26, 2025"
    if "jan 30" in h_lower:
        return "January 30, 2025"
    if "feb 18" in h_lower:
        return "February 18, 2025"
    if "feb 20" in h_lower:
        return "February 20, 2025"
    if "feb 22" in h_lower:
        return "February 22, 2025"
    if "mar 7" in h_lower:
        return "March 7, 2025"
    if "mar 8" in h_lower:
        return "March 8, 2025"
    if "mar 12" in h_lower:
        return "March 12, 2025"
    if "mar 14" in h_lower:
        return "March 14, 2025"
    if "mar 18" in h_lower:
        return "March 18, 2025"
    if "mar 20" in h_lower:
        return "March 20, 2025"
        
    if "sunday" in h_lower and "9:49" in h_lower:
        return "July 5, 2026 at 9:49 AM"
    if "wednesday" in h_lower and "2:03" in h_lower:
        return "July 8, 2026 at 2:03 PM"
    if "thursday" in h_lower and "1:27" in h_lower:
        return "July 9, 2026 at 1:27 PM"
    if "thursday" in h_lower and "6:32" in h_lower:
        return "July 9, 2026 at 6:32 PM"
    if "thursday" in h_lower and "7:44" in h_lower:
        return "July 9, 2026 at 7:44 PM"
    if "1:19" in h_lower:
        return "July 10, 2026 at 1:19 AM"
        
    return header

def get_significance(msg):
    body_lower = msg["body"].lower()
    if "bark" in body_lower or "phone" in body_lower or "credentials" in body_lower or "contacts" in body_lower:
        return "Dispute over Bark phone controls/rules, login credentials, and contact restrictions."
    if "july 12" in body_lower or "august 2" in body_lower or "possession" in body_lower or "airport" in body_lower or "dates" in body_lower or "flight" in body_lower or "summer" in body_lower or "42 days" in body_lower:
        return "Extended summer possession planning conflict and Caysi's refusal to transport child to airport."
    if "social" in body_lower or "ssn" in body_lower or "money" in body_lower or "card" in body_lower or "chatgpt" in body_lower or "lying" in body_lower:
        return "Dispute over child's SSN/financial accounts for 14th birthday, mother's deflection and ChatGPT use."
    if "school" in body_lower or "assignments" in body_lower or "ixl" in body_lower or "credentials" in body_lower:
        return "Dispute over summer school work execution and credit attribution."
    if "contempt" in body_lower or "lawyer" in body_lower or "attorney" in body_lower or "court" in body_lower or "serve" in body_lower:
        return "Legal posturing, threats of contempt, and dispute over court compliance."
    if "narcissistic" in body_lower or "annoying" in body_lower or "impaired" in body_lower or "gaslighting" in body_lower or "manipulation" in body_lower:
        return "Emotional conflict, personal attacks/name-calling by mother, and father's warnings of manipulation."
        
    return "Co-parenting and scheduling coordination."

def sort_all_messages(messages):
    months = {
        "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
        "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
    }
    
    def get_sort_val(m):
        date_str = m["date"]
        if "Late March/Early April" in date_str:
            return (2026, 3, 22, 0, 0)
        
        m_match = re.match(r'([A-Za-z]+) (\d+), (2026) at (\d+):(\d+) (AM|PM)', date_str)
        if m_match:
            month_name, day, year, hour, minute, ampm = m_match.groups()
            month = months[month_name]
            year = int(year)
            day = int(day)
            hour = int(hour)
            minute = int(minute)
            if ampm == "PM" and hour < 12:
                hour += 12
            if ampm == "AM" and hour == 12:
                hour = 0
            return (year, month, day, hour, minute)
        return (2026, 12, 31, 23, 59)
        
    return sorted(messages, key=get_sort_val)

def build_md():
    out_dir = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\litigation_analysis"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "text_message_extraction.md")
    
    phone_messages = []
    # Read phone records
    phone_records_path = "phone_records_2026.txt"
    if os.path.exists(phone_records_path):
        with open(phone_records_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                m = re.match(r'\[([^\]]+)\] ([^:]+): (.*)', line)
                if m:
                    date_str, sender, msg = m.groups()
                    phone_messages.append({
                        "date": date_str,
                        "sender": sender,
                        "receiver": "Michael Robinson" if sender == "Caysi Guinn" else "Caysi Guinn",
                        "body": msg,
                        "source": "caysi_phone_records.txt"
                    })
                    
    # Read texts_2026.txt
    texts_2026_path = "texts_2026.txt"
    text_messages = []
    if os.path.exists(texts_2026_path):
        with open(texts_2026_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        current_header = "Late March/Early April 2026 (Approximate)"
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue
            
            # Parse line number and content
            # Format: Line XXX: Content
            parts = line.split(":", 1)
            line_num_str = parts[0].replace("Line", "").strip()
            line_num = int(line_num_str)
            content = parts[1].strip() if len(parts) > 1 else line
            
            # Check if this line is a header
            m_header = re.match(r'^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec|\d+:\d+).*', content)
            if m_header and ('·' in content or re.search(r'\d+:\d+', content)):
                current_header = content
                i += 1
                continue
            
            # Determine sender based on line number
            sender = "Michael Robinson" if line_num in MICHAEL_LINES else "Caysi Guinn"
            
            # Group consecutive paragraphs sent by the same person under the same header
            # (In texts.txt, long paragraphs separated by blank lines belong to the same sender at that time)
            # Let's accumulate content if the next non-empty line has the same sender and same header.
            # However, to be simple and robust: we can just record it. Let's clean up double spacing in the body.
            text_messages.append({
                "line_num": line_num,
                "date": map_relative_date(current_header),
                "sender": sender,
                "receiver": "Michael Robinson" if sender == "Caysi Guinn" else "Caysi Guinn",
                "body": content,
                "source": "texts.txt"
            })
            i += 1

    # Now let's group consecutive text messages from the same sender that have the same date header
    # and occur within a few lines of each other to make the log readable and clean.
    grouped_text_messages = []
    if text_messages:
        curr_msg = text_messages[0]
        for next_msg in text_messages[1:]:
            if next_msg["date"] == curr_msg["date"] and next_msg["sender"] == curr_msg["sender"]:
                # Merge bodies
                curr_msg["body"] += " " + next_msg["body"]
            else:
                grouped_text_messages.append(curr_msg)
                curr_msg = next_msg
        grouped_text_messages.append(curr_msg)
        
    all_messages = []
    all_messages.extend(phone_messages)
    all_messages.extend(grouped_text_messages)
    
    # Sort messages chronologically
    sorted_messages = sort_all_messages(all_messages)
    
    with open(out_path, "w", encoding="utf-8") as md:
        md.write("""# Evidentiary Log of 2026 Communications and Disclosures
## Case: Caysi Guinn Custody & Litigation Analysis
**Date Range of Log:** January 1, 2026 – July 10, 2026  
**Subject Child:** Braylin Robinson (DOB: March 18, 2012 - turned 14 on March 18, 2026)  
**Parties:**  
*   **Father (Respondent):** Michael Robinson  
*   **Mother (Petitioner):** Caysi Guinn  
*   **Stepfather:** Ricky (Caysi's Husband)  
*   **Stepmother:** Kara Robinson (Michael's Wife)  

---

## I. Executive Summary of Evidentiary Themes
This document compiles text message logs, conversation records, and spoken disclosures involving Caysi Guinn, Ricky, Michael Robinson, and Kara Robinson in 2026. The evidence compiled herein supports the Petition to Modify Parent-Child Relationship to designate the father (Michael) as primary parent, and demonstrates:
1.  **Co-parenting Obstruction & Possession Denial:** Caysi's refusal to comply with summer possession schedules, specifically blocking Michael's designated possession window (July 12 – August 2, 2026) by claiming she and Ricky are "unavailable" to transport Braylin to the airport and refusing to allow others to do so, in violation of the Court Order.
2.  **Parental Alienation & Phone Interference:** Caysi's ongoing manipulation and restriction of the court-ordered Bark phone, including confiscation of the device, changing login credentials, and deleting family/sibling contacts (including stepmother Kara Robinson) to isolate Braylin.
3.  **Severe Domestic Harassment & Abuse Disclosures:** Detailed disclosures by Braylin of severe physical abuse (including choking by stepfather Ricky to the point of breathing restriction, dragging up stairs by hair, TV destruction as physical intimidation, and Caysi slapping Braylin's face causing blackouts) and emotional abuse (calling her "manipulator", "narcissistic", "burden", and threatening to commit her to a mental hospital).

---

## II. Structured Chronological SMS & Chat Logs (2026)
Below is the compiled log of text communications between Michael Robinson and Caysi Guinn from January 1, 2026, to July 10, 2026.

| Date/Timestamp | Sender | Receiver / Participants | Message Body / Content | Source File | Case Significance & Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
""")
        
        for msg in sorted_messages:
            sig = get_significance(msg)
            # Escape pipes in message body to avoid breaking markdown table
            body_clean = msg['body'].replace('|', '\\|')
            md.write(f"| {msg['date']} | {msg['sender']} | {msg['receiver']} | {body_clean} | `{msg['source']}` | {sig} |\n")
            
        md.write("""
---

## III. Structured Log of Spoken Disclosures and Audio Transcripts (2026)
Below is the compiled log of spoken statements, transcribed face-to-face discussions, and recorded outcries by Braylin Robinson during her visitation in Utah in June 2026.

### 1. Chronology of Disclosed Incidents & Outcries

| Disclosure Date | Incident Date | Participant(s) | Description of Abuse / Incident Disclosed | Source File | Evidentiary Weight / Litigation Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **June 11, 2026** | **Mid-January 2026** | Braylin (discloser), Ricky, Caysi | **The Chromebook Choking & Face Slapping Incident:** Braylin requested help on a homeschooling essay. Caysi refused and confiscated the Chromebook. When Braylin tried to retrieve it, stepfather Ricky dragged her and shoved her. When Braylin returned to get it, Ricky grabbed her throat with both hands, slammed her against the wall, and dangled her feet off the ground (restricting breathing). Caysi stood by and filmed on her phone, but stopped recording when the choking began. After Ricky dropped her, Caysi smacked Braylin's face, causing her to black out for 1-2 seconds and fall. Caysi later warned her not to tell her psychiatrist. | `2026_Choking_Detail.txt` | Direct evidence of severe physical abuse (strangulation) by stepfather Ricky and physical assault/collusion by mother Caysi, followed by medical neglect and obstruction of professional psychiatric disclosure. |
| **June 11, 2026** | **March 18, 2026** (14th Birthday) | Braylin (discloser), Caysi | **Colorado Birthday Slap:** While in Colorado for Braylin's birthday, Caysi slapped Braylin across the face in the car. This was in retaliation for Braylin talking to her father (Michael) on the phone about how bad their day had been. Caysi screamed that they "don't need to know everything that goes on in this house," violating phone-use rules and the injunction against punishing the child for speaking with the other parent. | `2026_Abuse_Interrogation.txt` | Physical assault in retaliation for telephone contact with the father. Proves active phone-use interference and emotional coercion to enforce secrecy. |
| **June 12, 2026** | **Ongoing (Texas Home)** | Braylin, Michael, Kara | **Parent-Child Emotional Abuse & Neglect:** In a face-to-face discussion in Utah, Braylin disclosed that there is no mutual conflict resolution in the Texas home. Caysi and Ricky demand total subservience, saying "we're the adults... we shouldn't ever have to be an equal with you." She disclosed that she "rarely sees love ever" in Ricky or Caysi's eyes, only "resentment" from Ricky. She is called a "manipulator" and "narcissistic" when she expresses opinions, and is told by Caysi that she is "doing horrible at finding herself." | `2026_Parent_Dispute.txt` | Demonstrates a toxic and hostile emotional environment in the Texas home, causing severe mental and emotional distress to the child. |
| **June 13, 2026** | **Ongoing / Historical** | Braylin (discloser), Ricky, Caysi, Sam | **Airbnb Stairs Dragging, TV Shattering, & Sibling Abuse:** Braylin disclosed that Ricky grabbed her by the hair and dragged her up the stairs in an Airbnb, dropping her at the top and causing her to hit her head. Caysi provided no medical support. Ricky also punched and shattered Braylin's bedroom TV screen to intimidate her. Sibling Sam choked Braylin to the point of blacking out. In co-parenting calls, Caysi dismissed Sam's choking as "three years ago," and Ricky blamed Braylin as the "antagonizer" because she teased Sam about TV, stating "Braylin is the older one." | `2026_Abuse_Timeline.txt`, `2026_School_Vape.txt` | Demonstrates stepfather's pattern of violent, intimidatory acts (TV destruction, hair dragging) and double standards in discipline where sibling abuse is excused while Braylin is physically punished. |
| **June 14, 2026** | **Ongoing (Texas Home)** | Braylin (discloser), Ricky, Caysi | **Verbal Harassment & Commitment Threats:** Ricky verbally harasses and physically intimidates Braylin by standing in her bedroom doorway, blocking her path, and screaming at her. He told her, "We don't want you here. The only thing keeping you here is your mother." Ricky and Caysi repeatedly threaten to send her to the "looney bin" (mental hospital) because she is a "burden." Caysi co-signs these threats to force compliance and keep her silent about physical abuse. | `2026_Stepdad_Harassment.txt` | Evidence of severe psychological abuse and intimidation used by stepdad and mother to coerce and silence the child. |
| **June 17, 2026** | **Utah Visitation** | Braylin (discloser), Michael | **Fear of Retaliation and Return to Texas:** Braylin expressed extreme terror of returning to the Texas home, stating she is terrified that Caysi will punish her for disclosing the physical abuse and disclosures to her father. She noted that Caysi has a long history of physical fistfights in the home which she always denies, accusing Braylin of "lying" or "making it up." | `2026_Utah_InPerson_Disclosures.txt` | Proves the child's acute fear of mother's retaliation, establishing a substantial risk of immediate physical and emotional harm if she returns to the Texas residence. |

### 2. Analysis of the Parent-Child Dispute Recording (`2026_Parent_Dispute.txt`)
During this recorded conversation in Utah on June 12, 2026, the following key evidentiary points are established:
*   **Speaker 1 (Braylin):** Articulates her desire for open communication and conflict resolution in the Texas home, which is rejected by Caysi and Ricky. She expresses that she feels like a "slave" under their rules and income leverage, and that she has no free speech or voice. She states: *"I think I look in Ricky in her eyes, and I just see resentment, and like, uh. Like, just not love... I rarely see love ever."*
*   **Speaker 2 (Michael):** Calms and validates Braylin, explaining that her communication style is healthy and that she is not the broken one. He notes that the communication failure stems from the adults' low emotional maturity. He advises her to be a "chameleon" to survive the next few years and that she is on a timeline to get out.
*   **Speaker 3 (Kara):** Co-signs the father's support and validation of Braylin, confirming the father's home offers a safe and supportive environment.

---

## IV. Legal Analysis & Recommendations for Counsel
1.  **Enforcement of Summer Possession:** Michael has fully complied with the 60-day notice requirement for the **July 12 – August 2, 2026** window. Caysi's written statement that she is "unavailable" and that "no one else will be bringing her" constitutes anticipatory breach and contempt of court. Counsel should file an immediate Motion for Enforcement of Possession and request a writ of attachment if the child is not surrendered.
2.  **Bark Phone Rule Violations:** The November 14, 2025 Order requires standard, unmonitored communication. Caysi's admission of removing family contacts and locking/withholding the phone violates the spirit and terms of the order, supporting a modification of sole telephone controls to the father.
3.  **Temporary Orders for Child Safety:** Braylin's outcries of choking, face slapping, hair dragging, and threats of psychiatric commitment show a pattern of physical and psychological abuse in the mother's home. Under Texas Family Code § 156.006, temporary orders designating the father as the parent with the exclusive right to designate primary residence are warranted due to the immediate danger to the child’s physical health or emotional development.
""")
        
    print(f"Successfully generated structured markdown report at: {out_path}")

if __name__ == "__main__":
    build_md()
