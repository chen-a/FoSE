import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import axios from "axios";
import ApplyDoctor from "./ApplyDoctor";

jest.mock("axios");

const mockStore = configureStore([]);

describe("ApplyDoctor component", () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      user: {
        user: {
          id: 1,
        },
      },
    });

    component = render(
      <Provider store={store}>
        <MemoryRouter>
          <ApplyDoctor />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("submits the form data correctly", async () => {
  axios.post.mockResolvedValue({
    data: {
      success: true,
      message: "Doctor application submitted successfully.",
    },
  });

  const firstNameInput = component.getByLabelText("First Name");
  const lastNameInput = component.getByLabelText("Last Name");
  const phoneInput = component.getByLabelText("Phone No");
  const emailInput = component.getByLabelText("Email");
  const websiteInput = component.getByLabelText("Website");
  const addressInput = component.getByLabelText("Address");
  const specializationInput = component.getByLabelText("Specialization");
  const experienceInput = component.getByLabelText("Experience");
  const feesInput = component.getByLabelText("Fees Per Consultation");
  const startTimeInput = component.getByLabelText("Start Time");
  const endTimeInput = component.getByLabelText("End Time");
  const submitButton = component.getByText("Submit");

  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  fireEvent.change(phoneInput, { target: { value: "1234567890" } });
  fireEvent.change(emailInput, { target: { value: "johndoe@example.com" } });
  fireEvent.change(websiteInput, { target: { value: "https://example.com" } });
  fireEvent.change(addressInput, { target: { value: "123 Main St." } });
  fireEvent.change(specializationInput, { target: { value: "Cardiology" } });
  fireEvent.change(experienceInput, { target: { value: "5 years" } });
  fireEvent.change(feesInput, { target: { value: "100" } });
  fireEvent.change(startTimeInput, { target: { value: "09:00" } });
  fireEvent.change(endTimeInput, { target: { value: "17:00" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "/api/v1/user/apply-doctor",
      {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
        email: "johndoe@example.com",
        website: "https://example.com",
        address: "123 Main St.",
        specialization: "Cardiology",
        experience: "5 years",
        feesPerCunsaltation: "100",
        startTime: "09:00",
        endTime: "17:00",
        userId: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const successMessage = component.getByText(
      "Doctor application submitted successfully."
    );
    expect(successMessage).toBeInTheDocument();
  });
});
});