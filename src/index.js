export default {
    async fetch(request, env) {
        const upgradeHeader = request.headers.get('Upgrade');
        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return new Response('Expected Upgrade: websocket', { status: 426 });
        }

        const webSocketPair = new WebSocketPair();
        const [client, server] = Object.values(webSocketPair);

        server.accept();

        server.addEventListener('message', async (event) => {
            console.log('[Worker] Message received, type:', typeof event.data);
            try {
                if (event.data instanceof ArrayBuffer) {
                    const uint8 = new Uint8Array(event.data);
                    console.log('[Worker] Audio data (WAV) received, size:', event.data.byteLength, 'Uint8 length:', uint8.length);

                    if (uint8.length === 0) {
                        console.error('[Worker] Received empty buffer');
                        return;
                    }

                    console.log('[Worker] Running Whisper model...');
                    const response = await env.AI.run('@cf/openai/whisper', {
                        audio: Array.from(uint8)
                    });

                    if (response && response.text) {
                        console.log('[Worker] Transcription successful:', response.text.trim());
                        server.send(JSON.stringify({ type: 'transcription', text: response.text.trim() }));
                    } else {
                        console.log('[Worker] No transcription text in response');
                    }
                } else {
                    console.log('[Worker] Non-binary message received:', event.data);
                }
            } catch (e) {
                console.error('[Worker] AI Error:', e);
            }
        });

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }
};
