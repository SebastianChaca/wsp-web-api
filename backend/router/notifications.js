/*
    Path: api/notifications
*/

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  updateNotificationsMessage,
  resetNotificationsMessage,
} = require("../constrollers/notifications");
const router = Router();

router.post("/messages", validarJWT, updateNotificationsMessage);
router.post("/messages/reset", validarJWT, resetNotificationsMessage);
module.exports = router;
