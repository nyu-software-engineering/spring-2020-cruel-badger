import React from "react";
import './assets/css/dashboard.css'

import Header from "./header.js";

function Dashboard(props) {
	return (
		<div className="App">
		<Header/>
<body> 
<h2> DASHBOARD</h2>

<div class="container">
 
  <div class="card">
    <h3 class="title">Future 1</h3>
      <button class="btn"><i class="fa fa-trash"></i></button>
    <div class="bar">
      <div class="emptybar"></div>
       <p>Take a gap year</p>
      <div class="filledbar"></div>
    </div>
    <a href="/view-future">
    <div class="circle">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="stroke" cx="60" cy="60" r="50"/>
    </svg>
    </div>
    </a>
  </div>
  
  

  <div class="card">
    <h3 class="title">Future 2</h3>
    <button class="btn"><i class="fa fa-trash"></i></button>
    <div class="bar">
      <div class="emptybar"></div>
      <p>Go to grad school</p>
      <div class="filledbar"></div>
    </div>
    <a href="/view-future">
    <div class="circle">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="stroke" cx="60" cy="60" r="50"/>
    </svg>
    </div>
    </a>
  </div>


  <div class="card">
    <h3 class="title">Future 3</h3>
    <button class="btn"><i class="fa fa-trash"></i></button>
    <div class="bar">
      <div class="emptybar"></div>
      <p>Move to Hawaii</p>
      <div class="filledbar"></div>
    </div>
    <a href="/view-future">
    <div class="circle">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="stroke" cx="60" cy="60" r="50"/>
    </svg>
    </div>
    </a>
  </div>


  <div class="card">
    <h3 class="title">Future 4</h3>
    <button class="btn"><i class="fa fa-trash"></i></button>
    <div class="bar">
      <div class="emptybar"></div>
      <p>Backpack across Europe</p>
      <div class="filledbar"></div>
    </div>
    <a href="/view-future">
    <div class="circle">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="stroke" cx="60" cy="60" r="50"/>
    </svg>
    </div>
    </a>
  </div>

</div>
<a class="button" href="/create-future"><span>Add Future</span></a>
<h3>Select a card to view more details</h3>
</body>


			

		</div>
	);
}


export default Dashboard;