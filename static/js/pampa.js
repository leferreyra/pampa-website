
// Archivo principal que contiene toda la logica del sitio web

// Definir solo boton atras al menu principal
var back_btn = {
	id:'',
	link:'/',
	name:'BACK',
	callback: function(){

		// Volvemos al menu principal
		window.history.back();
	}
}

// Definimos el espacio de nombres de la app
var Pampa = {}

// Definimos el menu genero de colecciones 
Pampa.menuItemsGen = [
	{ 
		id: '',
		name: 'Hombres',
		link: '#/coleccion/hombres',
		callback: function(){$.History.go('/coleccion/hombres');}
	},
	{ 
		id: '',
		name: 'Mujeres',
		link: '#/coleccion/mujeres',
		callback: function(){$.History.go('/coleccion/mujeres');}
	},
];

// Disparamos todo cuando el DOM esta cargado
$(document).ready(function(){
	
	// Dirty stuff for IE 
	if ($.browser.msie){
		alert('executing IE')
		// Llamar solo si se entra desde IE
		IECompatibility();
	}
	
	// Cargamos el menu con los botones iniciales
	Pampa.menuElement = $('.menu')[0];
	Pampa.changeMenuItems(Pampa.menuItems);
	Pampa.setTopMenuDelays();

	// Bind subscribe events
	Pampa.bindSubscribeEvent();

	// Bind contact form
	Pampa.bindContactForm();

	// Definimos el elemento loading
	Pampa.loadingElement = $('#loading');

	// Comenzar la carga
	Pampa.load();

});


function IECompatibility(){
	
	// Rotamos el div de next de la seccion campañas, porque IE no
	// soporta transforms rotate()

	$('.b.next').rotate(180);

}


// Diccionario que contiene el estado de carga de cada recurso
Pampa.resources_loading_state = {
	'fonts': false,
	'images': false,
	'background': false,
	'collection_sections_men': false,
	'collection_sections_women': false
}

Pampa.load = function(){
       
	// Comenzar la carga por recursos
	Pampa.load_images();
	Pampa.load_background();
	Pampa.load_font();
	Pampa.load_collection_sections();

}

Pampa.load_collection_sections = function(){

	// Pido al servidor todas las secciones
	$.getJSON('/collectionMan/', function(data) {

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

			var boton = {id: id , name: name, link:'coleccion/'+id,callback:function(e) {

				// se recupera el elemento que fue clickeado
				var id = $(e.currentTarget).attr('data-id');
				var dir = '/coleccion/seccion/';

				// se llama a la funcion de carga de la seccion clickeada
				$.History.go(dir + id);

				}
			}

			// se agrega el boton a la lista
			list_button.push(boton);
		};

		Pampa.collection_sections_buttons_m = list_button;
		console.log(list_button);

		// Cambiamos el estado de carga
		Pampa.resources_loading_state['collection_sections_men'] = true;
		Pampa.check_loading_state();
	});	

	// Pido al servidor todas las secciones
	$.getJSON('/collectionWoman/', function(data) {

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

			var boton = {id: id , name: name, link:'coleccion/'+id,callback:function(e) {

				// se recupera el elemento que fue clickeado
				var id = $(e.currentTarget).attr('data-id');
				var dir = '/coleccion/seccion/';

				// se llama a la funcion de carga de la seccion clickeada
				$.History.go(dir + id);

				}
			}

			// se agrega el boton a la lista
			list_button.push(boton);
		};

		Pampa.collection_sections_buttons_w = list_button;
		console.log(list_button);

		// Cambiamos el estado de carga
		Pampa.resources_loading_state['collection_sections_women'] = true;
		Pampa.check_loading_state();
	});	
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

			// // console.log('Cargada la imagen '+img.getAttribute('data-src'));

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
		// // console.log('Todas las imagenes cargadas');
		Pampa.resources_loading_state['images'] = true;
		Pampa.check_loading_state();
	}
}

// Contador para cantidad de pruebas y errores de fuentes.
Pampa.load_font_err_count = 0;

