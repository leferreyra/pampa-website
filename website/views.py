from website.models import *
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
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
                'miniatura_1': producto.imagen_1.url_200x200,
                'miniatura_2': '',
            }

        if producto.imagen_2: 
            newobj['imagen_2'] = producto.imagen_2.url
            newobj['miniatura_2'] = producto.imagen_2.url_200x200,

        productos.append(newobj)
    
    return HttpResponse(dumps(productos), mimetype='application/json')


def campania(request):

    campania = serializers.serialize('json', Campania.objects.all().reverse()) 
    return HttpResponse(simplejson.dumps(campania), mimetype='application/json')


def fondos(request):

    fondos = serializers.serialize('json', Fondo.objects.all().order_by('id').reverse()[:1]) 
    return HttpResponse(simplejson.dumps(fondos), mimetype='application/json')


@csrf_exempt
def contacto(request):
    
    subject = 'Nuevo mensaje de: %s' % request.GET['nombre']
    body = 'E-mail: %s\n' % request.GET['mail']
    body += 'Mensaje: %s' % request.GET['mensaje']

    # obetener el email del administrador
    admin_user = User.objects.get(username='admin')

    # envia desde una direccion del sistema no-reply al administrador del sitio django
    send_mail(subject, body, 'no-reply@pampamoda.com.ar', [ admin.email ])

    # devolvemos el status del la consulta
    response = {
        'status':'OK'
    }

    return HttpResponse(dumps(response), mimetype='application/json')
    
@csrf_exempt
def suscriptor(request):

    e = Suscriptor(email= request.GET['email'])
    e.save()

    # devolvemos el status del la consulta
    response = {
        'status':'OK'
    }
    
    return HttpResponse(dumps(response), mimetype='application/json')
