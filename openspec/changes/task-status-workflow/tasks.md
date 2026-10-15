## 1. Store

- [ ] 1.1 Export a `STATUSES` set as the single source of truth for valid
  statuses. Switch `TaskStore.create` to an options-object signature
  (`create({ title, description, status })`) and default `status` to `"todo"`
- [ ] 1.2 Reject unknown status strings in `create` and `update` by throwing
  a `ValidationError` (extends `Error`) that the HTTP layer can catch
  distinctly from `SyntaxError`
- [ ] 1.3 Derive `completed` from `status === "done"` on every returned task
- [ ] 1.4 Map `updates.completed === true` → `status: "done"` and `false` →
  `status: "todo"` when `status` is not also present (provisional — see
  design.md open question on fallback for non-done states)
- [ ] 1.5 When both `status` and `completed` are present in an update,
  `status` wins and `completed` is ignored
- [ ] 1.6 Add `list({ status })` exact-match filter; omit filter → all tasks

## 2. HTTP

- [ ] 2.1 Parse `status` from POST/PATCH JSON bodies
- [ ] 2.2 Parse `status` from `GET /tasks` query string; import `STATUSES`
  from the store module for validation; 400 on unknown value
- [ ] 2.3 Catch `ValidationError` from the store and map to
  `400 { "error": "invalid status" }` (distinguish from `SyntaxError` in
  the existing try/catch)

## 3. Tests

- [ ] 3.1 Default status on create
- [ ] 3.2 Invalid status rejected (both create and update)
- [ ] 3.3 PATCH status and PATCH completed stay consistent
- [ ] 3.4 `list` filter by status; unfiltered includes cancelled
- [ ] 3.5 Conflict: PATCH with both `status` and `completed` — `status` wins

## 4. Docs

- [ ] 4.1 Update README endpoints table: add `status` query param to
  `GET /tasks`, document the `status` field on task JSON, and note
  `status`/`completed` conflict resolution on `PATCH`
