import React from 'react';

function RightSection({ imageURL, productName, productDescription, learnMore }) {
    return (
        <div className="container mt-5">
            <div className="row align-items-center">
                <div className="col-6 p-5 mt-5">
                    <h1>{productName}</h1>
                    <p>{productDescription}</p>
                    <div>
                        <a href={learnMore} style={{fontSize:"20px", textDecoration:"none"}}>Learn more <i class="fa-solid fa-arrow-right-long"></i></a>
                    </div>
                </div>
                <div className="col-6">
                    <img src={imageURL} alt="Image" />
                </div>
            </div>
        </div>
    );
}

export default RightSection;