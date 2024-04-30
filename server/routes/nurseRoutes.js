const express = require("express");
const {
  getNurseInfoController,
  updateProfileController
} = require("../controllers/nurseCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getNurseInfo", authMiddleware, getNurseInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);