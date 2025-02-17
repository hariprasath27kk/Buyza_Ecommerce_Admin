import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row, Table, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaSearch, FaUser, FaEnvelope, FaVenusMars, FaGlobe } from 'react-icons/fa';
import { TiPencil } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import AddUserOffcanvas from './AddUserOffcanvas';
import UpdateUserOffcanvas from './UpdateUserOffcanvas';
import '../css/User.css'; // Import custom CSS

const Users = () => {
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddOffcanvas, setShowAddOffcanvas] = useState(false);
    const [showUpdateOffcanvas, setShowUpdateOffcanvas] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, [token]);

    const fetchUserData = async () => {
        try {
            console.log("Fetching user data");
            const response = await axios.get(`http://localhost:8080/form/getalldetails`, { headers: { Authorization: `Bearer ${token}` } });
            console.log('Response user details', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleShowAdd = () => setShowAddOffcanvas(true);
    const handleCloseAdd = () => setShowAddOffcanvas(false);

    const handleShowUpdate = (user) => {
        setSelectedUser(user);
        setShowUpdateOffcanvas(true);
    };
    const handleCloseUpdate = () => setShowUpdateOffcanvas(false);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                const response = await axios.delete(`http://localhost:8080/form/delete/${userToDelete._id}`);
                if (response) {
                    toast.success("User deleted successfully");
                    fetchUserData();
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setShowDeleteModal(false);
                setUserToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    return (
        <>
            <Container className="users-container">
                <Row className="mb-4 align-items-center">
                    <Col md={8} className="d-flex align-items-center">
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder="Search by name or email..."
                                className="search-input"
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                    </Col>
                    <Col md={4} className="text-md-end">
                        <Button className="add-user-btn" onClick={handleShowAdd}>
                            <FaPlus className="me-2" /> Add User
                        </Button>
                    </Col>
                </Row>

                <Table hover bordered className="users-table">
                    <thead>
                        <tr>
                            <th><FaUser className="header-icon" /> S.No</th>
                            <th><FaUser className="header-icon" /> Username</th>
                            <th><FaEnvelope className="header-icon" /> Email</th>
                            <th><FaVenusMars className="header-icon" /> Gender</th>
                            <th><FaGlobe className="header-icon" /> Country</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={index} className="user-row">
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.gender}</td>
                                <td>{user.country}</td>
                                <td>
                                    <TiPencil className="action-icon edit-icon" onClick={() => handleShowUpdate(user)} />
                                    <RiDeleteBin6Line className="action-icon delete-icon" onClick={() => handleDeleteClick(user)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <AddUserOffcanvas show={showAddOffcanvas} handleClose={handleCloseAdd} fetchUserData={fetchUserData} />
                {selectedUser && (
                    <UpdateUserOffcanvas show={showUpdateOffcanvas} handleClose={handleCloseUpdate} user={selectedUser} fetchUserData={fetchUserData} />
                )}

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete the user <strong>{userToDelete?.username}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteCancel}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default Users;