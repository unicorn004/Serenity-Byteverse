# Generated by Django 5.1.5 on 2025-03-19 21:40

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="medicalprofile",
            old_name="mood_score",
            new_name="personality_score",
        ),
    ]
