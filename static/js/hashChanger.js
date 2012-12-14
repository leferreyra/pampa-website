$(document).ready(function () {
	var hash = document.location.hash;
	$('.menu').addClass('show');
	if (hash) {
		loadHash(hash)
	};
})

function loadHash (hash) {
	go_to[hash]();
}

var go_to = {
	'#!/collection' : function() {
		//showLoading();
		$.getJSON('collection/', function(data) {
			json = $.parseJSON(data);
			alert(typeof(json['nombre']))
		})
		//hideLoading();
	}
}