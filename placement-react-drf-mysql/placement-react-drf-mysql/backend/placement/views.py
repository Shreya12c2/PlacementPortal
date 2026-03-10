from rest_framework import viewsets, permissions
from .models import StudentProfile, Company, Drive, Application
from .serializers import StudentProfileSerializer, CompanySerializer, DriveSerializer, ApplicationSerializer

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.AllowAny]

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by("id")
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]

class DriveViewSet(viewsets.ModelViewSet):
    queryset = Drive.objects.select_related("company").all()
    serializer_class = DriveSerializer
    permission_classes = [permissions.AllowAny]

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.select_related("drive","student").all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.AllowAny]
