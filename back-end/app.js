const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
require('./auth/auth');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');
const app = express();
const jwt = require('jsonwebtoken');

app.use( bodyParser.urlencoded({ extended : false }) );

app.set('trust proxy', 1);

const User = mongoose.model("User");
const Plan = mongoose.model("Plan");

const port = process.env.PORT || 4000;
require('./db.js');

//const PlanModel = mongoose.model("Plan");

const Validator = require('validatorjs');
const validator = (body, rules, messages, cb) => {
	console.log("in validator");

    const validation = new Validator(body, rules, messages);
    //console.log(validation.passes());
    validation.passes(() => cb(null, true));
    validation.fails(() => cb(validation.errors, false));
};


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

Validator.register('strict', value => passwordRegex.test(value),
    'password must contain at least one uppercase letter, one lowercase letter and one number');

const signupValidator = (req, res, next) => {
	let checkData = JSON.parse(Object.keys(req.body)[0]);
	const validRules = {
	  	"username": "required|string",
	  	"password": "required|string|min:6|confirmed|strict",
	  	"email": "required|email"
	}

	validator(checkData, validRules, {}, (err, status) => {
		if (!status) {
			console.log(status);
			console.log(err);

			res.json({success: false, message: "Validation failed", data: err});
		}
		else {
			next();
		}
	});
}

const createValidator = (req, res, next) => {
	//console.log(JSON.parse(Object.keys(req.body)[0]))
	let checkData = JSON.parse(Object.keys(req.body)[0]).results;
	const validRules = {
		"name": "required|string",
		"currentState": "required|string",
		"futureState": "required|string",
		"salary": "required|numeric",
		"salaryType": "required|string",
		"otherIncome": "required|numeric",
	    "otherIncomeType": 'required|string',
	    "housingLow": 'required|numeric',
	    "housingHigh": `required|numeric|min:${checkData.housingLow}`,
	    "foodLow": 'required|numeric',
	    "foodHigh": `required|numeric|min:${checkData.foodLow}`,
	    "foodType": 'required|string',
	    "transportLow": 'required|numeric',
	    "transportHigh": `required|numeric|min:${checkData.transportLow}`,
	    "transportType": 'required|string',
	    "savingsLow": 'required|numeric',
	    "savingsHigh": `required|numeric|min:${checkData.savingsLow}`,
 	    "savingsType": 'required|string',
	    "leisureLow": 'required|numeric',
	    "leisureHigh": `required|numeric|min:${checkData.leisureLow}`,
	    "leisureType": 'required|string',
	    "otherLow": 'required|numeric',
	    "otherHigh": `required|numeric|min:${checkData.otherLow}`,
	    "otherType": 'required|string',
	    "debt": 'required|numeric'

	}
	validator(checkData, validRules, {}, (err, status) => {
		if (!status) {
			console.log(status);
			console.log(err);

			res.json({success: false, message: "Validation failed", data: err});
		}
		else {
			next();
		}
	});
}


let plans = []


