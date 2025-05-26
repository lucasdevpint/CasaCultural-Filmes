// js/script.js

// --- DADOS MOCK (Simulação de um banco de dados) ---
let mockFilmes = [
    {
        id: 1,
        titulo: "A Incrível Jornada Cósmica",
        genero: "Ficção Científica, Aventura",
        diretor: "Jane Stellaris",
        ano: 2023,
        duracao: "145 min",
        sinopseCompleta: "No ano de 2242, a Terra enfrenta uma crise energética sem precedentes...",
        descricaoCurta: "Uma épica aventura através de galáxias desconhecidas.",
        imagemBanner: "images/banner_filme1.jpg",
        imagemPoster: "images/banner_filme1.jpg",
        avaliacaoMedia: 4.5,
        totalAvaliacoes: 180,
        avaliacoes: [
            { idAnalise: 101, usuario: "CineAmante_01", nota: 5, comentario: "Visualmente deslumbrante e uma história cativante! Imperdível." },
            { idAnalise: 102, usuario: "EstrelaFilmes", nota: 4, comentario: "Gostei muito, mas o final poderia ser um pouco diferente. Bons efeitos!" },
        ]
    },
    {
        id: 2,
        titulo: "O Segredo do Vale Esquecido",
        genero: "Mistério, Drama, Suspense",
        diretor: "Arthur Pendelton",
        ano: 2022,
        duracao: "122 min",
        sinopseCompleta: "Quando uma renomada arqueóloga desaparece...",
        descricaoCurta: "Detetives investigam um desaparecimento misterioso.",
        imagemBanner: "images/banner_filme_placeholder.png",
        imagemPoster: "images/banner_filme_placeholder.png",
        avaliacaoMedia: 4.2,
        totalAvaliacoes: 125,
        avaliacoes: [
            { idAnalise: 201, usuario: "Detetive Literário", nota: 4, comentario: "Trama envolvente e um final surpreendente. Me prendeu do início ao fim!" },
        ]
    },
    {
        id: 3,
        titulo: "Cozinhando com Estrelas",
        genero: "Comédia, Romance",
        diretor: "Isabelle Gourmet",
        ano: 2024,
        duracao: "105 min",
        sinopseCompleta: "Leo, um chef de food truck talentoso mas azarado...",
        descricaoCurta: "Dois chefs rivais descobrem a receita para o amor.",
        imagemBanner: "images/banner_filme_placeholder.png",
        imagemPoster: "images/banner_filme_placeholder.png",
        avaliacaoMedia: 3.8,
        totalAvaliacoes: 95,
        avaliacoes: []
    }
];
let proximoIdFilme = mockFilmes.length > 0 ? Math.max(...mockFilmes.map(f => f.id)) + 1 : 1;
let proximoIdAnalise = 300;


// --- FUNÇÕES GLOBAIS AUXILIARES ---
function getParametroUrl(nomeParametro) {
    const parametrosUrl = new URLSearchParams(window.location.search);
    return parametrosUrl.get(nomeParametro);
}

function encontrarFilmePorId(id) {
    return mockFilmes.find(filme => filme.id === parseInt(id));
}

function gerarEstrelasVisualizacao(avaliacao) {
    const totalEstrelas = 5;
    let estrelasHtml = '';
    const estrelasCheias = Math.floor(avaliacao);
    const meiaEstrela = (avaliacao % 1) >= 0.5;
    for (let i = 0; i < estrelasCheias; i++) { estrelasHtml += '⭐'; }
    if (meiaEstrela) { estrelasHtml += '✨'; }
    const estrelasVazias = totalEstrelas - estrelasCheias - (meiaEstrela ? 1 : 0);
    for (let i = 0; i < estrelasVazias; i++) { estrelasHtml += '☆'; }
    return estrelasHtml;
}

