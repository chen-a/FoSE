import React from "react";
import Layout from "./../components/Layout";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { Button } from 'antd';
const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //handle form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          userId: user.id,
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
      message.error("Something Went Wrrong ");
    }
  };

  const validateEmail = (rule, value, callback) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      callback("Please enter a valid email address.");
    } else {
      callback();
    }
  };

  const validateFees = (rule, value, callback) => {
    if (value && isNaN(value)) {
      callback("Please enter a valid number for fees per consultation.");
    } else {
      callback();
    }
  };
return(
<Layout>
  <h1 className="text-center">Apply Doctor</h1>
  <Form layout="vertical" onFinish={handleFinish} className="m-3">
    <h4>Personal Details:</h4>
    <Row gutter={20}>
      <Col xs={24} md={8}>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input type="text" placeholder="Your first name" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true }]}
        >
          <Input type="text" placeholder="Your last name" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item
          label="Phone No"
          name="phone"
          rules={[{ required: true }]}
        >
          <Input type="text" placeholder="Your contact no" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }, {validator: validateEmail}]}
        >
          <Input type="email" placeholder="Your email address" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Website" name="website">
          <Input type="text" placeholder="Your website" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true }]}
        >
          <Input type="text" placeholder="Your clinic address" />
        </Form.Item>
      </Col>
    </Row>
    <h4>Professional Details:</h4>
    <Row gutter={20}>
      <Col xs={24} md={8}>
        <Form.Item
          label="Specialization"
          name="specialization"
          rules={[{ required: true }]}
        >
          <Input type="text" placeholder="Your specialization" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item
          label="Experience"
          name="experience"
          rules={[{ required: true }]}
        >
          <Input type="text" placeholder="Your experience" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item
          label="Fees Per Consultation"
          name="feesPerCunsaltation"
          rules={[{ required: true }, {validator: validateFees}]}
        >
          <Input type="text" placeholder="Your contact no" />
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
      <Col xs={24} md={8}></Col>
      <Col xs={24} md={8}>
      <Button className="btn-primary form-btn" type="submit">
          Submit
        </Button>
      </Col>
    </Row>
  </Form>
</Layout>
);
};

export default ApplyDoctor;
