# @rymi/mcp

## 1.1.0

- `estimate_call_cost` no longer takes a `tier` argument (the four-tier role
  pricing is removed). It now accepts `{ stt_model, llm_model, tts_model,
  duration_seconds }` and returns the custom-stack rate (component cost +
  $0.02/min platform fee). The old `tier` argument was already ignored by the
  server.
