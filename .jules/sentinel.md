## 2026-04-29 - [Remove Hardcoded API Key]
**Vulnerability:** A hardcoded Google Gemini API key was found in `app.json`.
**Learning:** The API key for Gemini was directly committed into the source code configuration (`app.json`), exposing it to anyone with access to the repository.
**Prevention:** Use environment variables (e.g., `process.env.EXPO_PUBLIC_GEMINI_API_KEY`) to inject secrets at build time or runtime, rather than hardcoding them in configuration files.

## 2025-02-12 - Missing Timeouts and Unbounded Input in External API Fetch
**Vulnerability:** The AI Assistant engine (`aiAssistantEngine.js`) accepted unbounded user input and made a `fetch` request to the Gemini API without any timeout mechanism, posing DoS and hanging request risks.
**Learning:** External API integrations should always enforce reasonable payload size limits and network timeouts, especially when using standard `fetch` which does not timeout automatically.
**Prevention:** Implement `AbortController` for all external `fetch` calls with explicit timeouts, and truncate or validate user input size (e.g., `query.slice(0, 500)`) before sending it as part of an API payload.
