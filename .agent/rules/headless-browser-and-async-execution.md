# UNIVERSAL HEADLESS BROWSER & ASYNCHRONOUS RPA PROTOCOL

**Directive:** 100% Silent Headless Automation Across ALL Tasks & Subagents  
**Scope:** Applies universally to `/browser` subagents, Puppeteer, Playwright, Selenium, Chrome CLI, Roofr, JustCall, Google Workspace, Zoho, web research, and all automated UI tasks.

---

## 1. Universal Headless Standard (`--headless=new`)

All browser instances across ANY agent, subagent, or internal task **MUST ALWAYS** launch with modern headless mode:

```javascript
// Universal Browser Launch Configuration
const browser = await chromium.launch({
  headless: true, // Modern Chrome Headless (--headless=new)
  args: [
    '--headless=new',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080'
  ]
});
```

For Python:
```python
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")
```

---

## 2. Universal Non-Interference Mandate

1. **Strict Prohibition on GUI / Session 1 Interruption:**
   - Automation must NEVER open foreground visible windows or simulate hardware OS mouse movements (`pyautogui`) in the user's active session.
   - All interactions (navigation, typing, clicking, form submissions, dropdowns) must execute via the Chrome DevTools Protocol (CDP) or Playwright/Puppeteer DOM methods directly inside the off-screen virtual framebuffer.
2. **Subagent & `/browser` Mandate:**
   - Any `/browser` subagent spawned to inspect websites, manage cloud consoles, verify portals, or automate web flows must execute purely headlessly and return artifacts (screenshots, logs, extracted data) directly without opening visible browser windows.
3. **Evidence Artifacts:**
   - All visual verification screenshots are captured directly from headless page renders (`await page.screenshot({ path: targetArtifactPath })`) and embedded in markdown reports.
