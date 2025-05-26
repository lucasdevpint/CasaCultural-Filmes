// js/script.js

// URL base da nossa API (ajuste a porta se você mudou no application.properties)
const API_BASE_URL = 'http://localhost:8080/api';

// --- FUNÇÕES GLOBAIS AUXILIARES ---
function getParametroUrl(nomeParametro) {
    const parametrosUrl = new URLSearchParams(window.location.search);
    return parametrosUrl.get(nomeParametro);
}

function gerarEstrelasVisualizacao(avaliacao) {
    const totalEstrelas = 5;
    let estrelasHtml = '';
    if (typeof avaliacao !== 'number' || isNaN(avaliacao)) {
        avaliacao = 0; // Trata caso de avaliação não ser um número
    }
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

// --- FUNÇÕES DE RENDERIZAÇÃO (Atualizam o HTML da página com dados da API) ---

// Para filmes.html
async function renderizarCatalogoFilmes() {
    const container = document.getElementById('catalogo-filmes-container');
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/filmes`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ao buscar filmes.`);
        }
        const filmes = await response.json();

        if (!filmes || filmes.length === 0) {
            container.innerHTML = '<p>Nenhum filme encontrado no catálogo no momento.</p>';
            return;
        }

        let htmlFilmes = '';
        filmes.forEach(filme => {
            // Os IDs dos filmes virão do backend como `idFilme`
            htmlFilmes += `
                <article class="filme-card">
                    <img src="${filme.urlImagemBanner || 'images/banner_filme_placeholder.png'}" alt="Banner do filme ${filme.titulo}">
                    <div class="filme-info">
                        <h3>${filme.titulo}</h3>
                        <p class="genero"><strong>Gênero:</strong> ${filme.genero || 'N/A'}</p>
                        <p class="descricao">${filme.descricaoCurta || 'Sem descrição curta.'}</p>
                        <div class="avaliacao">
                            <span class="estrelas">${gerarEstrelasVisualizacao(filme.avaliacaoMedia || 0)}</span>
                            <span class="nota">${(filme.avaliacaoMedia || 0).toFixed(1)}</span> 
                            (<span class="total-avaliacoes">${filme.totalAvaliacoes || 0}</span> avaliações)
                        </div>
                        <div class="card-actions">
                            <a href="detalhes_filme.html?id=${filme.idFilme}" class="btn btn-detalhes">Ver Detalhes</a>
                            <button onclick="iniciarEdicaoFilme(${filme.idFilme})" class="btn btn-editar">Editar</button>
                            <button onclick="confirmarDelecaoFilme(${filme.idFilme})" class="btn btn-deletar">Deletar</button>
                        </div>
                    </div>
                </article>
            `;
        });
        container.innerHTML = htmlFilmes;
    } catch (error) {
        console.error("Falha ao carregar catálogo de filmes:", error);
        container.innerHTML = `<p class="erro-api">Não foi possível carregar os filmes. Tente novamente mais tarde. (${error.message})</p>`;
    }
}

