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
}
