const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");
const commentsController = require("../controllers/commentsController");

router.post("/:id", isAuth, errorWrapper(commentsController.createComment));

router.put("/edit/:id", isAuth, errorWrapper(commentsController.editComment));

router.post(
  "/select-answer/:questionId/:commentId",
  isAuth,
  authRole(roles.Teacher),
  errorWrapper(commentsController.selectAnswer)
);

router.post(
  "/deselect-answer/:questionId/:commentId",
  isAuth,
  authRole(roles.Teacher),
  errorWrapper(commentsController.deselectAnswer)
);

router.delete(
  "/:questionId/:commentId",
  isAuth,
  authRole(roles.Teacher),
  errorWrapper(commentsController.deleteComment)
);

module.exports = router;
