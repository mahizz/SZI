var express 	= require('express')
var app 		= express()
var bodyParser  = require('body-parser')

//Libs
require('./lib/prototypes')
var movment = require('./controllers/movment').Movment
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
	direction = req.body.direction;

	//console.log("Dataset: ", dataset[0][0])
	//console.log("direction: ",direction)
	console.log("Current position: ", curr)
	console.log("Target position: ", target)
	let start = {
		x: parseInt(curr.x),
		y: parseInt(curr.y),
		direction: direction
	}

	//console.log(movment(dataset,start,target))



	//Sending test data
	res.json({
		actionList: movment(dataset,start,target)		
	})
})

app.listen(_port, function () {
	console.log('Server running at', _port)
})