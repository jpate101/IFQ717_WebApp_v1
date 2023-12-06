import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const NewQualificationModal = ({ isOpen, onClose, createOrUpdateQualification, editQualification }) => {
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
                    <div className="flex justify-end mt-3">
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
