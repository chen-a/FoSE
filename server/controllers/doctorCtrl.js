const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const billingModel = require("../models/billingModel");
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({where: { userId: req.body.userId }});
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

// update doc profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({where: { userId: req.body.userId }}
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

//get single docotor
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({where: { id: req.body.doctorId }});
    res.status(200).send({
      success: true,
      message: "Sigle Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Single doctor info",
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({where:{ userId: req.body.userId }});
    const appointments = await appointmentModel.findAll({
      where: {
        doctorId: doctor.id
      }
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

const updateStatusController = async (req, res) => {
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
    const user = await userModel.findOne({where: { id: appoint.userId }});
    let notification = user.notification;
    if (notification == null) {
      notification = "[]";
    }
    notification = JSON.parse(notification);
    notification.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
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

const createBillController = async (req, res) => {
  try {
    const appointmentData = req.body.record;
    console.log( appointmentData);
    console.log( appointmentData['appointmentId']);
    console.log( appointmentData['doctorInfo']);
    console.log( appointmentData['date']);
    console.log( appointmentData['amount']);
    const newBill = await billingModel.create({
      userId: appointmentData['userId'],
      amount: appointmentData['amount'],
      date: appointmentData['date'],
      appointmentId: appointmentData['id'],
      doctorInfo: appointmentData['doctorInfo'],
      amount: "300",
      isPaid: false,
    });
    await newBill.save();
    const appoint = await appointmentModel.findOne({where:{ id: appointmentData['id'] }});
    appoint.isBillCreated = true;
    await appoint.save();
    res.status(200).send({
      success: true,
      message: "Appointment Bill Created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Create Bill",
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  createBillController,
};
