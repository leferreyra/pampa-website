
var go_section;

// Definimos funcion para parsear el hash de la url, cada vez
// que cambia. Asi cuando cambia a una seccion en particular
// podemos extraer la id de dicha seccion
window.onhashchange = function(){

	// Obtener hash
	hash = window.location.hash;
	dirs = hash.split('/');

	// Verificamos si se trata de una seccion
	if (dirs.length == 4 && dirs[2]=='seccion'){
		sec_id = dirs[3];

		// Llamamos la funcion encargada de la seccion
		go_section(sec_id);
	}
}


$(function() {

	$.History.bind('/coleccion',function(state) {

		btns = Pampa.collection_sections_buttons;
		btns.splice(0,0,back_btn);
		Pampa.changeMenu(btns);
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
				div.css('width', $(document).width());

				// Agregamos el div al backsled
				backsled.append(div);

			});

			// Cargamos la primer foto antes de ocultar el preloader
			var first_img = $('#campaign .backsled div')[0];
			// console.log('primer div');
			// console.log(first_img);

			var img = new Image();
			img.onload = function(){
				// console.log('carga completa de: ' + img.src);

				// Cambiamos el estado loaded a true
				fotos[0].fields.loaded = true;

				// Ponemos la imagen como fondo del div
				first_img.style.backgroundImage = 'url("'+ img.src +'")';

				// Ocultamos preloader
				Pampa.hideLoading();

			}

			// Trigger la carga de la primera imagen
			img.src = first_img.getAttribute('data-src');
			// console.log('cargando.. ' + img.src);

			// Lleva la cuenta de la foto actual
			current_foto = 0;

			// Esconder boton prev
			$('#campaign .prev').hide();
			
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
					// console.log('foto_div: ' + foto_div);
					Pampa.showLoading();

					var next_img = new Image();
					next_img.onload = function(){
						// console.log('carga completa: '+ next_img.src);

						// Cambiamos el estado loaded a true
						fotos[current_foto].fields.loaded = true;

						// Ponemos la imagen como fondo del div
						foto_div.style.backgroundImage = 'url("'+ next_img.src +'")';

						// Ocultamos preloader
						Pampa.hideLoading();

						// Animamos el backsled
						backsled.animate({left: ($(document).width() * -current_foto) + 'px'});
					}
					next_img.src = foto_div.getAttribute('data-src');
					// console.log('comienza la carga de: '+next_img.src);

				}else{

					// Animamos el backsled
					backsled.animate({left: ($(document).width() * -current_foto) + 'px'});
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
		// console.log(state);
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

	// Funcion para manejar secciones
	go_section = function(id){

		// Guardamos los items del menu actuales, para restaurarlos luego.
		old_menu_items = Pampa.currentMenuItems;

		// Creamos un nuevo boton
		colec_back_btn = {
			id:'',
			link:'/coleccion',
			name:'BACK',
			callback: function(){

				// En caso de que no se hubiera terminado de cargar algo,
				// ocultamos el loading.
				Pampa.hideLoading();

				// Ocultar la seccion y el div content.
				$('#content').hide();
				$('#content #section').hide();

				// Volvemos al menu de secciones
				$.History.go('/coleccion');
			}
		}

		// Seteamos el menu con el boton back
		Pampa.changeMenu([colec_back_btn]);

		// Mostramos el preloader
		Pampa.showLoading();

		// Definimos variables para controlar la cantidad de miniaturas cargadas
		var prod_min_loaded = 0;
		var prod_min_total = 0;

		// Comenzamos la carga
		$.get('/collection/' + id, function(json){

			// json alias
			var productos = json;

			// Definimos total de miniaturas a cargar
			prod_min_total = json.length;

			// Vaciamos el wrapper, de todo elemento previamente insertado
			$('#section-wrapper').html('');

			// Insertar los elementos del DOM para cada producto
			$.each(json, function(index, producto){

				// Creamos un nuevo div
				newdiv = $('<div></div>');

				// Asociamos un atributo data con la id del producto
				newdiv.attr('data-productid', producto.id_producto);

				// Agregamos un atributo data-index, ya que el productid
				// no sirve para posicionar el producto en el wrapper
				newdiv.attr('data-index', index);

				// Agregamos las clases necesarias
				newdiv.addClass('product');

				// Elementos html para las opciones del producto
				opthtml = $('#product-opt').html();
				newdiv.html(opthtml);

				// Comenzar a cargar la imagen en miniatura
				prod_min_img = new Image();

				// Al cargar, llamar a una funcion que checkea si todas las imagenes fueron cargadas.
				prod_min_img.onload = function(){

					// Incrementamos el contador de imagenes cargadas
					prod_min_loaded++;

					// Llamamos a la funcion de control de carga.
					check_prod_img_loaded();

				}

				// Comenzamos la carga
				prod_min_img.src = producto.miniatura_1;

				// Desactivamos los botones de .opt que no apliquen
				if (producto.miniatura_2 == ''){

					// Desactivar boton de imagen_2 si el producto no la tiene.
					newdiv.find('.turn').css('display', 'none');
				}

				// Coloca la imagen como fondo del div del producto
				newdiv.css('background-image', 'url("'+producto.miniatura_1+'")');

				console.log('comienza la carga de ' + producto.miniatura_1);

				// Insertamos el nuevo html al div #seciont-wrapper, que contiene
				// todos los div con clase .product
				$('#section-wrapper').append(newdiv);
			});

			// Funcion para control de la carga de las miniaturas de los productos
			var check_prod_img_loaded = function(){
					console.log('loaded: '+ prod_min_loaded);
				if (prod_min_loaded == prod_min_total){

					// Todas las miniaturas cargadas!
					Pampa.hideLoading();
				}
			}

			// Funcion para obtener longitudes del css.
			// Obtiene un string como '150px' y devuelve el valor 150
			parse_long = function(string){
				x = string.split('px');
				return Number(x[0]);
			}

			// Definimos algunas variables, para el posicionamiento inicial
			// Ver si se puede obtener de una mejor manera. Del CSS talvez.
			cant_prod = $('#section-wrapper .product').length;
			prod_width = parse_long($('.product').css('width'));

			// Se utiliza el margen por compatibilidad, ya que firefox, no devuelve
			// valores para la propiedad css margin corta
			prod_margin = parse_long($('.product').css('marginLeft')); 

			s_wrapper = $('#section-wrapper'); // El div contenedor de productos

			// Calcular el ancho del contenedor a partir de la altura del producto y 
			// altura del navegador, de manera que entren 3 filas de productos.
			total_prod_size = prod_width + (prod_margin * 2);
			width_in_prod_q = cant_prod / 3;
			width_in_px = width_in_prod_q * total_prod_size; // Fix firefox

			// Seteamos el ancho
			s_wrapper.css('width', width_in_px + 'px');

			// Seteamos la escala en caso de volver, a esta seccion
			s_wrapper.css({
				'transform': 'scale('+ 1 +')'
			});


			// Unbindeamos eventos
			$('#section-wrapper .product').unbind('click');

			// Calculamos el margen superior del wrapper, para que no se superponga
			// con el logo
			logo_height = parse_long($('.logo').css('height'));
			w_mtop_from_logo = ($(document).height() - parse_long(s_wrapper.css('height'))) / 2;
			w_margin_top = logo_height + w_mtop_from_logo;

			// Seteamos el margen superior e izquierdo del wrapper
			s_wrapper.css({'margin-top': w_margin_top + 'px', 'margin-left': w_mtop_from_logo + 'px'});

			// Calculamos la escala del wrapper cuando se hace zoom al producto
			zoom_scale = ($(document).height() / total_prod_size).toFixed(2);

			// Guardamos current_left para restaurarlo despues del zoomout
			var w_current_left = 0;

			// Unbindeamos y bindeamos nuevamente, los botones del producto a sus
			// respectivas funciones
			$('#section-wrapper .opt .optbut').unbind('click');

			$('#section-wrapper .opt .zoomout').click(function(e){

				// Removemos la clase zoomed de los productos
				$('#section-wrapper .product').removeClass('zoomed');

				// Seteamos la escala en caso de volver, a esta seccion
				s_wrapper.css({ 'transform': 'scale('+ 1 +')'});

				// Bindear eventos de nuevo
				setTimeout(function(){$('.product').click(zoom_product)}, 500);

				// Reseteamos los margenes del wrapper
				s_wrapper.css({'margin-top': w_margin_top + 'px', 'margin-left': w_mtop_from_logo + 'px'});

				// Set draggable w otra vez
				make_w_draggable();

				// Reset move cursor
				s_wrapper.css('cursor', 'move');

			});

			var make_w_draggable = function(){
				// Hacemos que #section-wrapper sea 'draggable' en el eje x
				s_wrapper.draggable({
					axis: 'x',
			        helper: function(){
			            // Create an invisible div as the helper. It will move and
			            // follow the cursor as usual.
			            return $('<div></div>').css('opacity',0);
			        },
			        drag: function(event, ui){
			            // During dragging, animate the original object to
			            // follow the invisible helper with custom easing.
			            var p = ui.helper.position();
			            $(this).stop().animate({
			                left: p.left
			            },1000,'easeOutCirc');
			        }
			    });
			}

			make_w_draggable();


			// Funcion que maneja cuando a un producto se le hace click
			var zoom_product = function(event){

				// Obtenemos la id del producto clickeado
				productid = event.currentTarget.getAttribute('data-index');	

				// Cargamos la imagen con mas resolucion
				var hd_img = new Image();

				img_url = productos[productid].imagen_1;
				hd_img.onload = function(){

					// Reemplazamos la imagen con menor resolucion con esta
					$(s_wrapper.find('.product[data-index="'+productid+'"]'))
						.css('background-image', 'url("'+img_url+'")');
				}

				hd_img.src = img_url;

				// Ponemos el cursoro normal
				s_wrapper.css('cursor', 'auto');

				// Quitamos la clase zoomed a todos los otros productos anteriores
				$('#section-wrapper .product').removeClass('zoomed');

				// Quitamos el draggable al wrapper
				s_wrapper.draggable('destroy');

				// Agregamos la clase zoomed al producto activo
				event.currentTarget.className += ' zoomed';

				$('.product').unbind('click');

				// Calculamos la ubicacion col, row. Del producto en el wrapper.
				prod_row = Math.floor(productid / width_in_prod_q) + 1;
				prod_col = (productid % width_in_prod_q) + 1;

				// Calculamos los margenes del producto, escalado.
				esc_margin_left = -((prod_col-1) * total_prod_size * zoom_scale);
				esc_margin_top = -((prod_row-1) * total_prod_size * zoom_scale);

				// Ajustamos el margen izquierdo para centrar el producto en la pantalla.
				esc_margin_left += ($(document).width() - (total_prod_size * zoom_scale))/2;

				// Animamos los margenes, y escalamos el wrapper completo
				// Cambia el origen de la transformacion
				s_wrapper.css({
					'marginLeft': esc_margin_left.toFixed(2) - parse_long(s_wrapper.css('left')).toFixed(2) + 'px',
					'marginTop': esc_margin_top.toFixed(2) + 'px',
					'transform-origin': '0% 0%',
					'transform': 'scale('+ zoom_scale +')'
				});

			}

			// Asignamos el handler para el evento click
			$('#section-wrapper .product').click(zoom_product);

			// Mostramos el div de la sección
			$('#content #section').show();
			$('#content').show();

		});

		// Generar productos (TESTING!)	
		// n = 6 // Numero de productos a generar
		// $('#section-wrapper').html('');
		// for (i=0; i<n; i++){
		// 	newdiv = $('<div></div>');
		// 	newdiv.attr('data-productid', i);
		// 	newdiv.addClass('product');
		// 	opthtml = $('#product-opt').html();
		// 	newdiv.html(opthtml);
		// 	$('#section-wrapper').append(newdiv);
		// }

			
	}
});