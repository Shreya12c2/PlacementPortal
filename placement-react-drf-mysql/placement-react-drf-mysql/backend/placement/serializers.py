from rest_framework import serializers
from .models import StudentProfile, Company, Drive, Application

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta: model = StudentProfile; fields = "__all__"

class CompanySerializer(serializers.ModelSerializer):
    class Meta: model = Company; fields = "__all__"

class DriveSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    class Meta: model = Drive; fields = "__all__"

class ApplicationSerializer(serializers.ModelSerializer):
    drive_title = serializers.CharField(source="drive.title", read_only=True)
    student_name = serializers.CharField(source="student.user.username", read_only=True)
    class Meta: model = Application; fields = "__all__"
