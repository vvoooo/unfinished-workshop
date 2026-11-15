import http from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PORT || 4173);
http.createServer(async (req,res) => {
  if(req.url !== '/' && req.url !== '/index.html'){res.writeHead(404);res.end('Not found');return;}
  try {res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(new URL('./dist/index.html',import.meta.url)));}
  catch {res.writeHead(500);res.end('Run npm run build first');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
