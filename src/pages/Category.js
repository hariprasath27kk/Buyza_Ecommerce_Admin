import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Col, Container, FloatingLabel, Form, Modal, Row, Table } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../css/Category.css'; // Import custom CSS

const Category = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const token = localStorage.getItem('token');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = (cat) => {
        setSelectedCategory(cat);
        setShow1(true);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/category');
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const filtered = categories.filter(cat =>
            cat.Category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    const handleSubmit = async () => {
        try {
            console.log('add cat method');
            const response = await axios.post('http://localhost:8080/category', { category });
            if (response.data.status) {
                setCategories([...categories, response.data.category]);
                setFilteredCategories([...filteredCategories, response.data.category]);
                toast.success("New category added successfully");
                setCategory('');
                handleClose();
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error(error.message);
            console.error('Error adding category:', error);
        }
    };

    const handleUpdate = async () => {
        console.log("selected cate", selectedCategory);
        if (selectedCategory.Category === '') {
            toast.error("Category is required");
            return;
        }
        try {
            const response = await axios.put(
                `http://localhost:8080/category/update/${selectedCategory._id}`,
                { selectedCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedCategory = response.data.category;

            setCategories(categories.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat));
            setFilteredCategories(filteredCategories.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat));
            setSelectedCategory(null);
            handleClose1();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:8080/category/delete/${id}`);
                if (response) {
                    toast.success("Category is deleted");
                    fetchCategories();
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="category-container">
            <Container>
                <Row className='mt-2'>
                    <Col md={10} className="d-flex">
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder="Search By Category"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </Col>
                    <Col md={2} className="text-md-end mt-2 mt-md-0">
                        <Button className="add-category-btn" onClick={handleShow}>
                            <FaPlus className="me-2" /> Add
                        </Button>
                    </Col>
                </Row>
                <Table bordered className="category-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((cat, index) => (
                            <tr key={cat._id} className="category-row">
                                <td>{index + 1}</td>
                                <td>{cat.Category}</td>
                                <td className="actions-cell">
                                    <div className="d-flex align-items-center justify-content-evenly">
                                        <FaEdit className="action-icon edit-icon" onClick={() => handleShow1(cat)} />
                                        <FaTrash className="action-icon delete-icon" onClick={() => handleDelete(cat._id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Add Category Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInput" label="Enter a Category" className="mb-3">
                        <Form.Control
                            type="text"
                            value={category}
                            required
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Category
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Category Modal */}
            <Modal show={show1} onHide={handleClose1} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInput" label="Enter a Category" className="mb-3">
                        <Form.Control
                            type="text"
                            value={selectedCategory ? selectedCategory.Category : ''}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, Category: e.target.value })}
                            placeholder="Enter category"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;