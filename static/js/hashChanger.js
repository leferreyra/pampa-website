$(document).ready(function () {
	// Recupero el HashTag en el caso del ingreso a la página con cierto Hash cargado
	var hash = document.location.hash;
	$('.menu').addClass('show');
	// Verifico la existencia del Hash
	if (hash) {
		// Llamada a la funcion encargada de cargar la seccion a la que se accede
		loadHash(hash)
	};
	// sera la llamada que debe ser realizada por el boton coleccion
	$('.d1').click(go_to['#!/coleccion/'])
})

loadHash = function (hash) {
	// Verifico si se quiere acceder a una seccion o a otro lugar
	if (hash.substring(0,21) == '#!/coleccion/seccion/') {
		//se llama al array donde se encuentran las funciones, en este caso es la funcion
		// de carga de secciones, se le pasa la seccion que se desea cargar, la que se encuentra
		// al final del hash
		go_to[hash.substring(0,21)](hash.substring(21,hash.length));
	} else{
		// se llama al array donde se encuentra la funciones, no es necesario ningún parametro
		go_to[hash]();
	};
}

var go_to = {
	// todo lo necesario para que luego del click en el boton coleccion se realice la carga
	// del menu con los links a las distintas secciones
	'#!/coleccion/' : function() {
		//Pampa.showLoading();
		// Pido al servidor todas las secciones
		document.location.hash = '#!/coleccion/';
		$.getJSON('collection/', function(data) {
			var json = $.parseJSON(data);
			// lista de botones que se añadiran al menu, depende de la cantidad de 
			// elementos que tenga la coleccion
			var list_button = [];
			for (var i = 0; i <= json.length - 1; i++) {
				var id = json[0].pk
				var name = json[i].fields.nombre
				// Cada item (boton) constara de 4 datos, id: id del elemento, generado por Django
				// name: nombre de la seccion, link: direccion a la que apuntara el boton y
				// callback: funcion a ser disparada cuando se realice el click en el boton
				var boton = {id: id , name: name, link:'#!/coleccion/'+id,callback:function(e) {
					// se recupera el elemento que fue clickeado
					var id = $(e.currentTarget).attr('data-id');
					// se llama a la funcion de carga de la seccion clickeada
					go_to['#!/coleccion/seccion/'](id);
					}
				}
				// se agrega el boton a la lista
				list_button.push(boton);
			};
			// estas dos lineas siguientes son solo de test, seran reemplazadas por la funcion
			// que asigne los botones al menu.
			$('.d2').attr('data-id',list_button[0].id);
			$('.d2').click(list_button[0].callback);
		})	
		//Pampa.hideLoading();
	},
	'#!/coleccion/seccion/' : function(name) {
		// Pampa.showLoading();
		document.location.hash = '#!/coleccion/seccion/'+name;
		$.getJSON('collection/'+name, function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				console.log(data[i].imagen_1)
			};
		})
		// Pampa.hideLoading();
	}
}