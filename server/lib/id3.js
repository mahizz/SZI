var _ = require('lodash')

module.exports = (function() {

	const NODE_TYPES = DecisionTreeID3.NODE_TYPES = {
		RESULT: 'result',
		FEATURE: 'feature',
		FEATURE_VALUE: 'feature_value'
	}

	var model

	function DecisionTreeID3(data, target, features) {
		this.data = data
		this.target = target
		this.features = features
		model = createTree(data, target, features)
	}


	DecisionTreeID3.prototype = {

		//Szukaj w drzewie:
		predict: function(dataToProcess) {

			let root = model

			while (root.type !== NODE_TYPES.RESULT) {
				let attr = root.name
				let sampleVal = dataToProcess[attr]

				let childNode = _.find(root.vals, function(node) {
					return node.name == sampleVal
				})

				if (childNode)
					root = childNode.child
				else
					root = root.vals[0].child
			}

			return root.val
		},

		//Eksportuj drzewo:
		toJSON: function() {
			return model
		},

		load: function(json) {
			model = JSON.parse(json)
		}

	}


	//Tworzenie drzewa:
	function createTree(data, target, features) {
		
		let targets = _.uniq(_.map(data, target))

		if (targets.length == 1) {
			return {
				type: NODE_TYPES.RESULT,
				val: targets[0],
				name: targets[0],
				alias: targets[0] + randomUUID()
			}
		}

		if (features.length == 0) {
			let topTarget = mostCommon(targets)
			return {
				type: NODE_TYPES.RESULT,
				val: topTarget,
				name: topTarget,
				alias: topTarget + randomUUID()
			}
		}

		let bestFeature = maxGain(data, target, features)
		let remainingFeatures = _.without(features, bestFeature)
		let possibleValues = _.uniq(_.map(data, bestFeature))

		let node = {
			name: bestFeature,
			alias: bestFeature + randomUUID()
		}

		node.type = NODE_TYPES.FEATURE
		node.vals = _.map(possibleValues, function(v) {
			let _newS = data.filter(function(x) {
				return x[bestFeature] == v
			})

			let child_node = {
				name: v,
				alias: v + randomUUID(),
				type: NODE_TYPES.FEATURE_VALUE
			}

			child_node.child = createTree(_newS, target, remainingFeatures)
			return child_node
		})

		return node
	}

	//Liczenie entropi dla listy
	function entropy(vals) {
		let uniqueVals = _.uniq(vals)
		let probs = uniqueVals.map(function(x) {
			return prob(x, vals)
		})

		let logVals = probs.map(function(p) {
			return -p * log2(p)
		})

		return logVals.reduce(function(a, b) {
			return a + b
		}, 0)
	}

	//Liczenie zysku
	function gain(data, target, feature) {
		let attrVals = _.uniq(_.map(data, feature))
		let setEntropy = entropy(_.map(data, target))
		let setSize = _.size(data)

		let entropies = attrVals.map(function(n) {
			let subset = data.filter(function(x) {
				return x[feature] === n
			})

			return (subset.length / setSize) * entropy(_.map(subset, target))
		})

		let sumOfEntropies = entropies.reduce(function(a, b) {
			return a + b
		}, 0)

		return setEntropy - sumOfEntropies
	}

	//Szuaknie najlepszego zysku dla podzialu
	function maxGain(data, target, features) {
		return _.max(features, function(element) {
			return gain(data, target, element)
		})
	}

	//Prawdopodobienstwo znalezienia Wartosci w podanej liscie:
	function prob(value, list) {
		let occurrences = _.filter(list, function(element) {
			return element === value
		})

		let numOccurrences = occurrences.length
		let numElements = list.length
		return numOccurrences / numElements
	}

	//Logarytm:
	function log2(n) {
		return Math.log(n) / Math.log(2)
	}

	//Szukaj elementu najczesciej wystepujacego:
	function mostCommon(list) {
		var elementFrequencyMap = {}
		var largestFrequency = -1
		var mostCommonElement = null

		list.forEach(function(element) {
			var elementFrequency = (elementFrequencyMap[element] || 0) + 1
			elementFrequencyMap[element] = elementFrequency

			if (largestFrequency < elementFrequency) {
				mostCommonElement = element
				largestFrequency = elementFrequency
			}
		})

		return mostCommonElement
	}

	//Random dla aliasu:
	function randomUUID() {
		return "_r" + Math.random().toString(32).slice(2)
	}

	return DecisionTreeID3
})()