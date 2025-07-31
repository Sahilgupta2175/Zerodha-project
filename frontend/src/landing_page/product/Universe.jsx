import React from 'react';

function Universe() {
    return (
        <div className="container mt-5">
            <div className="row text-center">
                <h1>The Zerodha Universe</h1>
                <p>Extend your trading and investment experience even further with our partner platforms</p>
                <div className="col-4 p-3 mt-5">
                    <img src="Images/smallcaseLogo.png" alt="Image" style={{width:"50%", height:"55%"}} />
                    <p className='text-small text-muted'>Thematic investment platform</p>
                </div>
                <div className="col-4 p-3 mt-5">
                    <img src="Images/streakLogo.png" alt="Image" style={{width:"50%", height:"55%"}} />
                    <p className='text-small text-muted'>Algo & strategy platform</p>
                </div>
                <div className="col-4 p-3 mt-5">
                    <img src="Images/sensibullLogo.svg" alt="Image" style={{width:"50%", height:"55%"}} />
                    <p className='text-small text-muted'>Options trading platform</p>
                </div>
                <div className="col-4 p-3 mt-5">
                    <img src="Images/zerodhaFundhouse.png" alt="Image" style={{width:"50%", height:"55%"}} />
                    <p className='text-small text-muted'>Asset management</p>
                </div>
                <div className="col-4 p-3 mt-5">
                    <img src="Images/goldenpiLogo.png" alt="Image" style={{width:"50%", height:"55%"}} />
                    <p className='text-small text-muted'>Bonds trading platform</p>
                </div>
                <div className="col-4 p-3 mt-5">
                    <img src="Images/dittoLogo.png" alt="Image" style={{width:"50%", height:"55%"}} />
                    <p className='text-small text-muted'>Insurance</p>
                </div>
                <button className='p-2 my-5 btn btn-primary fs-5' style={{width:"20%", margin:"0 auto"}}>Sign Up Now</button>
            </div>
        </div>
    );
}

export default Universe;