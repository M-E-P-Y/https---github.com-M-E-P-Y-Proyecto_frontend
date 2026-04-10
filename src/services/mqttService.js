import mqtt from 'mqtt';

// Configuración de tu Broker (HiveMQ)
// Nota: Usa 'wss' para conexiones seguras por WebSockets
const options = {
    connectTimeout: 4000,
    clientId: 'react_client_' + Math.random().toString(16).substring(2, 8),
    keepalive: 60,
};

// Sustituye con tu dirección de HiveMQ si es diferente
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);

client.on('connect', () => {
    console.log('✅ Conectado al Broker MQTT (HiveMQ)');
});

client.on('error', (err) => {
    console.error('❌ Error de conexión MQTT:', err);
    client.end();
});

/**
 * Publicar un mensaje a un tópico
 */
export const publishMessage = (topic, message) => {
    if (client.connected) {
        client.publish(topic, message);
        console.log(`📤 Mensaje enviado a [${topic}]: ${message}`);
    } else {
        console.error('No se pudo enviar: Cliente MQTT desconectado');
    }
};

/**
 * Suscribirse a un tópico y ejecutar un callback cuando llegue un mensaje
 */
export const subscribeToTopic = (topic, callback) => {
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`📥 Suscrito exitosamente a: ${topic}`);
        }
    });

    client.on('message', (receivedTopic, message) => {
        if (receivedTopic === topic) {
            callback(message.toString());
        }
    });
};

export default client;