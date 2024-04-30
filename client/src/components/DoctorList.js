import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/DoctorList.css';
const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
    <div className="card-container">
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/doctor/book-appointment/${doctor.id}`)}
      >
        <div className="card-header">
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body">
          <p>
            <b>Specialization</b> {doctor.specialization}
          </p>
          <p>
            <b>Experience</b> {doctor.experience}
          </p>
          <p>
            <b>Fees Per Consultation</b> {doctor.feesPerCunsaltation}
          </p>
          <p>
            <b>Timings</b> {doctor.startTime} - {doctor.endTime}
          </p>
        </div>
      </div>
    </div>
  </>
  );
};

export default DoctorList;