// Para detalhes_filme.html
async function renderizarDetalhesDoFilme(filmeId) {
    const containerDetalhes = document.getElementById('detalhes-do-filme-container');
    const tituloFilmeElemento = document.getElementById('titulo-filme-detalhes'); // Para o h2
    const secaoSuaAvaliacao = document.getElementById('sua-avaliacao-secao');

    if (!containerDetalhes) return;

    try {
        const responseFilme = await fetch(`${API_BASE_URL}/filmes/${filmeId}`);
        if (!responseFilme.ok) {
            if (responseFilme.status === 404) {
                throw new Error(`Filme com ID ${filmeId} não encontrado.`);
            }
            throw new Error(`Erro HTTP: ${responseFilme.status} ao buscar detalhes do filme.`);
        }
        const filme = await responseFilme.json();

        document.title = `${filme.titulo || 'Detalhes'} - Casa Cultural Av. Filmes`;
        if (tituloFilmeElemento) tituloFilmeElemento.textContent = filme.titulo || 'Detalhes do Filme';

        containerDetalhes.innerHTML = `
            <article class="filme-detalhe-item">
                <div class="filme-detalhe-cabecalho">
                    <h2>${filme.titulo}</h2>
                    <div class="avaliacao-detalhe">
                        ${gerarEstrelasVisualizacao(filme.avaliacaoMedia || 0)} 
                        (${(filme.avaliacaoMedia || 0).toFixed(1)} de ${filme.totalAvaliacoes || 0} avaliações)
                    </div>
                </div>
                <div class="filme-detalhe-corpo">
                    <img src="${filme.urlImagemPoster || filme.urlImagemBanner || 'images/banner_filme_placeholder.png'}" alt="Pôster do filme ${filme.titulo}" class="poster-detalhe">
                    <div class="info-texto-detalhe">
                        <p><strong>Gênero:</strong> ${filme.genero || 'N/A'}</p>
                        <p><strong>Diretor:</strong> ${filme.diretor || 'N/A'}</p>
                        <p><strong>Ano:</strong> ${filme.anoLancamento || 'N/A'}</p>
                        <p><strong>Duração:</strong> ${filme.duracao || 'N/A'}</p>
                        <h3>Sinopse:</h3>
                        <p>${filme.sinopseCompleta || 'Sinopse não disponível.'}</p>
                         <div class="detail-actions">
                            <button onclick="iniciarEdicaoFilme(${filme.idFilme}, true)" class="btn btn-editar">Editar Detalhes do Filme</button>
                        </div>
                    </div>
                </div>
            </article>
        `;
        if (secaoSuaAvaliacao) secaoSuaAvaliacao.style.display = 'block';
        await renderizarAvaliacoesDaComunidadeAPI(filmeId); // Busca e renderiza as avaliações

    } catch (error) {
        console.error(`Falha ao carregar detalhes do filme ID ${filmeId}:`, error);
        containerDetalhes.innerHTML = `<p class="erro-api">Não foi possível carregar os detalhes do filme. (${error.message}) <a href="filmes.html" class="btn">Voltar ao catálogo</a></p>`;
        if (tituloFilmeElemento) tituloFilmeElemento.textContent = "Filme não encontrado";
        document.title = "Filme Não Encontrado - Casa Cultural Av. Filmes";
        if (secaoSuaAvaliacao) secaoSuaAvaliacao.style.display = 'none';
        const containerAvaliacoesCom = document.getElementById('lista-avaliacoes-filme');
        if(containerAvaliacoesCom) containerAvaliacoesCom.innerHTML = "";
    }
}

async function renderizarAvaliacoesDaComunidadeAPI(filmeId) {
    const containerAvaliacoes = document.getElementById('lista-avaliacoes-filme');
    if (!containerAvaliacoes) return;

    try {
        const response = await fetch(`${API_BASE_URL}/filmes/${filmeId}/analises`);
        if (!response.ok && response.status !== 404 && response.status !== 204) { // 204 No Content é OK
            throw new Error(`Erro HTTP: ${response.status} ao buscar análises.`);
        }
        
        // Se for 204 No Content ou 404 (assumindo 404 aqui também como 'sem conteúdo'), a lista de análises é vazia
        const analises = (response.status === 204 || response.status === 404) ? [] : await response.json();

        if (!analises || analises.length === 0) {
            containerAvaliacoes.innerHTML = '<p>Ainda não há avaliações para este filme. Seja o primeiro!</p>';
            return;
        }

        let htmlAvaliacoes = '';
        analises.slice().reverse().forEach(analise => { // Mostra mais recentes primeiro
            htmlAvaliacoes += `
                <div class="avaliacao-item">
                    <h4>${analise.nomeUsuario || "Anônimo"} - <span class="nota-avaliacao">${gerarEstrelasVisualizacao(analise.nota)} (${analise.nota})</span></h4>
                    <p>"${analise.comentario}"</p>
                    <div class="avaliacao-actions">
                        <button onclick="iniciarEdicaoAnaliseAPI(${analise.idAnalise}, ${filmeId})" class="btn-acao-analise btn-editar-analise">Editar</button>
                        <button onclick="confirmarDelecaoAnaliseAPI(${analise.idAnalise}, ${filmeId})" class="btn-acao-analise btn-deletar-analise">Excluir</button>
                    </div>
                </div>
            `;
        });
        containerAvaliacoes.innerHTML = htmlAvaliacoes;
    } catch (error) {
        console.error(`Falha ao carregar avaliações para o filme ID ${filmeId}:`, error);
        containerAvaliacoes.innerHTML = `<p class="erro-api">Não foi possível carregar as avaliações. (${error.message})</p>`;
    }
}

