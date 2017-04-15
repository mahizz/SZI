var express 	= require('express')
var app 		= express()
var bodyParser  = require('body-parser')

//Libs
require('./lib/prototypes')

//Variales
var _port = 3088

//BodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	next()
})

app.get('/', (req, res) => {

	let time = process.uptime()
    let uptime = (time + "").toHHMMSS()

	res.json({
		server: 'ok'
	})
})

app.get('/status', (req, res) => {

	let time = process.uptime()
    let uptime = (time + "").toHHMMSS()

	res.json({
		status: 'running',
		uptime: uptime
	})
})

app.post('/api/calcMove', (req, res) => {

	let curr, target, dataset;
	curr = req.body.current;
	target = req.body.target;
	dataset = req.body.dataset;

	console.log("Dataset: ", dataset)
	console.log("Current position: ", curr)
	console.log("Target position: ", target)
	

	//Sending test data
	res.json({
		actionList: [
			{axis: 'x', value: 1},
			{axis: 'x', value: 1},
			{axis: 'x', value: 1},
			{axis: 'x', value: 1},
			{axis: 'y', value: 1},
			{axis: 'y', value: 1},
			{axis: 'y', value: 1},
			{axis: 'y', value: 1},
			{axis: 'x', value: -1},
			{axis: 'x', value: -1},
			{axis: 'y', value: -1}
		]		
	})
})

app.listen(_port, function () {
	console.log('Server running at', _port)
})