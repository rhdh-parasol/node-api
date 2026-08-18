class TaskStore {
  constructor() {
    this.tasks = new Map();
    this.nextId = 1;
  }

  create(title, description = '') {
    const task = {
      id: this.nextId++,
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  get(id) {
    return this.tasks.get(id) || null;
  }

  list() {
    return Array.from(this.tasks.values());
  }

  update(id, updates) {
    const task = this.tasks.get(id);
    if (!task) return null;

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.completed !== undefined) task.completed = updates.completed;

    return task;
  }

  delete(id) {
    return this.tasks.delete(id);
  }
}

module.exports = { TaskStore };
