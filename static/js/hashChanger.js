$(document).ready(function () {
	var hash = document.location.hash;
	$('.menu').addClass('show');
	if (hash) {
		loadHash(hash)
	};
})

loadHash = function (hash) {
	go_to[hash]();
}

var go_to = {
	'#!/coleccion/' : function() {
		//Pampa.showLoading();
		$.getJSON('collection/', function(data) {
			var json = $.parseJSON(data);
			var list_button = [];
			for (var i = 0; i <= json.length - 1; i++) {
				var name = json[i].fields.nombre
				var boton = {name: name, link:'#!/coleccion/'+name,callback:function(name) {go_to['#!/coleccion/seccion/'](name)}}
				list_button.push(boton);
			};
			$('#wrapper').click(function() {list_button[0].callback(list_button[0].name)})
		})	
		//Pampa.hideLoading();
	},
	'#!/coleccion/seccion/' : function(name) {
		alert(name)
	}
}