import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Doctors from '../Doctors';

describe('Doctors', () => {
  const mock = new MockAdapter(axios);

  afterEach(() => {
    mock.reset();
  });

  it('renders table with correct columns', async () => {
    const doctors = [
      {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        status: 'pending',
        phone: '1234567890',
      },
      {
        id: 2,
        userId: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        status: 'approved',
        phone: '0987654321',
      },
    ];

    mock.onGet('/api/v1/admin/getAllDoctors').reply(200, {
      success: true,
      data: doctors,
    });

    render(<Doctors />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('All Doctors')).toBeInTheDocument();

    for (const doctor of doctors) {
      expect(screen.getByText(`${doctor.firstName} ${doctor.lastName}`)).toBeInTheDocument();
      expect(screen.getByText(doctor.status)).toBeInTheDocument();
      expect(screen.getByText(doctor.phone)).toBeInTheDocument();
    }
  });

  it('updates doctor account status on approve button click', async () => {
    const doctors = [
      {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        status: 'pending',
        phone: '1234567890',
      },
    ];

    mock.onGet('/api/v1/admin/getAllDoctors').reply(200, {
      success: true,
      data: doctors,
    });

    mock.onPost('/api/v1/admin/changeAccountStatus').reply(200, {
      success: true,
      message: 'Account status updated successfully',
    });

    render(<Doctors />);

    const approveButton = screen.getByText('Approve');

    fireEvent.click(approveButton);

    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].data).toBe(JSON.stringify({ doctorId: 1, userId: 1, status: 'approved' }));
    expect(screen.getByText('Account status updated successfully')).toBeInTheDocument();
  });

  it('shows error message on failed update of doctor account status', async () => {
    const doctors = [
      {
        id: 1,
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        status: 'pending',
        phone: '1234567890',
      },
    ];

    mock.onGet('/api/v1/admin/getAllDoctors').reply(200, {
      success: true,
      data: doctors,
    });

    mock.onPost('/api/v1/admin/changeAccountStatus').reply(400, {
      success: false,
      message: 'Failed to update account status',
    });

    render(<Doctors />);

    const approveButton = screen.getByText('Approve');

    fireEvent.click(approveButton);

    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].data).toBe(JSON.stringify({ doctorId: 1, userId: 1, status: 'approved' }));
    expect(screen.getByText('Failed to update account status')).toBeInTheDocument();
  });
});
