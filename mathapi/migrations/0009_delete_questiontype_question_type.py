# Generated by Django 4.2 on 2023-09-28 20:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mathapi', '0008_questiontype_question_q_string'),
    ]

    operations = [
        migrations.DeleteModel(
            name='QuestionType',
        ),
        migrations.AddField(
            model_name='question',
            name='type',
            field=models.CharField(choices=[('ADD', 'Addition'), ('SUB', 'Subtraction'), ('ASUB', 'Addition and subtraction'), ('MULT', 'Multiplication'), ('DIV', 'Division'), ('EQ_A', 'Find answer to the equation'), ('EQ_M', 'Find missing value of the equation')], default='EQ_A', max_length=4),
        ),
    ]
