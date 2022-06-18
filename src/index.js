const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser');
const routes = require('./routes')

const server = http.createServer((request, response) => {
    const parsedUrl = new URL(`http://localhost:3000${request.url}`);
    let { pathname } = parsedUrl;
    console.log(`Request method: ${request.method} | Endpoint: ${pathname}`);
    
    const splitEndpoints = pathname.split('/').filter(Boolean);
    let id = null;

    if (splitEndpoints.length > 1) {
        pathname = `/${splitEndpoints[0]}/:id`;
        id = splitEndpoints[1];
    }

    const route = routes.find((routeObject) => (
        routeObject.endpoint === pathname && routeObject.method === request.method
    ));

    if (!route) {
        response.writeHead(404, { 'content-type': 'text/html' });
        response.end(`Cannot ${request.method} ${pathname}`);
        return;
    }

    response.send = (statusCode, body) => {
        response.writeHead(statusCode, { 'content-type': 'text/html' });
        response.end(JSON.stringify(body));
    };

    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        return bodyParser(request, () => route.handler(request, response));
    }

    route.handler(request, response);
});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));