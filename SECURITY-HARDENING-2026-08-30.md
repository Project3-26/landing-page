Landing security hardening applied 2026-08-30.

- Added non-breaking HTTP security headers via `_headers`.
- CSP intentionally deferred because the live landing page uses inline scripts and Google Fonts; tightening CSP should be tested separately before enforcement.
- Churchwide inquiry remains protected by server-side origin checks, validation, body-size limits, and honeypot handling in the app API.
