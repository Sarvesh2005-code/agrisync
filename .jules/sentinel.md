## 2026-04-29 - [Remove Hardcoded API Key]
**Vulnerability:** A hardcoded Google Gemini API key was found in `app.json`.
**Learning:** The API key for Gemini was directly committed into the source code configuration (`app.json`), exposing it to anyone with access to the repository.
**Prevention:** Use environment variables (e.g., `process.env.EXPO_PUBLIC_GEMINI_API_KEY`) to inject secrets at build time or runtime, rather than hardcoding them in configuration files.
## 2026-05-18 - [Missing Timeouts and Unbounded Input]
**Vulnerability:** External API calls (Gemini) lacked timeouts and unbounded user queries were directly passed to the API.
**Learning:** External dependencies can fail or hang, and large inputs can cause DoS or bloated local storage. A defense-in-depth approach is necessary.
**Prevention:** Always implement `AbortController` for network timeouts, and truncate unbounded user input early in the request lifecycle.
