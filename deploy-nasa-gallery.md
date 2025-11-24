## 🚀 AWS Automation (Infrastructure as Code)

Este projeto inclui scripts de automação em **PowerShell** para provisionar, configurar e destruir toda a infraestrutura necessária na AWS.

O script realiza o **Full Stack Deployment**:
1. Cria a rede (VPC, Subnets, Internet Gateway, NAT Gateway).
2. Configura segurança (Security Groups, Key Pairs).
3. Sobe uma instância EC2 (Amazon Linux 2023).
4. **User Data:** Instala automaticamente Node.js, Git, Nginx.
5. Clona este repositório, injeta as variáveis de ambiente, faz o build e serve a aplicação.

### 📂 Estrutura dos Arquivos

Certifique-se de ter os seguintes arquivos na raiz (ou na pasta de scripts) do projeto:

*   `deploy-nasa-gallery.ps1`: Script de criação da infraestrutura.
*   `cleanup-nasa-gallery.ps1`: Script de destruição (para economizar custos).
*   `secrets.json`: **(Você deve criar este arquivo)** Contém suas chaves de API.

---

### 🔐 Configuração de Segurança (Obrigatório)

Para não expor a API Key da NASA no GitHub, o script consome um arquivo local ignorado pelo Git.

1. Crie um arquivo chamado `secrets.json` na mesma pasta do script.
2. Adicione o seguinte conteúdo (substitua pela sua chave):

```json
{
    "NASA_API_KEY": "SUA_CHAVE_DA_NASA_AQUI",
    "NASA_API_BASE_URL": "https://api.nasa.gov"
}
```

> **Nota:** O arquivo `secrets.json` já está adicionado ao `.gitignore` para garantir que suas credenciais nunca sejam enviadas ao repositório.

---

### ▶️ Como Executar o Deploy

1. Abra o **PowerShell** como Administrador.
2. Certifique-se de ter o [AWS CLI](https://aws.amazon.com/cli/) instalado e configurado (`aws configure`).
3. Execute o script:

```powershell
.\deploy-nasa-gallery.ps1
```

**O que esperar:**
*   O script levará cerca de **5 a 8 minutos**.
*   Ao final, ele exibirá o **IP Público** de acesso.
*   Acesse no navegador: `http://SEU_IP_PUBLICO`

---

### 🧹 Como Limpar o Ambiente (Destruição)

Para evitar cobranças desnecessárias na AWS (especialmente do NAT Gateway e EC2), execute o script de limpeza quando terminar os testes:

```powershell
.\cleanup-nasa-gallery.ps1
```

*   O script pedirá uma confirmação (`CONFIRMAR`).
*   Ele removerá **todos** os recursos criados, garantindo custo zero após a execução.

---

### 🏗️ Arquitetura Provisionada

O script cria uma arquitetura de alta disponibilidade (preparada para produção):

*   **VPC Customizada:** Isolamento de rede.
*   **4 Subnets:** 2 Públicas (Web Server) e 2 Privadas (Backend/DB ready) em zonas de disponibilidade diferentes (us-west-2a / us-west-2b).
*   **NAT Gateway:** Permite que recursos privados acessem a internet para atualizações de forma segura.
*   **EC2 (t3.micro):** Servidor de aplicação rodando Nginx como Proxy Reverso para o React App.


---

### 💡 Dica Extra para o seu Repositório

Para deixar seu repositório super profissional, certifique-se de que o seu arquivo `.gitignore` na raiz do projeto contenha estas linhas (para evitar subir os arquivos gerados pelo script):

```
# AWS Automation Files
secrets.json
nasa-gallery-key.pem
aws-resources.txt
user_data_script.sh
```