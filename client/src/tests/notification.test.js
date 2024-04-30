import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import axios from "axios";
import NotificationPage from "./NotificationPage";

jest.mock("axios");

const mockStore = configureStore([]);

describe("NotificationPage component", () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      user: {
        user: {
          id: 1,
          notification: JSON.stringify([
            {
              message: "Notification 1",
              onClickPath: "/path/to/notification/1",
            },
            {
              message: "Notification 2",
              onClickPath: "/path/to/notification/2",
            },
          ]),
          seennotification: JSON.stringify([
            {
              message: "Notification 3",
              onClickPath: "/path/to/notification/3",
            },
          ]),
        },
      },
    });

    component = render(
      <Provider store={store}>
        <MemoryRouter>
          <NotificationPage />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays unread notifications", () => {
    const notification1 = component.getByText("Notification 1");
    expect(notification1).toBeInTheDocument();

    const notification2 = component.getByText("Notification 2");
    expect(notification2).toBeInTheDocument();

    const markAllReadButton = component.getByText("Mark All Read");
    expect(markAllReadButton).toBeInTheDocument();
  });

  it("marks all unread notifications as read", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "All notifications marked as read.",
      },
    });

    const markAllReadButton = component.getByText("Mark All Read");
    fireEvent.click(markAllReadButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/v1/user/get-all-notification",
        { userId: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const successMessage = component.getByText("All notifications marked as read.");
      expect(successMessage).toBeInTheDocument();
    });
  });

  it("displays read notifications", () => {
    const readNotificationsTab = component.getByText("Read");
    fireEvent.click(readNotificationsTab);

    const notification3 = component.getByText("Notification 3");
    expect(notification3).toBeInTheDocument();

    const deleteAllReadButton = component.getByText("Delete All Read");
    expect(deleteAllReadButton).toBeInTheDocument();
  });

  it("deletes all read notifications", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "All read notifications deleted.",
      },
    });

    const readNotificationsTab = component.getByText("Read");
    fireEvent.click(readNotificationsTab);

    const deleteAllReadButton = component.getByText("Delete All Read");
    fireEvent.click(deleteAllReadButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/v1/user/delete-all-notification",
        { userId: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const successMessage = component.getByText("All read notifications deleted.");
      expect(successMessage).toBeInTheDocument();
    });
  });
});