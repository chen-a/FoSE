import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import DoctorList from "../components/DoctorList";
const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.get(
        "/api/v1/user/getAllDoctors",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="text-center mb-4">Home</h1>
            <h3 className="text-center mb-4">Click on any doctor to schedule an appointment with them.</h3>
            <div className="card-deck" style={{ overflowY: 'scroll', maxHeight: '600px' }}>
              {doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
