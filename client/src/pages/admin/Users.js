import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { MessageApi } from "antd/lib/message";

const Users = () => {
  const [users, setUsers] = useState([]);
  
  //getUsers
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const makeDoctor = async (record) => {
    try {
      const res = await axios.post( "/api/v1/admin/makeDoctor",
        record,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        window.location.reload();
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } 
    catch (error) {
      message.error(error);
      console.log(error);
    }
  };


  const makeNurse = async (record) => {
    try {
      const res = await axios.post( "/api/v1/admin/makeNurse",
        record,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        window.location.reload();
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } 
    catch (error) {
      message.error(error);
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // antD table col
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Nurse",
      dataIndex: "isNurse",
      render: (text, record) => <span>{record.isNurse ? "Yes" : "No"}</span>,
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger">Block</button>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button disabled={record.isDoctor || record.isNurse} 
          className="btn btn-primary" 
          onClick={() => makeDoctor(record)}
          >
            Make Doctor
          </button>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button disabled={record.isNurse || record.isDoctor} 
          className="btn btn-info" 
          onClick={() => makeNurse(record)}
          >
            Make Nurse
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Users List</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};

export default Users;
