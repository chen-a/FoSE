import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import axios from "axios";
import Register from "./Register";

jest.mock("axios");

const mockStore = configureStore([]);

describe("Register component", () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({});

    component = render(
      <Provider store={store}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the form fields correctly", () => {
    const nameInput = component.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();

    const emailInput = component.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = component.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();

    const registerButton = component.getByText("Register");
    expect(registerButton).toBeInTheDocument();
  });

  it("submits the form data correctly", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "Register Successfully!",
      },
    });

    const nameInput = component.getByLabelText("Name");
    const emailInput = component.getByLabelText("Email");
    const passwordInput = component.getByLabelText("Password");
    const registerButton = component.getByText("Register");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "johndoe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/v1/user/register",
        {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        }
      );
      const successMessage = component.getByText("Register Successfully!");
      expect(successMessage).toBeInTheDocument();
    });
  });
});