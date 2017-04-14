/*===================================
=            Global Vars            =
===================================*/

max_x = 9;
max_y = 9;
pole = Array();
actor_pos = {
	x: 0,
	y: 0
}


/*=============================================
=            Functions for website            =
=============================================*/

var debug = function(msg) {
	let time = new Date();
	let element = '<li> [' + time.getTime() + ']: ' + msg + '</li>';
	$('#debug-list').prepend(element);
}

var log = function() {
	var args = Array.prototype.slice.call(arguments);
	args.forEach((msg) => { debug(msg); });
	console.log.apply(console, arguments);
}

var init_pole = function(min, max) {
	for(let x = 0; x <= max_x; x++) {
		pole[x] = Array();
		for(let y = 0; y <= max_y; y++) {
			pole[x][y] = Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}
}

var show_pole = function(dataset) {
	for(let x = 0; x <= max_x; x++) {
		for(let y = 0; y <= max_y; y++) {
			let id = '#' + x + 'x' + y;
			let val = dataset[x][y];
			$(id).html(val);
		}
	}
}

var get_val = function(cord) {
	let tmp = cord.split('x');
	return pole[tmp[0]][tmp[1]];
}

var show_actor = function(actor_pos) {
	console.log("show_actor: ", actor_pos);
	let cord = actor_pos.x + 'x' + actor_pos.y;
	let id = '#' + cord;
	$(id).html('X');
	$(id).addClass('actor_ground');
}

var clear_actor = function(pos, dataset) {
	let cord = pos.x + 'x' + pos.y;
	let id = '#' + cord;
	let val = dataset[pos.x][pos.y];
	$(id).html(val);
	$(id).removeClass('actor_ground');
}

var move_actor = function(direction) {
	log("Moving actor (" + direction.axis + ": " + direction.value + ")");
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


/*=======================================
=            Events handlers            =
=======================================*/

$('.pole').on('click', function(){
	let cord = $(this).prop('id');
	let val = get_val(cord)
	log("Click event: " + cord + " (Cost: " + val + ")");
});

$('#button_move_left').on('click', function(){
	move_actor({
		axis: 'x',
		value: -1
	});
});

$('#button_move_right').on('click', function(){
	move_actor({
		axis: 'x',
		value: 1
	});
});

$('#button_move_up').on('click', function(){
	move_actor({
		axis: 'y',
		value: -1
	});
});

$('#button_move_down').on('click', function(){
	move_actor({
		axis: 'y',
		value: 1
	});
});

$(document).keydown(function(e) {
	console.log(e);
    switch(e.which){
        case 37: 
        	$("#button_move_left").click();
        	break;
        case 38: 
        	$("#button_move_up").click();
        	break;
        case 39: 
        	$("#button_move_right").click();
        	break;
        case 40: 
        	$("#button_move_down").click();
        	break;
    }
});

/*==================================
=            Initialize            =
==================================*/

var main_init = function() {
	log('Init start...');
	init_pole(1,5);
	show_pole(pole);
	show_actor(actor_pos);
	log('Init complete.');
}

$(document).ready(main_init);