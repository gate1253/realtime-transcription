# Realtime Transcription Worker

This is a Cloudflare Worker that provides realtime speech-to-text using Cloudflare Workers AI (Whisper).

## Prerequisites
- Node.js
- Cloudflare Wrangler (`npm install -g wrangler`)
- A Cloudflare account with Workers AI enabled

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

## Development
To run the worker locally:
```bash
npx wrangler dev
```
The server will start at `ws://localhost:8787`.

## Deployment
To deploy to your Cloudflare account:
```bash
npx wrangler deploy
```

## Client Integration
The `webrtcTemplate.js` is already configured to connect to `ws://localhost:8787` by default. If you deploy the worker to a live URL, update the WebSocket URL in `startTranscription()` inside `webrtcTemplate.js`.