function atualizarAnoRodape() {
    const anoSpan = document.getElementById('currentYear');
    if (anoSpan) {
        anoSpan.textContent = new Date().getFullYear();
    }
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---
function renderizarCatalogoFilmes() {
    const container = document.getElementById('catalogo-filmes-container');
    if (!container) return;
    if (mockFilmes.length === 0) {
        container.innerHTML = '<p>Nenhum filme encontrado no catálogo no momento.</p>';
        return;
    }
    let htmlFilmes = '';
    mockFilmes.forEach(filme => {
        htmlFilmes += `
            <article class="filme-card">
                <img src="${filme.imagemBanner || 'images/banner_filme_placeholder.png'}" alt="Banner do filme ${filme.titulo}">
                <div class="filme-info">
                    <h3>${filme.titulo}</h3>
                    <p class="genero"><strong>Gênero:</strong> ${filme.genero}</p>
                    <p class="descricao">${filme.descricaoCurta}</p>
                    <div class="avaliacao">
                        <span class="estrelas">${gerarEstrelasVisualizacao(filme.avaliacaoMedia)}</span>
                        <span class="nota">${filme.avaliacaoMedia.toFixed(1)}</span> 
                        (<span class="total-avaliacoes">${filme.totalAvaliacoes}</span> avaliações)
                    </div>
                    <div class="card-actions">
                        <a href="detalhes_filme.html?id=${filme.id}" class="btn btn-detalhes">Ver Detalhes</a>
                        <button onclick="iniciarEdicaoFilme(${filme.id})" class="btn btn-editar">Editar</button>
                        <button onclick="confirmarDelecaoFilme(${filme.id})" class="btn btn-deletar">Deletar</button>
                    </div>
                </div>
            </article>
        `;
    });
    container.innerHTML = htmlFilmes;
}

function renderizarDetalhesDoFilme(filmeId) {
    const containerDetalhes = document.getElementById('detalhes-do-filme-container');
    const containerAvaliacoesComunidade = document.getElementById('lista-avaliacoes-filme');
    if (!containerDetalhes || !containerAvaliacoesComunidade) return;
    const filme = encontrarFilmePorId(filmeId);
    if (!filme) {
        containerDetalhes.innerHTML = "<p>Filme não encontrado.</p>";
        containerAvaliacoesComunidade.innerHTML = "";
        document.title = "Filme Não Encontrado - Casa Cultural Av. Filmes";
        const secaoSuaAvaliacao = document.getElementById('sua-avaliacao-secao');
        if(secaoSuaAvaliacao) secaoSuaAvaliacao.style.display = 'none';
        return;
    }
    document.title = `${filme.titulo} - Casa Cultural Av. Filmes`;
    containerDetalhes.innerHTML = `
        <article class="filme-detalhe-item">
            <div class="filme-detalhe-cabecalho">
                <h2>${filme.titulo}</h2>
                <div class="avaliacao-detalhe">
                    ${gerarEstrelasVisualizacao(filme.avaliacaoMedia)} (${filme.avaliacaoMedia.toFixed(1)} de ${filme.totalAvaliacoes} avaliações)
                </div>
            </div>
            <div class="filme-detalhe-corpo">
                <img src="${filme.imagemPoster || filme.imagemBanner || 'images/banner_filme_placeholder.png'}" alt="Pôster do filme ${filme.titulo}" class="poster-detalhe">
                <div class="info-texto-detalhe">
                    <p><strong>Gênero:</strong> ${filme.genero}</p>
                    <p><strong>Diretor:</strong> ${filme.diretor}</p>
                    <p><strong>Ano:</strong> ${filme.ano}</p>
                    <p><strong>Duração:</strong> ${filme.duracao}</p>
                    <h3>Sinopse:</h3>
                    <p>${filme.sinopseCompleta}</p>
                     <div class="detail-actions">
                        <button onclick="iniciarEdicaoFilme(${filme.id}, true)" class="btn btn-editar">Editar Detalhes do Filme</button>
                    </div>
                </div>
            </div>
        </article>
    `;
    const secaoSuaAvaliacao = document.getElementById('sua-avaliacao-secao');
    if(secaoSuaAvaliacao) secaoSuaAvaliacao.style.display = 'block';
    renderizarAvaliacoesDaComunidade(filme);
}

function renderizarAvaliacoesDaComunidade(filme) {
    const containerAvaliacoesComunidade = document.getElementById('lista-avaliacoes-filme');
    if (!containerAvaliacoesComunidade || !filme) return;
    if (filme.avaliacoes && filme.avaliacoes.length > 0) {
        let htmlAvaliacoes = '';
        filme.avaliacoes.slice().reverse().forEach(avaliacao => { // .slice().reverse() para não alterar o array original
            htmlAvaliacoes += `
                <div class="avaliacao-item">
                    <h4>${avaliacao.usuario || "Anônimo"} - <span class="nota-avaliacao">${gerarEstrelasVisualizacao(avaliacao.nota)} (${avaliacao.nota})</span></h4>
                    <p>"${avaliacao.comentario}"</p>
                    <div class="avaliacao-actions">
                        <button onclick="iniciarEdicaoAnalise(${filme.id}, ${avaliacao.idAnalise})" class="btn-acao-analise btn-editar-analise">Editar</button>
                        <button onclick="confirmarDelecaoAnalise(${filme.id}, ${avaliacao.idAnalise})" class="btn-acao-analise btn-deletar-analise">Excluir</button>
                    </div>
                </div>
            `;
        });
        containerAvaliacoesComunidade.innerHTML = htmlAvaliacoes;
    } else {
        containerAvaliacoesComunidade.innerHTML = '<p>Ainda não há avaliações para este filme. Seja o primeiro!</p>';
    }
}

// --- FUNÇÃO PARA RENDERIZAR TODAS AS ANÁLISES (lista_analises.html) ---
function renderizarTodasAsAnalises() {
    const container = document.getElementById('container-todas-analises');
    if (!container) return; // Só executa se o container existir na página

    let todasAsAnalisesHtml = '';
    let encontrouAlgumaAnalise = false;

    mockFilmes.forEach(filme => {
        if (filme.avaliacoes && filme.avaliacoes.length > 0) {
            encontrouAlgumaAnalise = true;
            // Adiciona um cabeçalho para o filme antes de listar suas análises
            todasAsAnalisesHtml += `<div class="filme-analises-bloco">`;
            todasAsAnalisesHtml += `<h3>Análises para: <a href="detalhes_filme.html?id=${filme.id}">${filme.titulo}</a></h3>`;
            
            filme.avaliacoes.slice().reverse().forEach(avaliacao => { // slice().reverse() para não alterar o array original
                todasAsAnalisesHtml += `
                    <div class="avaliacao-item">
                        <h4>${avaliacao.usuario || "Anônimo"} - <span class="nota-avaliacao">${gerarEstrelasVisualizacao(avaliacao.nota)} (${avaliacao.nota})</span></h4>
                        <p>"${avaliacao.comentario}"</p>
                        <div class="avaliacao-actions">
                            <button onclick="iniciarEdicaoAnalise(${filme.id}, ${avaliacao.idAnalise})" class="btn-acao-analise btn-editar-analise">Editar</button>
                            <button onclick="confirmarDelecaoAnalise(${filme.id}, ${avaliacao.idAnalise})" class="btn-acao-analise btn-deletar-analise">Excluir</button>
                        </div>
                    </div>
                `;
            });
            todasAsAnalisesHtml += `</div>`; // Fecha o filme-analises-bloco
        }
    });

    if (!encontrouAlgumaAnalise) {
        todasAsAnalisesHtml = '<p>Nenhuma análise encontrada na comunidade ainda.</p>';
    }

    container.innerHTML = todasAsAnalisesHtml;
}


// --- FUNÇÕES DE AÇÃO (Simulação de Edição, Deleção, Submissão) ---
window.iniciarEdicaoFilme = function(filmeId, naPaginaDeDetalhes = false) {
    const filmeParaEditar = encontrarFilmePorId(filmeId);
    if (!filmeParaEditar) { alert("Erro: Filme não encontrado."); return; }

    const novoTitulo = prompt("Novo título:", filmeParaEditar.titulo);
    if (novoTitulo === null) return;
    const novaDescricaoCurta = prompt("Nova descrição curta:", filmeParaEditar.descricaoCurta);
    if (novaDescricaoCurta === null) return;
    const novoGenero = prompt("Novo gênero:", filmeParaEditar.genero);
    if (novoGenero === null) return;

    if (!novoTitulo.trim() || !novaDescricaoCurta.trim() || !novoGenero.trim()) {
        alert("Título, descrição curta e gênero são obrigatórios.");
        return;
    }
    filmeParaEditar.titulo = novoTitulo.trim();
    filmeParaEditar.descricaoCurta = novaDescricaoCurta.trim();
    filmeParaEditar.genero = novoGenero.trim();
    
    alert("Filme atualizado (simulação)!");
    if (naPaginaDeDetalhes) { 
        renderizarDetalhesDoFilme(filmeId); 
        // Se a lista de todas as análises estiver visível e precisar ser atualizada por causa do título do filme:
        if (document.getElementById('container-todas-analises')) {
            renderizarTodasAsAnalises();
        }
    } else { 
        renderizarCatalogoFilmes(); 
    }
}

window.confirmarDelecaoFilme = function(filmeId) {
    const filmeParaDeletar = encontrarFilmePorId(filmeId);
    if (!filmeParaDeletar) { alert("Erro: Filme não encontrado."); return; }
    if (confirm(`Excluir "${filmeParaDeletar.titulo}" (simulação)?`)) {
        mockFilmes = mockFilmes.filter(filme => filme.id !== filmeId);
        alert(`Filme "${filmeParaDeletar.titulo}" deletado (simulação)!`);
        if (document.getElementById('catalogo-filmes-container')) { renderizarCatalogoFilmes(); }
        if (document.getElementById('container-todas-analises')) { renderizarTodasAsAnalises(); } // Atualiza lista de todas as análises
        
        const idFilmeAtualNaUrl = getParametroUrl('id');
        if (idFilmeAtualNaUrl && parseInt(idFilmeAtualNaUrl) === filmeId) {
            const containerDetalhes = document.getElementById('detalhes-do-filme-container');
            const containerAvaliacoesComunidade = document.getElementById('lista-avaliacoes-filme');
            const secaoSuaAvaliacao = document.getElementById('sua-avaliacao-secao');
            if(containerDetalhes) containerDetalhes.innerHTML = `<p>O filme "${filmeParaDeletar.titulo}" foi removido (simulação).</p><a href="filmes.html" class="btn">Voltar</a>`;
            if(containerAvaliacoesComunidade) containerAvaliacoesComunidade.innerHTML = "";
            if(secaoSuaAvaliacao) secaoSuaAvaliacao.style.display = 'none';
            document.title = "Filme Removido";
        }
    }
}

window.iniciarEdicaoAnalise = function(filmeId, idAnalise) {
    const filme = encontrarFilmePorId(filmeId);
    if (!filme || !filme.avaliacoes) { alert("Erro: Filme ou avaliações não encontrados."); return; }
    const analiseParaEditar = filme.avaliacoes.find(a => a.idAnalise === idAnalise);
    if (!analiseParaEditar) { alert("Erro: Análise não encontrada."); return; }

    const novoComentario = prompt("Edite comentário:", analiseParaEditar.comentario);
    if (novoComentario === null) return;
    const novaNotaStr = prompt(`Edite nota (1-5):`, analiseParaEditar.nota);
    if (novaNotaStr === null) return;
    const novaNota = parseInt(novaNotaStr);

    if (isNaN(novaNota) || novaNota < 1 || novaNota > 5) { alert("Nota inválida."); return; }
    if (!novoComentario.trim()) { alert("Comentário não pode ser vazio."); return; }
    
    analiseParaEditar.comentario = novoComentario.trim();
    analiseParaEditar.nota = novaNota;
    alert("Análise atualizada (simulação)!");

    // Re-renderiza a(s) seção(ões) relevante(s)
    if (document.getElementById('detalhes-do-filme-container')) {
        renderizarDetalhesDoFilme(filmeId);
    }
    if (document.getElementById('container-todas-analises')) {
        renderizarTodasAsAnalises();
    }
}

window.confirmarDelecaoAnalise = function(filmeId, idAnalise) {
    const filme = encontrarFilmePorId(filmeId);
    if (!filme || !filme.avaliacoes) { alert("Erro: Filme ou avaliações não encontrados."); return; }
    const analiseParaDeletar = filme.avaliacoes.find(a => a.idAnalise === idAnalise);
    if (!analiseParaDeletar) { alert("Erro: Análise não encontrada."); return; }
    if (confirm(`Excluir análise de "${analiseParaDeletar.usuario || 'Anônimo'}" (simulação)?`)) {
        filme.avaliacoes = filme.avaliacoes.filter(a => a.idAnalise !== idAnalise);
        alert("Análise deletada (simulação)!");
        // Re-renderiza a(s) seção(ões) relevante(s)
        if (document.getElementById('detalhes-do-filme-container')) {
            renderizarDetalhesDoFilme(filmeId);
        }
        if (document.getElementById('container-todas-analises')) {
            renderizarTodasAsAnalises();
        }
    }
}

// --- LÓGICA PARA CADASTRO DE NOVO FILME (form_novo_filme.html) ---
function lidarComCadastroNovoFilme(event) {
    event.preventDefault();
    const statusDiv = document.getElementById('status-cadastro-filme');
    const titulo = document.getElementById('titulo').value.trim();
    const genero = document.getElementById('genero').value.trim();
    const diretor = document.getElementById('diretor').value.trim();
    const anoStr = document.getElementById('ano').value;
    const ano = anoStr ? parseInt(anoStr) : null;
    const duracao = document.getElementById('duracao').value.trim();
    const descricaoCurta = document.getElementById('descricaoCurta').value.trim();
    const sinopseCompleta = document.getElementById('sinopseCompleta').value.trim();
    const imagemBanner = document.getElementById('imagemBanner').value.trim() || 'images/banner_filme_placeholder.png';
    const imagemPoster = document.getElementById('imagemPoster').value.trim() || 'images/banner_filme_placeholder.png';

    if (!titulo || !genero || !descricaoCurta) {
        statusDiv.textContent = "Título, Gênero e Descrição Curta são obrigatórios.";
        statusDiv.className = "status-mensagem erro";
        return;
    }
    if (anoStr && (isNaN(ano) || ano < 1888 || ano > new Date().getFullYear() + 5) ) {
        statusDiv.textContent = "Ano de lançamento inválido.";
        statusDiv.className = "status-mensagem erro";
        return;
    }

    const novoFilme = {
        id: proximoIdFilme++,
        titulo, genero, diretor: diretor || "Não informado", ano, duracao: duracao || "Não informada",
        descricaoCurta, sinopseCompleta: sinopseCompleta || "Sinopse não disponível.",
        imagemBanner, imagemPoster,
        avaliacaoMedia: 0, totalAvaliacoes: 0, avaliacoes: []
    };
    mockFilmes.push(novoFilme);
    statusDiv.textContent = `Filme "${titulo}" adicionado (Simulação)!`;
    statusDiv.className = "status-mensagem sucesso";
    document.getElementById('form-cadastro-filme').reset();
    console.log("Filmes após adição:", mockFilmes);
}


// --- EVENT LISTENERS E INICIALIZAÇÃO PRINCIPAL ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("script.js carregado e DOM pronto!");
    atualizarAnoRodape();

    if (document.getElementById('catalogo-filmes-container')) {
        renderizarCatalogoFilmes();
    }

    const containerDetalhesFilme = document.getElementById('detalhes-do-filme-container');
    if (containerDetalhesFilme) {
        const filmeIdDaUrl = getParametroUrl('id');
        if (filmeIdDaUrl) {
            renderizarDetalhesDoFilme(filmeIdDaUrl);
        } else {
            containerDetalhesFilme.innerHTML = "<p>ID do filme não especificado. <a href='filmes.html'>Voltar ao catálogo</a>.</p>";
            const secaoSuaAvaliacao = document.getElementById('sua-avaliacao-secao');
            if(secaoSuaAvaliacao) secaoSuaAvaliacao.style.display = 'none';
            const containerAvaliacoesComunidade = document.getElementById('lista-avaliacoes-filme');
            if(containerAvaliacoesComunidade) containerAvaliacoesComunidade.innerHTML = "";
        }

        const estrelasInputContainer = document.getElementById('estrelas-input');
        if (estrelasInputContainer) {
            const valorNotaHidden = document.getElementById('avaliacao-nota-valor');
            const todasAsEstrelas = estrelasInputContainer.querySelectorAll('.estrela');
            todasAsEstrelas.forEach(estrela => {
                estrela.addEventListener('click', function() {
                    const valorSelecionado = parseInt(this.dataset.valor);
                    if (valorNotaHidden) valorNotaHidden.value = valorSelecionado;
                    estrelasInputContainer.dataset.nota = valorSelecionado;
                    todasAsEstrelas.forEach(s => {
                        s.textContent = (parseInt(s.dataset.valor) <= valorSelecionado) ? '⭐' : '☆';
                    });
                });
                estrela.addEventListener('mouseover', function() {
                    const valorHover = parseInt(this.dataset.valor);
                    todasAsEstrelas.forEach(s => {
                        s.textContent = (parseInt(s.dataset.valor) <= valorHover) ? '⭐' : '☆';
                    });
                });
                estrela.addEventListener('mouseout', function() { 
                    const valorAtual = parseInt(estrelasInputContainer.dataset.nota) || 0;
                    todasAsEstrelas.forEach(s => {
                        s.textContent = (parseInt(s.dataset.valor) <= valorAtual) ? '⭐' : '☆';
                    });
                });
            });
        }

        const formNovaAvaliacao = document.getElementById('form-nova-avaliacao');
        if (formNovaAvaliacao) {
            formNovaAvaliacao.addEventListener('submit', function(event) {
                event.preventDefault();
                const filmeIdAtual = getParametroUrl('id');
                const filme = encontrarFilmePorId(filmeIdAtual);
                const nota = document.getElementById('avaliacao-nota-valor').value;
                const nomeUsuario = document.getElementById('avaliacao-nome').value.trim() || "Anônimo";
                const comentario = document.getElementById('avaliacao-comentario').value.trim();
                const statusDiv = document.getElementById('status-avaliacao');

                if (!filme) { statusDiv.textContent = "Erro: Filme não encontrado."; statusDiv.className = "status-mensagem erro"; return; }
                if (!nota || nota === "0") { statusDiv.textContent = "Selecione uma nota."; statusDiv.className = "status-mensagem erro"; return; }
                if (comentario === "") { statusDiv.textContent = "Escreva um comentário."; statusDiv.className = "status-mensagem erro"; return; }

                const novaAvaliacao = { idAnalise: proximoIdAnalise++, usuario: nomeUsuario, nota: parseInt(nota), comentario: comentario };
                filme.avaliacoes.push(novaAvaliacao);
                statusDiv.textContent = `Obrigado, ${nomeUsuario}! Avaliação registrada (Simulação).`;
                statusDiv.className = "status-mensagem sucesso";
                renderizarAvaliacoesDaComunidade(filme);
                formNovaAvaliacao.reset();
                const estrelasInputReset = document.getElementById('estrelas-input');
                if (estrelasInputReset) estrelasInputReset.dataset.nota = "0";
                const notaValorHiddenReset = document.getElementById('avaliacao-nota-valor');
                if (notaValorHiddenReset) notaValorHiddenReset.value = "";
                const todasEstrelasReset = document.querySelectorAll('#estrelas-input .estrela');
                if (todasEstrelasReset) todasEstrelasReset.forEach(s => s.textContent = '☆');
            });
        }
    }

    const formCadastroFilme = document.getElementById('form-cadastro-filme');
    if (formCadastroFilme) {
        formCadastroFilme.addEventListener('submit', lidarComCadastroNovoFilme);
    }

    // --- LÓGICA PARA PÁGINA DE LISTA DE TODAS AS ANÁLISES (lista_analises.html) ---
    if (document.getElementById('container-todas-analises')) {
        renderizarTodasAsAnalises();
    }
});