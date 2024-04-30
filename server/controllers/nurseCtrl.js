const nurseModel = require("../models/nurseModel");

const getNurseInfoController = async (req, res) => {
  try {
    const nurse = await nurseModel.findOne({where: { userId: req.body.userId }});
    res.status(200).send({
      success: true,
      message: "nurse data fetch success",
      data: nurse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Nurse Details",
    });
  }
};

// update nurse profile
const updateProfileController = async (req, res) => {
  try {
    const nurse = await nurseModel.findOne({where: { userId: req.body.userId }}
    );
    res.status(201).send({
      success: true,
      message: "Nurse Profile Updated",
      data: nurse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Nurse Profile Update issue",
      error,
    });
  }
};


module.exports = {
    getNurseInfoController,
    updateProfileController
  };