// Para lista_analises.html
async function renderizarTodasAsAnalises() {
    const container = document.getElementById('container-todas-analises');
    if (!container) return;

    try {
        const responseFilmes = await fetch(`${API_BASE_URL}/filmes`);
        if (!responseFilmes.ok) {
            throw new Error(`Erro HTTP: ${responseFilmes.status} ao buscar filmes para listar análises.`);
        }
        const filmes = await responseFilmes.json();

        if (!filmes || filmes.length === 0) {
            container.innerHTML = '<p>Nenhum filme encontrado para listar análises.</p>';
            return;
        }

        let todasAsAnalisesHtml = '';
        let encontrouAlgumaAnalise = false;

        // Usamos Promise.all para buscar todas as análises em paralelo
        const promessasAnalises = filmes.map(async (filme) => {
            const responseAnalises = await fetch(`${API_BASE_URL}/filmes/${filme.idFilme}/analises`);
            if (responseAnalises.ok && responseAnalises.status !== 204) {
                const analisesDoFilme = await responseAnalises.json();
                if (analisesDoFilme && analisesDoFilme.length > 0) {
                    encontrouAlgumaAnalise = true;
                    let blocoHtml = `<div class="filme-analises-bloco">`;
                    blocoHtml += `<h3>Análises para: <a href="detalhes_filme.html?id=${filme.idFilme}">${filme.titulo}</a></h3>`;
                    analisesDoFilme.slice().reverse().forEach(analise => {
                        blocoHtml += `
                            <div class="avaliacao-item">
                                <h4>${analise.nomeUsuario || "Anônimo"} - <span class="nota-avaliacao">${gerarEstrelasVisualizacao(analise.nota)} (${analise.nota})</span></h4>
                                <p>"${analise.comentario}"</p>
                                 <div class="avaliacao-actions">
                                    <button onclick="iniciarEdicaoAnaliseAPI(${analise.idAnalise}, ${filme.idFilme})" class="btn-acao-analise btn-editar-analise">Editar</button>
                                    <button onclick="confirmarDelecaoAnaliseAPI(${analise.idAnalise}, ${filme.idFilme})" class="btn-acao-analise btn-deletar-analise">Excluir</button>
                                </div>
                            </div>
                        `;
                    });
                    blocoHtml += `</div>`;
                    return blocoHtml;
                }
            }
            return ''; // Retorna string vazia se não houver análises ou erro
        });

        const resultadosHtml = await Promise.all(promessasAnalises);
        todasAsAnalisesHtml = resultadosHtml.join('');

        if (!encontrouAlgumaAnalise) {
            container.innerHTML = '<p>Nenhuma análise encontrada na comunidade ainda.</p>';
        } else {
            container.innerHTML = todasAsAnalisesHtml;
        }

    } catch (error) {
        console.error("Falha ao carregar todas as análises:", error);
        container.innerHTML = `<p class="erro-api">Não foi possível carregar todas as análises. Tente novamente mais tarde. (${error.message})</p>`;
    }
}


// --- FUNÇÕES DE AÇÃO (Agora chamam a API) ---

