## ADDED Requirements

### Requirement: Task status is a required field with a default

Every task SHALL have a `status` of one of: `todo`, `in_progress`,
`blocked`, `done`, `cancelled`. If the client omits `status` on create, the
task SHALL be created with `status: "todo"`.

#### Scenario: Create with explicit status

- **WHEN** a client `POST /tasks` with `{"title": "Ship it", "status": "in_progress"}`
- **THEN** the created task has `status` `"in_progress"` and `completed` `false`

#### Scenario: Create without status defaults to todo

- **WHEN** a client `POST /tasks` with `{"title": "Ship it"}`
- **THEN** the created task has `status` `"todo"` and `completed` `false`

#### Scenario: Create with invalid status is rejected

- **WHEN** a client `POST /tasks` with `{"title": "Ship it", "status": "donezo"}`
- **THEN** the API responds `400` and no task is created

### Requirement: Status can be updated independently of title

`PATCH /tasks/:id` SHALL accept `status` and persist it without requiring
other fields.

#### Scenario: Move a task to blocked

- **WHEN** a client `PATCH /tasks/1` with `{"status": "blocked"}`
- **THEN** the task's `status` is `"blocked"` and `completed` is `false`

#### Scenario: Mark done via status

- **WHEN** a client `PATCH /tasks/1` with `{"status": "done"}`
- **THEN** the task's `status` is `"done"` and `completed` is `true`

#### Scenario: Mark done via legacy completed flag

- **WHEN** a client `PATCH /tasks/1` with `{"completed": true}`
- **THEN** the task's `status` is `"done"` and `completed` is `true`

### Requirement: List can filter by a single status

`GET /tasks` SHALL accept an optional `status` query parameter. When present,
only tasks with that exact status are returned.

#### Scenario: Filter in-progress tasks

- **GIVEN** the store has one `todo` task and one `in_progress` task
- **WHEN** a client `GET /tasks?status=in_progress`
- **THEN** the response is a JSON array of length 1 whose item has
  `status` `"in_progress"`

#### Scenario: Unfiltered list still returns every task

- **WHEN** a client `GET /tasks` with no query string
- **THEN** the response includes tasks of every status, including
  `cancelled`

#### Scenario: Unknown filter value is rejected

- **WHEN** a client `GET /tasks?status=donezo`
- **THEN** the API responds `400`
