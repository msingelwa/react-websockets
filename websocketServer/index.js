const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const { client } = require('websocket');

//spinning http server and wss

const server = http.createServer();
server.listen(webSocketServerPort);
console.log('listening to post 8000');

const wss = http.createServer({
    httpServer: server
});

const clients = {};

const getUuid = () => {
    const uuid = () => Math.floor((1 + Math.random()) * 0x1000).toString(16).substring(1);
    return uuid();
}

wss.on('request', (request) => {
    const userId = getUuid();

    console.log((new Date()) + ' received new connection ' + request.origin);

    const connection = request.accept(null, request.origin);

    clients[userId] = connection;
    console.log('connected: ' + userId + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log('received: ' + message.utf8Data);
            // const json = JSON.parse(message.utf8Data);

            for (const clients in client) {
                clients[client].sendUTF(message.utf8Data);
                console.log('sent Message to ' + clients[client]);
            }
        }
    });
});