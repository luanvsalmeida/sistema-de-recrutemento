from django.db import models
from django.contrib.auth.models import User

class DadosUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dados_usuario', null=True, blank=True)
    usuario = models.CharField(max_length=255, default="", unique=True) 
    senha = models.CharField(max_length=255, default="")
    recrutador = models.BooleanField(default=False)
    
    def __str__(self):
        return self.usuario

class DadosPessoais(models.Model):
    usuario = models.OneToOneField(
        DadosUsuario, 
        on_delete=models.CASCADE,
        limit_choices_to={'recrutador': False},
        related_name="dados_pessoais",
        null=True,
        blank=True
    )
    nome = models.CharField(max_length=255, default="")
    data_nascimento = models.DateField(null=True, blank=True)
    cpf = models.CharField(max_length=14, default="")

    def __str__(self):
        return f"{self.nome} ({self.usuario})"

class Contato(models.Model):
    usuario = models.OneToOneField(
        DadosUsuario, 
        on_delete=models.CASCADE,
        limit_choices_to={'recrutador': False},
        related_name="contato",
        null=True,
        blank=True
    )
    email = models.EmailField(default="")
    telefone = models.CharField(max_length=20, default="")
    endereco = models.TextField(default="")

    def __str__(self):
        return f"Contato de {self.usuario}"

class ExperienciaProfissional(models.Model):
    usuario = models.ForeignKey(
        DadosUsuario, 
        on_delete=models.CASCADE,
        limit_choices_to={'recrutador': False},
        related_name="experiencias_profissionais",
        null=True,  # Make the field nullable to handle existing rows
        blank=True
    )
    cargo = models.CharField(max_length=255, default="")
    empresa = models.CharField(max_length=255, default="")
    periodo_inicio = models.DateField(null=True, blank=True)
    periodo_fim = models.DateField(null=True, blank=True)
    descricao = models.TextField(default="")

    def __str__(self):
        return f"{self.cargo} em {self.empresa} ({self.usuario})"

class FormacaoAcademica(models.Model):
    usuario = models.ForeignKey(
        DadosUsuario, 
        on_delete=models.CASCADE,
        limit_choices_to={'recrutador': False},
        related_name="formacoes_academicas",
        null=True,
        blank=True
    )
    instituicao = models.CharField(max_length=255, default="")
    curso = models.CharField(max_length=255, default="")
    periodo_inicio = models.DateField(null=True, blank=True)
    periodo_fim = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.curso} em {self.instituicao} ({self.usuario})"
