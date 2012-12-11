from website.models import *
<<<<<<< HEAD
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse
from django.template import RequestContext
from django.core import serializers

def secciones(request):
	secciones= serializers.serialize('json', Seccion.objects.all().reverse()) 
	return HttpResponse(simplejson.dumps(secciones), mimetype='application/json')


def productos(request, id_seccion):
	secciones= serializers.serialize('json', Producto.objects.filter(secciones= id_seccion))
	return HttpResponse(simplejson.dumps(productos), mimetype='application/json')




def campania(request):
	campania= serializers.serialize('json', Campania.objects.all().reverse()) 
	return HttpResponse(simplejson.dumps(campania), mimetype='application/json')


def fondos(request):
	fondos= serializers.serialize('json', Fondo.objects.all()) 
	return HttpResponse(simplejson.dumps(fondos), mimetype='application/json')
=======
from django.http import HttpResponse
from django.core import serializers
from django.utils import simplejson


def secciones(request):

    secciones = serializers.serialize('json', Seccion.objects.all().reverse()) 
    return HttpResponse(simplejson.dumps(secciones), mimetype='application/json')


def productos(request, id_seccion):

    secciones = serializers.serialize('json', Producto.objects.filter(secciones= id_seccion))
    return HttpResponse(simplejson.dumps(productos), mimetype='application/json')


def campania(request):

    campania = serializers.serialize('json', Campania.objects.all().reverse()) 
    return HttpResponse(simplejson.dumps(campania), mimetype='application/json')


def fondos(request):

    fondos = serializers.serialize('json', Fondo.objects.all()) 
    return HttpResponse(simplejson.dumps(fondos), mimetype='application/json')
>>>>>>> c568ce6b3c2c79adb4ef7e114d5c05c6fa3acf29
