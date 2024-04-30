import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import ApplyNurse from "../pages/ApplyNurse";

describe("ApplyNurse component", () => {
  const wrapper = mount(
    <MemoryRouter>
      <Provider store={store}>
        <ApplyNurse />
      </Provider>
    </MemoryRouter>
  );

  it("should render a form with input fields", () => {
    expect(wrapper.find("form").length).toEqual(1);
    expect(wrapper.find("input[type='text']").length).toEqual(5);
    expect(wrapper.find("input[type='email']").length).toEqual(1);
    expect(wrapper.find("TimePicker").length).toEqual(2);
    expect(wrapper.find("Button").length).toEqual(1);
  });

  it("should show an error message if an invalid email is entered", () => {
    wrapper.find("input[name='email']").simulate("change", {
      target: { value: "invalid_email" },
    });
    wrapper.find("form").simulate("submit");
    expect(wrapper.find(".ant-form-item-explain").text()).toContain(
      "Please enter a valid email address."
    );
  });

  it("should submit the form successfully when all required fields are filled out", () => {
    wrapper.find("input[name='firstName']").simulate("change", {
      target: { value: "John" },
    });
    wrapper.find("input[name='lastName']").simulate("change", {
      target: { value: "Doe" },
    });
    wrapper.find("input[name='phone']").simulate("change", {
      target: { value: "1234567890" },
    });
    wrapper.find("input[name='email']").simulate("change", {
      target: { value: "johndoe@example.com" },
    });
    wrapper.find("input[name='address']").simulate("change", {
      target: { value: "123 Main St" },
    });
    wrapper.find("input[name='type']").simulate("change", {
      target: { value: "RN" },
    });
    wrapper.find("input[name='status']").simulate("change", {
      target: { value: "Pending" },
    });
    wrapper.find("TimePicker[name='startTime']").simulate("change", {
      target: { value: "10:00" },
    });
    wrapper.find("TimePicker[name='endTime']").simulate("change", {
      target: { value: "18:00" },
    });
    wrapper.find("form").simulate("submit");
    expect(wrapper.find(".ant-message-success").text()).toContain(
      "Application submitted successfully."
    );
  });
});