import React, { useState } from 'react';
import axios from 'axios';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [recrutador, setRecrutador] = useState(false);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setUsuario('');
        setSenha('');
        setRecrutador(false);
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password
            });
            const { access, refresh, recrutador, id} = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('isRecrutador', recrutador);
            localStorage.setItem('userId', id);
            return { access, recrutador };
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const { access, recrutador } = await login(usuario, senha);
                if (access) {
                    window.location.href = '/';
                }
            } catch (error) {
                alert("Usuário ou senha inválidos");
            }
        } else {
            try {
                await axios.post('http://localhost:8000/signup/', {
                    usuario,
                    senha,
                    recrutador
                });
                try {
                    await login(usuario, senha);
                    window.location.href = '/';
                } catch (error) {
                    alert("Erro ao fazer login após o cadastro");
                }
            } catch (error) {
                alert("Erro ao cadastrar");
                console.log(error);
            }
        }
    };

    return (
        <>
            <header>
                <h2>Sistema Currículos</h2>
            </header>
            <div style={{ maxWidth: '300px', margin: 'auto', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px' }}
                        />
                    </div>
                    {!isLogin && (
                        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                            <input
                                type="checkbox"
                                name="recrutador"
                                checked={recrutador}
                                onChange={(e) => setRecrutador(e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            <label>Sou um recrutador</label>
                        </div>
                    )}
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                        {isLogin ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>
                <button onClick={toggleAuthMode} style={{ marginTop: '10px', border: 'none', background: 'none', color: '#007BFF', cursor: 'pointer' }}>
                    {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </button>
            </div>
        </>
    );
}

export default AuthPage;
