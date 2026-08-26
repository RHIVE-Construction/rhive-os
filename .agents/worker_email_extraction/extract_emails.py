import re
import os
from datetime import datetime

# Input and output file paths
input_file = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch_files\legal_emails_compilation.md"
output_dir = r"c:\Users\mjrob\OneDrive\Desktop\App Repo s\MJR_EPA\scratch\litigation_analysis"
output_file = os.path.join(output_dir, "email_transcription_2026.md")

os.makedirs(output_dir, exist_ok=True)

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Split content by email headers
email_blocks = re.split(r"### <a name='email-\d+'></a>Email #\d+", content)

parsed_emails = []
for block in email_blocks[1:]:
    date_match = re.search(r"-\s+\*\*Date:\*\*\s*(.*)", block)
    from_match = re.search(r"-\s+\*\*From:\*\*\s*(.*)", block)
    to_match = re.search(r"-\s+\*\*To:\*\*\s*(.*)", block)
    subj_match = re.search(r"-\s+\*\*Subject:\*\*\s*(.*)", block)
    body_match = re.search(r"\*\*Body:\*\*\s*\n```text\n(.*?)\n```", block, re.DOTALL)
    
    if not (date_match and from_match and to_match and subj_match):
        continue
        
    date_str = date_match.group(1).strip()
    from_str = from_match.group(1).strip()
    to_str = to_match.group(1).strip()
    subj_str = subj_match.group(1).strip()
    body_str = body_match.group(1) if body_match else ""
    
    # Filter for emails from Caysi to Michael in 2026
    frm_lower = from_str.lower()
    to_lower = to_str.lower()
    
    is_from_caysi = 'caysi' in frm_lower or 'guinn' in frm_lower or 'caysi.guinn1@gmail.com' in frm_lower
    is_to_michael = 'mjrob14' in to_lower or 'michael' in to_lower or 'michael robinson' in to_lower
    is_2026 = '2026' in date_str
    
    if is_from_caysi and is_to_michael and is_2026:
        # Clean up body if there's a duplicate line with html entities at the end of the body
        # (specifically seen in Email #35)
        lines = body_str.split('\n')
        cleaned_lines = []
        for line in lines:
            # Check if this line is the long duplicate HTML line
            if "&quot;" in line or "&#39;" in line or "Login:\xa0braylinbark18" in line:
                continue
            cleaned_lines.append(line)
        
        cleaned_body = '\n'.join(cleaned_lines).strip()
        
        parsed_emails.append({
            'date': date_str,
            'from': from_str,
            'to': to_str,
            'subject': subj_str,
            'body': cleaned_body
        })

# Sort chronologically.
# The dates are in formats like:
# "Mon, 16 Mar 2026 09:19:54 -0500"
# "Fri, 24 Apr 2026 14:52:21 -0500"
# Let's parse them using email utils to get a timestamp.
import email.utils
def parse_date(date_str):
    parsed = email.utils.parsedate_to_datetime(date_str)
    return parsed

parsed_emails.sort(key=lambda x: parse_date(x['date']))

# Write to output markdown file
markdown_output = "# Caysi Guinn to Michael Robinson - 2026 Email Transcriptions\n\n"
markdown_output += f"**Total Emails Extracted:** {len(parsed_emails)}\n\n"
markdown_output += "---\n\n"

for idx, email in enumerate(parsed_emails):
    markdown_output += f"## Email #{idx + 1}\n"
    markdown_output += f"- **Date:** {email['date']}\n"
    markdown_output += f"- **From:** {email['from']}\n"
    markdown_output += f"- **To:** {email['to']}\n"
    markdown_output += f"- **Subject:** {email['subject']}\n\n"
    markdown_output += "**Body:**\n"
    markdown_output += "```text\n"
    markdown_output += f"{email['body']}\n"
    markdown_output += "```\n\n"
    markdown_output += "---\n\n"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(markdown_output.strip() + "\n")

print(f"Successfully wrote {len(parsed_emails)} emails to {output_file}")
