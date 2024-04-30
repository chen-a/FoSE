import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import axios from "axios";
import HomePage from "./HomePage";

jest.mock("axios");

const mockStore = configureStore([]);

describe("HomePage component", () => {
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
        <HomePage />
      </MemoryRouter>
    </Provider>
  );

});

afterEach(() => {
jest.resetAllMocks();
});

it("renders the doctors list correctly", async () => {
const mockedDoctors = [
{
id: 1,
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
},
{
id: 2,
firstName: "Jane",
lastName: "Doe",
phone: "0987654321",
email: "janedoe@example.com",
website: "https://example.com",
address: "123 Main St.",
specialization: "Dentistry",
experience: "3 years",
feesPerCunsaltation: "50",
startTime: "10:00",
endTime: "18:00",
},
];

axios.get.mockResolvedValue({
    data: {
      success: true,
      data: mockedDoctors,
    },
  });
  
  await waitFor(() => {
    const doctorListElements = component.getAllByTestId("doctor-list-item");
    expect(doctorListElements.length).toBe(mockedDoctors.length);
  
    mockedDoctors.forEach((doctor, index) => {
      expect(doctorListElements[index]).toHaveTextContent(doctor.firstName);
      expect(doctorListElements[index]).toHaveTextContent(doctor.lastName);
      expect(doctorListElements[index]).toHaveTextContent(doctor.specialization);
    });
  });
});
});