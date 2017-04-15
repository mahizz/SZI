server_adr = 'localhost';
server_port = 3088;

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
		}
	});
}