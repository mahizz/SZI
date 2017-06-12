/*===================================
=            Global Vars            =
===================================*/

randomData = {
	forecast: 0,
	temp: "low",
	stage: "new"
}
max_x = 9;
max_y = 9;
pole_min_cost = 1;
pole_max_cost = 20;
img_min_id = 1;
img_max_id = 12;
pole = Array();
actor_in_move = false;
server_status = false;
actor_direction = 'S';
actor_pos = {
	x: 0,
	y: 0
}



/*=======================================
=            Debug functions            =
=======================================*/

var setDebuggerGround = function() {
	for (let i = 0; i <= 9; i++) {
		pole[5][i].cost = 100;
		pole[5][i].image = 100;
	}
	for (let i = 0; i <= 9; i++) {
		pole[i][4].cost = 100;
		pole[i][4].image = 100;
	}
	pole[5][7].cost = 1;
	pole[1][4].cost = 1;
	pole[8][4].cost = 1;
	show_pole(pole);
	show_actor(actor_pos);
}


/*=============================================
=            Functions for website            =
=============================================*/


var check_server_status = function() {
	checkStatus((res) => {
		if(res.status == 'ok') {
			server_status = true;
			$('#server_status').html('Online ( uptime ' + res.data.uptime + ' )');
		} else {
			server_status = false;
			$('#server_status').html('Offline');
		}
	});
}

var init_pole = function(min, max) {
	for(let x = 0; x <= max_x; x++) {
		pole[x] = Array();
		for(let y = 0; y <= max_y; y++) {
			pole[x][y] = {
				cost: (Math.floor(Math.random() * (max - min + 1)) + min),
				image: (Math.floor(Math.random() * (img_max_id - img_min_id + 1)) + img_min_id)
			};
		}
	}
}

var show_pole = function(dataset) {
	for(let x = 0; x <= max_x; x++) {
		for(let y = 0; y <= max_y; y++) {
			let id = '#' + x + 'x' + y;
			let val = dataset[x][y].cost;
			$(id).html(val);
		}
	}
}

var get_val = function(cord) {
	let tmp = cord.split('x');
	return pole[tmp[0]][tmp[1]].cost;
}

var show_actor = function(actor_pos) {
	console.log("show_actor: ", actor_pos);
	let cord = actor_pos.x + 'x' + actor_pos.y;
	let id = '#' + cord;
	let actor_img = "X";
	switch(actor_direction) {
		case 'N': actor_img = '^'; break;
		case 'S': actor_img = 'v'; break;
		case 'W': actor_img = '<'; break;
		case 'E': actor_img = '>'; break;
	}
	$(id).html(actor_img);
	$(id).addClass('actor_ground');

	get_details(actor_pos, pole);

	let img_id = pole[actor_pos.x][actor_pos.y].image;
	show_image(img_id)
}

var show_image = function(img_id) {
	let imageUrl = "assets/images/photos/" + img_id + ".jpg";
	$('#image_view').css('background-image', 'url(' + imageUrl + ')');
}

var clear_actor = function(pos, dataset) {
	let cord = pos.x + 'x' + pos.y;
	let id = '#' + cord;
	let val = dataset[pos.x][pos.y].cost;
	$(id).html(val);
	$(id).removeClass('actor_ground');
}

var move_actor = function() {

	let direction = {};
	if(actor_direction == 'N')
		direction = {axis: 'y', value: -1}
	if(actor_direction == 'S')
		direction = {axis: 'y', value: 1}
	if(actor_direction == 'W')
		direction = {axis: 'x', value: -1}
	if(actor_direction == 'E')
		direction = {axis: 'x', value: 1}

	let axis = direction.axis || 'x';
	let value = direction.value || 0;

	let last_pos = {x: actor_pos.x, y: actor_pos.y};
	let new_pos = {x: actor_pos.x, y: actor_pos.y};

	if(axis == 'x') {
		new_pos.x += value;
		new_pos.x = (new_pos.x > max_x) ? max_x : new_pos.x;
		new_pos.x = (new_pos.x < 0) ? 0 : new_pos.x;
		actor_pos.x = new_pos.x;
	} else if (axis == 'y') {
		new_pos.y += value;
		new_pos.y = (new_pos.y > max_y) ? max_y : new_pos.y;
		new_pos.y = (new_pos.y < 0) ? 0 : new_pos.y;
		actor_pos.y = new_pos.y;
	}

	clear_actor(last_pos, pole);
	show_actor(new_pos);
}

