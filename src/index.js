const http = require('http');

const routes = require('./routes')

const server = http.createServer((request, response) => {
    console.log(`Request method: ${request.method} | Endpoint: ${request.url}`);

    const route = routes.find((routeObject) => (
        routeObject.endpoint === request.url && routeObject.method === request.method
    ));

    if (!route) {
        response.writeHead(404, { 'content-type': 'text/html' });
        response.end(`Cannot ${request.method} ${request.url}`);
        return;
    }

    route.handler(request, response);
});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));