# Casa Cultural Av. Filmes (Spring Boot)

Bem-vindo ao repositório do projeto Casa Cultural Av. Filmes! Esta é uma aplicação web para catalogar filmes, permitir que usuários vejam detalhes, adicionem e gerenciem suas análises e avaliações.

## Descrição

O Casa Cultural Av. Filmes é um sistema web que visa criar uma comunidade para amantes de cinema. Os usuários podem explorar um catálogo de filmes, ver informações detalhadas sobre cada um, ler análises de outros usuários e contribuir com suas próprias avaliações e comentários. O projeto também permite o cadastro (simulado ou real, dependendo da fase de implementação) de novos filmes ao catálogo.

## Funcionalidades Principais

* **Catálogo de Filmes:** Listagem de filmes com informações básicas (título, imagem, gênero, descrição curta).
* **Detalhes do Filme:** Visualização completa dos dados de um filme específico, incluindo sinopse, diretor, ano, duração.
* **Análises e Avaliações:**
    * Exibição de análises e notas dadas por usuários para cada filme.
    * Permite que o usuário submeta sua própria nota (estrelas) e comentário para um filme.
    * (Simulação ou persistência real, dependendo da fase) Edição e exclusão de análises.
* **Cadastro de Filmes:**
    * Formulário para adicionar novos filmes ao catálogo (simulado ou persistido no banco).
* **Gerenciamento de Filmes (Admin - Simulado ou Persistido):**
    * Edição dos detalhes de filmes existentes.
    * Exclusão de filmes do catálogo.
* **Interface Amigável:**
    * Navegação intuitiva entre as páginas.
    * Alternância de tema (Claro/Escuro) com persistência da preferência do usuário.

## Tecnologias Utilizadas

* **Backend:**
    * Java (Versão 17)
    * Spring Boot (v3.x.x - verifique seu `pom.xml` para a versão exata)
        * Spring Web (para APIs REST e MVC)
        * Spring Data JPA (para persistência de dados)
        * Spring Boot DevTools (para facilitar o desenvolvimento)
    * Hibernate (como implementação JPA)
    * MySQL (Banco de Dados Relacional)
* **Frontend:**
    * HTML5
    * CSS3
    * JavaScript (Vanilla JS para interações e chamadas API via `Workspace`)
* **Build Tool:**
    * Apache Maven
* **Servidor (Embarcado/Externo):**
    * Tomcat (embutido pelo Spring Boot ao empacotar como JAR, ou para deploy de WAR)

## Pré-requisitos

Para rodar este projeto localmente, você precisará ter instalado:

* JDK 17 ou superior
* Apache Maven 3.6+
* MySQL Server (versão 8.x recomendada)
* Uma IDE de sua preferência (VS Code com extensões Java e Spring Boot, IntelliJ IDEA, Eclipse STS)
* Git (para clonar o repositório)

## Configuração e Execução do Projeto

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/lucasdevpint/CasaCultural-Filmes.git](https://github.com/lucasdevpint/CasaCultural-Filmes.git)
    cd CasaCultural-Filmes
    ```

2.  **Configure o Banco de Dados MySQL:**
    * Certifique-se de que seu servidor MySQL está rodando.
    * Crie um banco de dados chamado `db_casacultural_filmes` (ou o nome que você usou):
        ```sql
        CREATE DATABASE IF NOT EXISTS db_casacultural_filmes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        ```
    * Verifique se o usuário e senha do MySQL que você usará têm permissões para acessar e modificar este banco.

3.  **Configure as Propriedades da Aplicação:**
    * Abra o arquivo `src/main/resources/application.properties`.
    * Atualize as seguintes propriedades com suas credenciais e detalhes do banco de dados:
        ```properties
        spring.datasource.url=jdbc:mysql://localhost:3306/db_casacultural_filmes?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
        spring.datasource.username=SEU_USUARIO_MYSQL
        spring.datasource.password=SUA_SENHA_MYSQL
        spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

        spring.jpa.hibernate.ddl-auto=update
        spring.jpa.show-sql=true
        spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
        
        # Opcional: defina a porta se a 8080 estiver em uso
        # server.port=8081 
        ```
    * Substitua `SEU_USUARIO_MYSQL` e `SUA_SENHA_MYSQL`.

4.  **Construa e Execute a Aplicação Spring Boot:**
    * **Via Maven no terminal (na raiz do projeto):**
        Para construir e rodar (o Spring Boot DevTools pode ajudar com o live reload):
        ```bash
        mvn spring-boot:run
        ```
        Ou para construir o pacote (JAR ou WAR, dependendo do seu `pom.xml`):
        ```bash
        mvn clean package
        ```
        E depois rodar o JAR (se for JAR packaging):
        ```bash
        java -jar target/casacultural-filmes-0.0.1-SNAPSHOT.jar 
        ```
        (Ajuste o nome do JAR conforme necessário).
    * **Via IDE (VS Code, IntelliJ, Eclipse):**
        * Importe o projeto como um projeto Maven.
        * Encontre a classe principal anotada com `@SpringBootApplication` (ex: `CasaculturalFilmesApplication.java`).
        * Execute esta classe como uma Aplicação Java.

5.  **Acesse a Aplicação:**
    * Abra seu navegador e vá para `http://localhost:8080` (ou a porta que você configurou).

