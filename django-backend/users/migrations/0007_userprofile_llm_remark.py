# Generated by Django 5.1.7 on 2025-03-21 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_merge_20250322_0021'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='llm_remark',
            field=models.TextField(blank=True, null=True),
        ),
    ]
