from website.models import *
from django.http import HttpResponse
from django.core import serializers
from django.utils import simplejson
from django.template import RequestContext
from django.shortcuts import render_to_response
from json import dumps


def index(request):

	return render_to_response('index.html', {}, context_instance = RequestContext(request))



def secciones(request):

    secciones = serializers.serialize('json', Seccion.objects.all().reverse()) 
    return HttpResponse(simplejson.dumps(secciones), mimetype='application/json')


def productos(request, id_seccion):
	
	produc = Producto.objects.filter(secciones= id_seccion)
	productos= []

	for producto in produc:

		newobj = {
				'id_producto': producto.id,
				'nombre': producto.nombre,
				'mensaje': producto.mensaje,
				'imagen_1': producto.imagen_1.url,
				'imagen_2': '',
			}

		if producto.imagen_2: 
			newobj['imagen_2'] = producto.imagen_2.url
		
		productos.append(newobj)
	
	return HttpResponse(dumps(productos), mimetype='application/json')


def campania(request):

    campania = serializers.serialize('json', Campania.objects.all().reverse()) 
    return HttpResponse(simplejson.dumps(campania), mimetype='application/json')


def fondos(request):

<<<<<<< HEAD
=======
    fondos = serializers.serialize('json', Fondo.objects.all().order_by('id').reverse()[:1]) 
    return HttpResponse(simplejson.dumps(fondos), mimetype='application/json')
>>>>>>> aff69b7f9f3bd5e7d05b5fcb5ac4b640c64bfe1a
