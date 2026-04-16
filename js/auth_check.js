// Obtém o usuário ou define como null se não existir
const user = JSON.parse(localStorage.getItem('zetta_user')) || null;

function checkAccess(levelRequired) {
    // Se não há usuário e a página exige login, manda para o login
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Se um Admin tentar entrar na Loja, manda para o Painel
    if (levelRequired === 'cliente' && user.nivel === 'admin') {
        window.location.href = 'admin-produtos.html';
        return;
    }

    // Se um Cliente tentar entrar no Admin, manda para a Loja
    if (levelRequired === 'admin' && user.nivel !== 'admin') {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('zetta_user');
    localStorage.removeItem('zetta_cart');
    window.location.href = 'login.html';
}