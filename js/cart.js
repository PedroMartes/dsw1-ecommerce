
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('zetta_cart')) || [];
    } catch (e) {
        console.error("Erro ao ler carrinho:", e);
        return [];
    }
}

function adicionarAoCarrinho(produto) {
    let cart = getCart();

    cart.push(produto);
    
    try {
        localStorage.setItem('zetta_cart', JSON.stringify(cart));
        console.log("Produto adicionado:", produto.nome);
    } catch (e) {
        alert("O carrinho está cheio! Tente finalizar a compra ou remover itens.");
        console.error("LocalStorage Limit excedido", e);
    }
}

function removerDoCarrinho(index) {
    let cart = getCart();
    
    if (index > -1) {
        cart.splice(index, 1);
        localStorage.setItem('zetta_cart', JSON.stringify(cart));
    }

    if (typeof renderizarCarrinho === "function") {
        renderizarCarrinho();
    }
}

function limparCarrinho() {
    localStorage.removeItem('zetta_cart');
    if (typeof renderizarCarrinho === "function") {
        renderizarCarrinho();
    }
}

function calcularTotalCarrinho() {
    const cart = getCart();
    return cart.reduce((total, item) => total + parseFloat(item.preco || 0), 0);
}