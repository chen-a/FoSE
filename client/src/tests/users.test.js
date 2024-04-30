import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Users from '../Users';

jest.mock('axios');

describe('Users', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'testToken');
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('displays the users list', async () => {
    const data = [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        isDoctor: false,
        isNurse: false,
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        isDoctor: true,
        isNurse: false,
      },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data,
      },
    });

    render(<Users />);

    expect(screen.getByText('Users List')).toBeInTheDocument();
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Make Doctor')).toBeInTheDocument();
    expect(screen.getByText('Make Nurse')).toBeInTheDocument();
  });

  it('makes the user a doctor', async () => {
    const data = [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        isDoctor: false,
        isNurse: false,
      },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data,
      },
    });

    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'User has been made a doctor',
      },
    });

    render(<Users />);

    const makeDoctorButton = await screen.findByText('Make Doctor');
    fireEvent.click(makeDoctorButton);

    expect(axios.post).toHaveBeenCalledWith(
      '/api/v1/admin/makeDoctor',
      data[0],
      {
        headers: {
          Authorization: `Bearer testToken`,
        },
      }
    );

    expect(await screen.findByText('User has been made a doctor')).toBeInTheDocument();
  });

  it('makes the user a nurse', async () => {
    const data = [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        isDoctor: false,
        isNurse: false,
      },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data,
      },
    });

    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'User has been made a nurse',
      },
    });

    render(<Users />);

    const makeNurseButton = await screen.findByText('Make Nurse');
    fireEvent.click(makeNurseButton);

    expect(axios.post).toHaveBeenCalledWith(
      '/api/v1/admin/makeNurse',
      data[0],
      {
        headers: {
          Authorization: `Bearer testToken`,
        },
      }
    );

    expect(await screen.findByText('User has been made a nurse')).toBeInTheDocument();
  });
});