let futureArray = [{

		      		name: "Work in WI",
		      		currentStateAbbr: "NY",
		      		futureStateAbbr: "WI",
		      		currentStateLong: "New York",
		      		futureStateLong: "Wisconsin",
		      		currentStateData: {
		            "State": "New York",
		            "costIndex": "139.1000",
		            "costRank": 48,
		            "groceryCost": "114.8000",
		            "housingCost": "204.4000",
		            "utilitiesCost": "108.7000",
		            "transportationCost": "116.6000",
		            "miscCost": "104.8000"
		        },
		      		futureStateData: {
		            "State": "Wisconsin",
		            "costIndex": "97.3000",
		            "costRank": 25,
		            "groceryCost": "100.7000",
		            "housingCost": "91.4000",
		            "utilitiesCost": "98.9000",
		            "transportationCost": "98.1000",
		            "miscCost": "115.2000"
		        },
		      		yearlyIncome: 105000,
		      		yearlyOtherIncome: 12000,
		      		moneyIn: 117000,
		      		moneyIn_tax: 87040.48,
		      		yearlyHousing: 21000,
		      		yearlyFood: 9125,
		      		yearlyTransport: 2100,
		      		yearlySavings: 12000,
		      		yearlyLeisure: 9100,
		      		yearlyOther: 4200,
		      		moneyOut: 87484.52,
		      		moneyOut_tax: 57525,
		      		adjustedFood: 8004.26,
		      		adjustedHousing: 9390.41,
		      		adjustedTransport: 1766.81,
		      		adjustedLeisure: 6365.42,
		      		adjustedOther: 2937.89,
		      		adjustedMoneyOut: 70424.29,
		      		adjustedMoneyOut_tax: 40464.77

		      	},
                    {

		      		name: "Chill in HI",
		      		currentStateAbbr: "NY",
		      		futureStateAbbr: "HI",
		      		currentStateLong: "New York",
		      		futureStateLong: "Hawaii",
		      		currentStateData: {
		            "State": "New York",
		            "costIndex": "139.1000",
		            "costRank": 48,
		            "groceryCost": "114.8000",
		            "housingCost": "204.4000",
		            "utilitiesCost": "108.7000",
		            "transportationCost": "116.6000",
		            "miscCost": "104.8000"
		        },
		      		futureStateData: {
		            "State": "Hawaii",
		            "costIndex": "192.9000",
		            "costRank": 51,
		            "groceryCost": "169.3000",
		            "housingCost": "318.6000",
		            "utilitiesCost": "172.7000",
		            "transportationCost": "148.6000",
		            "miscCost": "116.8000"
		        },
		      		yearlyIncome: 20000,
		      		yearlyOtherIncome: 12000,
		      		moneyIn: 123456,
		      		moneyIn_tax: 123456,
		      		yearlyHousing: 12,
		      		yearlyFood: 23,
		      		yearlyTransport: 36,
		      		yearlySavings: 34,
		      		yearlyLeisure: 7654,
		      		yearlyOther: 53454,
		      		moneyOut: 346.52,
		      		moneyOut_tax: 642,
		      		adjustedFood: 543.26,
		      		adjustedHousing: 65432.41,
		      		adjustedTransport: 346.81,
		      		adjustedLeisure: 6234.42,
		      		adjustedOther: 634.89,
		      		adjustedMoneyOut: 632.29,
		      		adjustedMoneyOut_tax: 3246.77

		      	}
];


let cost_json = JSON.parse(fs.readFileSync("cost_data.json"));
let cost_data = cost_json.data
//console.log(cost_data);



app.use(cors());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
	res.send("This is the backend");
})

// app.get("/dashboard", (req, res) => {
// 	res.json(plans)
// })

let abbrToState = (abbr) => {
	var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    for (let i = 0; i < states.length; i++) {
    	if (abbr === states[i][1]) return states[i][0];
    }
    return "Invalid state abbr"
    
}


