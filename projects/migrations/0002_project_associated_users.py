# Generated by Django 3.2.3 on 2021-05-15 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='associated_users',
            field=models.TextField(default=''),
        ),
    ]
