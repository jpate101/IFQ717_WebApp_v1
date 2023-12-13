import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const NewQualificationModal = ({ isOpen, onClose, createOrUpdateQualification, editQualification, onDeleteQualification }) => {
    const [name, setName] = useState('');
    const [maxHours, setMaxHours] = useState('');

    useEffect(() => {
        console.log("Received editing qualification:", editQualification);
        if (editQualification) {
          setName(editQualification.name);
          setMaxHours(editQualification.maximum_hours || '');
        } else {
          setName('');
          setMaxHours('');
        }
      }, [editQualification]);
      
    const handleSaveClick = async () => {
        const payload = { name, maxHours: maxHours ? parseFloat(maxHours) : undefined };
        console.log('Saving qualification with payload:', payload);
        await createOrUpdateQualification(payload);
    };

    const handleDeleteClick = async () => {
        if (editQualification && editQualification.id) {
            onDeleteQualification(editQualification.id); 
        }
    };
    

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed bg-black bg-opacity-10 inset-0 flex justify-center items-center">
            <div className="relative bg-white p-5 rounded-lg shadow-lg">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-xl font-bold cursor-pointer"
                >
                    &times;
                </button>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. RSA, Blue Card"
                            className="border p-1 w-full -ml-0.5"
                            style={{
                                fontSize: '0.875rem'
                            }}
                        />
                    </Form.Group>
                    <Form.Group controlId="maxHours">
                        <Form.Label>Maximum hours per week:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={maxHours}
                            onChange={(e) => setMaxHours(e.target.value)}
                            placeholder="(optional) e.g. 24"
                            className="border p-1 w-full -ml-0.5"
                            style={{
                                fontSize: '0.875rem'
                            }}
                        />
                    </Form.Group>
                    <div className={`flex ${editQualification ? 'justify-between' : 'justify-end'} mt-3`}>
                        {editQualification && (
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                fill="currentColor" 
                                class="bi bi-trash3" 
                                className="mr-3 cursor-pointer roster-icon mt-1"
                                viewBox="0 0 16 16"
                                onClick={handleDeleteClick}
                                style={{ 
                                    width: '24px', 
                                    height: '24px' 
                                }}
                            >
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
                                    />
                            </svg>
                        )}
                        <Button
                            onClick={handleSaveClick}
                            className="tanda-button mr-0.5"
                            style={{
                                fontSize: '0.875rem'
                            }}
                        >
                            {editQualification ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default NewQualificationModal;
