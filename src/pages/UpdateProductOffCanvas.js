import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, FloatingLabel, Form, Offcanvas } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateProductOffcanvas = ({ show, handleClose, product, fetchAllProducts }) => {
    const token = localStorage.getItem('token');
    const initialValues = {
        productName: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        quantity: '',
        file: null,
    };
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState(initialValues);
    const [subcategories, setSubCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState('');

    // console.log(fetchAllProducts,"fetchAllProducts")
    useEffect(() => {
        if (product) {
            setFormData(product);
            console.log("prouct in update page ",product)
            setPreviewImage(product.imageUrl ? `http://localhost:8080/uploads/${product.imageUrl}` : '');
            const selectedCategory = categories.find(category => category.name === product.category);
            if (selectedCategory) {
                setSubCategories(selectedCategory.subcategories);
                const selectedSubcategory = selectedCategory.subcategories.find(subcategory => subcategory === product.subcategory);

            }
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file' && files[0]) {
            setFormData({
                ...formData,
                file: files[0],
            });
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });

            if (name === 'category') {
                const selectedCategory = categories.find(category => category.name === value);
                if (selectedCategory) {
                    setSubCategories(selectedCategory.subcategories);
                    setFormData({
                        ...formData,
                        [name]: value,
                        subcategory: '',

                    });
                }
            }


        }
    };


    useEffect(() => {
        fetchCategories();
        fetchSubCategories();

    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/subcategory');
            setSubCategories(response.data);
            console.log("sub cat in add prod", response.data)
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const formDataToSend = new FormData();
    
            // Append all fields except 'file'
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'file') {
                    formDataToSend.append(key, value);
                }
                else if (value) {
                    formDataToSend.append('file', value);
                }
            });
    
    
            const response = await axios.put(
                `http://localhost:8080/product/update/${product._id}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // Ensure proper content type
                    },
                }
            );
    
            if (response.status === 200) {
                toast.success('Product updated successfully');
                setFormData(initialValues);
                handleClose();
                fetchAllProducts();
            } else {
                console.error('Error updating product', response.statusText);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error updating product');
            console.error('Error:', error);
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement='end' backdrop="static">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Update Product</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form noValidate onSubmit={handleSubmit} encType="multipart/form-data">
                    <FloatingLabel controlId="floatingProductName" label="Product Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="productName"
                            placeholder="Product Name"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingCategory" label="Category" className="mb-3">
                        <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.Category}>{category.Category}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingSubCategory" label="SubCategory" className="mb-3">
                        <Form.Select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            required={formData.category !== ''}
                            disabled={subcategories.length === 0}
                        >
                            <option value="">Select SubCategory</option>

                            {subcategories
                                .filter(subcategory => subcategory.categoryId.Category === formData.category)
                                .map((subcategory) => (
                                    <option key={subcategory._id} value={subcategory.subCategory}>
                                        {subcategory.subCategory}
                                    </option>
                                ))}
                        </Form.Select>
                    </FloatingLabel>


                    <FloatingLabel controlId="floatingPrice" label="Price" className="mb-3">
                        <Form.Control
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingDescription" label="Description" className="mb-3">
                        <Form.Control
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingQuantity" label="Quantity" className="mb-3">
                        <Form.Control
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={handleChange}
                            accept='image/*'
                        />
                    </Form.Group>

                    {previewImage && (
                        <div className="mb-3">
                            <img src={previewImage} alt="Preview" width="100px" height="auto"  />
                        </div>
                    )}

                    <Button type="submit" className='w-100'>Update Product</Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default UpdateProductOffcanvas;
