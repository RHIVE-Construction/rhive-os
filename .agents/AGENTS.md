# Customization Rules

- Always log into aistudio.google.com using the email: victor.v@rhiveconstruction.com

## Preferred Project Agents

Utilize the following agents when doing research and generating responses and code for this project:

* **Antigravity Agent Preview (antigravity-preview-05-2026)**: A general-purpose autonomous agent running in a remote, Google-hosted Linux environment.
* **Deep Research Preview (deep-research-preview-04-2026)**: Optimized for speed and efficiency in long-running context gathering & synthesis tasks.
* **Deep Research Max Preview (deep-research-max-preview-04-2026)**: Optimized for maximum search exhaustiveness and report comprehensiveness.
* **Gemini 3.5 Flash (gemini-3.5-flash)**: Most intelligent model for sustained frontier performance in agentic and coding tasks.
* **Gemini 3.5 Live Translate Preview (gemini-3.5-live-translate-preview)**: Real-time speech-to-speech translation model.
* **Gemini 3.1 Flash Lite (gemini-3.1-flash-lite)**: Most cost-efficient model optimized for high-volume tasks.
* **Gemini 3 Flash Preview (gemini-3-flash-preview)**: Fast, intelligent model combining frontier intelligence with superior search.
* **Gemini 3.1 Pro Preview (gemini-3.1-pro-preview)**: Reasoning model with multimodal understanding and coding capabilities.
* **Gemini 3.1 Flash Image (gemini-3.1-flash-image)**: Pro-level visual intelligence with Flash-speed efficiency.
* **Gemini 3 Pro Image (gemini-3-pro-image)**: Image generation and editing model.
* **Gemini 2.5 Flash Image (gemini-2.5-flash-image)**: Image generation and editing model.
* **Gemini 2.5 Pro (gemini-2.5-pro)**: Previous generation reasoning model for coding.
* **Gemini Pro Latest (gemini-pro-latest)**: Points to `gemini-3.1-pro-preview`.
* **Gemini Flash Latest (gemini-flash-latest)**: Points to `gemini-3.5-flash`.
* **Gemini Flash-Lite Latest (gemini-flash-lite-latest)**: Points to `gemini-3.1-flash-lite`.
* **Gemini 2.5 Flash (gemini-2.5-flash)**: Hybrid reasoning model.
* **Gemini 2.5 Flash-Lite (gemini-2.5-flash-lite)**: Smallest, most cost-effective model.
* **Gemini Robotics-ER 1.6 Preview (gemini-robotics-er-1.6-preview)**: Embodied reasoning for physical interaction.
* **Gemini 3.1 Flash Live Preview (gemini-3.1-flash-live-preview)**: Real-time dialogue with acoustic nuance detection.
* **Gemini 3.1 Flash TTS Preview (gemini-3.1-flash-tts-preview)**: Expressive audio speech generation.
* **Lyria 3 Pro Preview (lyria-3-pro-preview)**: Generative model with precise structural music control.
* **Lyria 3 Clip Preview (lyria-3-clip-preview)**: Low-latency music audio clip generation.
* **Gemini 2.5 Pro Preview TTS (gemini-2.5-pro-preview-tts)**: Low-latency audio speech generation.
* **Gemini 2.5 Flash Preview TTS (gemini-2.5-flash-preview-tts)**: Price-performant low-latency speech generation.
* **Imagen 4 (imagen-4.0-generate-001)**: High-quality image generation with text rendering.
* **Imagen 4 Ultra (imagen-4.0-ultra-generate-001)**: Enhanced image quality and text rendering.
* **Imagen 4 Fast (imagen-4.0-fast-generate-001)**: High-efficiency image generation.
* **Veo 3.1 (veo-3.1-generate-preview)**: Video generation model.
* **Veo 3.1 Fast (veo-3.1-fast-generate-preview)**: High-speed video generation model.
* **Veo 3.1 Lite (veo-3.1-lite-generate-preview)**: Cost-efficient video generation model.
* **Veo 2 (veo-2.0-generate-001)**: Video generation model.
* **Gemma 4 26B A4B IT (gemma-4-26b-a4b-it)**: MoE open weights model.

## System Rules — Always Enforced

> **CRITICAL**: Before developing any feature, fixing any bug, committing, or pushing — read and follow the System Rules document located at `.agents/rules/SYSTEM_RULES.md`.

The System Rules define:
- **Button & label conventions** — only `Yes`, `No`, `Submit`, `Send`, `Cancel`, `Close`, `Save`, `Delete`, `Remove`. `Abort` is **strictly prohibited**.
- **Testing protocol** — ALL features MUST pass `npm run build` and manual testing before any commit or push.
- **Branch & commit workflow** — conventional commit format, branch naming, merge protocol.
- **UI/Component standards** — RHIVE Design System, no checkboxes, no hardcoded colors, no debug logs.
- **Feature development sequence** — review rules → branch → develop → test → commit → test → push → merge → build → deploy.

These rules are permanent, non-negotiable, and apply to every agent and every change.

---

## JustCall Integration Maintenance

- **API Versioning**: Always use the latest JustCall API version (currently v2.1). Before implementing any JustCall-related changes, check for API updates.
- **MCP Synchronization**: Ensure the JustCall MCP server (https://mcp.justcall.host/mcp) is correctly configured in `mcp.json`. Use the API Key and Secret from `functions/.env` to authenticate.
- **Deployment Protocol**: Any changes to `functions/index.js` involving JustCall must be deployed to Firebase (`firebase deploy --only functions`) immediately to ensure live consistency.
- **Robustness**: Always implement multi-format phone number variations (`getPhoneVariations`) for any JustCall lookup to handle different international and local formats.
- **Dependency Updates**: Keep `axios` and other communication-related dependencies in `functions/package.json` updated to their latest stable versions.
