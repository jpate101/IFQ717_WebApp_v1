import React from 'react';
import { Select } from 'antd';
const { Option } = Select;

function DatePickerDropdown({ onSelectChange }) {
    return (
      <Select className="bg-white h-10 rounded ml-4 w-28 hover:bg-tandaBlue"
        onChange={onSelectChange}
        defaultValue="week">
        <Option value="week" className="">Week</Option>
        <Option value="fortnight"className="">Fortnight</Option>
        <Option value="month" className="">Month</Option>
      </Select>
    );
  }

  export default DatePickerDropdown;