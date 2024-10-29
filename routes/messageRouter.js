const { Router } = require("express");
const messageController = require("../controllers/message_controller.js");

const router = Router();

router.get("/", messageController.printMessageForm);
router.post("/", messageController.postMessage);

module.exports = router;
