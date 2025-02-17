import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import AddProductOffcanvas from './AddProductOffcanvas';
import UpdateProductOffcanvas from './UpdateProductOffCanvas';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../css/Products.css'; // Import custom CSS

const Products = () => {
  const token = localStorage.getItem('token');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showOffcanvas1, setShowOffcanvas1] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold the selected product
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);

  const handleShow1 = (product) => {
    setSelectedProduct(product);
    setShowOffcanvas1(true);
  };
  const handleClose1 = () => setShowOffcanvas1(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    const response = await axios.get("http://localhost:8080/product/getallproducts", { headers: { Authorization: `Bearer ${token}` } });
    console.log('response all products', response.data);
    setProducts(response.data);
  };

  const filterProducts = (product) => {
    if (
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.quantity.toString().includes(searchTerm)
    ) {
      return true;
    }
    return false;
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this Product?");
    if (confirmed) {
        try {
            const response = await axios.delete(`http://localhost:8080/product/delete/${id}`);
            if (response) {
                toast.success("product is deleted");
                fetchAllProducts();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
};

  return (
    <div className="products-container">
      <Container>
        <Row className='mt-2'>
          <Col md={10} className="d-flex">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
          <Col md={2} className="text-md-end mt-2 mt-md-0">
            <Button className="add-product-btn" onClick={handleShow}>
              <FaPlus className="me-2" /> Add
            </Button>
          </Col>
        </Row>

        <Table bordered hover className="products-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>SubCategory</th>
              <th>Price</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>ProductImage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.filter(filterProducts).map((product, index) => (
              <tr key={index} className="product-row">
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.subcategory}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>
                  <img
                    src={`http://localhost:8080/uploads/${product.imageUrl}`}
                    width={"100px"}
                    height={"auto"}
                    alt="product"
                    className="product-image"
                  />
                </td>
                <td className="actions-cell">
                  <div className='d-flex align-items-center justify-content-evenly'>
                    <FaEdit
                      className="action-icon edit-icon"
                      onClick={() => handleShow1(product)}
                    />
                    <FaTrash
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(product._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <AddProductOffcanvas show={showOffcanvas} handleClose={handleClose} fetchAllProducts={fetchAllProducts} />
        <UpdateProductOffcanvas show={showOffcanvas1} handleClose={handleClose1} product={selectedProduct} fetchAllProducts={fetchAllProducts} />
      </Container>
    </div>
  );
}

export default Products;