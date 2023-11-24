import { useState } from 'react';

//form
export const useLocationForm = () => {
    const [formDataLocation, setFormDataLocation] = useState({
        locationsId: '',
        name: '',
        short_name: '',
        latitude: '',
        longitude: '',
        address: '',
        public_holiday_regions: ['au'],
        specific_holiday_dates: [
            { date: '' },
            { date: '', from: '', to: '' },
        ],
    });
    return [formDataLocation, setFormDataLocation];
};
export const useTeamsForm = () => {
    const [formDataTeams, setFormDataTeams] = useState({
        Id: '',
        name: '',
        location_id: '',
        export_name: '',
        colour: '',
        team_group: '',
        qualification_ids: [''],
        user_ids: [''],
        manager_ids: [''],
    });
    return [formDataTeams, setFormDataTeams];
};
export const useEmployeeForm = () => {
    const [formDataEmployee, setFormDataEmployee] = useState({
        Id: '',
        name: '',
        date_of_birth: '',
        employment_start_date: '',
        employee_id: '',
        passcode: '',
        department_ids: [''],
        preferred_hours: null,
        part_time_fixed_hours: null,
        award_template_id: null,
        award_template_organisation_id: null,
        award_tag_ids: [''],
        report_department_id: null,
        managed_department_ids: [''],
        email: '',
        phone: '',
        days_overtime_averaged_over: null,
        overtime_calculated_over_period_start: '',
        can_see_costs: false,
        user_levels: [''],
        yearly_salary: null,
        next_pay_group_id: null,
        hourly_rate: null,
        bank_details_bsb: null,
        bank_details_account_number: null,
        bank_details_account_name: null,
        address: {
            street_line_one: '',
            street_line_two: '',
            city: '',
            state: '',
            country: '',
            postcode: '',
        },
        tax_declaration: {
            previous_family_name: '',
            australian_tax_resident: false,
            australian_tax_residency_status: '',
            tax_free_threshold: false,
            senior_tax_offset: false,
            zone_overseas_carer: false,
            student_loan: false,
            financial_supplement_debt: false,
            tax_code: false,
            employment_basis: '',
            tax_file_number: 0,
            student_loan_plans: [''],
            uk_tax_year_status: '',
            tax_scale_type: '',
            income_type: '',
            home_country: '',
            employment_type: '',
            senior_marital_status: '',
        },
        bank_details: {
            bsb: null,
            account_number: null,
            account_name: '',
        },
        super_fund_membership: {
            request: {
                employer_default: false,
                ioof: false,
                own_choice: false,
                elevate: false,
            },
            config: {
                super_contribution_type: '',
                trustee_director: false,
                member_number: '',
                occupational_rating: '',
                super_fund_id: null,
            },
        },
        regular_hours: {
            start_date: '',
            schedules: {
                week: null,
                day: '',
                start: '',
                end: '',
                breaks: '',
                department_id: null,
            },
        },
        temporary_employee_type: '',
        qualifications: [
            {
                qualification_id: null,
                enabled: null,
                license_number: "",
                expires: "",
                in_training: null,
                file_id: ""
            }
        ],
        enable_login: null,
    });
    return [formDataEmployee, setFormDataEmployee];
};

export const useOnboardingForm = () => {
    const [formDataOnboarding, setFormDataOnboarding] = useState({
        Id: '',
        Name: '',
        Email: '',
        Phone: '',
        Custom_Message: '',

    });
    return [formDataOnboarding, setFormDataOnboarding];
};

export const useDataBusinessHours = () => {
    const [formDataBusiness, setFormDataBusiness] = useState({
      business_hours: [
        { weekday: 0, start: '', finish: '' },
        { weekday: 1, start: '', finish: '' },
        { weekday: 2, start: '', finish: '' },
        { weekday: 3, start: '', finish: '' },
        { weekday: 4, start: '', finish: '' },
        { weekday: 5, start: '', finish: '' },
        { weekday: 6, start: '', finish: '' },
      ],
    });
    return [formDataBusiness, setFormDataBusiness];
  };