var turn_actor = function(direction) {
	let direct = "";
	switch(direction) {
		case 'left': direct = 'left'; break;
		case 'right': direct = 'right'; break;
		default: direct = '';
	}

	if(direct == '') 
		return false;

	if(direct == 'left')
		switch(actor_direction) {
			case 'N': actor_direction = 'W'; break;
			case 'S': actor_direction = 'E'; break;
			case 'W': actor_direction = 'S'; break;
			case 'E': actor_direction = 'N'; break;
		}
	else if (direct == 'right')
		switch(actor_direction) {
			case 'N': actor_direction = 'E'; break;
			case 'S': actor_direction = 'W'; break;
			case 'W': actor_direction = 'N'; break;
			case 'E': actor_direction = 'S'; break;
		}

	show_actor(actor_pos);
}

var deleyed_loop_move_actor = function(i, action_list) {
	if(i == action_list.length) {
		actor_in_move = false;
		return false;
	} else {
		console.log(action_list[i]);
		switch(action_list[i].action) {
			case 'move': move_actor(); break;
			case 'turn_left': turn_actor('left'); break;
			case 'turn_right': turn_actor('right'); break;
		};
		setTimeout(function(){ deleyed_loop_move_actor(++i, action_list); }, 1000);
	}
}

var move_actor_to = function(target_pos, dataset) {
	console.log('Moving to', target_pos);

	$('#details_ground_type').html("Loading...");

	let target = target_pos;
	let current = actor_pos;
	let data = dataset;

	let image_id = dataset[target_pos.x][target_pos.y].image;

	getAIdata({
		imgId: image_id, 
		forecast: randomData.forecast, 
		temp: randomData.temp, 
		stage: randomData.stage
	}, (res) => {
		if(res.status == 'ok') {
			let aiResponse = res.data;
			let tmp, status, actionWater;
			//console.log(aiResponse);

			actionWater = (aiResponse.decision) ? "Podlewam" : "Nie podlewam";

			tmp = aiResponse.ground[0].split(" ");
			status = tmp[0] + "(" + tmp[3] + " ";

			tmp = aiResponse.plant[0].split(" ");
			status += tmp[0] + "(" + tmp[3] + " ";

			$('#details_ground_actionWater').html(actionWater);
			$('#details_ground_type').html(status);
		} else {
			$('#details_ground_actionWater').html("???");
			$('#details_ground_type').html("???");
		}
		
	});

	actor_in_move = true;

	console.log(" ");
	console.log("------------- Starting Move -------------");

	calcMove({
		target: target,
		current: current,
		dataset: data,
		direction: actor_direction
	}, (response) => {
		//console.log(response);
		if(response.status == 'ok') {
			deleyed_loop_move_actor(0, response.data.actionList);
		} else {
			actor_in_move = false;
		}

	});
}

var get_details = function(pos, dataset) {
	let ground_type, cords, image_id, cost, actions;

	cords = pos.x + 'x' + pos.y;
	image_id = dataset[pos.x][pos.y].image;
	cost = dataset[pos.x][pos.y].cost;
	actions = Array();

	$('#details_actor_direction').html('');
	$('#details_cords').html('');
	$('#details_image_id').html('');
	$('#details_cost').html('');

	$('#details_actor_direction').html(actor_direction);
	$('#details_cords').html(cords);
	$('#details_image_id').html(image_id);
	$('#details_cost').html(cost);	
}


/*=======================================
=            Events handlers            =
=======================================*/

$('.pole').on('click', function(){
	let cord = $(this).prop('id');
	let val = get_val(cord);
	let tmp = cord.split('x');
	let pos = { x: tmp[0], y: tmp[1] };

	if(!actor_in_move)
		move_actor_to(pos, pole);
});

$('#button_turn_left').on('click', function(){
	if(!actor_in_move)
		turn_actor('left');
});

$('#button_turn_right').on('click', function(){
	if(!actor_in_move)
		turn_actor('right');
});

$('#button_move').on('click', function(){
	if(!actor_in_move)
		move_actor();
});

$(document).keydown(function(e) {
    switch(e.which){
        case 37: 
        	$("#button_turn_left").click();
        	break;
        case 38: 
        	$("#button_move").click();
        	break;
        case 39: 
        	$("#button_turn_right").click();
        	break;
    }
});

/*==================================
=            Initialize            =
==================================*/

var main_init = function() {

	console.log('Init start...');
	
	$.getScript('assets/js/rest.js', function() {
	    check_server_status();
		init_pole(pole_min_cost,pole_max_cost);
		show_pole(pole);
		show_actor(actor_pos);
		setInterval(check_server_status, 1000);
	});
	
	
	console.log('Init complete.');
}

$(document).ready(main_init);