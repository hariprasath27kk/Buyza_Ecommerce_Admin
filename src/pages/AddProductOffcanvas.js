import React, { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';


const AddProductOffcanvas = ({ show, handleClose, fetchAllProducts }) => {

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');


    const initialValues = {
        productName: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        quantity: '',
        file: null,
    };

    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setValues({
            ...values,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('values.productName',values.productName)
        if (values.productName === '') {
             return console.log("product name is required")
        }
        console.log("datas", values);
        values.category = selectedCategory;
        values.subcategory = selectedSubCategory;

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });
        console.log("formdata", formData)

        try {
            const response = await axios.post("http://localhost:8080/product/setproducts", formData);

            if (response.status === 200) {
                toast("Product added successfully");

                // setValues(initialValues);
                resetForm();

                handleClose();
                fetchAllProducts();
            } else {
                console.error('Error uploading file', response.statusText);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error uploading file');
            console.error('Error:', error);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setSelectedCategory('');
        setSelectedSubCategory('');
    };

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
        if (!show) {
            resetForm();
        }

    }, [show]);

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

    return (
        <Offcanvas show={show} onHide={handleClose} placement='end' backdrop="static">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Add Product</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form  onSubmit={handleSubmit}>
                    <FloatingLabel controlId="floatingProductName" label="Product Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="productName"
                            placeholder="Product Name"
                            required
                            value={values.productName}
                            onChange={handleChange}

                        />
                        <Form.Control.Feedback type="invalid">
                            Product Name is required.
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingCategory" label="Category" className="mb-3">
                        <Form.Control
                            as="select"
                            name="category"
                            // value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            required
                            >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.Category}>{category.Category}</option>
                            ))}
                        </Form.Control>
                    </FloatingLabel>


                    {selectedCategory && (
                        <FloatingLabel controlId="floatingSubcategory" label="Subcategory" className="mb-3">
                            <Form.Control
                                as="select"
                                name="subcategory"
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                required
                            >
                                <option value="">Select Subcategory</option>
                                {subCategories
                                    .filter(subcategory => subcategory.categoryId.Category === selectedCategory)
                                    .map((subcategory) => (
                                        <option key={subcategory._id} value={subcategory.subCategory}>
                                            {subcategory.subCategory}
                                        </option>
                                    ))}
                            </Form.Control>
                        </FloatingLabel>
                    )}



                    <FloatingLabel controlId="floatingDescription" label="Description" className="mb-3">
                        <Form.Control
                            as="textarea"
                            name="description"
                            placeholder="Description"
                            value={values.description}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingQuantity" label="Quantity" className="mb-3">
                        <Form.Control
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={values.quantity}
                            onChange={handleChange}
                            // pattern='/d+'
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            // step="1"  
                            // min="0"   
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingPrice" label="Price" className="mb-3">
                        <Form.Control
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={values.price}
                            // pattern='[1-9]*[.]?[1-9]'
                            min={"1"}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>
                   

                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={handleChange}
                            accept='image/*'
                            required
                        />
                    </Form.Group>

                    <Button type="submit" className='w-100'>Add Product</Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AddProductOffcanvas;




