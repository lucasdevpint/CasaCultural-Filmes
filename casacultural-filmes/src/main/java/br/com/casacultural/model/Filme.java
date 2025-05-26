package br.com.casacultural.model;

import jakarta.persistence.*; // Para anotações JPA (Java Persistence API)
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity // Marca esta classe como uma entidade JPA (será mapeada para uma tabela no BD)
@Table(name = "filmes") // Especifica o nome da tabela no banco de dados
public class Filme {

    @Id // Marca este campo como a chave primária da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura o ID para ser auto-incrementado pelo banco
    @Column(name = "id_filme") // Mapeia para a coluna 'id_filme'
    private int idFilme;

    @Column(nullable = false, length = 255) // Não pode ser nulo, tamanho máximo de 255 caracteres
    private String titulo;

    @Column(length = 255)
    private String genero;

    @Column(length = 150)
    private String diretor;

    @Column(name = "ano_lancamento") // Mapeia para a coluna 'ano_lancamento'
    private Integer anoLancamento; // Usar Integer permite valor nulo se o ano não for informado

    @Column(length = 50)
    private String duracao;

    @Lob // Indica que pode ser um texto longo (TEXT no MySQL)
    @Column(name = "descricao_curta", columnDefinition = "TEXT")
    private String descricaoCurta;

    @Lob
    @Column(name = "sinopse_completa", columnDefinition = "TEXT")
    private String sinopseCompleta;

    @Column(name = "url_imagem_banner", length = 255)
    private String urlImagemBanner;

    @Column(name = "url_imagem_poster", length = 255)
    private String urlImagemPoster;

    @Column(name = "data_cadastro", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    // insertable=false, updatable=false: O Java não vai tentar inserir ou atualizar este campo
    // columnDefinition: Pede ao banco para usar o valor padrão CURRENT_TIMESTAMP
    private Timestamp dataCadastro;

    // Relacionamento: Um Filme pode ter muitas Análises
    // mappedBy="filme": Indica que o lado "dono" do relacionamento está na classe Analise, no campo "filme".
    // cascade=CascadeType.ALL: Operações (salvar, deletar) em Filme serão cascateadas para suas Análises.
    // orphanRemoval=true: Se uma Analise for removida da lista 'avaliacoes' de um Filme, ela será deletada do BD.
    // fetch=FetchType.LAZY: As avaliações só serão carregadas do BD quando explicitamente acessadas (ex: filme.getAvaliacoes()).
    @OneToMany(mappedBy = "filme", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Analise> avaliacoes = new ArrayList<>();


    // Construtores
    public Filme() {
    }

    // Getters e Setters (essenciais para JPA e para o seu código)
    public int getIdFilme() {
        return idFilme;
    }

    public void setIdFilme(int idFilme) {
        this.idFilme = idFilme;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getDiretor() {
        return diretor;
    }

    public void setDiretor(String diretor) {
        this.diretor = diretor;
    }

    public Integer getAnoLancamento() {
        return anoLancamento;
    }

    public void setAnoLancamento(Integer anoLancamento) {
        this.anoLancamento = anoLancamento;
    }

    public String getDuracao() {
        return duracao;
    }

    public void setDuracao(String duracao) {
        this.duracao = duracao;
    }

    public String getDescricaoCurta() {
        return descricaoCurta;
    }

    public void setDescricaoCurta(String descricaoCurta) {
        this.descricaoCurta = descricaoCurta;
    }

    public String getSinopseCompleta() {
        return sinopseCompleta;
    }

    public void setSinopseCompleta(String sinopseCompleta) {
        this.sinopseCompleta = sinopseCompleta;
    }

    public String getUrlImagemBanner() {
        return urlImagemBanner;
    }

    public void setUrlImagemBanner(String urlImagemBanner) {
        this.urlImagemBanner = urlImagemBanner;
    }

    public String getUrlImagemPoster() {
        return urlImagemPoster;
    }

    public void setUrlImagemPoster(String urlImagemPoster) {
        this.urlImagemPoster = urlImagemPoster;
    }

    public Timestamp getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Timestamp dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public List<Analise> getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(List<Analise> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }

    // Método utilitário para adicionar uma análise (garante a bidirecionalidade se necessário)
    public void addAnalise(Analise analise) {
        this.avaliacoes.add(analise);
        analise.setFilme(this); // Mantém o relacionamento bidirecional consistente
    }

    // (Opcional) toString para facilitar a visualização em logs
    @Override
    public String toString() {
        return "Filme{" +
               "idFilme=" + idFilme +
               ", titulo='" + titulo + '\'' +
               '}';
    }
}