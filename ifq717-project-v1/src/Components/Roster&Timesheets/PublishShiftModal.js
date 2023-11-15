import React, { useState } from 'react';

const PublishShiftModal = ({ isOpen, onClose, weekRange, onPublish }) => {
  const [publishOption, setPublishOption] = useState('all');
  const [showAccordion, setShowAccordion] = useState(true);

  const handleRadioChange = (option) => {
    setPublishOption(option);
    setShowAccordion(true);
  };

  if (!isOpen) return null;

    return (
        <div className="fixed bg-black bg-opacity-25 inset-0 flex justify-center items-center">
            <div className="relative bg-white p-5 rounded-lg h-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-xl font-bold cursor-pointer">&times;
                    </button>
                <h3 className="text-center mb-4">{weekRange}</h3>
                <div className="flex flex-col items-center">
                    <label className="mb-2">
                        <input 
                            type="radio"
                            value="all"
                            checked={publishOption === 'all'}
                            onChange={() => handleRadioChange('all')}
                        />
                        Publish All Shifts
                    </label>
                    {publishOption === 'all' && showAccordion && 
                        <p className="text-sm text-gray-600 mb-3">
                            This option will publish all shifts for the selected week.
                        </p>
                    }
                    <label className="mb-2">
                        <input
                            type="radio"
                            value="updates"
                            checked={publishOption === 'updates'}
                            onChange={() => handleRadioChange('updates')}
                        />
                        Publish Updates Only
                    </label>
                    {publishOption === 'updates' && showAccordion && 
                        <p className="text-sm text-gray-600 mb-6">
                            This option will publish only the updated shifts for the selected week.
                        </p>
                    }
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => onPublish(publishOption)}
                    style={{backgroundColor: '#3498db'}}>
                        Publish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishShiftModal;
