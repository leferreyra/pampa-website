
// Archivo principal que contiene toda la logica del sitio web

var Pampa = {}

$(document).ready(function(){

	// Cargamos el menu con los botones iniciales
	Pampa.menuElement = $('.menu')[0];
	Pampa.changeMenuItems(Pampa.menuItems);
	Pampa.setTopMenuDelays();

	// Definimos el elemento loading
	Pampa.loadingElement = $('#loading');

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

	// Se obtiene el total de imagenes a cargar
	// El -1 es por la imagen adicional del preloader, cuya descarga
	// no sera controlada por la aplicacion.
	Pampa.img_count = image_list.length - 1;

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
		src_img = 'media/' + json[0].fields.foto_fondo;

		// Creamos el objeto imagen para comenzar a descargarla
		backimg = new Image();

		backimg.onload = function(){

			// Actualizamos el estado de carga del fondo
			Pampa.resources_loading_state['background'] = true;

			// Llamamos al control de carga de recursos
			Pampa.check_loading_state();	

			// Finalmente, agregamos la imagen como fondo con CSS
			$('#wrapper').css('background-image', 'url("'+ src_img +'")');

		}

		// Asignamos el atributo src para comenzar la descarga
		backimg.src = src_img;
		
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

	// Ocultamos el div de loading (Provisorio)
	$('#loading').addClass('hide');

	// Cambiamos algunas propiedades del elmento para utilizarlo como preloader
	// de las subsecciones tambien (Despues de que terminan las animaciones CSS)
	setTimeout(function(){
		$('#loading').css({
			background: 'rgba(0,0,0,0.6)',
			zIndex: 60
		});
	}, 1000);

	// Mostramos el menu (Provisorio)
	$('.menu').addClass('show');

}


// Funciones del menu principal
// ============================

// Definimos el menu principal
Pampa.menuItems = [
	{ 
		id: '',
		name: 'Colección',
		link: '#!/collection',
		callback: function(){ console.log('Se ha presionado el boton, coleccion'); }
	},

	{ 
		id: '',
		name: 'Campañas',
		link: '#!/campaign',
		callback: function(){}
	},

	{ 
		id: '',
		name: 'Tienda en línea',
		link: '#!/store',
		callback: function(){}
	},

	{ 
		id: '',
		name: 'Contacto',
		link: '#!/contact',
		callback: function(){ console.log('contacto?, todo lo que tu quieras mami..'); }
	},
];


// Agregamos las clases de delay del menu principal
Pampa.setTopMenuDelays = function(){	
	prefix = 'd';
	$.each($('.button'), function(index, element){
		element.className += ' d'+(index+1);
	});
}


// Intercambia los elementos actuales del menu por otros elementos
Pampa.changeMenuItems = function(btnlist){

	// Borra los elementos actuales
	Pampa.clearMenu();

	// Creamos una lista para guardar los callbacks y bindear al final
	var callbacks = {}

	// Si el primer elemento tiene como nombre 'BACK' se utiliza para
	// definir el boton atras
	if (btnlist[0].name == 'BACK'){
		Pampa.menuElement.innerHTML = $('#back-button-html').html();
		$('.menu .back-button').attr('id', 'back-button');
		callbacks['back-button'] = btnlist[0].callback;
		btnlist.splice(0,1);
	}

	// Por cada elemento nuevo de la lista, hacemos un render de 
	// la plantilla de Mustache, de elemento del menu
	$.each(btnlist, function(index, element){

		// Alias corto para el elemento del menu
		m = Pampa.menuElement;

		// Creamos un id para poder bindear el callback despues.
		id = 'button_' + (index+1);

		// Datos para el nuevo elemento
		data = { 
			'data_id': element.id,
			'name': element.name,
			'link': element.link,
			'id': id
		}

		// Concatenamos el contenido actual con el nuevo elemento del menu
		newhtml = m.innerHTML + Mustache.render($('#menu-item-template').html(), data);

		// Cambiamos el contenido del menu
		m.innerHTML = newhtml;

		// Agregar callback a la lista
		callbacks[id] = element.callback;

	});

	// Bindear los callbacks
	$.each(callbacks, function(idx, cb){
		$('#'+idx).click(cb);
	});

}

// Vacia los elementos del menu
Pampa.clearMenu = function(){
	Pampa.menuElement.innerHTML = '';
}

// Hace uso de Pampa.changeMenuItems pero le pone animaciones
Pampa.changeMenu = function(btnlist){

	// Obtenemos nombre corto de .menu
	m = $('.menu');

	// Animamos hacia afuera, cambiamos los items, y animamos hacia adentro.	
	m.animate({left:m.width(), opacity: 0}, 100, function(){
		Pampa.changeMenuItems(btnlist);
	});
	m.animate({left: 0, opacity: 1}, {duration: 100, queue: true});
}


// Funciones para ocultar y mostrar el menu
Pampa.hideMenu = function(){
	m = $('.menu');
	m.animate({left: m.width(), opacity: 0}, 100);
}

Pampa.showMenu = function(){
	m = $('.menu');
	m.animate({left: 0, opacity: 1}, 100);
}


// Funciones para el control del div loading
// =========================================

// Esta funcion muestra el div loading (no!, en serio?)
Pampa.showLoading = function(){
	l = Pampa.loadingElement;
	l.removeClass('hide');
}

// Esta funcion esconde el div loading
Pampa.hideLoading = function(){
	l = Pampa.loadingElement;
	l.addClass('hide');
}