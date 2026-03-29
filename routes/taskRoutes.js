const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.post(
  "/",
  authorizeRoles("admin head", "admin"),
  taskController.createTask,
);

router.get(
  "/",
  authorizeRoles("admin head", "admin"),
  taskController.viewAllTasks,
);

router.put(
  "/:id/assign",
  authorizeRoles("admin"),
  taskController.assignTaskToDriver,
);

router.get(
  "/driver/my-tasks",
  authorizeRoles("driver"),
  taskController.viewMyTasks,
);

router.put(
  "/:id/status",
  authorizeRoles("driver"),
  taskController.updateMyTaskStatus,
);

router.post(
  "/assign-bulk",
  authorizeRoles("admin"),
  taskController.assignBulkTasksToDriver,
);

module.exports = router;
