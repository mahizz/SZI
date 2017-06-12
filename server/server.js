var express 		= require('express')
var app 			= express()
var bodyParser  	= require('body-parser')
var movment 		= require('./controllers/movment').Movment
var conventers 		= require('./lib/conventers')
var PythonShell 	= require('python-shell')
var treeController 	= require('./controllers/treeControl')
var Promise 		= require('bluebird')

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




/*=================================
=            Functions            =
=================================*/

var status = (callback) => {
	let time = process.uptime()
    let uptime = (time + "").toHHMMSS()

	callback({
		status: 'running',
		uptime: uptime
	})
}

var calcMove = (data, callback) => {
	let curr, target, dataset, direction
	curr = data.current
	target = data.target
	dataset = data.dataset
	direction = data.direction

	let start = {
		x: parseInt(curr.x),
		y: parseInt(curr.y),
		direction: direction
	}

	callback({ actionList: conventers.convertToMovementList(movment(dataset, start, target)) })
}

var checkImage = (data, callback) => {

	let name = data.uid

	let options = {
	  scriptPath: 'network_ground/',
	  args: ["../assets/images/photos/"+name+".jpg"]
	}


	PythonShell.run('label_image.py',options, function (err, result_ground) {
		if (err) 
			throw err;

		let inOptions = {
		  scriptPath: 'network/',
		  args: ["../assets/images/photos/"+name+".jpg"]
		}


		PythonShell.run('d_label_image.py',inOptions, function (err, result_plant) {
			if (err) 
				throw err;
		
		  	callback({
				server: 'ok',
				results: {
					ground: result_ground,
					plant: result_plant
				}
			})
		})
	  	
	})
}

var checkDecisionTree = (data, callback) => {
	console.log(data)
	callback(dtreeWatering.predict({
		plant: data.plant,
		weather: data.weather,
		forecast: data.forecast,
		temp: data.temp,
		stage: data.stage
	}))
}

var getTree = (callback) => {
	let obj = dtreeWatering.toJSON()
	callback(JSON.stringify(obj, null, 4))
}

var retrainTree = (callback) => {
	treeController.trainTree((tree) => {
		dtreeWatering = tree
	})
	callback({ status: 'ok' })
}

var loadTree = (callback) => {
	treeController.loadTree((tree) => {
		dtreeWatering = tree
	})
	callback({ status: 'ok' })
}

var calculateAll = (data, callback) => {
	checkImage(data, (respImage) => {
		
		let input = {
			forecast: data.forecast,
			temp: data.temp,
			stage: data.stage
		}
		input.plant = respImage.results.plant[0].split(" ")
		input.weather = respImage.results.ground[0].split(" ")

		input.plant = input.plant[0]
		input.weather = input.weather[0]

		checkDecisionTree(input, (respDec) => {
			console.log(input)
			callback({
				decision: respDec,
				plant: respImage.results.plant,
				ground: respImage.results.ground
			})
		})
	})
}



/*====================================
=            Api handlers            =
====================================*/

app.get('/', (req, res) => {
	res.json({ server: 'ok' })
})

app.get('/status', (req, res) => {
	status((response)=>{
		res.json(response)
	})
})

app.post('/api/calcMove', (req, res) => {
	calcMove(req.body, (response) => {
		res.json(response)
	})
})

app.get('/api/photo/:uid', (req, res) => {
	checkImage(req.params, (response) => {
		res.json(response)
	})
})

app.get('/api/ID3/:plant/:weather/:forecast/:temp/:stage', (req, res) => {
	checkDecisionTree(req.params, (response) => {
		res.json(response)
	})
})

app.get('/api/getTree', (req, res) => {
    res.header("Content-Type",'application/json')
	getTree((response) => {
		res.send(response)
	})
})

app.get('/api/retrainTree', (req, res) => {
	retrainTree((response) => {
		res.json(response)
	})
})

app.get('/api/getData/:uid/:forecast/:temp/:stage', (req, res) => {
	calculateAll(req.params, (response) => {
		console.log(response)
		res.json(response)
	})
})




/*============================
=            Init            =
============================*/

app.listen(_port, function () {
	console.log('Server running at', _port)
	loadTree((response) => {})
})

