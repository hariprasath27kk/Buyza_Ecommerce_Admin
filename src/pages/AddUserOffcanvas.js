import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Offcanvas } from 'react-bootstrap';
import { toast } from 'react-toastify';
import countryList from 'country-list';

const AddUserOffcanvas = ({ show, handleClose }) => {
    const initialValues = {
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        gender: '',

    };

    const [ip, setIp] = useState();
    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    console.log("valuesss", values)

    useEffect(() => {

        fetchIp();
    }, [])
    const fetchIp = async () => {
        const response = await axios.get('https://api.ipify.org?format=json');
        setIp(response.data.ip)
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            username: values.userName,
            email: values.email,
            password: values.password,
            country: values.country,
            gender: values.gender,
            roll: "user",
            ip: ip,
        };

        try {
            const response = await axios.post("http://localhost:8080/form/register", data);

            if (response.status === 200) {
                toast("User added successfully");
                setValues(initialValues);
                handleClose();
                window.location.reload()
            } else {
                console.error('Error adding user', response.statusText);
            }
        } catch (error) {
            toast.error(error.message);
            // toast.error(error.response?.data?.error || 'Error adding user');
            console.error('Error:', error);
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement='end' backdrop="static">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Add Users</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form noValidate onSubmit={handleSubmit}>
                    <FloatingLabel controlId="floatingUserName" label="User Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="userName"
                            placeholder="User Name"
                            value={values.userName}
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

                    <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingConfirmPassword" label="Confirm Password" className="mb-3">
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={values.confirmPassword}
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

                    <Button type="submit" className='w-100'>Add User</Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default AddUserOffcanvas;
