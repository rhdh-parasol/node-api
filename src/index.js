const http = require('node:http');
const { TaskStore } = require('./store');

const store = new TaskStore();
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && url.pathname === '/tasks') {
    const tasks = store.list();
    res.writeHead(200);
    res.end(JSON.stringify(tasks));
    return;
  }

  if (method === 'POST' && url.pathname === '/tasks') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { title, description } = JSON.parse(body);
        if (!title) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'title is required' }));
          return;
        }
        const task = store.create(title, description);
        res.writeHead(201);
        res.end(JSON.stringify(task));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'invalid JSON' }));
      }
    });
    return;
  }

  const taskMatch = url.pathname.match(/^\/tasks\/(\d+)$/);
  if (taskMatch) {
    const id = parseInt(taskMatch[1], 10);

    if (method === 'GET') {
      const task = store.get(id);
      if (!task) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'task not found' }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(task));
      return;
    }

    if (method === 'PATCH') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          const task = store.update(id, updates);
          if (!task) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'task not found' }));
            return;
          }
          res.writeHead(200);
          res.end(JSON.stringify(task));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'invalid JSON' }));
        }
      });
      return;
    }

    if (method === 'DELETE') {
      const deleted = store.delete(id);
      if (!deleted) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'task not found' }));
        return;
      }
      res.writeHead(204);
      res.end();
      return;
    }
  }

  if (method === 'GET' && url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, () => {
  console.log(`Task API listening on port ${PORT}`);
});

module.exports = { server };
