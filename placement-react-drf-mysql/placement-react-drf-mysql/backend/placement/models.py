from django.db import models
from django.contrib.auth.models import User

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    reg_no = models.CharField(max_length=50, unique=True)
    branch = models.CharField(max_length=50)
    batch_year = models.IntegerField()
    cgpa = models.FloatField(default=0)
    backlogs = models.IntegerField(default=0)
    resume_url = models.URLField(blank=True)
    def __str__(self): return f"{self.user.username} ({self.reg_no})"

class Company(models.Model):
    name = models.CharField(max_length=120)
    website = models.URLField(blank=True)
    sector = models.CharField(max_length=80, blank=True)
    description = models.TextField(blank=True)
    def __str__(self): return self.name

class Drive(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="drives")
    title = models.CharField(max_length=120)
    ctc_lpa = models.FloatField(null=True, blank=True)
    location = models.CharField(max_length=120, blank=True)
    application_deadline = models.DateField()
    drive_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default="OPEN")
    min_cgpa = models.FloatField(default=0)
    allowed_branches = models.JSONField(default=list)
    max_backlogs = models.IntegerField(default=0)
    batch_year_from = models.IntegerField()
    batch_year_to = models.IntegerField()
    def __str__(self): return f"{self.title} @ {self.company.name}"

class Application(models.Model):
    drive = models.ForeignKey(Drive, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default="APPLIED")
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
