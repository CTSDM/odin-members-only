const { Router } = require("express");
const messageController = require("../controllers/message_controller.js");

const router = Router();

router.get("/", messageController.printMessageForm);
router.post("/", messageController.postMessage);
router.post("/:msgID", messageController.deleteMessage);

module.exports = router;
