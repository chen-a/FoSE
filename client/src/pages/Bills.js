import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { message, Table, Modal,Form, Input  } from "antd";
import moment from "moment";

const Bills = () => {
  const [bill, setBill] = useState([]);
  const [visible, setVisible] = useState(false); // state to control Modal visibility
  const [form] = Form.useForm();

  const getBills = async () => {
    try {
      const res = await axios.get("/api/v1/user/getBills", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setBill(res.data.data);
        console.log("here:" + res.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (record) => {
    try {
      const res = await axios.post(
        "/api/v1/user/user-update-status",
        { appointmentsId: record.id, status: "paid" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        setVisible(false);
        getBills();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

   useEffect(() => {
     getBills();
   }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorInfo",
    },
    {
      title: "Appointment Date",
      dataIndex: "date",
      render: (date, record) => (
        <span>
          {moment(new Date(date)).format("DD-MM-YYYY")}
        </span>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Status",
      dataIndex: "isPaid",
      render: (isPaid) => (
        <span>{isPaid ? "Paid" : "Not Paid"}</span>
      )
    },
    {
      title: "Actions",
      dataIndex: "isPaid",
      render: (text, record) => (
        <div className="d-flex">
          {!record.isPaid && (
            <div className="d-flex">
              <button
                className="btn btn-danger ms-2"
                 onClick={() => setVisible(true) }
              >
                Make Payment
              </button>
              <Modal
                title="Enter Credit Card Information"
                open={visible}
                onOk={() => form.submit()}
                onCancel={() => setVisible(false)}
              >
                <Form form={form} onFinish={() => handlePayment(record)}>
                  <Form.Item
                    name="cardNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your credit card number",
                      },
                    ]}
                  >
                    <Input placeholder="Credit Card Number" />
                  </Form.Item>
                  <Form.Item
                    name="expiryDate"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your credit card expiry date",
                      },
                    ]}
                  >
                    <Input placeholder="Expiry Date (MM/YY)" />
                  </Form.Item>
                  <Form.Item
                    name="cvv"
                    rules={[
                      {
                        required: true,
                        message: "Enter CVV"
                      },
                    ]}
                    >
                      <Input placeholder="CVV" />
                    </Form.Item>
                    </Form>
                    </Modal>

            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Table columns={columns} dataSource={bill} />

      {/* <Modal
        title="Make Payment"
        open={paymentModalVisible}
        onOk={() => handlePaymentSubmit()}
        onCancel={() => setPaymentModalVisible(false)}
      > */}
    </Layout>
  );
};

export default Bills;
