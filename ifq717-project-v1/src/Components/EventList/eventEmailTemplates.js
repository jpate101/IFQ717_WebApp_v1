// email subjects/bodies for events like birthdays, work anniversaries, welcome on first day
// TODO: planning to refactor to get a solution that allows a nicer email preview, to render the images for user before sending

export function getEventEmailTemplate(type, name, years, loggedInUserName, organisation) {
    const birthdayImageUrl = 'https://github.com/jpate101/IFQ717_WebApp_v1/blob/main/ifq717-project-v1/src/Resources/EmployeeEventsWidget/tandaBirthday.jpg?raw=true';
    const workiversaryImageUrl = 'https://github.com/jpate101/IFQ717_WebApp_v1/blob/main/ifq717-project-v1/src/Resources/EmployeeEventsWidget/thanksForYourWork.jpg?raw=true';
    const welcomeImageUrl = 'https://github.com/jpate101/IFQ717_WebApp_v1/blob/main/ifq717-project-v1/src/Resources/EmployeeEventsWidget/welcomeToTheCrew.jpg?raw=true';
  
    let emailSubject = '';
    let emailBody = '';
  
    switch (type) {
      case 'Birthday':
        emailSubject = `Happy Birthday ${name}!`;
        emailBody = 
        `Dear ${name},
        \n\nHope you enjoy a wonderful day on your birthday! 
        \n\n\
        From ${loggedInUserName} & all of us at ${organisation} \n\n\
        \n\n\
        <img src="${birthdayImageUrl}" alt="Happy Birthday img" width="300">`;
        break;

      case 'Milestone':
        
        if (years > 0) {
          emailSubject = `Congratulations on ${years} years, ${name}!`;
          emailBody = 
          `Dear ${name},
          \n\n
          Congratulations on ${years} years with us at ${organisation}! 
          \n\
          We love having you as part of our team, and we appreciate all your contributions over ${years} years!
          \n\n\
          <img src="${workiversaryImageUrl}" alt="Congratulations on your work anniversary img" width="300">
          From ${loggedInUserName} & all of us at ${organisation} \n\n\``;
        } 
        
        else {
          emailSubject = `Welcome to ${organisation}, ${name}!`;
          emailBody = `Dear ${name},
          \n\n
          We are so pleased to welcome you to the crew! 
          \n\
          Thanks for joining us, and we look forward to working with you and sharing your work journey! 
          \n\
          <img src="${welcomeImageUrl}" alt="Welcome first day img" width="300">
          From ${loggedInUserName} & all of us at ${organisation} 
          \n\n\``;
        }

        break;
      default:
        break;
    }

    return { emailSubject, emailBody };
}