const router = require("express").Router();
const authController = require("../controllers/auth.controller.js");
const userController = require('../controllers/user.controller.js');
const conversationController = require('../controllers/conversation.controller')
const messageController = require('../controllers/message.controller')
const auth = require("../middleware/auth.middleware")
const resetMiddleware = require("../middleware/reset.middleware")
const admin = require("../middleware/admin.middleware.js");

// register
router.post("/api/register", authController.signUp);

// login
router.post("/api/login", authController.signIn);

// logout
router.post("/api/logout", authController.logout);

// loggedIn
router.get("/api/loggedIn", auth,authController.loggedIn);

// resetPassword
router.put("/api/resetPassword/:token", resetMiddleware, authController.resetPassword);

// forgotPassword
router.put("/api/forgotPassword", auth,authController.forgotPassword);

// changePassword
router.put("/api/changePassword/:token", auth ,authController.changePassword);

// getUser
router.post("/api/getUser", auth,userController.getUser);

// checkTokenValidity
router.post("/api/checkToken", resetMiddleware,authController.checkToken)

// get admin username
router.post("/api/adminUsername", auth,conversationController.getAdmin);

// start new conversation
router.post("/api/newConversation", auth,conversationController.newConversation);

// send message
router.post("/api/sendMessage", auth,conversationController.sendMessage);

// get single conversation
router.post("/api/conversation/:id", auth,conversationController.getSingleConversation);

// get all conversations
router.post("/api/conversations", auth,conversationController.getAllConversations);

// has already started a conversation ?
router.post("/api/hasConversation", auth, conversationController.hasConversation);

// check is valid conversation
router.post("/api/checkConversation", auth,conversationController.checkIsValidConversation)

// send simple message
router.post("/api/simpleMessage", messageController.sendSimpleMessage)

// get all simple messages
router.get("/api/messages", admin, messageController.getAllSimpleMessages)

// get simple message
router.post("/api/message", admin, messageController.getSimpleMessage)

// check if simple message is valid
router.post("/api/checkMessage", auth,messageController.checkIsValidMessage)

module.exports = router;
