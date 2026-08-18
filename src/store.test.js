const { describe, it } = require('node:test');
const assert = require('node:assert');
const { TaskStore } = require('./store');

describe('TaskStore', () => {
  it('creates a task with auto-incrementing id', () => {
    const store = new TaskStore();
    const task = store.create('Buy groceries', 'Milk and eggs');
    assert.strictEqual(task.id, 1);
    assert.strictEqual(task.title, 'Buy groceries');
    assert.strictEqual(task.description, 'Milk and eggs');
    assert.strictEqual(task.completed, false);
  });

  it('lists all tasks', () => {
    const store = new TaskStore();
    store.create('Task 1');
    store.create('Task 2');
    const tasks = store.list();
    assert.strictEqual(tasks.length, 2);
  });

  it('gets a task by id', () => {
    const store = new TaskStore();
    store.create('Find me');
    const task = store.get(1);
    assert.strictEqual(task.title, 'Find me');
  });

  it('returns null for non-existent task', () => {
    const store = new TaskStore();
    assert.strictEqual(store.get(999), null);
  });

  it('updates a task', () => {
    const store = new TaskStore();
    store.create('Original');
    const updated = store.update(1, { title: 'Updated', completed: true });
    assert.strictEqual(updated.title, 'Updated');
    assert.strictEqual(updated.completed, true);
  });

  it('deletes a task', () => {
    const store = new TaskStore();
    store.create('Delete me');
    assert.strictEqual(store.delete(1), true);
    assert.strictEqual(store.get(1), null);
  });
});
