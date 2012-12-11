from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^collection/(?P<id_seccion>\d+)$', 'website.views.productos'),
    url(r'^collection/', "website.views.secciones"),
<<<<<<< HEAD
    url(r'^campaign/', "website.views.camapania"),
    url(r'^background/', "website.views.fondos"),


)
=======
    url(r'^campaign/', "website.views.campania"),
    url(r'^background/', "website.views.fondos"),
)
>>>>>>> c568ce6b3c2c79adb4ef7e114d5c05c6fa3acf29
