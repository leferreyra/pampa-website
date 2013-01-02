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

		// Cambiamos el menu
		Pampa.changeMenu([back_btn]);

		// Mostramos el preloader
		Pampa.showLoading();

		// Realizamos la consulta de todas las fotos de la campaña
		var fotos;
		$.get('campaign/', function(json){

			// convertimos los datos de la respuesta
			fotos = $.parseJSON(json);

			// agregamos un atributo loaded a cada foto
			$.each(fotos, function(key, value){
				value.fields.loaded = false;
			});

			// Obtenemos el contenedor de las fotos
			var backsled = $('.backsled');	

			// Vaciamos el backsled
			backsled.html('');

			// El ancho del contenedor debe ser la suma del ancho de todas las fotos
			backsled_width = (fotos.length * 100) + '%';
			backsled.css('width', backsled_width);

			// Insertamos los divs que contendran las fotos
			$.each(fotos, function(index, value){

				// Creamos nuevo div
				div = $('<div></div>');

				// Agregamos atributos
				div.addClass('campaign-item');

				// utilizamos el atributo data-src para guardar la url de la imagen a cargar
				div.attr('data-src', 'media/' + value.fields.foto_campania);
				div.css('width', document.width);

				// Agregamos el div al backsled
				backsled.append(div);

			});

			// Cargamos la primer foto antes de ocultar el preloader
			var first_img = $('#campaign .backsled div')[0];
			console.log('primer div');
			console.log(first_img);

			var img = new Image();
			img.onload = function(){
				console.log('carga completa de: ' + img.src);

				// Cambiamos el estado loaded a true
				fotos[0].fields.loaded = true;

				// Ponemos la imagen como fondo del div
				first_img.style.backgroundImage = 'url("'+ img.src +'")';

				// Ocultamos preloader
				Pampa.hideLoading();

			}

			// Trigger la carga de la primera imagen
			img.src = first_img.getAttribute('data-src');
			console.log('cargando.. ' + img.src);

			// Lleva la cuenta de la foto actual
			current_foto = 0;
			
			// Setea la position de backsled
			backsled.css('left', '0px');

			// Si hay mas de una foto, mostramos el boton next
			if (fotos.length > 1){
				$('#campaign .next').show();
			}

			// Unbind cualquier otro evento previamente bindeado
			// Esto es por si se vuelve a ingresar a la seccion
			$('#campaign .next').unbind('click');
			$('#campaign .prev').unbind('click');

			// Bindeamos los botones
			// Boton Next
			$('#campaign .next').click(function(){

				// Actualizamos current_foto
				current_foto++;

				animate_backsled();

			});

			// Boton prev
			$('#campaign .prev').click(function(){

				// Actualizamos current_foto
				current_foto--;

				animate_backsled();

			});

			var animate_backsled = function(){

				// Controlamos el boton .next
				if (current_foto==fotos.length-1) {
					$('#campaign .next').hide();
				}else{
					$('#campaign .next').show();
				}

				// Controlamos el boton .prev
				if (current_foto==0) {
					$('#campaign .prev').hide();
				}else{
					$('#campaign .prev').show();
				}

				// Checkamos si esta cargada la siguiente foto que se va a Mostrar
				// de no ser asi se muestra el preloader y se inicia la carga
				if (!fotos[current_foto].fields.loaded){

					foto_div = $('#campaign .backsled div')[current_foto]
					console.log('foto_div: ' + foto_div);
					Pampa.showLoading();

					var next_img = new Image();
					next_img.onload = function(){
						console.log('carga completa: '+ next_img.src);

						// Cambiamos el estado loaded a true
						fotos[current_foto].fields.loaded = true;

						// Ponemos la imagen como fondo del div
						foto_div.style.backgroundImage = 'url("'+ next_img.src +'")';

						// Ocultamos preloader
						Pampa.hideLoading();

						// Animamos el backsled
						backsled.animate({left: (document.width * -current_foto) + 'px'});
					}
					next_img.src = foto_div.getAttribute('data-src');
					console.log('comienza la carga de: '+next_img.src);

				}else{

					// Animamos el backsled
					backsled.animate({left: (document.width * -current_foto) + 'px'});
				}
			}

			// Mostrar div de seccion campaña
			$('#content #campaign').show();
			$('#content').show();

		});
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

		// Ocultar preloader
		Pampa.hideLoading();

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