//route to recieve and process front end results
app.post("/processFormData", createValidator, (req, res) => {
	console.log("In the backend");
	//console.log(req.body);

	//console.log(Object.keys(req.body));
	//console.log(JSON.parse(Object.keys(req.body)[0]));

	//let formData = req.body.data
	let receivedData = JSON.parse(Object.keys(req.body)[0]);
	//console.log(testdata); 
	// console.log(receivedData.results);
	// console.log(receivedData.username);
	// console.log(receivedData.email);
	//console.log(JSON.parse(Object.keys(req.body)[0].username));
	//console.log(JSON.parse(Object.keys(req.body)[0].email));
	let formData = receivedData.results;
	console.log("form data is");
	console.log(formData)

	let aveHousing = (parseFloat(formData.housingLow) + parseFloat(formData.housingHigh)) / 2;
	let yearlyHousing = aveHousing * 12;
	console.log(`Yearly housing costs: ${yearlyHousing}`)


	let aveFood = (parseFloat(formData.foodLow) + parseFloat(formData.foodHigh)) / 2;
	let yearlyFood = 0;
	if (formData.foodType === "daily") {
		yearlyFood = aveFood * 365;
	}
	else if (formData.foodType === "weekly") {
		yearlyFood = aveFood * 52
	} else if (formData.foodType === "monthly") {
		yearlyFood = aveFood * 12;
	}

	console.log(`Yearly food costs: ${yearlyFood}`)

	let aveTransport = (parseFloat(formData.transportLow) + parseFloat(formData.transportHigh)) / 2; 
	let yearlyTransport = 0;
	if (formData.transportType === "daily") {
		yearlyTransport = aveTransport * 365;
	}
	else if (formData.transportType === "weekly") {
		yearlyTransport = aveTransport * 52;
	}
	else if (formData.transportType === "monthly") {
		yearlyTransport = aveTransport * 12;
	}

	console.log(`Yearly transport costs: ${yearlyTransport}`)

	let aveSavings = (parseFloat(formData.savingsLow) + parseFloat(formData.savingsHigh)) / 2;
	let yearlySavings = 0;
	if (formData.savingsType === "daily") {
		yearlySavings = aveSavings * 365
	}
	else if (formData.savingsType === "weekly") {
		yearlySavings = aveSavings * 52
	}
	else if (formData.savingsType === "monthly") {
		yearlySavings = aveSavings * 12
	}

	console.log(`Yearly savings costs: ${yearlySavings}`)

	let aveLeisure = (parseFloat(formData.leisureLow) + parseFloat(formData.leisureHigh)) / 2;
	let yearlyLeisure = 0;
	if (formData.leisureType === "daily") {
		yearlyLeisure = aveLeisure * 365;
	}
	else if (formData.leisureType === "weekly") {
		yearlyLeisure = aveLeisure * 52;
	}
	else if (formData.leisureType === "monthly") {
		yearlyLeisure = aveLeisure * 12;
	}

	console.log(`Yearly leisure costs: ${yearlyLeisure}`)


	let aveOther = (parseFloat(formData.otherLow) + parseFloat(formData.otherHigh)) / 2;
	let yearlyOther = 0;
	if (formData.otherType === "daily") {
		yearlyOther = aveOther * 365
	}
	else if (formData.otherType === "weekly") {
		yearlyOther = aveOther * 52
	}
	else if (formData.otherType === "monthly") {
		yearlyOther = aveOther * 12
	}

	console.log(`Yearly other costs: ${yearlyOther}`)

	let yearlyDebt = parseFloat(formData.debt);

	console.log(`Yearly debt costs: ${yearlyDebt}`)

	let yearlyOtherIncome = 0;
	if (formData.otherIncomeType === "monthly") {
		yearlyOtherIncome = parseFloat(formData.otherIncome) * 12
	}
	else if (formData.otherIncomeType === "yearly") {
		yearlyOtherIncome = parseFloat(formData.otherIncome);
	}

	console.log(`Yearly other income: ${yearlyOtherIncome}`)




	let yearlyIncome = 0;
	if (formData.salaryType === "yearly") {
		yearlyIncome = parseFloat(formData.salary)
	}
	else if (formData.salaryType === "monthly") {
		yearlyIncome = parseFloat(formData.salary) * 12
	}
	//now yearly income is correct
	//now to check how much they would pay in taxes
	console.log(`Yearly income: ${yearlyIncome}`)


	

	axios({
	    "method":"POST",
	    "url":"https://taxee.io/api/v2/calculate/2020",
	    "headers":{
	    "content-type":"application/json",
	    "authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUElfS0VZX01BTkFHRVIiLCJodHRwOi8vdGF4ZWUuaW8vdXNlcl9pZCI6IjVlOGUyODMzZjEyNWY2MTQ3MmMyM2EyOSIsImh0dHA6Ly90YXhlZS5pby9zY29wZXMiOlsiYXBpIl0sImlhdCI6MTU4NjM3NDcwN30.ULT5iDPIVHdGBVCqRDNSQaNJjrDRW1dLQO1gwNaFy1U"
	    },"data":{
	    "state":formData.futureState,
	    "filing_status":"single",
	    "pay_rate":yearlyIncome
	    }
    })
    .then((response)=> {
      console.log(`Future name is  ${formData.planName}`)
      console.log(`State is ${formData.futureState}`)
      console.log(`Income is ${yearlyIncome}`)
      //console.log(response.data)

      let totalTax = response.data.annual.fica.amount + response.data.annual.federal.amount + response.data.annual.state.amount;
      console.log(`Total tax is ${totalTax}`)

      
      let moneyIn = yearlyIncome + yearlyOtherIncome;

      let moneyOut = yearlyHousing + yearlyFood + yearlyTransport + yearlySavings + yearlyLeisure + yearlyOther + totalTax + yearlyDebt;

      console.log(`MONEY COMING IN PER YEAR: ${moneyIn}`)
      console.log(`MONEY GOING OUT PER YEAR: ${moneyOut}`)


      
     


      	let currentState = abbrToState(formData.currentState);
      	let currentCostData = {}

      	let futureState = abbrToState(formData.futureState);
		let futureCostData = {}

      	for (let i = 0; i < cost_data.length; i++) {
      		if (cost_data[i].State === currentState) {
      			currentCostData = cost_data[i];
      		}
      		if (cost_data[i].State === futureState) {
      			futureCostData = cost_data[i];
      		}
      	}

      	let costAdjustment = ((futureCostData.costIndex / currentCostData.costIndex));
      	let foodAdjustment = ((futureCostData.groceryCost / currentCostData.groceryCost));
      	let transportAdjustment = ((futureCostData.transportationCost / currentCostData.transportationCost));
      	let housingAdjustment = ((futureCostData.housingCost / currentCostData.housingCost));

      	let adjustedFood = yearlyFood * foodAdjustment;
      	let adjustedHousing = yearlyHousing * housingAdjustment;
      	let adjustedTransport = yearlyTransport * transportAdjustment;
      	let adjustedLeisure = yearlyLeisure * costAdjustment;
      	let adjustedOther = yearlyOther * costAdjustment;

      	console.log("Adjusted cost of food: " + adjustedFood)
      	console.log("Adjusted cost of housing: " + adjustedHousing)
      	console.log("Adjusted cost of transport: " + adjustedTransport)
      	console.log("Adjusted cost of leisure: " + adjustedLeisure)
      	console.log("Adjusted cost of other: " + adjustedOther)

      	let adjustedMoneyOut = adjustedHousing + adjustedFood + adjustedTransport + yearlySavings + adjustedLeisure + adjustedOther + totalTax + yearlyDebt;

      	let obj = {
      		name: formData.name,
      		currentStateAbbr: formData.currentState,
      		futureStateAbbr: formData.futureState,
      		currentStateLong: currentState,
      		futureStateLong: futureState,
      		currentStateData: currentCostData,
      		futureStateData: futureCostData,
      		yearlyIncome: yearlyIncome,
      		yearlyOtherIncome: yearlyOtherIncome,
      		moneyIn: moneyIn,
      		moneyIn_tax: moneyIn - totalTax,
      		yearlyHousing: yearlyHousing,
      		yearlyFood: yearlyFood,
      		yearlyTransport: yearlyTransport,
      		yearlySavings: yearlySavings,
      		yearlyLeisure: yearlyLeisure,
      		yearlyOther: yearlyOther,
      		moneyOut: moneyOut,
      		moneyOut_tax: moneyOut - totalTax,
      		adjustedFood: adjustedFood,
      		adjustedHousing: adjustedHousing,
      		adjustedTransport: adjustedTransport,
      		adjustedLeisure: adjustedLeisure,
      		adjustedOther: adjustedOther,
      		adjustedMoneyOut: adjustedMoneyOut,
      		adjustedMoneyOut_tax: adjustedMoneyOut - totalTax,
      		email: formData.email,
      		username: formData.username
      	}
      	// let newPlan = new PlanModel(obj);
      	// newPlan.save(function (err) {
      	// 	if (err) return handleError(err);
      	// });
      	// //push to atlas
      	// let query = { username: receivedData.username, email: receivedData.email };
      	// User.findOneAndUpdate(query, {$push: {plans: newPlan}}, {new: true, upsert: true}, function (err) {});

      	// let newPlan = new Plan({
      	// 	name: formData.name,
      	// 	currentStateAbbr: formData.currentState,
      	// 	futureStateAbbr: formData.futureState,
      	// 	currentStateLong: currentState,
      	// 	futureStateLong: futureState,
      	// 	currentStateData: currentCostData,
      	// 	futureStateData: futureCostData,
      	// 	yearlyIncome: yearlyIncome,
      	// 	yearlyOtherIncome: yearlyOtherIncome,
      	// 	moneyIn: moneyIn,
      	// 	moneyIn_tax: moneyIn - totalTax,
      	// 	yearlyHousing: yearlyHousing,
      	// 	yearlyFood: yearlyFood,
      	// 	yearlyTransport: yearlyTransport,
      	// 	yearlySavings: yearlySavings,
      	// 	yearlyLeisure: yearlyLeisure,
      	// 	yearlyOther: yearlyOther,
      	// 	moneyOut: moneyOut,
      	// 	moneyOut_tax: moneyOut - totalTax,
      	// 	adjustedFood: adjustedFood,
      	// 	adjustedHousing: adjustedHousing,
      	// 	adjustedTransport: adjustedTransport,
      	// 	adjustedLeisure: adjustedLeisure,
      	// 	adjustedOther: adjustedOther,
      	// 	adjustedMoneyOut: adjustedMoneyOut,
      	// 	adjustedMoneyOut_tax: adjustedMoneyOut - totalTax,
      	// 	email: formData.email,
      	// 	username: formData.username
      	// })

      	let newPlan = new Plan(obj);

      	newPlan.save((err) => {
      		if (err) throw err;
      		console.log("future saved");
      		Plan.find({email: formData.email}, (err, results) => {
	      		if (err) console.log(err);
	      		//let resultId = results.length-1;
	      		// console.log("the length is");
	      		// console.log(results.length);
	      		// console.log(results);
	      		res.json({future: obj, futureID: results.length});
      		});
      	});



      	// futureArray.push(obj);
      	// let id = futureArray.length-1;
      	// res.json({future: obj, futureID: id});

    })
    .catch((error)=>{
      console.log(error)
    })
})

