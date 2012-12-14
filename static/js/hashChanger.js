$(document).ready(function () {
	var hash = document.location.hash;
	$('.menu').addClass('show');
	if (hash) {
		loadHash(hash)
	};
})

loadHash = function (hash) {
	if (hash.substring(0,21) == '#!/coleccion/seccion/') {
		go_to[hash.substring(0,21)](hash.substring(21,hash.length));
	} else{
		go_to[hash]();
	};
}

var go_to = {
	'#!/coleccion/' : function() {
		//Pampa.showLoading();
		$.getJSON('collection/', function(data) {
			var json = $.parseJSON(data);
			var list_button = [];
			for (var i = 0; i <= json.length - 1; i++) {
				var id = json[0].pk
				var name = json[i].fields.nombre
				var boton = {id: id , name: name, link:'#!/coleccion/'+id,callback:function(id) {go_to['#!/coleccion/seccion/'](id)}}
				list_button.push(boton);
				document.location.hash = '#/coleccion/seccion/'+id;
			};
			$('#wrapper').click(function() {list_button[0].callback(list_button[0].id)})
		})	
		//Pampa.hideLoading();
	},
	'#!/coleccion/seccion/' : function(name) {
		// Pampa.showLoading();
		$.getJSON('collection/'+name, function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				console.log(data[i].imagen_1)
			};
		})
		// Pampa.hideLoading();
	}
}