import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;
      let tasks = database.selectAll("tasks");
      if (search) {
        tasks = database.selectAll("tasks", {});
      }
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title and description not found in the request body...",
          })
        );
      }

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title not found in the request body...",
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Description not found in the request body...",
          })
        );
      }

      const created_at = new Date();
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: created_at,
        updated_at: created_at,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title or description are required fields...",
          })
        );
      }

      const task = database.selectAll("tasks", { id })[0];
      if (!task.id) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "Task not found...",
          })
        );
      }

      const new_date = new Date();
      database.update("tasks", id, {
        title,
        description,
        completed_at: task.completed_at,
        created_at: task.created_at,
        updated_at: new_date,
      });

      res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectAll("tasks", { id })[0];

      if (!task.id) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "Task not found...",
          })
        );
      }

      if (task.completed_at != null) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "This task is already completed...",
          })
        );
      }

      task.completed_at = new Date();

      database.update("tasks", id, { ...task });

      res.writeHead(204).end();
    },
  },
];
