import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

const Form = () => {
    const [formData, setFormData] = useState({
        dados_pessoais: {
            nome: "",
            data_nascimento: "",
            cpf: "",
        },
        contato: {
            email: "",
            telefone: "",
            endereco: "",
        },
        experiencia: [
            {
                cargo: "",
                empresa: "",
                periodo_inicio: "",
                periodo_fim: "",
                descricao: "",
            }
        ],
        formacao: [
            {
                instituicao: "",
                curso: "",
                periodo_inicio: "",
                periodo_fim: "",
            }
        ],
    });

    const handleChange = (event, section, index = 0) => {
        const { name, value } = event.target;
        if (section === "experiencia" || section === "formacao") {
            // Atualiza uma entrada dentro da lista de experiência ou formação
            setFormData((prevFormData) => {
                const updatedSection = [...prevFormData[section]];
                updatedSection[index] = {
                    ...updatedSection[index],
                    [name]: value,
                };
                return {
                    ...prevFormData,
                    [section]: updatedSection,
                };
            });
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [section]: {
                    ...prevFormData[section],
                    [name]: value,
                },
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("accessToken");

        const updatedFormData = {
            dados_pessoais: { ...formData.dados_pessoais, usuario_id: userId },
            contato: { ...formData.contato, usuario_id: userId },
            experiencia: formData.experiencia.map(exp => ({ ...exp, usuario_id: userId })), // Garante que é uma lista
            formacao: formData.formacao.map(form => ({ ...form, usuario_id: userId })), // Garante que é uma lista
        };
        
        try {
            const response = await axios.post("http://localhost:8000/curr/", updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Dados salvos com sucesso:", response.data);
            window.location.href = '/';
    
        } catch (error) {
            console.error("Erro ao salvar dados:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <>
            <header>
                <h2>Sistema de Currículos</h2>
            </header>
            <div style={styles.container}>
                
                <Link to="/" style={styles.backLink}>← Voltar para a página inicial</Link>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h2 style={styles.sectionTitle}>Dados Pessoais</h2>
                    <input
                        type="text"
                        name="nome"
                        value={formData.dados_pessoais.nome}
                        onChange={(e) => handleChange(e, "dados_pessoais")}
                        placeholder="Nome"
                        style={styles.input}
                    />
                    <input
                        type="date"
                        name="data_nascimento"
                        value={formData.dados_pessoais.data_nascimento}
                        onChange={(e) => handleChange(e, "dados_pessoais")}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="cpf"
                        value={formData.dados_pessoais.cpf}
                        onChange={(e) => handleChange(e, "dados_pessoais")}
                        placeholder="CPF"
                        style={styles.input}
                    />

                    <h2 style={styles.sectionTitle}>Contato</h2>
                    <input
                        type="email"
                        name="email"
                        value={formData.contato.email}
                        onChange={(e) => handleChange(e, "contato")}
                        placeholder="Email"
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="telefone"
                        value={formData.contato.telefone}
                        onChange={(e) => handleChange(e, "contato")}
                        placeholder="Telefone"
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="endereco"
                        value={formData.contato.endereco}
                        onChange={(e) => handleChange(e, "contato")}
                        placeholder="Endereço"
                        style={styles.input}
                    />

                    <h2 style={styles.sectionTitle}>Experiência Profissional</h2>
                    <input
                        type="text"
                        name="cargo"
                        value={formData.experiencia[0].cargo}
                        onChange={(e) => handleChange(e, "experiencia")}
                        placeholder="Cargo"
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="empresa"
                        value={formData.experiencia[0].empresa}
                        onChange={(e) => handleChange(e, "experiencia")}
                        placeholder="Empresa"
                        style={styles.input}
                    />
                    <input
                        type="date"
                        name="periodo_inicio"
                        value={formData.experiencia[0].periodo_inicio}
                        onChange={(e) => handleChange(e, "experiencia")}
                        style={styles.input}
                    />
                    <input
                        type="date"
                        name="periodo_fim"
                        value={formData.experiencia[0].periodo_fim}
                        onChange={(e) => handleChange(e, "experiencia")}
                        style={styles.input}
                    />
                    <textarea
                        name="descricao"
                        value={formData.experiencia[0].descricao}
                        onChange={(e) => handleChange(e, "experiencia")}
                        placeholder="Descrição da Experiência"
                        style={styles.textarea}
                    />

                    <h2 style={styles.sectionTitle}>Formação Acadêmica</h2>
                    <input
                        type="text"
                        name="instituicao"
                        value={formData.formacao[0].instituicao}
                        onChange={(e) => handleChange(e, "formacao")}
                        placeholder="Instituição"
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="curso"
                        value={formData.formacao[0].curso}
                        onChange={(e) => handleChange(e, "formacao")}
                        placeholder="Curso"
                        style={styles.input}
                    />
                    <input
                        type="date"
                        name="periodo_inicio"
                        value={formData.formacao[0].periodo_inicio}
                        onChange={(e) => handleChange(e, "formacao")}
                        style={styles.input}
                    />
                    <input
                        type="date"
                        name="periodo_fim"
                        value={formData.formacao[0].periodo_fim}
                        onChange={(e) => handleChange(e, "formacao")}
                        style={styles.input}
                    />

                    <button type="submit" style={styles.submitButton}>Enviar</button>
                </form>
            </div>
        </>
        
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'gray',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '8px 0',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        margin: '8px 0',
        borderRadius: '4px',
        border: '1px solid #ddd',
        minHeight: '80px',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    backLink: {
        alignSelf: 'flex-start',
        marginBottom: '10px',
        textDecoration: 'none',
        color: '#007BFF',
        fontSize: '16px',
    }
};


export default Form;
