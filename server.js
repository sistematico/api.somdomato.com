import http from 'http'
import { routes } from './router/routes.js'

http.createServer(routes.handleRequest).listen(4000)