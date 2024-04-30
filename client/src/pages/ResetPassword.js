import React from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/reset-password", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Password Changed Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };
  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          className="register-form"
        >
          <h3 className="text-center">Reset Password</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="New Password" name="newPassword">
            <Input type="password" required />
          </Form.Item>
          <Form.Item label="Confirm New Password" name="confirmPassword">
            <Input type="password" required />
          </Form.Item>
          <Form.Item>
            <button className="btn btn-primary" type="submit">
              Change Password
            </button>
          </Form.Item>
          <Link to="/login" className="login-link">
            Already a user? Log in here.
          </Link>
        </Form>
      </div>
    </>
  );
};

export default ResetPassword;
