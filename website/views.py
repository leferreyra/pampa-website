from website.models import *
from django.http import HttpResponse
from django.core import serializers
from django.utils import simplejson
from django.template import RequestContext
from django.shortcuts import render_to_response
from json import dumps
from PIL import Image
from pampa import settings



def index(request):

	return render_to_response('index.html', {}, context_instance = RequestContext(request))



def secciones(request):

    secciones = serializers.serialize('json', Seccion.objects.all().reverse()) 
    return HttpResponse(simplejson.dumps(secciones), mimetype='application/json')


def productos(request, id_seccion):
	
	produc = Producto.objects.filter(secciones= id_seccion)
	productos= []
	
	dir_miniaturas = settings.MEDIA_ROOT + "miniaturas/"

	for producto in produc:
		
		try:
			fichero = open(dir_miniaturas + str(producto.id) + "_imagen_1_miniatura")
			fichero.close()
		except:
			im = Image.open(settings.MEDIA_ROOT + producto.imagen_1.url)
			size = im.size
			newsize = (int(round(size[0]*0.25)), int(round(size[1]*0.25)))

   			im.thumbnail(newsize, Image.ANTIALIAS)
   			im.save( dir_miniaturas + str(producto.id) + "_imagen_1_miniatura" , "JPEG")

		newobj = {
				'id_producto': producto.id,
				'nombre': producto.nombre,
				'mensaje': producto.mensaje,
				'imagen_1': producto.imagen_1.url,
				'imagen_2': '',
				'miniatura_1': dir_miniaturas + str(producto.id) + "_imagen_1_miniatura",
				'miniatura_2': '',
				
			}

		if producto.imagen_2: 
			newobj['imagen_2'] = producto.imagen_2.url
			try:
				fichero = open(dir_miniaturas + str(producto.id) + "_imagen_2_miniatura")
				fichero.close()
			except:
				im = Image.open(settings.MEDIA_ROOT + producto.imagen_2.url)
				size = im.size
				newsize = (int(round(size[0]*0.25)), int(round(size[1]*0.25)))
				im.thumbnail(newsize, Image.ANTIALIAS)
				im.save(dir_miniaturas + str(producto.id) + "_imagen_2_miniatura" , "JPEG")			

			
			newobj['miniatura_2'] = dir_miniaturas + str(producto.id) + "_imagen_2_miniatura",
		
		productos.append(newobj)
	
	return HttpResponse(dumps(productos), mimetype='application/json')


def campania(request):

    campania = serializers.serialize('json', Campania.objects.all().reverse()) 
    return HttpResponse(simplejson.dumps(campania), mimetype='application/json')


def fondos(request):

    fondos = serializers.serialize('json', Fondo.objects.all().order_by('id').reverse()[:1]) 
    return HttpResponse(simplejson.dumps(fondos), mimetype='application/json')
