import React from 'react';
import { render } from '@testing-library/react';
import DoctorProfile from '../DoctorProfile';

describe('DoctorProfile', () => {
  it('initializes form fields with correct values', () => {
    const user = {
      name: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'johndoe@example.com',
      website: 'https://example.com',
      address: '123 Main St',
      specialization: 'Cardiology',
      experience: '5 years',
      feesPerCunsaltation: '100',
      startTime: '09:00',
      endTime: '17:00',
    };

    const { getByLabelText } = render(<DoctorProfile />, {
      initialState: { user },
    });

    expect(getByLabelText('First Name')).toHaveValue(user.name);
    expect(getByLabelText('Last Name')).toHaveValue(user.lastName);
    expect(getByLabelText('Phone No')).toHaveValue(user.phone);
    expect(getByLabelText('Email')).toHaveValue(user.email);
    expect(getByLabelText('Website')).toHaveValue(user.website);
    expect(getByLabelText('Address')).toHaveValue(user.address);
    expect(getByLabelText('Specialization')).toHaveValue(user.specialization);
    expect(getByLabelText('Experience')).toHaveValue(user.experience);
    expect(getByLabelText('Fees Per Cunsaltation')).toHaveValue(
      user.feesPerCunsaltation
    );
    expect(getByLabelText('Start Time')).toHaveValue(user.startTime);
    expect(getByLabelText('End Time')).toHaveValue(user.endTime);
  });
});
