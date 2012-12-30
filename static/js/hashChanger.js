var go_to = {
	// todo lo necesario para que luego del click en el boton coleccion se realice la carga
	// del menu con los links a las distintas secciones
	'/coleccion' : function() {
		//Pampa.showLoading();
		// Pido al servidor todas las secciones
		$.getJSON('/collection/', function(data) {

			var json = $.parseJSON(data);
			// lista de botones que se añadiran al menu, depende de la cantidad de 
			// elementos que tenga la coleccion
			var list_button = [];
			for (var i = 0; i <= json.length - 1; i++) {
				var id = json[i].pk
				var name = json[i].fields.nombre
				// Cada item (boton) constara de 4 datos, id: id del elemento, generado por Django
				// name: nombre de la seccion, link: direccion a la que apuntara el boton y
				// callback: funcion a ser disparada cuando se realice el click en el boton
				bindearSeccion(id);
				var boton = {id: id , name: name, link:'coleccion/'+id,callback:function(e) {
					// se recupera el elemento que fue clickeado
					var id = $(e.currentTarget).attr('data-id');
					var dir = '/coleccion/seccion/';
					// se llama a la funcion de carga de la seccion clickeada
					$.History.go(dir + id)
					// go_to[dir](id);

					}
				}
				// se agrega el boton a la lista
				list_button.push(boton);
			};
			Pampa.changeMenu(list_button);
		})	
		//Pampa.hideLoading();
	},
	'/coleccion/seccion/' : function(name) {
		// Pampa.showLoading();
		document.location.hash = '#/coleccion/seccion/'+name;
		$.getJSON('collection/'+name, function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				console.log(data[i].imagen_1)
			};
		})
		// Pampa.hideLoading();
	}
}


// Definir solo boton atras al menu principal
back_btn = {
	id:'',
	link:'/',
	name:'BACK',
	callback: function(){

		// Volvemos al menu principal
		$.History.go('');
	}
}


$(function() {

	$.History.bind('/coleccion',function(state) {
		go_to[state]();
	});

	$.History.bind('/campania',function(state) {
		console.log(state);
	});

	$.History.bind('/contacto',function(state) {

		// Creamos nueva lista de botones para el menu
		newmenu = [back_btn];

		// Cambiamos los botones del menu
		Pampa.changeMenu(newmenu);

		// Mostramos el div dela seccion contacto
		$('#content #contact').show();
		$('#content').show();

	});

	$.History.bind('/tienda',function(state) {
		console.log(state);
	});

	$.History.bind('',function() {

		// Ocultar los divs de cualquier otra seccion
		$('#content').hide();
		$('#content > div').hide();

		// Cambiamos el menu con los items princimpales
		Pampa.changeMenu(Pampa.menuItems);
	});

	bindearSeccion = function(id) {
		$.History.bind('/coleccion/seccion/' + id,function() {

			go_to['/coleccion/seccion/'](id);
		})
	};

	var hash = location.hash;

	if (hash.substring(1,20) == '/coleccion/seccion/') {
		//se llama al array donde se encuentran las funciones, en este caso es la funcion
		// de carga de secciones, se le pasa la seccion que se desea cargar, la que se encuentra
		// al final del hash
		go_to[hash.substring(1,20)](hash.substring(20,hash.length));
	}
});

