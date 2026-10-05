# SciQuest first cost-protection layer

Reviewed the repository's current `server.ts`: all three Gemini routes were public,
shared a 25 MB JSON parser, and had no rate or usage gate. Chat already mapped three
friendly choices to fixed model IDs, but visitors could select Pro and Search.
Provider exception messages were returned to callers. Firebase sign-in exists in
the browser, but these routes do not verify a server-side identity.

This patch keeps authentication, payments and subscriptions outside its scope.
It adds shared per-IP limits, bounded inputs and outputs, server-controlled model
choices, a shared daily request cap, and safe failures. No new runtime dependency.

| Protection | Default | Prevents or reduces |
| --- | --- | --- |
| Shared IP rate gate, before JSON parsing | 12 requests in a 60-second window, across mentor routes | Rapid repeated calls; expensive JSON parsing after the allowance is exhausted |
| Shared IP daily attempt cap | 50 per UTC day | One visitor repeatedly spending the app's allowance |
| Shared app daily attempt cap | 300 per UTC day | Distributed visitors exceeding a bounded daily number of Gemini attempts |
| Chat parser and validation | 96 KiB; 1–20 messages; 4,000 characters each; 16,000 total | Oversized prompts/history and malformed role/content types |
| Transcription parser and validation | 3 MiB JSON; canonical base64; 2 MiB decoded audio; approved audio MIME types | Large uploads and arbitrary MIME requests |
| Speech parser and validation | 24 KiB JSON; 4,000 input characters; speak first 350; Puck only | Huge TTS requests and unapproved voice options |
| Server model allowlist | fast, standard; Pro and Search disabled | Visitors selecting higher-cost features or arbitrary model IDs |
| Output and SDK controls | Chat 1,024 tokens; transcription 512; 30-second timeout; one SDK attempt | Very long text responses and automatic retry amplification |
| Safe errors | 400/403/413/415/429/503; generic provider failures | Exposure of provider errors, keys, prompts or student audio |

The rate window starts on the first request and expires after 60 seconds; traffic
can burst at the boundary. IPv6 identities are grouped by /64. IPs are HMAC-hashed
in storage, not saved in plaintext. School Wi-Fi users may share one allowance.
Each chat, transcription and speech call counts separately: one spoken question
with a spoken reply can consume three attempts. Invalid inputs use the minute
allowance but not the daily Gemini allowance. Daily reservations happen before
the upstream call; failed/timed-out calls remain counted. There are no refunds or
automatic retries. Daily admission checks and increments both caps atomically.

## Configuration

Use Node 22.18+ (or the existing tsx runtime). Create a persistent Upstash Redis
database and place these values in server environment secrets, never VITE_ vars:

```dotenv
GEMINI_API_KEY=your_server_secret
UPSTASH_REDIS_REST_URL=https://YOUR_DATABASE.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_write_token
AI_IP_HASH_SECRET=at_least_32_characters_of_random_secret
AI_USAGE_NAMESPACE=sciquest:ai
AI_REQUESTS_PER_MINUTE=12
AI_IP_DAILY_REQUEST_CAP=50
AI_DAILY_REQUEST_CAP=300
AI_ALLOWED_CHAT_CHOICES=fast,standard
AI_ALLOW_SEARCH_GROUNDING=false
TRUSTED_PROXY_CIDRS=
```

Generate the hash secret with `openssl rand -hex 32`. Use the same secret, namespace,
database and limits on every instance of the deployment. Give a separate preview
deployment a separate namespace. Keep eviction disabled: losing keys resets the
allowances. Do not manually clear daily keys while the service is public.
Missing credentials, invalid store responses and Redis timeouts fail closed with
503; the AI routes cannot silently fall back to an unprotected in-memory counter.
The Redis REST call has a three-second timeout and is not automatically retried.

Empty `TRUSTED_PROXY_CIDRS` trusts no forwarding headers. When hosted behind a
reverse proxy, set the actual verified proxy IPs/CIDRs. Do not use `true`, broad
networks or guessed hop counts. Ensure the proxy sanitises forwarded headers and
clients cannot bypass it. Verify two real client networks receive separate
allowances and a forged X-Forwarded-For cannot change a client's bucket. A wrong
setting can group everyone under a proxy IP or permit spoofing. The repository
does not establish the production proxy topology, so no platform-specific value
has been guessed here.

Model IDs stay exactly as found in the repository, in `server/validation.ts`;
availability and billing support must be checked with the deployment's Gemini
account. Unsupported models return generic 503 and still consume an attempt.
To allow Pro deliberately, use `AI_ALLOWED_CHAT_CHOICES=fast,standard,complex`.
To allow Search deliberately, set `AI_ALLOW_SEARCH_GROUNDING=true`.

## Apply and verify

Merge this reviewed patch, set the secrets, then redeploy the Express server.
`vite preview` or static-only hosting does not run these routes. This patch does
not change deployment configuration or publish the live app.

```bash
npm run test:cost-protection
npm run lint
npm run build
```

Validation in this review: nine tests passed; TypeScript checking and production
build passed. A normal npm install encountered the existing Vite 8/esbuild peer
conflict; validation used `npm install --legacy-peer-deps --ignore-scripts
--package-lock=false`, without changing dependency versions or the Bun lockfile.
The build reports existing large-bundle/config warnings.

Tests cover model/search restrictions, invalid bodies, audio size/base64, TTS
limits, IP normalisation, atomic-script request shape, quota denial, successful
admission, store failure and error redaction. They mock the REST transport; no paid
Gemini call or production Redis was used. Before enabling public testing, test the
configured Redis with a preview namespace: set daily cap to 2, send concurrent
valid requests and confirm exactly two upstream attempts are admitted, subsequent
requests get 429, and restarting an instance does not reset the cap. Check midnight
UTC rollover and per-IP/whole-app caps independently. Confirm malformed JSON gets
400, oversized JSON gets 413, and a Redis outage gets 503 without a Gemini call.

Existing browser response handling uses its generic/local fallback for non-200
chat responses. The Pro/Search controls remain visible but their requests receive
403 by default. After 20 history messages, start a new conversation; the patch
rejects extra history rather than silently deleting it. A later small UI update
can display the safe server message and disable unavailable controls.

## Limits of this layer

The daily cap is a call-count ceiling, not a currency budget: model pricing,
audio duration, thinking tokens and grounding can have different costs. The byte
limit does not verify audio duration or its true codec. Provider timeout does not
prove that upstream billing stops. A /64 IPv6 group and IPv4 address are not user
identities; rotating networks can evade the per-IP allowance, while the app-wide
cap still applies. Add verified server-side login and shared per-user quotas
before broader monetisation. This patch does not add them.

Every rate check itself uses Redis, including rejected requests. High-volume abuse
still needs hosting/edge protection to contain bandwidth and Redis costs. No
financial spend guarantee is claimed. Daily limits reset at 00:00 UTC (07:00
Jakarta), not Jakarta midnight.
