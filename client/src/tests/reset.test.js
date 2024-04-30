import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import ResetPassword from "./ResetPassword";

jest.mock("axios");

describe("ResetPassword component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByText("Reset Password")).toBeInTheDocument();
  });

  it("submits the form with correct data", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
      },
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword" },
    });

    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByRole("button"));

    expect(axios.post).toHaveBeenCalledWith("/api/v1/user/reset-password", {
      email: "test@test.com",
      newPassword: "newpassword",
      confirmPassword: "newpassword",
    });

    await screen.findByText("Password Changed Successfully!");
  });

  it("displays error message if form submission fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Something went wrong"));

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpassword" },
    });

    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByRole("button"));

    expect(axios.post).toHaveBeenCalledWith("/api/v1/user/reset-password", {
      email: "test@test.com",
      newPassword: "newpassword",
      confirmPassword: "newpassword",
    });

    await screen.findByText("Something Went Wrong");
  });
});