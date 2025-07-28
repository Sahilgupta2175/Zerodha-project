import React from 'react';
import "./Navbar.css";

function Navbar() {
    return (
        <nav class="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: "#ffffff" }}>
            <div class="container p-2">
                <a class="navbar-brand" href="#">
                    <img src="Images/logo.svg" alt="Zerodha Logo Image" style={{ width: "25%" }} />
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <form>
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Signup</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="#">About</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="#">Product</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="#">Pricing</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="#">Support</a>
                            </li>
                        </ul>
                    </form>
                    <i class="fa-solid fa-bars mx-5"></i>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;