const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8086;
const DIR = 'D:\\Downloads\\New folder (9)\\extracted\\edu-pro\\dist\\public';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  
  if (reqPath.startsWith('/api/')) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ success: true, result: { data: {} } }));
    return;
  }

  let file = path.join(DIR, reqPath === '/' ? 'index.html' : reqPath);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(DIR, 'index.html');
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('edu-pro running at http://localhost:' + PORT);
});
