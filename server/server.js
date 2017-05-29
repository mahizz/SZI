var express 	= require('express')
var app 		= express()
var bodyParser  = require('body-parser')
var movment 	= require('./controllers/movment').Movment
var conventers 	= require('./lib/conventers')
var PythonShell = require('python-shell')

//Libs
require('./lib/prototypes')
//sd

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


//    network/flower_photos/final/daisy_test.jpg


app.get('/', (req, res) => {

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
	  if (err) throw err;
	  // results is an array consisting of messages collected during execution

	  	res.json({
			server: 'ok',
			results: results
		})
	});


})


app.listen(_port, function () {
	console.log('Server running at', _port)
})