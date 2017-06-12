	var fs 		= require('fs');
	var DTree 	= require('../lib/id3')

	var dtreeWatering

	var class_name = "watering"
	var features = ["stage", "temp", "plant", "weather", "forecast"]
	var training_data = [
			{"stage":"new", "temp":"high", "plant":"tulips", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"high", "plant":"tulips", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"high", "plant":"rocks", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"new", "temp":"high", "plant":"rocks", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"new", "temp":"high", "plant":"sunflowers", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"high", "plant":"sunflowers", "weather":"dry", "forecast":"50", "watering":true},
			{"stage":"new", "temp":"high", "plant":"rose", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"high", "plant":"rose", "weather":"dry", "forecast":"50", "watering":true},
			{"stage":"new", "temp":"high", "plant":"daisy", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"high", "plant":"daisy", "weather":"dry", "forecast":"50", "watering":true},

			{"stage":"new", "temp":"high", "plant":"tulips", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"new", "temp":"high", "plant":"tulips", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"high", "plant":"rocks", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"new", "temp":"high", "plant":"rocks", "weather":"wet", "forecast":"50", "watering":false},

			{"stage":"new", "temp":"high", "plant":"sunflowers", "weather":"wet", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"high", "plant":"sunflowers", "weather":"wet", "forecast":"50", "watering":true},
			{"stage":"new", "temp":"high", "plant":"rose", "weather":"wet", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"high", "plant":"rose", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"high", "plant":"daisy", "weather":"wet", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"high", "plant":"daisy", "weather":"wet", "forecast":"50", "watering":false},


			{"stage":"new", "temp":"low", "plant":"tulips", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"low", "plant":"tulips", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"low", "plant":"rocks", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"new", "temp":"low", "plant":"rocks", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"new", "temp":"low", "plant":"sunflowers", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"low", "plant":"sunflowers", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"low", "plant":"rose", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"low", "plant":"rose", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"low", "plant":"daisy", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"low", "plant":"daisy", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"new", "temp":"low", "plant":"tulips", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"new", "temp":"low", "plant":"tulips", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"low", "plant":"rocks", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"new", "temp":"low", "plant":"rocks", "weather":"wet", "forecast":"50", "watering":false},

			{"stage":"new", "temp":"low", "plant":"sunflowers", "weather":"wet", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"low", "plant":"sunflowers", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"low", "plant":"rose", "weather":"wet", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"low", "plant":"rose", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"new", "temp":"low", "plant":"daisy", "weather":"wet", "forecast":"0", "watering":true},
			{"stage":"new", "temp":"low", "plant":"daisy", "weather":"wet", "forecast":"50", "watering":false},





			{"stage":"medium", "temp":"high", "plant":"tulips", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"high", "plant":"tulips", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"rocks", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"rocks", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"medium", "temp":"high", "plant":"sunflowers", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"high", "plant":"sunflowers", "weather":"dry", "forecast":"50", "watering":true},
			{"stage":"medium", "temp":"high", "plant":"rose", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"high", "plant":"rose", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"daisy", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"high", "plant":"daisy", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"medium", "temp":"high", "plant":"tulips", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"tulips", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"rocks", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"rocks", "weather":"wet", "forecast":"50", "watering":false},

			{"stage":"medium", "temp":"high", "plant":"sunflowers", "weather":"wet", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"high", "plant":"sunflowers", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"rose", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"rose", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"daisy", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"high", "plant":"daisy", "weather":"wet", "forecast":"50", "watering":false},


			{"stage":"medium", "temp":"low", "plant":"tulips", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"low", "plant":"tulips", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"rocks", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"rocks", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"medium", "temp":"low", "plant":"sunflowers", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"low", "plant":"sunflowers", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"rose", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"low", "plant":"rose", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"daisy", "weather":"dry", "forecast":"0", "watering":true},
			{"stage":"medium", "temp":"low", "plant":"daisy", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"medium", "temp":"low", "plant":"tulips", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"tulips", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"rocks", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"rocks", "weather":"wet", "forecast":"50", "watering":false},

			{"stage":"medium", "temp":"low", "plant":"sunflowers", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"sunflowers", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"rose", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"rose", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"daisy", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"medium", "temp":"low", "plant":"daisy", "weather":"wet", "forecast":"50", "watering":false},



			{"stage":"old", "temp":"high", "plant":"tulips", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"tulips", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rocks", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rocks", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"old", "temp":"high", "plant":"sunflowers", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"sunflowers", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rose", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rose", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"high", "plant":"daisy", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"daisy", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"old", "temp":"high", "plant":"tulips", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"tulips", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rocks", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rocks", "weather":"wet", "forecast":"50", "watering":false},

			{"stage":"old", "temp":"high", "plant":"sunflowers", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"sunflowers", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rose", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"rose", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"high", "plant":"daisy", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"high", "plant":"daisy", "weather":"wet", "forecast":"50", "watering":false},


			{"stage":"old", "temp":"low", "plant":"tulips", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"tulips", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rocks", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rocks", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"old", "temp":"low", "plant":"sunflowers", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"sunflowers", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rose", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rose", "weather":"dry", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"low", "plant":"daisy", "weather":"dry", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"daisy", "weather":"dry", "forecast":"50", "watering":false},

			{"stage":"old", "temp":"low", "plant":"tulips", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"tulips", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rocks", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rocks", "weather":"wet", "forecast":"50", "watering":false},

			{"stage":"old", "temp":"low", "plant":"sunflowers", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"sunflowers", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rose", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"rose", "weather":"wet", "forecast":"50", "watering":false},
			{"stage":"old", "temp":"low", "plant":"daisy", "weather":"wet", "forecast":"0", "watering":false},
			{"stage":"old", "temp":"low", "plant":"daisy", "weather":"wet", "forecast":"50", "watering":false}
		]

	var trainTree = function(callback) {
		console.log("Creating tree new decision tree...")

		dtreeWatering = new DTree(training_data, class_name, features)
		let obj = dtreeWatering.toJSON()
		var jsonTree = JSON.stringify(obj)
		fs.writeFile('treeData.json', jsonTree, 'utf8', (err) => {
			if (err) {
				console.log(err)
			} else {
				console.log("Created tree saved to json file.")
			}
		});
		callback(dtreeWatering)
	}

	var loadTree = function(callback) {
		console.log("Loading tree from json...")

		dtreeWatering = new DTree([],[],"")
		fs.readFile('treeData.json', 'utf8', (err, data) => {
			if (err) {
				console.log(err);
				trainTree((tree) => {
					callback(tree)
				})
			} else {
				dtreeWatering.load(data)
				console.log("Tree loaded from json file.")
				callback(dtreeWatering)
			}
		})
	}

module.exports = {
	trainTree: trainTree,
	loadTree: loadTree
}