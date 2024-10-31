from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from base.models import *
from .serializers import *
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data

        # Decodifica o token de acesso da resposta
        access_token = data.get('access')
        if access_token:
            # Carrega o token com RefreshToken para acessar as informações adicionais
            token_data = AccessToken(access_token)
            try:
                # Obtém o `DadosUsuario` a partir do ID do usuário
                dados_usuario = DadosUsuario.objects.get(user_id=token_data['user_id'])
                data['recrutador'] = dados_usuario.recrutador
                data['id'] = dados_usuario.id
            except DadosUsuario.DoesNotExist:
                data['recrutador'] = False
                data['id'] = None

        return Response(data)



@api_view(['GET'])
def getData(request):
    usuarios = DadosUsuario.objects.all()
    seerializer = DadosUsuarioSerializer(usuarios, many=True)
    return Response(seerializer.data)

@api_view(['POST'])
def signUp(request):
    serializer = DadosUsuarioSerializer(data=request.data)
    if serializer.is_valid():
        # Cria um usuário Django com username e senha
        user = User.objects.create_user(
            username=request.data['usuario'],
            password=request.data['senha']
        )

        print("inicio")
        # Cria DadosUsuario e o vincula ao User
        dados_usuario = DadosUsuario.objects.create(
            user=user,
            usuario=request.data['usuario'],
            senha=request.data['senha'],
            recrutador=request.data.get('recrutador', False)
        )

        # Gera tokens JWT
        refresh = RefreshToken.for_user(user)
        tokens = {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

        return Response({**serializer.data, **tokens}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def curriculumData(request, id=None):
    # Obter o usuário autenticado
    dados_usuario = DadosUsuario.objects.filter(usuario=request.user).first()

    if request.method == 'GET':
        if dados_usuario.recrutador:
            # Se o usuário for recrutador, obter todos os dados
            dados_pessoais = DadosPessoais.objects.all()
            contato = Contato.objects.all()
            experiencia = ExperienciaProfissional.objects.all()
            formacao = FormacaoAcademica.objects.all()
            many_value = True  # Retorna uma lista de instâncias
        else:
            # Se não for recrutador, filtrar apenas os dados do usuário
            dados_pessoais = DadosPessoais.objects.filter(usuario=dados_usuario).first()
            contato = Contato.objects.filter(usuario=dados_usuario).first()
            experiencia = ExperienciaProfissional.objects.filter(usuario=dados_usuario)
            formacao = FormacaoAcademica.objects.filter(usuario=dados_usuario)
            many_value = False  # Retorna uma única instância para `dados_pessoais` e `contato`

        # Serializar os dados com `many=True` para recrutadores e `many=False` para usuários
        dados_pessoais_serializer = DadosPessoaisSerializer(dados_pessoais, many=dados_usuario.recrutador)
        contato_serializer = ContatoSerializer(contato, many=dados_usuario.recrutador)
        experiencia_serializer = ExperienciaProfissionalSerializer(experiencia, many=True)
        formacao_serializer = FormacaoAcademicaSerializer(formacao, many=True)

        return Response({
            'dados_pessoais': dados_pessoais_serializer.data,
            'contato': contato_serializer.data,
            'experiencia': experiencia_serializer.data,
            'formacao': formacao_serializer.data
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        if not dados_usuario:
            return Response({"error": "Usuário não encontrado para associação."}, status=status.HTTP_400_BAD_REQUEST)

        # Extrair os dados do request
        dados_pessoais_data = request.data.get('dados_pessoais')
        contato_data = request.data.get('contato')
        experiencia_data = request.data.get('experiencia')
        formacao_data = request.data.get('formacao')

        # Inicializar os serializers com os dados recebidos
        dados_pessoais_serializer = DadosPessoaisSerializer(data=dados_pessoais_data)
        contato_serializer = ContatoSerializer(data=contato_data)
        experiencia_serializer = ExperienciaProfissionalSerializer(data=experiencia_data, many=True)
        formacao_serializer = FormacaoAcademicaSerializer(data=formacao_data, many=True)

        # Verificar se todos os dados são válidos
        if all([dados_pessoais_serializer.is_valid(), contato_serializer.is_valid(), 
                experiencia_serializer.is_valid(), formacao_serializer.is_valid()]):
            # Salvar dados
            dados_pessoais_serializer.save(usuario=dados_usuario)
            contato_serializer.save(usuario=dados_usuario)
            for experiencia_item in experiencia_serializer.validated_data:
                ExperienciaProfissional.objects.create(usuario=dados_usuario, **experiencia_item)
            for formacao_item in formacao_serializer.validated_data:
                FormacaoAcademica.objects.create(usuario=dados_usuario, **formacao_item)

            return Response({
                'dados_pessoais': dados_pessoais_serializer.data,
                'contato': contato_serializer.data,
                'experiencia': experiencia_serializer.data,
                'formacao': formacao_serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            # Retornar erros caso algum serializer seja inválido
            return Response({
                'dados_pessoais_errors': dados_pessoais_serializer.errors,
                'contato_errors': contato_serializer.errors,
                'experiencia_errors': experiencia_serializer.errors,
                'formacao_errors': formacao_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)