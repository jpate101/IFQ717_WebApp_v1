import React, { useState, useEffect } from 'react';
import { 
  getShiftReminderList, 
  createShiftReminder, 
  updateShiftReminder,
  deleteShiftReminder
 } from '../../API/Utilities';
import { Select } from 'antd';
import EditButton from '../Buttons/EditButton';
import { ReactComponent as BinIcon } from '../../svg/trash3.svg';
import { ReactComponent as BellIcon } from '../../svg/bell.svg'
const { Option } = Select;

const NavTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className='nav-tabs-container'>
      <ul className="nav-tabs">
        <li className={`create ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Create Shift Reminders</li>
        <li className={`view ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>View Shift Reminders</li>
      </ul>
    </div>
  );
};

const CreateShiftReminderModal = ({ showModal, handleClose }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [reminderTime, setReminderTime] = useState();
  const [shiftReminders, setShiftReminders] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState(null);

  const handleCreateOrUpdateReminder = async () => {
    try {
      const reminderMinutes = Number(reminderTime);
      if (isEditMode) {
        await updateShiftReminder(editingReminderId, reminderMinutes);
        console.log(`Shift reminder updated for ${reminderMinutes} minutes before`);
        alert('Shift reminder successfully updated')
      } else {
        await createShiftReminder(reminderMinutes);
        console.log(`Shift reminder created for ${reminderMinutes} minutes before`);
        alert('Shift reminder successfully created')
      }
      fetchShiftReminders();
      setActiveTab('view');
    } catch (error) {
      console.error('Error handling shift reminder:', error);
      alert('Error occurred while processing the shift reminder.');
    } finally {
      setIsEditMode(false);
      setEditingReminderId(null);
    }
  };

  const handleEditClick = (reminder) => {
    setActiveTab('create');
    setIsEditMode(true);
    setEditingReminderId(reminder.id);
    setReminderTime(reminder.minutes_before_shift_start);
  };

  const fetchShiftReminders = async () => {
    try {
      const reminders = await getShiftReminderList();
      setShiftReminders(reminders);
    } catch (error) {
      console.error('Failed to fetch shift reminders:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchShiftReminders();
    }
  }, [activeTab]);

  const handleDeleteReminder = async (reminderId) => {
    try {
      await deleteShiftReminder(reminderId);
      console.log(`Shift reminder with ID ${reminderId} deleted`);
      alert('Shift reminder successfully deleted')
      fetchShiftReminders();
    } catch (error) {
      console.error('Error deleting shift reminder:', error);
    }
  };

  return showModal && (
    <div className="fixed bg-black bg-opacity-10 inset-0 flex justify-center items-center">
      <div className="relative bg-white p-5 rounded-lg h-auto max-h-[80vh] overflow-y-auto">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-xl font-bold cursor-pointer"
        >
          &times;
        </button>
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'create' && (
          <div>
            <div 
              style={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              marginTop: "1rem",
              }}>
              <BellIcon className="tanda-icon"></BellIcon>
              <Select
                value={reminderTime}
                defaultValue={30}
                style={{ width: 200 }}
                onChange={value => setReminderTime(value)}
              >
                <Option value={30}>30 minutes before</Option>
                <Option value={60}>1 hour before</Option>
                <Option value={120}>2 hours before</Option>
                <Option value={180}>3 hours before</Option>
                <Option value={1440}>24 hours before</Option>
              </Select>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "end"
            }}>
              <button 
                className="btn btn-primary tanda-button" 
                onClick={handleCreateOrUpdateReminder}
              >
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'view' && (
          <div>
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Minutes Before Shift Start</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shiftReminders.map((reminder) => (
                  <tr key={reminder.id}>
                    <td>{reminder.id}</td>
                    <td>{reminder.minutes_before_shift_start}</td>
                    <td>
                      <EditButton onClick={() => handleEditClick(reminder)}/>
                    </td>
                    <td>
                    <BinIcon 
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="cursor-pointer tanda-icon" 
                        style={{ marginLeft: '10px' }} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateShiftReminderModal;
