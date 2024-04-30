const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const nurseModel = require("../models/nurseModel")
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const bedModel = require("../models/bedModel");
const insuranceModel = require("../models/insuranceModel");
const billingModel = require("../models/billingModel");

moment.tz.setDefault("America/Chicago");

//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({where: { email: req.body.email }});
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registered Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({where: { email: req.body.email }});
    if (!user) {
      return res
        .status(200)
        .send({ message: "User Not Found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user.id }, "XYZGHJ123", {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Successful", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const user = await userModel.findOne({where: {email: req.body.email}});
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    } 
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(200).send({
        message: "Passwords Do Not Match",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    const updatedUser = await userModel.update(
      { password: hashedPassword},
      {
        where: {
          id: user.id
        },
      }
    );
    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error While Changing Password",
    });
  }
}

const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({where: {id: req.body.userId} });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Authentication Error",
      success: false,
      error,
    });
  }
};

// Apply Doctor CTRL
const applyDoctorController = async (req, res) => {
  try {
    var userdata = req.body;

    const newDoctor = await doctorModel.create({
      userId: userdata['userId'],
      firstName: userdata['firstName'],
      lastName: userdata['lastName'],
      phone: userdata['phone'],
      email: userdata['email'],
      website: userdata['website'],
      address: userdata['address'],
      specialization: userdata['specialization'],
      experience: userdata['experience'],
      feesPerCunsaltation: userdata['feesPerCunsaltation'],
      status: 'pending',
      startTime: userdata['startTime'],
      endTime: userdata['endTime']
    });    
    await newDoctor.save();
    const adminUser = await userModel.findOne({
      where: {
        isAdmin: true
      }
    });
    let notification = adminUser.notification;
    if (notification == null) {
      notification = "[]";
    }
    notification = JSON.parse(notification);
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A doctorModel Account`,
      data: {
        doctorId: newDoctor.id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    const [rowsUpdated] = await userModel.update(
      { notification: JSON.stringify(notification) },
      {
        where: {
          id: adminUser.id
        },
        returning: true
      }
    );
      res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
};

const applyNurseController = async (req, res) => {
  try {
    var userdata = req.body;
    const newNurse = await nurseModel.create({
      userId: userdata['userId'],
      firstName: userdata['firstName'],
      lastName: userdata['lastName'],
      phone: userdata['phone'],
      email: userdata['email'],
      website: userdata['website'],
      address: userdata['address'],
      type: userdata['type'],
      status: 'pending',
      startTime: userdata['startTime'],
      endTime: userdata['endTime'],
    });    
    await newNurse.save();
    const adminUser = await userModel.findOne({
      where: {
        isAdmin: true
      }
    });
    let notification = adminUser.notification;
    if (notification == null) {
      notification = "[]";
    }
    notification = JSON.parse(notification);
    notification.push({ 
      type: "apply-nurse-request", 
      message: `${newNurse.firstName} ${newNurse.lastName} Has Applied For A nurseModel Account`, 
      data: { 
        nurseId: newNurse.id, 
        name: newNurse.firstName + " " + newNurse.lastName, 
        onClickPath: "/admin/nurses" 
      } 
    });
    const [rowsUpdated] = await userModel.update(
      { notification: JSON.stringify(notification) },
      {
        where: {
          id: adminUser.id
        }
      }
    );
    res.status(201).send({
      success: true,
      message: "Nurse Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Nurse",
    });
  }
};

//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: {
        id: req.body.userId
      }
    });
    let seennotification = user.seennotification;
    if (seennotification == null) {
      seennotification = [];
    }
    seennotification = JSON.parse(seennotification);
    let notification = user.notification;
    if (notification == null) {
      notification = [];
    }
    notification = JSON.parse(notification);
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All Notification Marked As Read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: {
        id: req.body.userId
      }
    });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable To Delete All Notifications",
      error,
    });
  }
};

//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.findAll({where:{ status: "approved" }});
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctors",
    });
  }
};

//BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = await appointmentModel.create({
      ...req.body,
      doctorInfo: req.body.doctorInfo.firstName + " " + req.body.doctorInfo.lastName,
      userInfo: req.body.userInfo.name,
    });
    await newAppointment.save();
    const user = await userModel.findOne({
      where: {
        id: req.body.doctorInfo.userId
      }
    });    
    let notification = user.notification;
    if (notification == null) {
      notification = "[]";
    }
    notification = JSON.parse(notification);
    notification.push({
      type: "New-appointment-request",
      message: `A new appointmentModel Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Booked Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

// booking bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    console.log("fromTime = " + fromTime);
    console.log("endTime = " + toTime);
    const appointments = await appointmentModel.findAll({
      where: {
        doctorId,
        date,
        time: {
          [Op.between]: [fromTime, toTime]
        }
      }
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment Is Not Available At This Time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointment is Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const findBedController = async (req, res) => {
  try {
    const { date, time } = req.body;
    const useDate = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(time, "HH:mm").add(1, "hours").toISOString();

    const beds = await bedModel.findAll();
    for (let i = 0; i < beds.length; i++) {
      const bedId = beds[i].id;
      const appointment = await appointmentModel.findOne({
        where: {
          bedId,
          date: useDate,
          time: {
            [Op.between]: [fromTime, toTime]
          }
        }
      });
      if (!appointment) {
        return res.status(200).send({
          success: true,
          bedId,
          message: "Found Available Bed"
        });
      }
    }
    return res.status(200).send({
      success: false,
      message: "Appointment is not available at this time (Availability Error)"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Finding Beds"
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.findAll({
      where: {
        userId: req.body.userId,
      },
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In userModel Appointments",
    });
  }
};

const userUpdateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const updatedAppointment = await appointmentModel.update(
      { status: status },
      {
        where: {
          id: appointmentsId
        },
      }
    );
    const appoint = await appointmentModel.findOne({where:{ id: appointmentsId }});
    const doc = await doctorModel.findOne({where: { id: appoint.doctorId }});
    let notification = doc.notification;
    if (notification == null) {
      notification = "[]";
    }
    notification = JSON.parse(notification);
    notification.push({
      type: "status-updated",
      message: `Patient Cancelled Their Appointment ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await doc.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

const getUserInfoController = async (req, res) => {
  try {
    const user = await userModel.findOne({where: { id: req.body.id }});
    res.status(200).send({
      success: true,
      message: "user data fetch success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching User Details",
    });
  }
};

// update user profile
const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findOne({where: { id: req.body.id }}
    );
    res.status(201).send({
      success: true,
      message: "Patient Profile Updated",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Patient Profile Update issue",
      error,
    });
  }
};

const getBillsController = async (req, res) => {
  try {
    const bills = await billingModel.findAll({
      where: {
        userId: req.body.userId,
      },
    });
    res.status(200).send({
      success: true,
      message: "Users Bills Fetched Successfully",
      data: bills,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Finding Bills",
    });
  }
};

module.exports = {
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
};