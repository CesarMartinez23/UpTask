import type { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";

export class TaskController {
  static async createTask(req: Request, res: Response) {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error("Project not found");
      return res.status(404).json({ error: error.message });
    }
    try {
      const task = new Task({ ...req.body, project: projectId });
      task.project = req.project._id;
      req.project.tasks.push(task._id);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.status(201).send(task);
    } catch (error) {
      const errormsg = new Error("Project not found");
      res.status(500).json({ error: errormsg.message });
    }
  }

  static async getProjectTasks(req: Request, res: Response) {
    try {
      const tasks = await Task.find({ project: req.project._id }).populate(
        "project"
      );
      res.json(tasks);
    } catch (error) {
      const errormsg = new Error("Project not found");
      res.status(500).json({ error: errormsg.message });
    }
  }

  static async getTaskById(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Task not found");
        return res.status(404).json({ error: error.message });
      }
      if (task.project.toString() !== req.project._id) {
        const error = new Error("Task not found in project");
        return res.status(400).json({ error: error.message });
      }
      res.json(task);
    } catch (error) {
      const errormsg = new Error("Task not found");
      res.status(500).json({ error: errormsg.message });
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Task not found");
        return res.status(404).json({ error: error.message });
      }
      if (task.project.toString() !== req.project._id) {
        const error = new Error("Task not found in project");
        return res.status(400).json({ error: error.message });
      }
      task.name = req.body.name;
      task.description = req.body.description;
      await task.save();
      res.send("Task updated successfully");
    } catch (error) {
      const errormsg = new Error("Task not found");
      res.status(500).json({ error: errormsg.message });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Task not found");
        return res.status(404).json({ error: error.message });
      }
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== taskId
      );
      await Promise.allSettled([task.deleteOne(), req.project.save()]);
      res.send("Task deleted successfully");
    } catch (error) {
      const errormsg = new Error("Task not found");
      res.status(500).json({ error: errormsg.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { taskId } = req.params;

      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Task not found");
        return res.status(404).json({ error: error.message });
      }
      const { status } = req.body;
      task.status = status;
      await task.save();
      res.send("Task status updated successfully");
    } catch (error) {
      const errormsg = new Error("Task not found");
      res.status(500).json({ error: errormsg.message });
    }
  }
}
