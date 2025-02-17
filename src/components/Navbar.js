import React, { useState } from 'react';
import { Button, NavDropdown, Modal } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { toast } from 'react-toastify';
import { RiDashboardFill } from "react-icons/ri";
import { IoPerson, IoLogOut, IoAddCircle, IoList } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import admin from '../Asserts/admin.png';
import '../css/NavScrollExample.css'; // Import custom CSS

function NavScrollExample({ profile }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        toast.success("Logout Successful");
        localStorage.clear();
        window.location.reload();
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Show the logout confirmation modal
    };

    const handleCloseLogoutModal = () => {
        setShowLogoutModal(false); // Hide the logout confirmation modal
    };

    return (
        <>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="custom-navbar">
                <Container fluid>
                    <Navbar.Brand href="/" className="navbar-brand">
                        <RiDashboardFill className="dashboard-icon" /> DashBoard
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" className="navbar-toggle" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
                            <Nav.Link href="/addproduct" className="nav-link">
                                <IoAddCircle className="nav-icon" /> Add Product
                            </Nav.Link>
                            <Nav.Link href="/order-list" className="nav-link">
                                <IoList className="nav-icon" /> Order List
                            </Nav.Link>

                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title={
                                    <span className="account-dropdown">
                                        <IoPerson className="account-icon" />
                                        Account
                                    </span>
                                }
                                menuVariant="dark"
                                className="account-dropdown"
                            >
                                {profile && profile.username ? (
                                    <span className="profile-info">
                                        <div className="profile-details">
                                            <img src={admin} width="60" height="60" alt="admin" className="profile-image" />
                                            <span className="profile-username">{profile.username}</span>
                                        </div>
                                        <Button onClick={handleLogoutClick} className="logout-btn">
                                            <IoLogOut className="logout-icon" /> Logout
                                        </Button>
                                    </span>
                                ) : (
                                    <span>Loading...</span>
                                )}
                                
                                 {/* <Button onClick={handleLogoutClick} className="logout-btn">
                                            <IoLogOut className="logout-icon" /> Logout
                                        </Button> */}

                                <NavDropdown.Divider />
                                <Nav.Link href="/users" className="dropdown-item">
                                    <FaUsers className="dropdown-icon" /> Users
                                </Nav.Link>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Logout Confirmation Modal */}
            <Modal show={showLogoutModal} onHide={handleCloseLogoutModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to logout?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLogoutModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NavScrollExample;