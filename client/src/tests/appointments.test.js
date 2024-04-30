import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Appointments from './Appointments';

const mockAxios = new MockAdapter(axios);

describe('Appointments', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render a table with appointments data', async () => {
    const appointments = [
      {
        id: 1,
        doctorInfo: 'Dr. John Smith',
        userInfo: 'Jane Doe',
        date: '2023-05-10T10:00:00.000Z',
        time: '2023-05-10T10:00:00.000Z',
        status: 'approved',
        actions: 'actions',
      },
      {
        id: 2,
        doctorInfo: 'Dr. Jane Smith',
        userInfo: 'John Doe',
        date: '2023-05-11T10:00:00.000Z',
        time: '2023-05-11T10:00:00.000Z',
        status: 'cancelled',
        actions: 'actions',
      },
    ];
    mockAxios.onGet('/api/v1/user/user-appointments').reply(200, {
      success: true,
      data: appointments,
    });

    render(<Appointments />);

    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('10-05-2023 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('approved')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('11-05-2023 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('cancelled')).toBeInTheDocument();
  });

  it('should be able to cancel an appointment', async () => {
    const appointments = [
      {
        id: 1,
        doctorInfo: 'Dr. John Smith',
        userInfo: 'Jane Doe',
        date: '2023-05-10T10:00:00.000Z',
        time: '2023-05-10T10:00:00.000Z',
        status: 'approved',
        actions: 'actions',
      },
    ];
    mockAxios.onGet('/api/v1/user/user-appointments').reply(200, {
      success: true,
      data: appointments,
    });

    mockAxios
      .onPost('/api/v1/user/user-update-status', {
        appointmentsId: 1,
        status: 'cancelled',
      })
      .reply(200, { success: true, message: 'Appointment cancelled' });

    render(<Appointments />);

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockAxios.history.post.length).toBe(1));
    expect(mockAxios.history.post[0].url).toBe(
      '/api/v1/user/user-update-status'
    );
    expect(mockAxios.history.post[0].data).toEqual({
      appointmentsId: 1,
      status: 'cancelled',
    });
    expect(screen.getByText('Appointment cancelled')).toBeInTheDocument();
  });
});
