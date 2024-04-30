import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import axios from "axios";
import Login from "./Login";

jest.mock("axios");

const mockStore = configureStore([]);

describe("Login component", () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({});
    component = render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the login form fields correctly", () => {
    const emailInput = component.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = component.getByPlaceholderText("Password");
    expect(passwordInput).toBeInTheDocument();

    const submitButton = component.getByText("Login");
    expect(submitButton).toBeInTheDocument();
  });

  it("submits the login form data correctly", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        token: "my_token",
      },
    });

    const emailInput = component.getByPlaceholderText("Email");
    const passwordInput = component.getByPlaceholderText("Password");
    const submitButton = component.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/v1/user/login", {
        email: "test@example.com",
        password: "password",
      });

      expect(localStorage.getItem("token")).toEqual("my_token");
    });
  });
});