//get function to get array of futures
//the call the dashboard makes
app.get('/dashboard', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
	console.log("in futures array")
	console.log(req.user)
	console.log(req.headers.authorization.split(" ")[1]);
	let token = req.headers.authorization.split(" ")[1];
	Plan.find({email:req.user.email}, (err, results) => {
		console.log(results);
		res.send(results);
	})
    //res.send(futureArray);
});


// this is the route the future page recieves from
app.get('/future', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
	// console.log(req.headers.authorization);
	// console.log(req.query);
	let index = JSON.parse(req.query.id);
	console.log("index id")
	console.log(index.id);
	//let future = futureArray[index.id];
	console.log(req.user);
	Plan.find({email:req.user.email}, (err, results) => {
		if (err) throw err;
		console.log(results);
		let future = results[index.id - 1];

		//get money in vs money out flow
		let moneyFlow = future.moneyIn_tax - future.adjustedMoneyOut_tax;

		//financial status determines between -1, 0, 1 how well the plan will do
		let financialStatus = 0;
		if (moneyFlow > -1000 && moneyFlow < 1000) {
			financialStatus = 0;
		} else if (moneyFlow <= -1000) {
			financialStatus = -1;
		}
		else {
			financialStatus = 1;
		}

		//get the difference of the cost index between states
		let costDiff = ((future.futureStateData.costIndex - future.currentStateData.costIndex) / future.currentStateData.costIndex * 100.000).toFixed(2);
		//console.log(costDiff);
		//get max expense
		// let expenses = [['Food', future.adjustedFood],
		// 				['Rent', future.adjustedHousing],
		// 				['Commute', future.adjustedTransport], 
		// 				['Leisure', future.adjustedLeisure], 
		// 				['Misc.', future.adjustedOther]];
		// come back to this later
		// let maxExpense = expenses.map(function() { return o.y; })

		const body = {
			cashFlow: moneyFlow,
			financialIndicator: financialStatus,
			stateCost: costDiff,
			currState: future.currentStateAbbr,
			futureState: future.futureStateAbbr, 
			pieChart: [
				['Expense', 'Dollars'],
		        ['Food', future.adjustedFood], 
		        ['Rent', future.adjustedHousing],
		        ['Commute', future.adjustedTransport],
		        ['Leisure', future.adjustedLeisure],
		        ['Misc.', future.adjustedOther],
			],
			barChart: [['', 'In', 'Out'],
	                  ['Cash Flow', future.moneyIn_tax, future.adjustedMoneyOut_tax],
	        ],
		}
		console.log(body);
	    res.send(body);
	})
	//console.log(((future.futureStateData.costIndex - future.currentStateData.costIndex) / future.currentStateData.costIndex * 100).toFixed(2));

});


