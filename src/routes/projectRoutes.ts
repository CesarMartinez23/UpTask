import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { handleInputErrors } from "../middleware/validation";
import { validateProjectExists } from "../middleware/project";

const router = Router();

router.post(
  "/",
  body("projectName").notEmpty().withMessage("Project Name is required"),
  body("clientName").notEmpty().withMessage("Client Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  ProjectController.createProject
);

router.get(
  "/",

  ProjectController.getAllProjects
);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid Project ID"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Invalid Project ID"),
  body("projectName").notEmpty().withMessage("Project Name is required"),
  body("clientName").notEmpty().withMessage("Client Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid Project ID"),
  handleInputErrors,
  ProjectController.deleteProject
);

/* Routes for tasks */

router.param("projectId", validateProjectExists);

router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("Task Name is required"),
  body("description").notEmpty().withMessage("Task Description is required"),
  handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid Task ID"),
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid Task ID"),
  body("name").notEmpty().withMessage("Task Name is required"),
  body("description").notEmpty().withMessage("Task Description is required"),
  handleInputErrors,
  TaskController.updateTask
);

export default router;
