var express 		= require('express')
var app 			= express()
var bodyParser  	= require('body-parser')
var movment 		= require('./controllers/movment').Movment
var conventers 		= require('./lib/conventers')
var PythonShell 	= require('python-shell')
var treeController 	= require('./controllers/treeControl')

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

var status = () => {
	let time = process.uptime()
    let uptime = (time + "").toHHMMSS()

	return {
		status: 'running',
		uptime: uptime
	}
}

var calcMove = (data) => {
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

	return { actionList: conventers.convertToMovementList(movment(dataset, start, target)) }
}

var checkImage = (data) => {

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
		
		  	return {
				server: 'ok',
				results: {
					ground: result_ground,
					plant: result_plant
				}
			}
		})
	  	
	})
}

var checkDecisionTree = (data) => {
	return predicted_class = dtreeWatering.predict({
		plant: data.plant,
		weather: data.weather,
		forecast: data.forecast,
		temp: data.temp,
		stage: data.stage
	})
}

var getTree = () => {
	let obj = dtreeWatering.toJSON()
	return JSON.stringify(obj, null, 4)
}

var retrainTree = () => {
	treeController.trainTree((tree) => {
		dtreeWatering = tree
	})
	return { status: 'ok' }
}

var loadTree = () => {
	treeController.loadTree((tree) => {
		dtreeWatering = tree
	})
	return { status: 'ok' }
}

var calculateAll = (data) => {
	let a1 = new Promise((resolve, reject) => {
		resolve(checkImage(data))
	})

	let a2 = (ins) => {
		return new Promise((resolve, reject) => {
			resolve(checkDecisionTree(ins))
		})
	}

	a1.then(resp => {
		let input = data
		input.plant = resp.results.plant
		input.weather = resp.results.ground
		a2(input).then(res => {
			return {
				decision: res,
				plant: resp.results.plant,
				ground: resp.results.ground
			}
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
	res.json(status())
})

app.post('/api/calcMove', (req, res) => {
	res.json(calcMove(req.body))
})

app.get('/api/photo/:uid', (req, res) => {
	res.json(checkImage(req.params))
})

app.get('/api/ID3/:plant/:weather/:forecast/:temp/:stage', (req, res) => {
	res.json(checkDecisionTree(req.params))
})

app.get('/api/getTree', (req, res) => {
    res.header("Content-Type",'application/json')
	res.send(getTree())
})

app.get('/api/retrainTree', (req, res) => {
	res.json(retrainTree())
})

app.get('/api/getData/:uid/:forecast/:temp/:stage', (req, res) => {
	res.json(calculateAll(req.params))
})




/*============================
=            Init            =
============================*/

app.listen(_port, function () {
	console.log('Server running at', _port)
	loadTree()
})

