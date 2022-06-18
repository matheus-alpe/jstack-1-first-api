const http = require('http');
const { URL } = require('url');

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

    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };
    route.handler(request, response);
});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));