//GETTING SIGN UP DATA


//4-27 G adding stuff to try auth
app.post('/signup', signupValidator, function(req, res) {
  console.log("in sign up");
  let formData = JSON.parse(Object.keys(req.body)[0]);
  console.log(formData);

  

  if (!formData.username || !formData.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: formData.username,
      password: formData.password,
      email: formData.email,
      tokens: [],
      plans: []
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
      	//console.log("error");
      	console.log(err);
        return res.json({success: false, msg: 'Username already exists.'});
      }
      console.log("Should be no error");
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

app.post('/signin', function(req, res) {
	//console.log("in sign in");
	//console.log(req);
  let formData = JSON.parse(Object.keys(req.body)[0]);
  //console.log(formData);
  User.findOne({
    username: formData.username
  }, function(err, user) {
    if (err) {
    	console.log("error finding user for signing in");
    	throw err;
    }

    if (!user) {
    	console.log("user not found");
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(formData.password, function (err, isMatch) {
      	console.log("user found and password matches");
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), "secret", {
            expiresIn: 604800 // 1 week
          });
          // return the information including token as JSON
           console.log("token is " + token);
          res.json({success: true, token: 'JWT ' + token, user: user});
        } else {
        	console.log("wrong password");
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

// app.listen(4000);

app.post('/delete', function(req, res){
	let receivedData = JSON.parse(Object.keys(req.body)[0]);
	Plan.deleteOne({name: receivedData.name, futureStateAbbr: receivedData.futureState}, (err, results) => {
		if (err) {
			res.send(err);
		}
	})
})

app.post('/checkSession', function(req, res) {
	//console.log("============IN CHECK SESSION===================");
	//console.log(JSON.parse(Object.keys(req.body)[0]));
	let sessionData = JSON.parse(Object.keys(req.body)[0]);
	//console.log(sessionData);
	//console.log(sessionData.username + " " + typeof sessionData.username);
	//console.log(sessionData.email);
	if(typeof sessionData.username === "undefined" || typeof sessionData.email === "undefined" || typeof sessionData.token === "undefined"){
		//console.log("false");
		res.send(false)
	}
	else {
		//console.log("true");
		res.send(true)
	}
})

app.get("/logout", function(req, res) {
	req.logout();
});

module.exports = app.listen(4000);

//module.exports = abbrToState;



