// ProductDetails.js
import React from 'react';

const ProductDetails = (props) => {

    const {name, rating, price, reducedPrice, discount, about}=props;
  return (
    <div className="product-details">
      <h2>{name}</h2>
      <div className="star-rating">
        
            <span className="star">&#9733;</span>
        
        
        <span className="star">&#9733;</span>
        <span className="star">&#9733;</span>
        <span className="star">&#9733;</span>
        <span className="star">&#9734;</span>
      </div>
      <p>{rating} out of 5 stars</p>
      <p>Price: ₹{price}</p>
      <p>Reduced Price: ₹{reducedPrice}</p>
      <p>Discount: {discount}%</p>
      <hr />
      <p>{about}</p>
    </div>
  );
}

export default ProductDetails;
