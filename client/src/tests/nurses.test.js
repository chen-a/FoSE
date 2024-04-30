import React from 'react';
import { render } from '@testing-library/react';
import Nurses from '../Nurses';

describe('Nurses', () => {
it('renders the title', () => {
const { getByText } = render(<Nurses />);
expect(getByText('All Nurses')).toBeInTheDocument();
});

it('renders the table columns', () => {
const { getByText } = render(<Nurses />);
expect(getByText('Name')).toBeInTheDocument();
expect(getByText('Status')).toBeInTheDocument();
expect(getByText('Phone')).toBeInTheDocument();
expect(getByText('Actions')).toBeInTheDocument();
});
});