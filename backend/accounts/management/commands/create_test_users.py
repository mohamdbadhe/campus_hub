from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import Profile


class Command(BaseCommand):
    help = 'Creates test users for admin, student, and lecturer'

    def handle(self, *args, **options):
        # Create Admin
        admin_email = 'admin@campus.edu'
        admin_password = 'admin123'
        if not User.objects.filter(username=admin_email).exists():
            admin_user = User.objects.create_user(
                username=admin_email,
                email=admin_email,
                password=admin_password
            )
            admin_profile, _ = Profile.objects.get_or_create(user=admin_user)
            admin_profile.role = 'admin'
            admin_profile.save()
            self.stdout.write(
                self.style.SUCCESS(f'Created Admin: {admin_email} / {admin_password}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Admin user {admin_email} already exists')
            )

        # Create Student
        student_email = 'student@campus.edu'
        student_password = 'student123'
        if not User.objects.filter(username=student_email).exists():
            student_user = User.objects.create_user(
                username=student_email,
                email=student_email,
                password=student_password
            )
            student_profile, _ = Profile.objects.get_or_create(user=student_user)
            student_profile.role = 'student'
            student_profile.save()
            self.stdout.write(
                self.style.SUCCESS(f'Created Student: {student_email} / {student_password}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Student user {student_email} already exists')
            )

        # Create Lecturer (approved)
        lecturer_email = 'lecturer@campus.edu'
        lecturer_password = 'lecturer123'
        if not User.objects.filter(username=lecturer_email).exists():
            lecturer_user = User.objects.create_user(
                username=lecturer_email,
                email=lecturer_email,
                password=lecturer_password
            )
            lecturer_profile, _ = Profile.objects.get_or_create(user=lecturer_user)
            lecturer_profile.role = 'lecturer'
            lecturer_profile.save()
            self.stdout.write(
                self.style.SUCCESS(f'Created Lecturer: {lecturer_email} / {lecturer_password}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Lecturer user {lecturer_email} already exists')
            )

        # Create Manager (approved)
        manager_email = 'manager@campus.edu'
        manager_password = 'manager123'
        if not User.objects.filter(username=manager_email).exists():
            manager_user = User.objects.create_user(
                username=manager_email,
                email=manager_email,
                password=manager_password
            )
            manager_profile, _ = Profile.objects.get_or_create(user=manager_user)
            manager_profile.role = 'manager'
            manager_profile.save()
            self.stdout.write(
                self.style.SUCCESS(f'Created Manager: {manager_email} / {manager_password}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Manager user {manager_email} already exists')
            )

        self.stdout.write(
            self.style.SUCCESS('\nAll test users created!')
        )
        self.stdout.write('\nLogin Credentials:')
        self.stdout.write('=' * 50)
        self.stdout.write(f'Admin:    {admin_email}    / {admin_password}')
        self.stdout.write(f'Student:  {student_email}  / {student_password}')
        self.stdout.write(f'Lecturer: {lecturer_email} / {lecturer_password}')
        self.stdout.write(f'Manager:  {manager_email}  / {manager_password}')
        self.stdout.write('=' * 50)
