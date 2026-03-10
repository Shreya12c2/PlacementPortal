from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import StudentProfileViewSet, CompanyViewSet, DriveViewSet, ApplicationViewSet

router = DefaultRouter()
router.register(r"students", StudentProfileViewSet)
router.register(r"companies", CompanyViewSet)
router.register(r"drives", DriveViewSet)
router.register(r"applications", ApplicationViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
