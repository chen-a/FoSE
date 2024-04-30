import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        console.log(res.data.data);
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
   // ============ handle availiblity
   const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.message === "Appointment is not available at this time") {
        message.error(res.data.message);
      } else if (res.data.success) {
        setIsAvailable(true);
        console.log(isAvailable);
        message.success(res.data.message);
      }
      else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  // =============== booking func
  const handleBooking = async () => {
    try {
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      
      const avail = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!avail.data.success || avail.data.message === "Appointment is not available at this time (Availability Error)") {
        message.error("The requested time slot is not available.");
        dispatch(hideLoading());
        return;
      } 
      const bed = await axios.post("/api/v1/user/find-available-bed",
        { date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!bed.data.success || !bed) { // bed.data.message === "Bed available at this time") {
        message.error("Appointment is not available at this time (Bed Error)");
        dispatch(hideLoading());
        return;
      } 
      console.log("((((((((((((((((((((");
      console.log(bed);
      console.log("TEST");
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user.id,
          bedId: bed.data.bedId,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
          isBillCreated: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
      else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h3>Booking Page</h3>
              </div>
              <div className="card-body">
                {doctors && (
                  <div>
                    <h4>
                      Dr. {doctors.firstName} {doctors.lastName}
                    </h4>
                    <h4>Fees : {doctors.feesPerCunsaltation}</h4>
                    <h4>
                      Timings :{" "}
                      {doctors.timings && doctors.timings[1]} -{" "}
                      {doctors.timings && doctors.timings[2]}{" "}
                    </h4>
                    <div className="d-flex flex-column">
                      <DatePicker
                        aria-required={"true"}
                        className="m-2"
                        format="DD-MM-YYYY"
                        onChange={(value) => {
                          setDate(moment(value).format("DD-MM-YYYY"));
                        }}
                      />
                      <TimePicker
                        aria-required={"true"}
                        format="HH:mm"
                        className="mt-3"
                        onChange={(value) => {
                          setTime(moment(value).format("HH:mm"));
                        }}
                      />
  
                      <button
                        className="btn btn-primary mt-4"
                        onClick={handleAvailability}
                      >
                        Check Availability
                      </button>
  
                      <button className="btn btn-dark mt-2" onClick={handleBooking}>
                        Book Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
