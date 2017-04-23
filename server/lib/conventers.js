var convertToMovementList = function(queue) {
	let movement = [];
	let current = queue;

	while(typeof(current.parent) != 'undefined') {

		let step = {
			state: current.state,
			cost_left: current.cost,
			action: current.action
		}
		
		movement.push(step);
		current = current.parent;
	}

	return movement.reverse();
}

module.exports = {
	convertToMovementList: convertToMovementList
};