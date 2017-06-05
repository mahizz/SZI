server_adr = window.location.hostname || 'localhost';
server_port = 3088;

var checkStatus = function(next) {
	let response = { status: 'fail' };
	let serv_url = 'http://' + server_adr + ':' + server_port;

	$.ajax({
	    url: serv_url + '/status',
	    type: 'GET',
	    timeout: 3000,
	    crossDomain: true,
	    success: (res) => { 
	    	response.status = 'ok';
	    	response.data = res;
	    	next(response);
	    },
		error: (jqXHR, textStatus, err) => {
			next(response);
		}
	});
}

var calcMove = function(req, next) {

	let response = { status: 'fail' };
	let serv_url = 'http://' + server_adr + ':' + server_port;

	$.ajax({
	    url: serv_url + '/api/calcMove',
	    type: 'POST',
	    crossDomain: true,
	    data: req,
	    success: (res) => { 
	    	response.status = 'ok';
	    	response.data = res;
	    	next(response);
	    },
		error: (jqXHR, textStatus, err) => {
			console.log('text status ' + textStatus + ', err ' + err);
			next(response);
		}
	});
}

var aiGroundType = function(req, next) {

	let response = { status: 'fail' };
	let serv_url = 'http://' + server_adr + ':' + server_port;
	let img_uid = 1 * req.imgId;

	$.ajax({
	    url: serv_url + '/api/plants/' + img_uid,
	    type: 'GET',
	    crossDomain: true,
	    success: (res) => { 
	    	response.status = 'ok';
	    	response.data = res;
	    	next(response);
	    },
		error: (jqXHR, textStatus, err) => {
			console.log('text status ' + textStatus + ', err ' + err);
			next(response);
		}
	});
}