from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('signup/', views.signUp),
    path('curr/', views.curriculumData),
    path('curr/<int:id>/', views.curriculumData, name='curriculum_data_detail'),
    path('api/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair')
]