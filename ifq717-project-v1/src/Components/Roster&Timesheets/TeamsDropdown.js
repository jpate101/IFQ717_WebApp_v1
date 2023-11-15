import { Select } from 'antd';
import FormItemWrapper from './FormItemWrapper';
import { ReactComponent as PeopleIcon } from '../../svg/people.svg';
const { Option } = Select;

function TeamsDropdown({ onSelectChange, teams, selectedTeamId }) {


    return (
      <FormItemWrapper>
        <PeopleIcon
          className="tanda-icon"
        >
        </PeopleIcon>
          <Select
          popupClassName="tanda-dropdown"
          onChange={(value) => {
            console.log('Selected Team ID:', value);
            onSelectChange(value);
          }}
          value={selectedTeamId}
          placeholder="Select a Team"
          style={{ 
            width: '218px',
          }}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {teams.map(team => (
            <Option key={team.id} value={team.id}>
              {team.name}
            </Option>
          ))}
        </Select>
      </FormItemWrapper>
    )
  }

  export default TeamsDropdown;