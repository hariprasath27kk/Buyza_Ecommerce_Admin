import React, { useState, useEffect } from 'react';
import { Button, FloatingLabel, Form, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import countryList from 'country-list';

const UpdateUserOffcanvas = ({ show, handleClose, user, fetchUserData }) => {
    const initialValues = {
        username: user?.username || '',
        email: user?.email || '',
        country: user?.country || '',
        gender: user?.gender || '',
    };

    const [values, setValues] = useState(initialValues);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            setValues({
                username: user.username,
                email: user.email,
                country: user.country,
                gender: user.gender,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8080/form/update/${user._id}`, values,{headers:{Authorization: `Bearer ${token}`}});

            if (response.status === 200) {
                toast("User updated successfully");
                handleClose();
                fetchUserData();
            } else {
                console.error('Error updating user', response.statusText);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error updating user');
            console.error('Error:', error);
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement='end' backdrop="static">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Update User</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form noValidate onSubmit={handleSubmit}>
                    <FloatingLabel controlId="floatingUserName" label="User Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="User Name"
                            value={values.username}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingCountry" label="Country" className="mb-3">
                        <Form.Select
                            name="country"
                            value={values.country}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Country</option>
                            {countryList.getData().map((country) => (
                                <option key={country.code} value={country.name}>{country.name}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <Form.Group className="mb-3">
                        <Form.Label><b>Gender</b></Form.Label>
                        <div>
                            <Form.Check
                                inline
                                label="Male"
                                name="gender"
                                type="radio"
                                value="male"
                                checked={values.gender === 'male'}
                                onChange={handleChange}
                            />
                            <Form.Check
                                inline
                                label="Female"
                                name="gender"
                                type="radio"
                                value="female"
                                checked={values.gender === 'female'}
                                onChange={handleChange}
                            />
                        </div>
                    </Form.Group>

                    <Button type="submit" className='w-100'>Update User</Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default UpdateUserOffcanvas;
