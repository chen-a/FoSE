import React from 'react';
import { shallow } from 'enzyme';
import Bills from '../Bills';
import { Table } from 'antd';

describe('Bills component', () => {
  let wrapper;
  const mockData = [
    {
      id: 1,
      doctorInfo: 'Dr. Smith',
      date: '2022-06-01T00:00:00.000Z',
      amount: 100,
      isPaid: false,
    },
    {
      id: 2,
      doctorInfo: 'Dr. Johnson',
      date: '2022-06-03T00:00:00.000Z',
      amount: 150,
      isPaid: true,
    },
  ];

  beforeAll(() => {
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('testToken');
  });

  beforeEach(() => {
    wrapper = shallow(<Bills />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a Table component', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('should set the bill state after calling getBills function', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: mockData }),
      })
    );
    await wrapper.instance().getBills();
    expect(wrapper.state('bill')).toEqual(mockData);
  });

  it('should handle the payment when user clicks the Make Payment button and isPaid is false', async () => {
    const mockHandlePayment = jest.fn();
    wrapper.instance().handlePayment = mockHandlePayment;
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, message: 'Payment successful' }),
      })
    );
    wrapper.setState({ visible: true, selectedRecord: mockData[0] });
    await wrapper.find('.ant-modal-footer button').at(1).simulate('click');
    expect(mockHandlePayment).toHaveBeenCalledWith(mockData[0]);
    expect(wrapper.state('visible')).toBe(false);
  });

  it('should not handle the payment when user clicks the Make Payment button and isPaid is true', () => {
    const mockHandlePayment = jest.fn();
    wrapper.instance().handlePayment = mockHandlePayment;
    wrapper.setState({ selectedRecord: mockData[1] });
    wrapper.find('.ant-modal-footer button').at(1).simulate('click');
    expect(mockHandlePayment).not.toHaveBeenCalled();
  });
});
