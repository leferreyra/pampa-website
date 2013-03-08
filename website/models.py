#encoding:utf-8

from django.db import models
from website.thumbs import ImageWithThumbsField



class Seccion(models.Model):
    
    nombre = models.CharField(max_length=50)
    opciones_sexo = (('H', 'Hombre'), ('M', 'Mujer'))
    sexo = models.CharField(max_length=1, choices=opciones_sexo)

    
    def __unicode__(self):
        return self.nombre + '(' + self.sexo + ')'


class Producto(models.Model):

    nombre = models.CharField(max_length=100)
    url_store = models.CharField(max_length=400, blank=True)
    imagen_1 = ImageWithThumbsField(upload_to='productos', verbose_name='Imágen delantera', sizes=((160,160),))
    imagen_2 = ImageWithThumbsField(upload_to='productos', verbose_name='Imágen trasera', null= True, blank= True, sizes=((160,160),))
    secciones = models.ManyToManyField(Seccion)


    def __unicode__(self):

        return self.nombre


class Campania(models.Model):

    nombre = models.CharField(max_length=100)
    foto_campania = models.ImageField(upload_to='campania', verbose_name='Foto Campaña')


    def __unicode__(self):
        return self.nombre


class Fondo(models.Model):

    nombre = models.CharField(max_length=100)
    foto_fondo = models.ImageField(upload_to='fondos', verbose_name='Foto Fondo')


    def __unicode__(self):
        return self.nombre


class Suscriptor(models.Model):
    
    email= models.CharField(max_length=100)


    def __unicode__(self):
        return self.email
