# Generated by Django 4.2 on 2023-09-23 18:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mathapi', '0005_inventory_coins'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='trapModules',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='lifetimeinventory',
            name='coins',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='lifetimeinventory',
            name='trapModules',
            field=models.IntegerField(default=0),
        ),
    ]
