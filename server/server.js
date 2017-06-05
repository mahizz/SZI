var express 	= require('express')
var app 		= express()
var bodyParser  = require('body-parser')
var movment 	= require('./controllers/movment').Movment
var conventers 	= require('./lib/conventers')
var PythonShell = require('python-shell')
var DTree 		= require('./lib/id3')

//Libs
require('./lib/prototypes')

//Variales
var _port = 3088
var dtreeWatering

//BodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	next()
})


//    network/flower_photos/final/daisy_test.jpg


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

	console.log("direction: ",direction)
	console.log("Current position: ", curr)
	console.log("Target position: ", target)
	let start = {
		x: parseInt(curr.x),
		y: parseInt(curr.y),
		direction: direction
	}

	//Sending data
	res.json({
		actionList: conventers.convertToMovementList(movment(dataset,start,target))	
	})
})

app.get('/api/plants/:uid', (req, res) => {
	
	let name = req.params.uid
	let options = {
	  scriptPath: 'network/',
	  args: ["../assets/images/flowers/"+name+".jpg"]
	};

	PythonShell.run('d_label_image.py',options, function (err, results) {
		if (err) throw err

	  	res.json({
			server: 'ok',
			results: results
		})
	});


})

app.get('/api/ground/:uid', (req, res) => {

	let name = req.params.uid

	let options = {
	  scriptPath: 'network_ground/',
	  args: ["../assets/images/grounds/"+name+".jpg"]
	};


	PythonShell.run('label_image.py',options, function (err, results) {
	  if (err) throw err;
	  // results is an array consisting of messages collected during execution

  	res.json({
		server: 'ok',
		results: results
	})
})

app.get('/api/ID3/:plant/:weather/:forecast', (req, res) => {

	let predicted_class = dtreeWatering.predict({
		plant: req.params.plant,
		weather: req.params.weather,
		forecast: req.params.forecast
	})

	res.json(predicted_class)
})

app.get('/api/getTree', (req, res) => {
	res.json(dtreeWatering.toJSON())
})


app.listen(_port, function () {
	console.log('Server running at', _port)

	let training_data = [
		{"plant":"ground", "weather":"dry", "forecast":"0", "watering":true},
		{"plant":"ground", "weather":"dry", "forecast":"50", "watering":false},
		{"plant":"rock", "weather":"dry", "forecast":"0", "watering":false},
		{"plant":"rock", "weather":"dry", "forecast":"50", "watering":false},

		{"plant":"potato", "weather":"dry", "forecast":"0", "watering":true},
		{"plant":"potato", "weather":"dry", "forecast":"50", "watering":false},
		{"plant":"rose", "weather":"dry", "forecast":"0", "watering":true},
		{"plant":"rose", "weather":"dry", "forecast":"50", "watering":false},
		{"plant":"daisy", "weather":"dry", "forecast":"0", "watering":true},
		{"plant":"daisy", "weather":"dry", "forecast":"50", "watering":false},

		{"plant":"ground", "weather":"wet", "forecast":"0", "watering":false},
		{"plant":"ground", "weather":"wet", "forecast":"50", "watering":false},
		{"plant":"rock", "weather":"wet", "forecast":"0", "watering":false},
		{"plant":"rock", "weather":"wet", "forecast":"50", "watering":false},

		{"plant":"potato", "weather":"wet", "forecast":"0", "watering":false},
		{"plant":"potato", "weather":"wet", "forecast":"50", "watering":false},
		{"plant":"rose", "weather":"wet", "forecast":"0", "watering":false},
		{"plant":"rose", "weather":"wet", "forecast":"50", "watering":false},
		{"plant":"daisy", "weather":"wet", "forecast":"0", "watering":false},
		{"plant":"daisy", "weather":"wet", "forecast":"50", "watering":false}
	]

	let class_name = "watering"
	let features = ["plant", "weather", "forecast"]

	dtreeWatering = new DTree(training_data, class_name, features)
})