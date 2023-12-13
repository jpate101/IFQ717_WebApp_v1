import React from 'react';
import { Modal, Select, Button } from 'antd';
import FormItemWrapper from './FormItemWrapper';
import { ReactComponent as PersonPlusIcon } from '../../svg/person-plus.svg'

const SelectEmployeeModal = ({ isOpen, onClose, employees, onEmployeeSelect }) => {
  const handleEmployeeChange = value => {
    onEmployeeSelect(value);
  };

  const handleSave = () => {
    onClose();
  };

  const modalFooter = (
    <div>
      <Button 
        onClick={handleSave}
        type="primary"
        className="tanda-button"
        style={{
            color: 'white',
            borderColor: '#3498db',
            backgroundColor: '#3498db'
        }}>
        Save
      </Button>
    </div>
  );

  return (
    <Modal
      title="Select Employee"
      visible={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      footer={modalFooter}
      closeIcon
      className="fixed inset-0 flex justify-center items-center"
    >
        <FormItemWrapper>
            <PersonPlusIcon
            className="tanda-icon"
            >
            </PersonPlusIcon>
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select an employee"
                onChange={handleEmployeeChange}
            >
                {employees.map(employee => (
                <Select.Option key={employee.id} value={employee.id}>
                    {employee.name}
                </Select.Option>
                ))}
            </Select>
        </FormItemWrapper>
    </Modal>
  );
};

export default SelectEmployeeModal;

