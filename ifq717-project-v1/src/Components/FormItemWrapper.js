import React from 'react';

function FormItemWrapper({ children, icon}) {
    return (
      <div className="flex">
        {icon && <div className="text-tandaBlue mr-2">{icon}</div>}
        {children}
      </div>
    );
  }

  export default FormItemWrapper;