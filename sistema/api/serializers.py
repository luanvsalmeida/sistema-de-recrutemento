from rest_framework import serializers
from base.models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        print("token: ", token, "user:  ", user)
        # Tenta obter o `DadosUsuario` correspondente ao ID do usuário
        try:
            dados_usuario = DadosUsuario.objects.get(user_id=user.id)
            token['recrutador'] = dados_usuario.recrutador
            token['id'] = dados_usuario.id
        except DadosUsuario.DoesNotExist:
            # Define valores padrão se `DadosUsuario` não for encontrado
            print("(serializers.py) dados_usuario não encontrado para o usuário com ID:", user.id)
            token['recrutador'] = False
            token['id'] = None
        
        print("(serializers.py) recrutador:", token['recrutador'], "id:", token['id'])
        return token


class DadosUsuarioSerializer(serializers.ModelSerializer):
    usuario = serializers.CharField(max_length=255)  

    class Meta:
        model = DadosUsuario
        fields = '__all__'

class DadosPessoaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DadosPessoais
        fields = '__all__'

class ContatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contato
        fields = '__all__'

class ExperienciaProfissionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienciaProfissional
        fields = '__all__'

class FormacaoAcademicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormacaoAcademica
        fields = '__all__'
