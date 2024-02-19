# Generated by Django 4.2 on 2023-11-21 12:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('mathapi', '0011_alter_question_q_string'),
    ]

    operations = [
        migrations.CreateModel(
            name='MCQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=512)),
                ('choices', models.CharField(max_length=256)),
                ('difficulty', models.IntegerField(default=1)),
                ('type', models.CharField(choices=[('MATH', 'Math question'), ('SC', 'Science question'), ('GK', 'General knowledge'), ('IQ', 'IQ question')], max_length=4)),
            ],
        ),
        migrations.CreateModel(
            name='UserStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_difficulty', models.IntegerField(default=1)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_stat', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]