#encoding:utf-8

from django.db import models


class Seccion(models.Model):
    
    nombre = models.CharField(max_length=50, unique=True)

    
    def __unicode__(self):
        return self.nombre


class Producto(models.Model):

    nombre = models.CharField(max_length=100)
    mensaje= models.CharField(max_length=15, null= True, blank= True)
    imagen_1 = models.ImageField(upload_to='productos', verbose_name='Imágen delantera')
    imagen_2 = models.ImageField(upload_to='productos', verbose_name='Imágen trasera', null= True, blank= True)
    secciones = models.ManyToManyField(Seccion)


    def __unicode__(self):

        return self.nombre


class Campania(models.Model):

    nombre = models.CharField(max_length=100)
    foto_campania = models.ImageField(upload_to='campaña', verbose_name='Foto Campaña')


    def __unicode__(self):
        return self.nombre


class Fondo(models.Model):

    nombre = models.CharField(max_length=100)
    foto_fondo = models.ImageField(upload_to='fondos', verbose_name='Foto Fondo')


    def __unicode__(self):
        return self.nombre


class suscriptor(models.Model):
    
    email= models.CharField(max_length=100)


    def __unicode__(self):
        return self.email
