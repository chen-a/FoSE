const express = require("express");
const {
  loginController,
  registerController,
  resetPasswordController,
  authController,
  applyDoctorController,
  applyNurseController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  findBedController,
  userAppointmentsController,
  userUpdateStatusController,
  getUserInfoController,
  updateProfileController,
  getBillsController
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

router.post("/reset-password", resetPasswordController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController);

//APply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

router.post("/apply-nurse", authMiddleware, applyNurseController);

//POST SINGLE USER INFO
router.post("/getUserInfo", authMiddleware, getUserInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//Notifiaction  Doctor || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);
//Notifiaction  Doctor || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//GET ALL DOC
router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookeAppointmnetController);

//Booking Avliability
router.post(
  "/booking-availbility",
  authMiddleware,
  bookingAvailabilityController
);

// Find Bed
router.post("/find-available-bed", authMiddleware, findBedController);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

// Appointment Status
router.post("/user-update-status", authMiddleware, userUpdateStatusController);

//GET ALL DOC
router.get("/getBills", authMiddleware, getBillsController);

module.exports = router;