// Adicionar Filme (form_novo_filme.html)
async function lidarComCadastroNovoFilmeAPI(event) {
    event.preventDefault();
    const statusDiv = document.getElementById('status-cadastro-filme');
    const form = event.target;

    const filme = {
        titulo: form.titulo.value.trim(),
        genero: form.genero.value.trim(),
        diretor: form.diretor.value.trim() || "Não informado",
        anoLancamento: form.ano.value ? parseInt(form.ano.value) : null,
        duracao: form.duracao.value.trim() || "Não informada",
        descricaoCurta: form.descricaoCurta.value.trim(),
        sinopseCompleta: form.sinopseCompleta.value.trim() || "Sinopse não disponível.",
        urlImagemBanner: form.imagemBanner.value.trim() || 'images/banner_filme_placeholder.png',
        urlImagemPoster: form.imagemPoster.value.trim() || 'images/banner_filme_placeholder.png',
        // avaliacaoMedia e totalAvaliacoes serão calculados ou definidos pelo backend/banco
    };

    if (!filme.titulo || !filme.genero || !filme.descricaoCurta) {
        statusDiv.textContent = "Título, Gênero e Descrição Curta são obrigatórios.";
        statusDiv.className = "status-mensagem erro";
        return;
    }
    // Adicionar mais validações se necessário

    try {
        const response = await fetch(`${API_BASE_URL}/filmes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filme)
        });

        if (response.ok) {
            const filmeAdicionado = await response.json();
            statusDiv.textContent = `Filme "${filmeAdicionado.titulo}" adicionado com sucesso ao banco de dados! (ID: ${filmeAdicionado.idFilme})`;
            statusDiv.className = "status-mensagem sucesso";
            form.reset();
            // Opcional: redirecionar ou atualizar lista em filmes.html se estiver na mesma página
        } else {
            const erro = await response.json();
            throw new Error(erro.erro || `Erro HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao cadastrar filme:", error);
        statusDiv.textContent = `Erro ao cadastrar filme: ${error.message}`;
        statusDiv.className = "status-mensagem erro";
    }
}

// Adicionar Análise (detalhes_filme.html)
async function lidarComNovaAnaliseAPI(event) {
    event.preventDefault();
    const statusDiv = document.getElementById('status-avaliacao');
    const form = event.target;
    const filmeId = getParametroUrl('id');

    if (!filmeId) {
        statusDiv.textContent = "Erro: ID do filme não encontrado para adicionar avaliação.";
        statusDiv.className = "status-mensagem erro";
        return;
    }

    const analise = {
        nomeUsuario: form.avaliacao_nome.value.trim() || "Anônimo",
        nota: parseInt(form.avaliacao_nota_valor.value),
        comentario: form.avaliacao_comentario.value.trim()
        // idFilmeFk será definido pelo backend ou associado através do endpoint
    };

    if (!analise.nota || analise.nota === 0) {
        statusDiv.textContent = "Por favor, selecione uma nota (clicando nas estrelas).";
        statusDiv.className = "status-mensagem erro";
        return;
    }
    if (analise.comentario === "" && form.avaliacao_comentario.required) {
        statusDiv.textContent = "Por favor, escreva um comentário.";
        statusDiv.className = "status-mensagem erro";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/filmes/${filmeId}/analises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analise)
        });

        if (response.ok) {
            const analiseAdicionada = await response.json();
            statusDiv.textContent = `Obrigado, ${analiseAdicionada.nomeUsuario}! Sua avaliação foi registrada no banco de dados.`;
            statusDiv.className = "status-mensagem sucesso";
            form.reset();
            // Limpar estrelas
            const estrelasInputReset = document.getElementById('estrelas-input');
            if (estrelasInputReset) estrelasInputReset.dataset.nota = "0";
            const notaValorHiddenReset = document.getElementById('avaliacao-nota-valor');
            if (notaValorHiddenReset) notaValorHiddenReset.value = "";
            const todasEstrelasReset = document.querySelectorAll('#estrelas-input .estrela');
            if (todasEstrelasReset) todasEstrelasReset.forEach(s => s.textContent = '☆');
            
            await renderizarAvaliacoesDaComunidadeAPI(filmeId); // Re-renderiza a lista de avaliações
        } else {
            const erro = await response.json();
            throw new Error(erro.erro || `Erro HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        statusDiv.textContent = `Erro ao enviar avaliação: ${error.message}`;
        statusDiv.className = "status-mensagem erro";
    }
}

// Editar Filme (chamado por onclick)
window.iniciarEdicaoFilme = async function(filmeId, naPaginaDeDetalhes = false) {
    // Primeiro, buscar os dados atuais do filme para preencher os prompts
    try {
        const response = await fetch(`${API_BASE_URL}/filmes/${filmeId}`);
        if (!response.ok) throw new Error("Filme não encontrado para edição.");
        const filmeParaEditar = await response.json();

        const novoTitulo = prompt("Digite o novo título do filme:", filmeParaEditar.titulo);
        if (novoTitulo === null) return; // Usuário cancelou

        const novaDescricaoCurta = prompt("Digite a nova descrição curta:", filmeParaEditar.descricaoCurta);
        if (novaDescricaoCurta === null) return;
        
        const novoGenero = prompt("Digite o(s) novo(s) gênero(s):", filmeParaEditar.genero);
        if (novoGenero === null) return;
        
        // Adicionar mais prompts para outros campos se desejar (diretor, ano, sinopse, imagens)

        if (!novoTitulo.trim() || !novaDescricaoCurta.trim() || !novoGenero.trim()) {
            alert("Título, descrição curta e gênero são obrigatórios.");
            return;
        }

        const filmeAtualizado = {
            ...filmeParaEditar, // Mantém outros campos como ID, etc.
            titulo: novoTitulo.trim(),
            descricaoCurta: novaDescricaoCurta.trim(),
            genero: novoGenero.trim()
            // Atualize outros campos aqui
        };

        const putResponse = await fetch(`${API_BASE_URL}/filmes/${filmeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filmeAtualizado)
        });

        if (putResponse.ok) {
            alert("Filme atualizado com sucesso no banco de dados!");
            if (naPaginaDeDetalhes) {
                await renderizarDetalhesDoFilme(filmeId);
            } else {
                await renderizarCatalogoFilmes();
            }
            if (document.getElementById('container-todas-analises')) { // Se a lista geral de análises estiver visível
                await renderizarTodasAsAnalises();
            }
        } else {
            const erro = await putResponse.json();
            throw new Error(erro.erro || `Erro HTTP: ${putResponse.status}`);
        }

    } catch (error) {
        console.error("Erro ao editar filme:", error);
        alert(`Erro ao editar filme: ${error.message}`);
    }
}

