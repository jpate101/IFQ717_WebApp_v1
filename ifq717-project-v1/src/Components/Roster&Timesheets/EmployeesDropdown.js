import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import FormItemWrapper from './FormItemWrapper';
import { ReactComponent as PersonPlusIcon } from '../../svg/person-plus.svg'

const { Option } = Select;

function EmployeesDropdown({ onSelectChange, selectedEmployeeId }) {
  const [employees, setEmployees] = useState([]);

  return (
      <FormItemWrapper>
        <PersonPlusIcon
          className="tanda-icon"
        >
        </PersonPlusIcon>
        <Select 
          popupClassName="tanda-dropdown"
          onChange={(value) => {
            console.log('Selected Employee ID:', value);
            onSelectChange(value);
          }}
          value={selectedEmployeeId}
          placeholder="Select an Employee"
          style={{ width: '218px'}}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {employees.map(employee => (
            <Option key={employee.id} value={employee.id}>
              {employee.name}
            </Option>
          ))}
        </Select>
      </FormItemWrapper>
    );
  }

  export default EmployeesDropdown;