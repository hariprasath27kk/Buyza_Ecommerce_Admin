import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { FaUser, FaImage, FaInfoCircle, FaShoppingCart } from 'react-icons/fa';
import '../css/OrderList.css'; // Import custom CSS

const OrderList = () => {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState([]);
    const [showModel, setShowModel] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/cart/getcart');
            setProducts(response.data);
            console.log("Response data in carts", response);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleShowModel = (user) => {
        console.log("user ", user);
        setUsers(user);
        setShowModel(true);
    };

    const handleCloseModel = () => setShowModel(false);

    return (
        <div className='order-list-container'>
            <Table bordered className='order-table'>
                <thead>
                    <tr>
                        <th><FaInfoCircle className="header-icon" /> S.No</th>
                        <th><FaShoppingCart className="header-icon" /> Product Name</th>
                        <th>Category</th>
                        <th>SubCategory</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Total Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th><FaImage className="header-icon" /> Image</th>
                        <th><FaUser className="header-icon" /> Buyer</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product, index) => (
                        <tr key={index} className="order-row">
                            <td>{index + 1}</td>
                            <td>{product.productName}</td>
                            <td>{product.category}</td>
                            <td>{product.subcategory}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>{product.productId?.quantity}</td>
                            <td>{product.price}</td>
                            <td>{product.status}</td>
                            <td>{product.totalPrice}</td>
                            <td>
                                <img
                                    src={`http://localhost:8080/uploads/${product.imageUrl}`}
                                    width={"100px"}
                                    height={"auto"}
                                    alt="product"
                                    className="product-image"
                                />
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() => handleShowModel(product.userID)}
                                    className="user-button"
                                >
                                    <FaUser className="button-icon" /> User
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModel} onHide={handleCloseModel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Buyer User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {users ? (
                        <div className="user-details">
                            <p><strong>Name:</strong> {users.username}</p>
                            <p><strong>Email:</strong> {users.email}</p>
                            <p>
                                <strong>Image:</strong>
                                <img
                                    src={`http://localhost:8080/uploads/${users.image}`}
                                    alt="user"
                                    className="user-image"
                                />
                            </p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModel}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderList;