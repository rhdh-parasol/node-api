## Canonical Touchpoints

No canonical document updates. This repo has no `specifications/` tree yet.

## Context

`node-api` is an in-memory task REST API. A task today is:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk and eggs",
  "completed": false,
  "createdAt": "2026-08-21T15:00:00.000Z"
}
```

`PATCH` may flip `completed`. `GET /tasks` always returns the full map. There
is no notion of "started", "waiting", or "abandoned".

## Goals / Non-Goals

**Goals:**

- One explicit status per task, shared by create, update, and list
- Filter `GET /tasks` by a single status value
- Default new tasks to `todo` when the client omits `status`
- Keep response payloads backward-compatible enough that a client reading
  `completed` still works

**Non-Goals:**

- Multi-status filters (`?status=todo,blocked`)
- Transition rules that reject `todo → done` or similar
- Soft-delete; `DELETE` remains hard-delete
- Durability across restarts

## Decisions

### 1. Status enum, not extra booleans

Statuses: `todo` | `in_progress` | `blocked` | `done` | `cancelled`.

**Why this over keeping `completed` and adding `startedAt`:** two booleans
cannot express blocked vs cancelled, and timestamps still leave the current
state implicit.

**Alternative considered:** `pending` / `active` / `closed`. Rejected — too
coarse; `blocked` vs `cancelled` are different operational states.

### 2. Derived `completed` on every response

`completed` is `true` iff `status === "done"`. It is not stored. `PATCH` with
`{ "completed": true }` is treated as `{ "status": "done" }`; `{ "completed":
false }` is treated as `{ "status": "todo" }`.

**Why:** avoid breaking the existing store tests and any client that only
knows the boolean.

**Alternative considered:** drop `completed` in one breaking change. Deferred
— this is a playground API, but a dual-field window is cheap.

### 3. No enforced transitions

Any status may be PATCH'd to any other valid status. Invalid strings return
`400`.

**Why:** the store is a teaching API, not a workflow engine. Enforcing a DAG
now would invent policy we do not have (can you cancel from `blocked`? reopen
`done`?).

### 4. Filter is exact match, single value

`GET /tasks?status=blocked` returns only that status. Unknown status → `400`.
Omitted query param → current behavior (all tasks).

## Risks / Trade-offs

**[`completed` and `status` on the same PATCH]** → if both are sent and
disagree, last-write-wins is ambiguous. Proposal: if both present, `status`
wins and `completed` is ignored.

**[cancelled vs DELETE]** → two ways to "get rid of" a task. Cancelled tasks
still appear in `GET /tasks` unless filtered. Clients that want a trash view
must filter; clients that want it gone must DELETE.

**[in-memory only]** → status is lost on restart. Acceptable for this app;
do not pretend otherwise in docs.

## Open Questions

- Should `cancelled` tasks be excluded from unfiltered `GET /tasks`?
- When `completed: false` is PATCHed on a `blocked` task, is `todo` the
  right fallback, or should we restore the previous non-done status?
- Do we need `updatedAt` once status can change independently of title?
