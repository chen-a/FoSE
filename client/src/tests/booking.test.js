import React from "react";
import { mount } from "enzyme";
import axios from "axios";
import BookingPage from "./BookingPage";
import { act } from "react-dom/test-utils";

jest.mock("axios");

describe("BookingPage component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<BookingPage />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the BookingPage component", () => {
    expect(wrapper.find(BookingPage)).toHaveLength(1);
  });

  it("should call getUserData function on mount", async () => {
    const spy = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: { success: true },
    });
    await act(async () => {
      wrapper = mount(<BookingPage />);
    });
    expect(spy).toHaveBeenCalledWith(
      "/api/v1/doctor/getDoctorById",
      { doctorId: undefined },
      { headers: { Authorization: "Bearer null" } }
    );
  });

  it("should handleAvailability function when check availability button clicked", async () => {
    const spy = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: { success: true, message: "Appointment is available" },
    });
    await act(async () => {
      wrapper.find("button").at(1).simulate("click");
    });
    expect(spy).toHaveBeenCalledWith(
      "/api/v1/user/booking-availbility",
      { doctorId: undefined, date: "", time: undefined },
      { headers: { Authorization: "Bearer null" } }
    );
    expect(wrapper.find("button").at(1).text()).toEqual("Book Now");
  });

  it("should handleBooking function when book now button clicked", async () => {
    const spy = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: { success: true, message: "Appointment booked successfully" },
    });
    await act(async () => {
      wrapper.find("button").at(1).simulate("click");
      wrapper.find("button").at(2).simulate("click");
    });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(
      "/api/v1/user/booking-availbility",
      { doctorId: undefined, date: "", time: undefined },
      { headers: { Authorization: "Bearer null" } }
    );
    expect(spy).toHaveBeenCalledWith(
      "/api/v1/user/find-available-bed",
      { date: "", time: undefined },
      { headers: { Authorization: "Bearer null" } }
    );
    expect(wrapper.find("button").at(2).text()).toEqual("Book Now");
  });
});