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
      task.project = project._id;
      project.tasks.push(task._id);
      await task.save();
      await project.save();
      res.status(201).send(task);
    } catch (error) {
      console.log(error);
    }
  }
}
