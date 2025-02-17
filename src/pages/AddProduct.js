import React, { useState } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import Category from './Category';
import SubCategory from './SubCategory';
import Products from './Products';

const AddProduct = () => {

    const [selectedComponent, setSelectedComponent] = useState('Category');

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'Category':
                return <Category />;
            case 'SubCategory':
                return <SubCategory />;
            case 'Products':
                return <Products />;
            default:
                return <Category />;
        }
    };
   

    const styles = {
        fixedColumn: {
            position: 'fixed',
            top: '80px',
            width: '15%',
        },
        mainContent: {
            marginLeft: '17%',
            paddingTop: '50px',
        },
        activeItem: {
            backgroundColor: '#007bff', // Active background color
            color: 'white', // Active text color
            cursor: 'pointer', 
        },
        hoverItem: {
            cursor: 'pointer', // Pointer cursor for hovered item
        },
       
    };
    return (

        <>

            <Row>
                <Col style={styles.fixedColumn} className="mt-2">
                    <ListGroup>
                        <ListGroup.Item onClick={() => setSelectedComponent('Category')} style={selectedComponent === 'Category' ? styles.activeItem : styles.hoverItem}>Category</ListGroup.Item>
                        <ListGroup.Item onClick={() => setSelectedComponent('SubCategory')} style={selectedComponent === 'SubCategory' ? styles.activeItem : styles.hoverItem}>SubCategory</ListGroup.Item>
                        <ListGroup.Item onClick={() => setSelectedComponent('Products')} style={selectedComponent === 'Products' ? styles.activeItem : styles.hoverItem}>Product Details</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col style={styles.mainContent} className="mt-2 me-0 ps-0 g-0">
                    {renderComponent()}
                </Col>
            </Row>
        </>
    );
}

export default AddProduct;
