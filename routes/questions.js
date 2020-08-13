const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");

const questionsController = require("../controllers/questionsController");

router.get("/", questionsController.getQuestions);
router.get("/:id", questionsController.getQuestion);
router.post("/", isAuth, questionsController.createQuestion);
router.post("/:id", isAuth, questionsController.createComment);

module.exports = router;
