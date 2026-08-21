## 1. Store

- [ ] 1.1 Add a `STATUSES` set and default `status: "todo"` in `TaskStore.create`
- [ ] 1.2 Reject unknown status strings in `create` and `update` (throw or return a sentinel the HTTP layer maps to 400)
- [ ] 1.3 Derive `completed` from `status === "done"` on every returned task
- [ ] 1.4 Map `updates.completed === true` → `status: "done"` and `false` → `status: "todo"` when `status` is not also present
- [ ] 1.5 Add `list({ status })` exact-match filter; omit filter → all tasks

## 2. HTTP

- [ ] 2.1 Parse `status` from POST/PATCH JSON bodies
- [ ] 2.2 Parse `status` from `GET /tasks` query string; 400 on unknown value
- [ ] 2.3 Map store validation failures to `400 { "error": "invalid status" }`

## 3. Tests

- [ ] 3.1 Default status on create
- [ ] 3.2 Invalid status rejected
- [ ] 3.3 PATCH status and PATCH completed stay consistent
- [ ] 3.4 `list` filter by status; unfiltered includes cancelled
