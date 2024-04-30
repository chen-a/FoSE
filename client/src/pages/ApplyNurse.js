import React from "react";
import Layout from "./../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { Col, Form, Input, Row, TimePicker, message, Button } from "antd";

const ApplyNurse = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      console.log("test");
      console.log(values);
      const res = await axios.post(
        "/api/v1/user/apply-nurse",
        {
          ...values,
          userId: user.id,
          startTime: values.startTime.format('HH:mm'),
          endTime: values.endTime.format('HH:mm'),
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
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  // validate email format
  const validateEmail = (rule, value, callback) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      callback("Please enter a valid email address.");
    } else {
      callback();
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Apply Nurse</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              required
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="Your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              required
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="Your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Phone No"
              name="phone"
              required
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="Your contact no" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Email"
              name="email"
              required
              rules={[{ required: true }, { validator: validateEmail }]}
            >
              <Input type="email" placeholder="Your email address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Address" name="address" required>
              <Input type="text" placeholder="Your address" />
            </Form.Item>
          </Col>
        </Row>
      <h4>Professional Details:</h4>
      <Row gutter={20}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Type"
            name="type"
          >
            <Input type="text" placeholder="Type of nurse" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Status"
            name="status"
          >
            <Input type="text" placeholder="Status of application" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item 
            label="Start Time" 
            name="startTime" 
            required>
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item 
            label="End Time" 
            name="endTime" 
            required>
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-center">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  </Layout>
);
};

export default ApplyNurse;
