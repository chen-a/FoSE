const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  getAllNursesController,
  changeAccountStatusController,
  changeNurseAccountStatusController,
  makeDoctorController,
  makeNurseController,
  getAdminInfoController
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

router.get("/getAllNurses", authMiddleware, getAllNursesController);

//POST ACCOUNT STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

router.post(
  "/changeNurseAccountStatus",
  authMiddleware,
  changeNurseAccountStatusController
);

router.post("/makeDoctor", authMiddleware, makeDoctorController);

router.post("/makeNurse", authMiddleware, makeNurseController);

router.post("/getAdminInfo", authMiddleware, getAdminInfoController);

module.exports = router;
