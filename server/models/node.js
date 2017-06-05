var Node = function(parent,action,state,cost){
	this.parent = parent
	this.action = action
	this.state = state
	this.cost = cost
}


module.exports = Node;