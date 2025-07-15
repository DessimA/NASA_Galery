# Galeria NASA

Este projeto é uma aplicação React que interage com várias APIs da NASA para exibir imagens e informações astronômicas. Ele permite aos usuários explorar a Imagem Astronômica do Dia (APOD), pesquisar na Biblioteca de Imagens e Vídeos da NASA e visualizar fotos dos Rovers de Marte.

## Funcionalidades

*   **Imagem Astronômica do Dia (APOD):** Visualize a imagem astronômica diária e sua explicação.
*   **Pesquisa na Biblioteca de Imagens e Vídeos da NASA:** Pesquise por imagens e vídeos da vasta coleção da NASA.
*   **Fotos dos Rovers de Marte:** Navegue pelas fotos tiradas por diferentes Rovers de Marte em vários sóis (dias marcianos).
*   **Favoritos:** Salve suas imagens favoritas para acesso rápido.

## Tecnologias Utilizadas

*   React
*   Axios (para requisições de API)
*   Bootstrap (para estilização)
*   React Router DOM (para navegação)
*   React Icons
*   React Input Mask

## Configuração e Instalação

Para colocar este projeto em funcionamento em sua máquina local, siga estes passos:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/dessima/NASA_Galery.git
    cd NASA_Galery
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure a Chave da API da NASA (Opcional, mas Recomendado):**
    Algumas funcionalidades, como APOD e Fotos dos Rovers de Marte, utilizam a API da NASA. Embora uma `DEMO_KEY` seja fornecida por padrão, ela possui limites de taxa. Para funcionalidade completa, é recomendado obter sua própria chave de API em [NASA API](https://api.nasa.gov/) e configurá-la:

    Crie um arquivo `.env` na raiz do diretório do projeto e adicione sua chave de API:
    ```
    REACT_APP_NASA_API_KEY=SUA_CHAVE_DA_API_DA_NASA
    ```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Executa o aplicativo em modo de desenvolvimento.
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo em seu navegador.

A página será recarregada quando você fizer alterações. Você também pode ver quaisquer erros de lint no console.

### `npm test`

Inicia o executor de testes no modo de observação interativo.
Consulte a seção sobre [execução de testes](https://facebook.github.io/create-react-app/docs/running-tests) para obter mais informações.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.
Ele agrupa corretamente o React em modo de produção e otimiza a compilação para o melhor desempenho.

A compilação é minificada e os nomes dos arquivos incluem os hashes.
Seu aplicativo está pronto para ser implantado!

Consulte a seção sobre [implantação](https://facebook.github.io/create-react-app/docs/deployment) para obter mais informações.

### `npm run eject`

**Nota: esta é uma operação unidirecional. Uma vez que você `eject`, não há como voltar!**

Se você não estiver satisfeito com a ferramenta de compilação e as escolhas de configuração, você pode `eject` a qualquer momento. Este comando removerá a única dependência de compilação do seu projeto.

Em vez disso, ele copiará todos os arquivos de configuração e as dependências transitivas (webpack, Babel, ESLint, etc) diretamente para o seu projeto, para que você tenha controle total sobre eles. Todos os comandos, exceto `eject`, ainda funcionarão, mas apontarão para os scripts copiados para que você possa ajustá-los. Neste ponto, você está por conta própria.

Você nunca precisa usar `eject`. O conjunto de recursos curados é adequado para implantações pequenas e médias, e você não deve se sentir obrigado a usar este recurso. No entanto, entendemos que esta ferramenta não seria útil se você não pudesse personalizá-la quando estivesse pronto para isso.

## Saiba Mais

Você pode aprender mais na [documentação do Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Para aprender React, consulte a [documentação do React](https://reactjs.org/).
