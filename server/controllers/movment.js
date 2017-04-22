var node = require('.././models/node')
var q = require('.././models/priorityq')

var _ = require('lodash')

var Movment = function Movment(dataset,start,goal){
	console.log("start -----------------------------------------")
	var open = new q()
	var close = []
	open.push(new node('start','none',start,cost(dataset,start,goal)))

	let path = false
	let i =0
	let current
	while(!path){
		i=i+1

		if(open.length < 1){
			break
		}
		current = open.pop()
		console.log("current: ",current)

		if( goalTest(current.state,goal) ){
			return current
		}

		close.push(current)

		let act = actions(dataset,current.state)
		act.forEach( (entry) => {
   			let temp = new node(
   					current,
   					entry.action,
   					{x: entry.x ,y: entry.y , direction: entry.direction},
   					cost(dataset[entry.x][entry.y].cost, entry, goal)
				)


   			//(_.find(close, function(item) { return item.state == temp.state }) ){
   			let test = open.search(temp.state)

			

   			let some = find(close,temp.state)
   			if(test == null &&  !find(close,temp.state)){
   				open.push(temp)
   			}else if(test != null){

   				console.log("To do zamien")
   			}

   			

   			
		});

		if(i==20)console.log("placek")
	}

	


	return open
}

function find(array,k) {
    for (var i=0; i < array.length; i++) {
        if (array[i].state.x == k.x && array[i].state.y == k.y && array[i].state.direction == k.direction) {
            return true
        }
    }
    return false
}

function actions(dataset,state){
	let curr_x,curr_y,dirr,target_x,target_y,dirrL,dirrR
	let actions =[]

	curr_x = state.x
	curr_y = state.y
	dirr = state.direction

	switch (dirr) {
	    case 'N':
        		target_y = parseInt(curr_y) - 1
				target_x = parseInt(curr_x)
				dirrL = 'W'
				dirrR = 'E'
	        break;
	    case 'W':
        		target_y = parseInt(curr_y)
				target_x = parseInt(curr_x) - 1
				dirrL = 'S'
				dirrR = 'N'
	        break;
	    case 'S':
        		target_y = parseInt(curr_y) + 1
				target_x = parseInt(curr_x)
				dirrL = 'E'
				dirrR = 'W'
	        break;
	    case 'E':
        		target_y = parseInt(curr_y) 
				target_x = parseInt(curr_x) + 1
				dirrL = 'N'
				dirrR = 'S'
	        break;
	}

	let turnR = {
		x:curr_x,
		y:curr_y,
		direction:dirrR,
		action:"trun right"
	}
	let turnL = {
		x:curr_x,
		y:curr_y,
		direction:dirrL,
		action:"trun left"
	}
	actions.push(turnR)
	actions.push(turnL)

	if( ! ( ( target_x == -1 ) || ( target_y == -1 ) || ( target_x > 9 ) || ( target_y > 9 ))){
		let move = {
			x:target_x,
			y:target_y,
			direction:dirr,
			action:"move"
		}
		actions.push(move)
	}
	return actions
}

function cost(cost,state,goal){
	let heuristic = Math.abs(goal.x - state.x) + Math.abs(goal.y - state.y)
	return heuristic + parseInt(cost)
}

function goalTest(state,goal){
	return  (( state.x == goal.x ) && ( state.y == goal.y ))
}



module.exports.Movment = Movment;