// Cargamos las fuentes, usando Google WebfontLoader
Pampa.load_font = function(){

	// Configuracion de Webfont Loader
	var WebFontConfig = {
		custom: {
			families: ['dinpro'],
			urls: [ 'static/css/fonts.css' ]
		},
		active: function(){

			// Marcamos el recurso de fuentes como cargado.
			Pampa.resources_loading_state['fonts'] = true;

			// Checkeamos el estado de todos los recursos.
			Pampa.check_loading_state();
		},
		inactive: function(){

			// Debug output
			// console.log('Fuentes inactivas...');
			// console.log('Intentando nuevamente...');

			// Intentar cargar las fuentes nuevamente
			if (Pampa.load_font_err_count < 4){
				WebFont.load(WebFontConfig);
				Pampa.load_font_err_count++;
				console.log('fallo '+Pampa.load_font_err_count);
			}else{
				// Marcamos el recurso de fuentes como cargado.
				Pampa.resources_loading_state['fonts'] = true;

				// Checkeamos el estado de todos los recursos.
				Pampa.check_loading_state();
			}
		},
		loading: function(){
			// console.log('Cargando fuentes...');
		},
	}

	if (WebFont){

		// Comenzar la carga de fuentes
		WebFont.load(WebFontConfig);

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

	// console.log('Carga completa');
	// Comenzamos a cargar y reproducir la musica
	Pampa.setUpMusic()

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

	// Mostramos el div wrapper
	$('#wrapper').show()

}


// Funciones del menu principal
// ============================

// Definimos el menu principal
Pampa.menuItems = [
	{ 
		id: '/coleccion',
		name: 'Colección',
		link: '#/collection',
		callback: function(){ $.History.go('/coleccion'); }
	},

	{ 
		id: '/campania',
		name: 'Campañas',
		link: '#/campaign',
		callback: function(){$.History.go('/campania'); }
	},

	{ 
		id: '/tienda',
		name: 'Tienda en línea',
		link: '#/store',
		callback: function(){$.History.go('/tienda');}
	},

	{ 
		id: '/contact',
		name: 'Contacto',
		link: '#/contact',
		callback: function(){$.History.go('/contacto');}
	},
];


// Agregamos las clases de delay del menu principal
Pampa.setTopMenuDelays = function(){	
	prefix = 'd';
	$.each($('.button'), function(index, element){
		element.className += ' d'+(index+1);
	});
}

// Guardamos los items, actuales.
Pampa.currentMenuItems = Pampa.menuItems;

// Intercambia los elementos actuales del menu por otros elementos
Pampa.changeMenuItems = function(btnlist){

	// Guardamos los elementos actuales del menu
	Pampa.currentMenuItems = btnlist.slice();

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


// Configuraciones para el reproductor de musica
// =============================================

Pampa.setUpMusic = function(){

	// Setup de la libreria soundmanager2.json
	soundManager.setup({
	  // path to directory containing SM2 SWF
	  url: 'static/swf/',
	});


	// Setup del plugin 360
	threeSixtyPlayer.config = {

	    playNext: true,   // stop after one sound, or play through list until end
	    autoPlay: true,   // start playing the first sound right away
	    allowMultiple: false,  // let many sounds play at once (false = only one sound playing at a time)
	    loadRingColor: '#333', // how much has loaded
	    playRingColor: '#d40000', // how much has played
	    backgroundRingColor: '#1a1a1a', // color shown underneath load + play ("not yet loaded" color)

	    // optional segment/annotation (metadata) stuff..
	    segmentRingColor: 'rgba(255,255,255,0.33)', // metadata/annotation (segment) colors
	    segmentRingColorAlt: 'rgba(0,0,0,0.1)',
	    loadRingColorMetadata: '#ddd', // "annotations" load color
	    playRingColorMetadata: 'rgba(128,192,256,0.9)', // how much has played when metadata is present

	    circleDiameter: null, // set dynamically according to values from CSS
	    circleRadius: null,
	    animDuration: 500,
	    animTransition: window.Animator.tx.bouncy, // http://www.berniecode.com/writing/animator.html
	    showHMSTime: false, // hours:minutes:seconds vs. seconds-only
	    scaleFont: true,  // also set the font size (if possible) while animating the circle

	    // optional: spectrum or EQ graph in canvas (not supported in IE <9, too slow via ExCanvas)
	    useWaveformData: false,
	    waveformDataColor: '#0099ff',
	    waveformDataDownsample: 3, // use only one in X (of a set of 256 values) - 1 means all 256
	    waveformDataOutside: false,
	    waveformDataConstrain: false, // if true, +ve values only - keep within inside circle
	    waveformDataLineRatio: 0.64,

	    // "spectrum frequency" option
	    useEQData: false,
	    eqDataColor: '#339933',
	    eqDataDownsample: 4, // use only one in X (of 256 values)
	    eqDataOutside: true,
	    eqDataLineRatio: 0.54,

	    // enable "amplifier" (canvas pulses like a speaker) effect
	    usePeakData: true,
	    peakDataColor: '#ff33ff',
	    peakDataOutside: true,
	    peakDataLineRatio: 0.5,

	    useAmplifier: true, // "pulse" like a speaker

	    fontSizeMax: null, // set according to CSS

	    scaleArcWidth: 1,  // thickness factor of playback progress ring

	    useFavIcon: false // Experimental (also requires usePeakData: true).. 
	    //Try to draw a "VU Meter" in the favicon area, if browser supports it (Firefox + Opera as of 2009)
		
	}
}


// Bindeamos el evento onkeypress para el apartado subscribir
// ----------------------------------------------------------


Pampa.bindSubscribeEvent = function(){

	// Creamos el listener del evento onkeypress
	$('#subscribe input').keypress(function(e){

		// Verificamos que sea la tecla enter
		if (e.which == 13){

			// Obtenemos el contenido del input
			email = $('#subscribe input').val();

			// Comprobamos que sea un email valido (mas o menos)
			if (Pampa.isMail(email)){

				// Creamos el map de datos a enviar
				data = {
					'email': email
				}

				// Ponemos el apartado en modo 'cargando'
				$('#subscribe').addClass('loading');

				// Realizamos la consulta
				$.get('/subscribe/', data, function(json){

					if (json.status == 'OK'){

						// Sacamos el modo cargando
						$('#subscribe').removeClass('loading');

						// Escondemos el input
						$('#subscribe input').hide();

						// Cambiamos mensaje y color del parrafo
						$('#subscribe p')
							.html('Tu correo fue guardado exitosamente!')

						// Esperamos unos segundos y luego escondemos el form.
						setTimeout(function(){
							$('#subscribe').fadeOut();
						}, 5000);
					}
				});

			// Emitimos mensaje de error de validacion
			}else{ alert('El e-mail introducido debe ser una direccion válida de correo'); }
		}
	});
}


// Listeners que envian el formulario de contacto
// ----------------------------------------------

Pampa.bindContactForm = function(){

	// Bindeamos el boton de submit
	$('#submit-contact').click(function(){

		// Obtenemos las entradas
		nombre = $('.contacto-box input[name="nombre"]').val();
		mail = $('.contacto-box input[name="mail"]').val();
		mensaje = $('.contacto-box textarea').val();

		// Si el formulario es valido, hacemos la consulta
		if (nombre!='' && Pampa.isMail(mail) && mensaje!=''){

			// Cambiamos el estado del formulario
			$('.contacto-box').addClass('loading');
			$('#submit-contact').html('Cargando...');


			// Creamos el mapa de datos a enviar
			data = {
				'nombre' : nombre,
				'mail' : mail,
				'mensaje' : mensaje
			}
			
			// Realizamos la consulta
			$.get('contacto/', data, function(json){
				response = $.parseJSON(json);
				// console.log(response);

				// Cambiamos el estado del formulario
				$('.contacto-box').removeClass('loading');
				$('#submit-contact').html('Enviado Correctamente!');
				$('#submit-contact').css('background-color', 'green');
			})
		}
	});
}


// Validar email ;)
Pampa.isMail = function(mail){
	return mail.indexOf('@')!=-1 && mail.indexOf('.')!=-1
}
