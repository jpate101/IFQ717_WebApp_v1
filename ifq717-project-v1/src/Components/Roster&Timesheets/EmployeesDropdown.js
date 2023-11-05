import { Select } from 'antd';
import FormItemWrapper from './FormItemWrapper';
const { Option } = Select;

function EmployeesDropdown({ employees, onSelectChange, selectedEmployeeId }) {
    return (
      <FormItemWrapper
        icon={
          <svg xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="tanda-icon">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        }
      >
        <Select 
          popupClassName="tanda-dropdown"
          onChange={(value) => onSelectChange(value)}
          value={selectedEmployeeId}
          placeholder="Select an Employee"
          style={{ width: '218px'}}
          showSearch
          filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {employees && employees.map(employee => (
            <Option key={employee.id} value={employee.id}>
              {employee.name}
            </Option>
          ))}
        </Select>
      </FormItemWrapper>
    );
  }

  export default EmployeesDropdown;