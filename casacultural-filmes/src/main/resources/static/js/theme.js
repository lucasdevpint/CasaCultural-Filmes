// js/theme.js

// Função para alterar o tema e salvar a preferência em um cookie
function alterarTema(temaEscolhido) {
    // O cookie é configurado para expirar em 30 dias
    document.cookie = "tema=" + temaEscolhido + ";path=/;max-age=" + (60 * 60 * 24 * 30); 
    aplicarTema(temaEscolhido); // Aplica o tema visualmente na página
}

// Função para aplicar as classes CSS do tema ao body da página
function aplicarTema(tema) {
    // Remove classes de tema anteriores para evitar conflitos e garantir que apenas uma esteja ativa
    document.body.classList.remove("tema-claro", "tema-escuro");

    if (tema === "escuro") {
        document.body.classList.add("tema-escuro");
    } else {
        document.body.classList.add("tema-claro"); // O tema claro é o padrão se nenhum tema específico for definido
    }
}

// Função para ler o valor de um cookie específico pelo nome
function lerCookie(nome) {
    const nomeEQ = nome + "=";
    const ca = document.cookie.split(';'); // Divide a string de todos os cookies em um array

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        // Remove espaços em branco no início do nome do cookie
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        // Se o cookie for encontrado, retorna seu valor
        if (c.indexOf(nomeEQ) === 0) {
            return c.substring(nomeEQ.length, c.length);
        }
    }
    return null; // Retorna null se o cookie com o nome especificado não for encontrado
}

// Event listener que é acionado quando a página inteira (incluindo estilos, imagens) é carregada
window.addEventListener('load', function() {
    const temaSalvo = lerCookie("tema"); // Tenta ler a preferência de tema salva no cookie
    if (temaSalvo) {
        aplicarTema(temaSalvo); // Se encontrou uma preferência salva, aplica esse tema
    } else {
        aplicarTema("claro"); // Caso contrário, aplica o tema claro como padrão
    }
});