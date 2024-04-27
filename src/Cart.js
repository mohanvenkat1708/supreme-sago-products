
// Cart.js
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import CartEntry from './CartEntry';
import Checkbox from './Checkbox';
import TotalCount from './TotalCount';
import ProceedButton from './ProceedButton';
import Cookies from 'js-cookie';
import "./Cart.css";
import { useCookies } from 'react-cookie';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cookies, setCookie] = useCookies(['accessToken']);
  useEffect(() => {
    fetchCartItems();
    //cartItems.map(product => console.log(product.product_id));
    //console.log(cartItems)
}, [cartItems]); 
  const fetchCartItems = async () => {
    try {
      //const JWToken= Cookies.get('token');
      const response = await fetch('http://localhost:5000/cart-items', { method: 'POST' , headers: {
        'Authorization': `Bearer ${cookies.accessToken}` 
      }}); 
      //console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
        //console.log('hello');
      }
      
      const responseData = await response.json();
      setCartItems(responseData.cartItems);
    } catch (error) {
      console.error('Error fetching cart items:'+ error);
      console.log(cookies.accessToken);
    }
  };
  
  const handleCheckboxChange = (productId) => {
    console.log(productId+"bla bla bla");
    setSelectedProducts(prevSelectedProducts => {
      //console.log(prevSelectedProducts)
      if (prevSelectedProducts.length === cartItems.length) {
        console.log(prevSelectedProducts);
        // If all products are selected, toggle off the selection for the clicked product
        return prevSelectedProducts.filter(id => id !== productId);
      } else {
        // Toggle the selection state of the clicked product
        if (prevSelectedProducts.includes(productId)) {
          return prevSelectedProducts.filter(id => id !== productId);
        } else {
          return [...prevSelectedProducts, productId];
        }
      }
    });
  };
  

  const handleRemove = async (productId) => {
    try {
      // Send a POST request to your backend API to remove the product from the cart
      const response = await fetch(`http://localhost:5000/remove-from-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.accessToken}` 
        },
        body: JSON.stringify({ productId })
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove product from cart');
      }
  
      // If the request is successful, update the cart items state by refetching the items
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };
  
  
  const calculateTotalCostOfSelectedProducts = () => {
    let totalCost = 0;

    // Iterate over the cartItems array
    cartItems.forEach(product => {
        // Check if the product is selected (present in selectedProducts array)
        if (selectedProducts.includes(product.product_id)) {
            // Add the cost of the selected product to the total cost
            totalCost += product.price; // Assuming each product object has a "price" property
        }
    });

    return totalCost;
};

  const handleProceed = () => {
    const totalCost = calculateTotalCostOfSelectedProducts();
    navigate(`/payment?cost=${totalCost}`);
  };

  return (
    <div className="cart">
      <TotalCount className="product-count" count={selectedProducts.length} />
      <div className='rest'>
        {cartItems.map(product => (
          <div className="entry" key={product.product_id}>
            <Checkbox
            checked={selectedProducts.includes(product.product_id)}
            onChange={() => handleCheckboxChange(product.product_id) } // Pass the product ID to handleCheckboxChange
            label="Select"
/>
            <CartEntry product={product} onRemove={() => handleRemove(product.product_id)} />
          </div>
        ))}
        {selectedProducts.length > 0 && <ProceedButton onClick={handleProceed} />}
      </div>
    </div>
  );
}

export default Cart;
