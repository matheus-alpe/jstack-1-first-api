const http = require('http');
const { URL } = require('url');

const routes = require('./routes')

const server = http.createServer((request, response) => {
    const parsedUrl = new URL(`http://localhost:3000${request.url}`);

    console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

    const route = routes.find((routeObject) => (
        routeObject.endpoint === parsedUrl.pathname && routeObject.method === request.method
    ));

    if (!route) {
        response.writeHead(404, { 'content-type': 'text/html' });
        response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
        return;
    }

    request.query = Object.fromEntries(parsedUrl.searchParams);
    route.handler(request, response);
});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));