import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { message, Table } from "antd";
import moment from "moment";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/user/user-update-status",
        { appointmentsId: record.id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorInfo",
      //render: (text, record) => (
        ///<span>
          //{record.doctorInfo.split(" ")[0]} {record.doctorInfo.split(" ")[1]}
        //</span>
      //),
    },
    {
      title: "Patient Name",
      dataIndex: "userInfo",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (date, record) => (
        <span>
          {moment(new Date(date)).format("DD-MM-YYYY")} &nbsp;
          {moment(new Date(record.time)).format("h:mm A")}
        </span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "approved" && (
            <div className="d-flex">
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "cancelled")}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
