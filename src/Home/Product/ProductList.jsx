// src/ProductList.jsx
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GetAllProducts } from "../../Api/products.api";

const ProductList = () => {
  // State to hold the list of products with additional fields
  const [products, setProducts] = useState([
    { id: 1, title: "Product 1", price: "$10", QA: "5", category: "clothes" },
    { id: 2, title: "Product 2", price: "$20", QA: "5", category: "clothes" },
    { id: 3, title: "Product 3", price: "$30", QA: "5", category: "clothes" },
  ]);

  // State for editing a product
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    price: "",
    QA: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);

  // Function to delete a product by its ID
  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Function to show the modal for editing a product
  const handleShow = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setShowModal(false);
  };

  // Function to save changes made to the current product
  const handleSaveChanges = () => {
    setProducts(
      products.map((product) =>
        product.id === currentProduct.id ? currentProduct : product
      )
    );
    handleClose(); // Close the modal after saving changes
  };

  // Function to handle changes in input fields of the modal
  const handleChange = (e) => {
    const { name, value } = e.target; // Get input name and value
    setCurrentProduct({ ...currentProduct, [name]: value }); // Update current product state
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await GetAllProducts();
        setProducts(response.data); // Assuming `response.data` contains the product list
      } catch (err) {
        console.log(
          err.message || "An error occurred while fetching products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="main-container mt-5">
      <h1 className="text-center mb-4">Product List</h1>
      <Link to="/addproduct" className="btn btn-success mb-3">
        Add New Product
      </Link>
      <table className="table table-striped table-bordered table-responsive">
        <thead className="table-dark">
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>QA</th> {/* Added QA column */}
            <th>Category</th> {/* Added Category column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.QA}</td> {/* Displaying QA */}
              <td>{product.category}</td> {/* Displaying Category */}
              <td>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleShow(product)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing a product */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                name="name"
                value={currentProduct.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formProductPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                name="price"
                value={currentProduct.price}
                onChange={handleChange}
              />
            </Form.Group>

            {/* New input field for QA */}
            <Form.Group controlId="formProductQA">
              <Form.Label>QA</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter QA"
                name="QA"
                value={currentProduct.QA}
                onChange={handleChange}
              />
            </Form.Group>

            {/* New input field for Category */}
            <Form.Group controlId="formProductCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                name="category"
                value={currentProduct.category}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* Button to cancel changes and close modal */}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {/* Button to save changes made in the modal */}
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductList;
