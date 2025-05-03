Logging & Error‑Handling Strategy
1. Separation of concerns – The browser does optimistic UI + shallow checks; the back‑end is the single place that talks to the external service and owns deep validation and logging.

2. Centralised Express error middleware funnels all unhandled exceptions, network errors and validation issues through logger.error so nothing is missed.

3. Winston writes:

    3.1. error.log – persistent JSON lines, rotated by ops if needed.

    3.2. Console – coloured, human‑readable for local dev.

4. Error envelope – client receives { message } only. Stack traces stay server‑side, preventing leakage of internals.

5. Categories handled

    5.1. Network failures – Axios throws ECONNREFUSED, mapped to 503.

    5.2. Invalid responses – empty body or non‑2xx status triggers own Error.

    5.3. Unexpected data formats – JSON parse failure surfaced as Invalid JSON received.

6. Timestamps – Winston timestamps each entry; you can correlate with browser console (performance timing logged in main.js).

7. Monitoring hooks – Winston can be swapped for any transport (Elastic, Loki, Datadog) without touching the route logic.

This setup yields reproducible logs that answer what, when, and where every failure happened, speeding up debuggability and enabling alerting dashboards.