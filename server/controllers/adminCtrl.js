const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const nurseModel = require("../models/nurseModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "erorr while fetching users",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.findAll({where:{ status: "approved" }});
    res.status(200).send({
      success: true,
      message: "Doctors Data list",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting doctors data",
      error,
    });
  }
};

const getAllNursesController = async (req, res) => {
  try {
    const nurses = await nurseModel.findAll({where: {status: 'approved'}});
    res.status(200).send({
      success: true,
      message: "Nurses Data list",
      data: nurses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting nurses data",
      error,
    });
  }
};

// doctor account status
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    console.log(doctorId,status);
    // const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    // const doctor = await doctorModel.findOne({where: { id: doctorId }});
    // await doctorModel.update({status: status}, {where: {id: doctorId}});
    const [rowsUpdated, [updatedDoctor]] = await doctorModel.update(
      { status },
      {
        where: {
          userId: doctorId
        },
        returning: true
      }
    );
    
    const user = await userModel.findOne({where: { id: updatedDoctor.userId }});
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your doctorModel Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in Account Status",
      error,
    });
  }
};

const changeNurseAccountStatusController = async (req, res) => {
  try {
    const { nurseId, status } = req.body;
    console.log(nurseId, status);
    const rowsUpdated = await nurseModel.update(
      { status },
      {
        where: {
          id: nurseId
        }
      }
    );
    const nurseInfo = await nurseModel.findOne({where: {id: nurseId}});
    
    const user = await userModel.findOne({where: { id: nurseInfo.userId }});
    let notification = user.notification;
    if (notification == null) {
      notification = "[]";
    }
    notification = JSON.parse(notification);
    notification.push({
      type: "nurse-account-request-updated",
      message: `Your nurseModel Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isNurse = status === "approved" ? true : false;
    console.log("test");
    console.log("test2");
    console.log("id = " + user.id);
    console.log(user.isNurse);
    await user.save();
    res.status(201).send({
      success: true,
      message: "Nurse Account Status Updated",
      data: rowsUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in Account Status",
      error,
    });
  }
};

const makeDoctorController = async (req, res) =>{
  try {
    const user = await userModel.findOne({where: {id: req.body.id}});

    await userModel.update({ isDoctor: 1 }, {
      where: {
        id: req.body.id // the id of the user you want to update
      }
    })
 
    const newDoctor = await doctorModel.create({
      userId: user.id,
      firstName: user.name,
      lastName: '',
      phone: '',
      email: user.email,
      address: '',
      specialization: '',
      experience: '',
      feesPerCunsaltation: 0,
      status: 'approved',
      timings: '',
    });    
    console.log(newDoctor);
    await newDoctor.save();
    res.status(200).send({
      success: true,
      message: "New Doctor Created Successfully",
    });
  } catch (error) {
  console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Making Doctor",
      error,
    });
  }
}

const makeNurseController = async (req, res) =>{
  try {
    const user = await userModel.findOne({where: {id: req.body.id}});

    await userModel.update({ isNurse: true }, {
      where: {
        id: req.body.id // the id of the user you want to update
      }
    })
  
    const newNurse = await nurseModel.create({
      userId: user.id,
      firstName: user.name,
      lastName: '',
      phone: '',
      email: user.email,
      address: '',
      status: 'approved',
    });    
    console.log(newNurse);
    await newNurse.save();
    res.status(200).send({
      success: true,
      message: "New Nurse Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Making Nurse",
      error,
    });
  }
}

const getAdminInfoController = async (req, res) => {
  try {
    const admin = await userModel.findOne({where: { id: req.body.id }});
    res.status(200).send({
      success: true,
      message: "admin data fetch success",
      data: admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Admin Details",
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  getAllNursesController,
  makeDoctorController,
  changeAccountStatusController,
  changeNurseAccountStatusController,
  makeNurseController,
  getAdminInfoController
};
