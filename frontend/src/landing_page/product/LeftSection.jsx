import React from 'react';

function LeftSection({ imageURL, productName, productDescription, tryDemo, learnMore, googlePlay, appStore }) {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-6">
                    <img src={imageURL} alt="Image" />
                </div>
                <div className="col-6 p-5 mt-5">
                    <h1>{productName}</h1>
                    <p>{productDescription}</p>
                    <div>
                        <a href={tryDemo} style={{fontSize:"20px", textDecoration:"none"}}>Try Demo <i class="fa-solid fa-arrow-right-long"></i></a>
                        <a href={learnMore} style={{fontSize:"20px", textDecoration:"none", marginLeft:"50px"}}>Learn more <i class="fa-solid fa-arrow-right-long"></i></a>
                    </div>
                    <div className='mt-3'>
                        <a href={googlePlay} style={{textDecoration:"none"}}> <img src="Images/googlePlayBadge.svg" alt="Google play store badge" /> </a>
                        <a href={appStore} style={{marginLeft:"20px", textDecoration:"none"}}> <img src="Images/appstoreBadge.svg" alt="App store badge" /> </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftSection;