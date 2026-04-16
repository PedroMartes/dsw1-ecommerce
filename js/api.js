// js/api.js
const API_BASE = "http://localhost/dsw1-ecommerce-backend"; 

async function fetchData(endpoint) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`);
        if (!res.ok) throw new Error('Erro na requisição');
        return await res.json();
    } catch (e) { 
        console.error("Erro ao conectar com o PHP:", e); 
    }
}