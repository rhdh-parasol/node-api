# node-api

Playground copy for [rhdh-parasol](https://github.com/rhdh-parasol), sourced from [fullsend-playground](https://github.com/fullsend-playground).


A simple REST API for task management, built with Node.js (no external dependencies).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /tasks | List all tasks |
| POST | /tasks | Create a task |
| GET | /tasks/:id | Get a task by ID |
| PATCH | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |
| GET | /health | Health check |

## Run

```bash
npm start
```

## Test

```bash
npm test
```
