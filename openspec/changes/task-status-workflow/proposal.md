## Why

The task API only models work as `completed: true|false`. That is enough for a
checkbox, but not for a workflow: a task can be unstarted, in progress, blocked
on someone else, or abandoned. Callers currently overload `description` or
invent client-side conventions to express that. We want a first-class status
so list/filter and PATCH have a shared language.

## What Changes

- Replace the boolean `completed` field with a `status` enum on each task
- Accept `status` on create and update
- Allow `GET /tasks?status=` to filter the in-memory list
- Keep a derived `completed` boolean on responses (`status === "done"`) so
  existing clients do not immediately break

## Non-goals

- Persistence beyond process lifetime (store stays in-memory)
- Auth, multi-tenancy, or per-user task lists
- Due dates, assignees, comments, or subtasks
- Pagination, sorting, or full-text search
- A state-machine library or workflow engine

## Capabilities

### New Capabilities

- `task-status`: Task lifecycle status (`todo`, `in_progress`, `blocked`,
  `done`, `cancelled`) on create/update, plus list filtering by status

### Modified Capabilities

_(none — this repo has no long-lived `openspec/specs/` yet)_

## Canonical Touchpoints

- **PRDs / ADRs**: None
- **Long-lived specs (`openspec/specs/`)**: None in this change (new capability
  only; promote after apply if we keep the model)

**Change type**: feature-spec

## Impact

- **API**: `POST /tasks` and `PATCH /tasks/:id` accept `status`; `GET /tasks`
  gains a `status` query parameter; task JSON gains `status` and keeps
  `completed` as a derived field
- **Store**: `TaskStore.create` / `update` / `list` learn status + filter
- **Tests**: store tests cover default status, invalid status, and list filter