// Deletar Filme (chamado por onclick)
window.confirmarDelecaoFilme = async function(filmeId) {
    // Buscar o título para a mensagem de confirmação
    let tituloFilme = `ID ${filmeId}`;
    try {
        const responseFilme = await fetch(`${API_BASE_URL}/filmes/${filmeId}`);
        if (responseFilme.ok) {
            const filme = await responseFilme.json();
            tituloFilme = filme.titulo;
        }
    } catch (e) { /* Ignora, usa o ID no confirm */ }

    if (confirm(`Tem certeza que deseja excluir o filme "${tituloFilme}"? Esta ação não pode ser desfeita.`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/filmes/${filmeId}`, {
                method: 'DELETE'
            });

            if (response.ok || response.status === 204) { // 204 No Content é sucesso para DELETE
                alert(`Filme "${tituloFilme}" deletado com sucesso do banco de dados!`);
                if (document.getElementById('catalogo-filmes-container')) {
                    await renderizarCatalogoFilmes();
                }
                if (document.getElementById('container-todas-analises')) {
                    await renderizarTodasAsAnalises();
                }
                
                const idFilmeAtualNaUrl = getParametroUrl('id');
                if (idFilmeAtualNaUrl && parseInt(idFilmeAtualNaUrl) === filmeId) {
                    // Redireciona para a página de filmes se o filme deletado era o da página de detalhes
                    window.location.href = 'filmes.html';
                }

            } else {
                 const erro = response.status !== 204 ? await response.json() : { erro: `Status ${response.status}`};
                throw new Error(erro.erro || `Erro HTTP: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro ao deletar filme:", error);
            alert(`Erro ao deletar filme: ${error.message}`);
        }
    }
}

