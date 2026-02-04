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
            try {
                if (event.data instanceof ArrayBuffer) {
                    const audioBuffer = new Float32Array(event.data);
                    const audioArray = Array.from(audioBuffer);

                    const response = await env.AI.run('@cf/openai/whisper', {
                        audio: audioArray
                    });

                    if (response && response.text) {
                        server.send(JSON.stringify({ type: 'transcription', text: response.text.trim() }));
                    }
                }
            } catch (e) {
                console.error('AI Error:', e);
            }
        });

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }
};
