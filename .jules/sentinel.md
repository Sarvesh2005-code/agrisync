## 2026-04-29 - [Remove Hardcoded API Key]
**Vulnerability:** A hardcoded Google Gemini API key was found in `app.json`.
**Learning:** The API key for Gemini was directly committed into the source code configuration (`app.json`), exposing it to anyone with access to the repository.
**Prevention:** Use environment variables (e.g., `process.env.EXPO_PUBLIC_GEMINI_API_KEY`) to inject secrets at build time or runtime, rather than hardcoding them in configuration files.

## 2024-05-18 - [Add Timeout and Input Truncation to External API Calls]
**Vulnerability:** The Gemini API call in `aiAssistantEngine.js` lacked a timeout mechanism and accepted unbounded input (`query`), leading to potential Resource Exhaustion and Denial of Service (DoS) due to indefinitely hanging network requests or overly large payloads.
**Learning:** All external API requests (`fetch`) must include an `AbortController` with a reasonable timeout, and all user input acting as a payload must be truncated/limited to prevent DoS. This is a crucial defense-in-depth security pattern for this offline-first project that periodically syncs/queries online.
**Prevention:** Enforce input length constraints (`substring(0, 500)`) on user queries, and always pass `signal: controller.signal` to `fetch` calls, paired with `setTimeout(() => controller.abort(), ms)`.