// Editar Análise (chamado por onclick)
window.iniciarEdicaoAnaliseAPI = async function(idAnalise, filmeId) { // filmeId é para re-renderizar
    try {
        const responseAnalise = await fetch(`${API_BASE_URL}/analises/${idAnalise}`);
        if(!responseAnalise.ok) throw new Error("Análise não encontrada para edição.");
        const analiseParaEditar = await responseAnalise.json();

        const novoComentario = prompt("Edite seu comentário:", analiseParaEditar.comentario);
        if (novoComentario === null) return;

        const novaNotaStr = prompt(`Edite sua nota (1-5):`, analiseParaEditar.nota);
        if (novaNotaStr === null) return;
        const novaNota = parseInt(novaNotaStr);

        if (isNaN(novaNota) || novaNota < 1 || novaNota > 5) {
            alert("Nota inválida. Por favor, insira um número entre 1 e 5.");
            return;
        }
        if (!novoComentario.trim()) {
            alert("O comentário não pode ficar vazio.");
            return;
        }
        
        const analiseAtualizada = {
            ...analiseParaEditar, // Mantém outros campos como ID, idFilmeFk, usuário
            comentario: novoComentario.trim(),
            nota: novaNota
            // A data da análise será atualizada pelo backend no service/controller se configurado
        };

        const putResponse = await fetch(`${API_BASE_URL}/analises/${idAnalise}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analiseAtualizada)
        });

        if (putResponse.ok) {
            alert("Análise atualizada com sucesso no banco de dados!");
            if (document.getElementById('detalhes-do-filme-container') && getParametroUrl('id') == filmeId) {
                 await renderizarDetalhesDoFilme(filmeId);
            }
            if (document.getElementById('container-todas-analises')) {
                await renderizarTodasAsAnalises();
            }
        } else {
            const erro = await putResponse.json();
            throw new Error(erro.erro || `Erro HTTP: ${putResponse.status}`);
        }

    } catch (error) {
        console.error("Erro ao editar análise:", error);
        alert(`Erro ao editar análise: ${error.message}`);
    }
}

// Deletar Análise (chamado por onclick)
window.confirmarDelecaoAnaliseAPI = async function(idAnalise, filmeId) { // filmeId é para re-renderizar
    // Opcional: buscar nome do usuário para o confirm, mas pode simplificar
    if (confirm(`Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita.`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/analises/${idAnalise}`, {
                method: 'DELETE'
            });

            if (response.ok || response.status === 204) {
                alert("Análise deletada com sucesso do banco de dados!");
                 if (document.getElementById('detalhes-do-filme-container') && getParametroUrl('id') == filmeId) {
                    await renderizarDetalhesDoFilme(filmeId);
                }
                if (document.getElementById('container-todas-analises')) {
                    await renderizarTodasAsAnalises();
                }
            } else {
                const erro = response.status !== 204 ? await response.json() : { erro: `Status ${response.status}`};
                throw new Error(erro.erro || `Erro HTTP: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro ao deletar análise:", error);
            alert(`Erro ao deletar análise: ${error.message}`);
        }
    }
}


// --- EVENT LISTENERS E INICIALIZAÇÃO PRINCIPAL ---
document.addEventListener('DOMContentLoaded', async function() {
    console.log("script.js (API version) carregado e DOM pronto!");
    atualizarAnoRodape();

    // Lógica para a página de filmes
    if (document.getElementById('catalogo-filmes-container')) {
        await renderizarCatalogoFilmes();
    }

    // Lógica para a página de detalhes do filme
    const containerDetalhesFilme = document.getElementById('detalhes-do-filme-container');
    if (containerDetalhesFilme) {
        const filmeIdDaUrl = getParametroUrl('id');
        if (filmeIdDaUrl) {
            await renderizarDetalhesDoFilme(filmeIdDaUrl); // Agora é async
        } else {
            containerDetalhesFilme.innerHTML = "<p>ID do filme não especificado na URL. Volte ao <a href='filmes.html'>catálogo</a> e selecione um filme.</p>";
            const secaoSuaAvaliacao = document.getElementById('sua-avaliacao-secao');
            if(secaoSuaAvaliacao) secaoSuaAvaliacao.style.display = 'none';
            const containerAvaliacoesCom = document.getElementById('lista-avaliacoes-filme');
            if(containerAvaliacoesCom) containerAvaliacoesCom.innerHTML = "";
        }

        // Configuração das estrelas interativas (permanece igual)
        const estrelasInputContainer = document.getElementById('estrelas-input');
        if (estrelasInputContainer) {
            const valorNotaHidden = document.getElementById('avaliacao-nota-valor');
            const todasAsEstrelas = estrelasInputContainer.querySelectorAll('.estrela');
            todasAsEstrelas.forEach(estrela => {
                estrela.addEventListener('click', function() { /* ... */ 
                    const valorSelecionado = parseInt(this.dataset.valor);
                    if (valorNotaHidden) valorNotaHidden.value = valorSelecionado;
                    estrelasInputContainer.dataset.nota = valorSelecionado;
                    todasAsEstrelas.forEach(s => {
                        s.textContent = (parseInt(s.dataset.valor) <= valorSelecionado) ? '⭐' : '☆';
                    });
                });
                estrela.addEventListener('mouseover', function() { /* ... */ 
                    const valorHover = parseInt(this.dataset.valor);
                    todasAsEstrelas.forEach(s => {
                        s.textContent = (parseInt(s.dataset.valor) <= valorHover) ? '⭐' : '☆';
                    });
                });
                estrela.addEventListener('mouseout', function() {  /* ... */
                    const valorAtual = parseInt(estrelasInputContainer.dataset.nota) || 0;
                    todasAsEstrelas.forEach(s => {
                        s.textContent = (parseInt(s.dataset.valor) <= valorAtual) ? '⭐' : '☆';
                    });
                });
            });
        }

        // Formulário de nova avaliação agora chama a função API
        const formNovaAvaliacao = document.getElementById('form-nova-avaliacao');
        if (formNovaAvaliacao) {
            formNovaAvaliacao.addEventListener('submit', lidarComNovaAnaliseAPI);
        }
    }

    // Formulário de cadastro de novo filme agora chama a função API
    const formCadastroFilme = document.getElementById('form-cadastro-filme');
    if (formCadastroFilme) {
        formCadastroFilme.addEventListener('submit', lidarComCadastroNovoFilmeAPI);
    }

    // Lógica para a página de lista de todas as análises
    if (document.getElementById('container-todas-analises')) {
        await renderizarTodasAsAnalises();
    }
});