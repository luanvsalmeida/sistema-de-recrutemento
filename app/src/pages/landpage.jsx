import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function LandPage() {
    const [userData, setUserData] = useState(null);
    const [allCurriculums, setAllCurriculums] = useState([]);
    const isRecrutador = localStorage.getItem('isRecrutador') === 'true';
    const accessToken = localStorage.getItem('accessToken');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isRecrutador');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;
    
            try {
                if (isRecrutador) {
                    // Recrutador - Pega todos os currículos
                    const response = await axios.get('http://localhost:8000/curr/', {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    
                    // Ajusta a estrutura dos dados para que seja uma lista de currículos
                    const { dados_pessoais, contato, experiencia, formacao } = response.data;
                    
                    // Organiza os dados para que cada currículo seja um objeto com essas propriedades
                    const curriculumsList = dados_pessoais.map((pessoal, index) => ({
                        dados_pessoais: pessoal,
                        contato: contato[index],
                        experiencia: experiencia[index],
                        formacao: formacao[index],
                    }));
                    
                    setAllCurriculums(curriculumsList); // Agora `allCurriculums` terá os dados formatados
                    console.log("Todos os currículos: ", curriculumsList);
                } else {
                    // Usuário comum - Pega seu próprio currículo
                    const userId = localStorage.getItem('userId');
                    const response = await axios.get(`http://localhost:8000/curr/${userId}`, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    
                    setUserData(response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            }
        };
    
        fetchData();
    }, [accessToken, isRecrutador]);
    

    return (
        <>
            <header>
                <h1>Sistema Curriculo</h1>
                <button onClick={handleLogout}>Sair</button>
            </header>
    
            <div>
                {isRecrutador ? (
                    <div>
                        <h2>Lista de Currículos</h2>
                        {allCurriculums.length > 0 ? (
                            allCurriculums.map((curriculum) => (
                                <div style={{backgroundColor: "gray", width: "50%", padding: "2%", margin: "5%"}} key={curriculum.id}>
                                    <h3>{curriculum.dados_pessoais?.nome}</h3>
                                    <div>
                                        <h4>Dados Pessoais</h4>
                                        <p>CPF: {curriculum.dados_pessoais?.cpf}</p>
                                        <p>Nascimento: {curriculum.dados_pessoais?.data_nascimento}</p>
                                        <p>{curriculum.dados_pessoais?.cpf}</p>
                                    </div>
                                    <hr />
                                    <div>
                                        <h4>Formação</h4>
                                        <p>Curso: {curriculum.formacao?.curso}</p>
                                        <p>Instituição: {curriculum.formacao?.instituicao}</p>
                                        <p>Início: {curriculum.formacao?.periodo_inicio}</p>
                                        <p>Conclusão: {curriculum.formacao?.periodo_fim}</p>
                                    </div> 
                                    <hr />
                                    <div>
                                        <h4>Experiência Profissional</h4>
                                        <p>Cargo: {curriculum.experiencia?.cargo}</p>
                                        <p>Descrição: {curriculum.experiencia?.descricao}</p>
                                        <p>Empresa: {curriculum.experiencia?.empresa}</p>
                                        <p>Admissão: {curriculum.experiencia?.periodo_inicio}</p>
                                        <p>Demissão: {curriculum.experiencia?.periodo_fim}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum currículo encontrado.</p>
                        )}
                        
                    </div>
                ) : (
                    userData && (
                        <div>
                            <h2>Meu Currículo</h2>
                            {userData.dados_pessoais.nome != '' ? (
                                <div style={{backgroundColor: "gray", width: "50%", padding: "2%", margin: "5%"}}>
                                    <h3>{userData.dados_pessoais?.nome}</h3>
                                    <div>
                                        <h4>Dados Pessoais</h4>
                                        <p>CPF: {userData.dados_pessoais?.cpf}</p>
                                        <p>Nascimento: {userData.dados_pessoais?.data_nascimento}</p>
                                        <p>{userData.dados_pessoais?.cpf}</p>
                                    </div>
                                    <hr />
                                    <div>
                                        <h4>Formação</h4>
                                        <p>Curso: {userData.formacao?.curso}</p>
                                        <p>Instituição: {userData.formacao?.instituicao}</p>
                                        <p>Início: {userData.formacao?.periodo_inicio}</p>
                                        <p>Conclusão: {userData.formacao?.periodo_fim}</p>
                                    </div> 
                                    <hr />
                                    <div>
                                        <h4>Experiência Profissional</h4>
                                        <p>Cargo: {userData.experiencia?.cargo}</p>
                                        <p>Descrição: {userData.experiencia?.descricao}</p>
                                        <p>Empresa: {userData.experiencia?.empresa}</p>
                                        <p>Admissão: {userData.experiencia?.periodo_inicio}</p>
                                        <p>Demissão: {userData.experiencia?.periodo_fim}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p>Currículo não cadastrado.</p>
                                
                                    <Link to="/form">Criar Currículo</Link>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

        </>
    );
}
