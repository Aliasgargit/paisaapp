const express = require("express");
const userRouter = require("./uesr")
const router = express.Router();

router.use("/user",userRouter);
router.use("/account",accountRouter);
module.exports = router;