
// Archivo principal que contiene toda la logica del sitio web

var Pampa = {}

$(document).ready(function(){

	// Comenzar la carga
	Pampa.load();

});


// Diccionario que contiene el estado de carga de cada recurso
Pampa.resources_loading_state = {
	// 'fonts': false,
	// 'music': false,
	'images': false,
	'background': false,
}

Pampa.load = function(){

	// Comenzar la carga por recursos
	Pampa.load_images();
	Pampa.load_background();

}


Pampa.load_images = function(){

	// Se obtienen todas las imagenes del html
	image_list = document.images;

	Pampa.img_count = image_list.length;

	// Se lleva un contador de imagenes cargadas
	Pampa.loaded_img_count = 0;   

	// Por cada imagen del documento, se asigna una funcion de callback
	// al evento onload de la imagen, para ir verificando cuando se cargo la imagen
	$.each(image_list, function(index, img){
		img.onload = function(){

			// console.log('Cargada la imagen '+img.getAttribute('data-src'));

			// Cuando el evento onload se produce, se llama a la funcion check_images_loaded
			Pampa.check_images_loaded();

		}
		// Se le asigna la url de la imagen para comenzar la cargao
		// La url esta almacenada en el atributo html5 data-src
		img.src = img.getAttribute('data-src');

	});
}

// Cuando esta funcion es llamada, significa que una nueva imagen fue cargada
Pampa.check_images_loaded = function(){

	// Se incrementa el contador de imagenes cargadas
	Pampa.loaded_img_count++;

	// Se comprueba que todas las imagenes fueron cargadas. De ser asi, se cambia
	// el estado de carga de las imagenes, y se llama al callback que controla los
	// estados de carga de los recursos.
	if (Pampa.loaded_img_count == Pampa.img_count){
		// console.log('Todas las imagenes cargadas');
		Pampa.resources_loading_state['images'] = true;
		Pampa.check_loading_state();
	}
}


Pampa.load_background = function (){

	// Realizamos la consulta del fondo al servidor con AJAX
	$.getJSON('background/', function(data){

		json = $.parseJSON(data);

		$('#wrapper').css('background-image', 'url("media/'+ json[0].fields.foto_fondo +'")');
		
		// Actualizamos el estado de carga del fondo
		Pampa.resources_loading_state['background'] = true;

		// Llamamos al control de carga de recursos
		Pampa.check_loading_state();

	});

}


// Cada vez que un recurso termina de cargar, 
// se llama a esta funcion para comprobar si todos los recursos
// estan cargados
Pampa.check_loading_state = function(){
	load_complete = true;
	$.each(Pampa.resources_loading_state, function(key, value){
		if (!value){
			load_complete = false;
		}
	});
	if (load_complete) {
		Pampa.on_load_complete();
	}
}

// Funcion llamada cuando todos los recursos han sido cargados
Pampa.on_load_complete = function(){
	console.log('Carga completa');
}
