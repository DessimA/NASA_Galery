# 💾 Como Salvar e Executar o Script no Windows

## 📝 **Formato do Arquivo**

Salve com a extensão **`.ps1`** (PowerShell Script)

**Nome sugerido:** `deploy-nasa-gallery.ps1`

---

## 🔧 **Como Salvar**

### **Opção 1: Notepad (Bloco de Notas)**
```
1. Abra o Notepad
2. Cole o código do script
3. Clique em "Arquivo" → "Salvar Como"
4. Em "Nome do arquivo", digite: deploy-nasa-gallery.ps1
5. Em "Salvar como tipo", selecione: "Todos os Arquivos (*.*)"
6. Em "Codificação", selecione: "UTF-8"
7. Clique em "Salvar"
```

### **Opção 2: VS Code (Recomendado)**
```
1. Abra o VS Code
2. Cole o código
3. Ctrl + S para salvar
4. Digite o nome: deploy-nasa-gallery.ps1
5. O VS Code vai reconhecer automaticamente como PowerShell
```

### **Opção 3: PowerShell ISE**
```
1. Abra "Windows PowerShell ISE"
2. Cole o código
3. Ctrl + S
4. Salve como: deploy-nasa-gallery.ps1
```

---

## ▶️ **Como Executar**

### **PASSO 1: Abrir PowerShell como Administrador**

```powershell
# Pressione: Win + X
# Selecione: "Windows PowerShell (Admin)" ou "Terminal (Admin)"
```

### **PASSO 2: Navegar até a pasta do script**

```powershell
# Exemplo: Se salvou na pasta Downloads
cd C:\Users\SeuUsuario\Downloads

# Ou se salvou em Documentos
cd C:\Users\SeuUsuario\Documents

# Verificar se o arquivo está lá
dir *.ps1
```

### **PASSO 3: Habilitar Execução de Scripts (Primeira vez apenas)**

```powershell
# Verificar política atual
Get-ExecutionPolicy

# Se retornar "Restricted", execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Confirme digitando: S
```

**Explicação das políticas:**
- `Restricted` - Nenhum script pode ser executado (padrão)
- `RemoteSigned` - Scripts locais podem rodar, scripts baixados precisam ser assinados
- `Unrestricted` - Todos scripts podem rodar (menos seguro)

### **PASSO 4: Executar o Script**

```powershell
# Forma 1 (recomendada):
.\deploy-nasa-gallery.ps1

# Forma 2 (caminho completo):
C:\Users\SeuUsuario\Downloads\deploy-nasa-gallery.ps1

# Forma 3 (com PowerShell explícito):
powershell -ExecutionPolicy Bypass -File .\deploy-nasa-gallery.ps1
```

---

## 🎬 **Passo a Passo Completo (Do Zero)**

```powershell
# 1. Abrir PowerShell como Admin
# Win + X → "Terminal (Admin)"

# 2. Verificar se AWS CLI está configurado
aws sts get-caller-identity

# 3. Navegar até onde salvou o script
cd C:\Users\SeuUsuario\Downloads

# 4. Habilitar scripts (primeira vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 5. Executar!
.\deploy-nasa-gallery.ps1
```

---

## ⚠️ **Troubleshooting Comum**

### **Erro: "Não é reconhecido como nome de cmdlet"**
```powershell
# Problema: PowerShell não encontrou o script
# Solução: Use .\ antes do nome
.\deploy-nasa-gallery.ps1  # ✅ CORRETO
deploy-nasa-gallery.ps1    # ❌ ERRADO
```

### **Erro: "A execução de scripts foi desabilitada"**
```powershell
# Solução 1: Mudar política (permanente)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Solução 2: Bypass temporário (apenas essa execução)
powershell -ExecutionPolicy Bypass -File .\deploy-nasa-gallery.ps1
```

### **Erro: "AWS CLI não encontrado"**
```powershell
# Verificar se está instalado
aws --version

# Se não estiver, instalar:
# Download: https://awscli.amazonaws.com/AWSCLIV2.msi
# Após instalar, FECHE e ABRA o PowerShell novamente
```

### **Erro: "Credenciais AWS inválidas"**
```powershell
# Configurar AWS CLI
aws configure

# Vai pedir:
# AWS Access Key ID: [cole sua key]
# AWS Secret Access Key: [cole sua secret]
# Default region name: us-west-2
# Default output format: json
```

---

## 📁 **Estrutura Recomendada de Pastas**

```
C:\AWS-Projects\
└── NASA-Gallery\
    ├── deploy-nasa-gallery.ps1      ← Script principal
    ├── cleanup-complete.ps1          ← Script de limpeza
    ├── nasa-gallery-key.pem          ← Será criado pelo script
    └── aws-resources.txt             ← Será criado pelo script
```

**Como criar:**
```powershell
# Criar estrutura de pastas
mkdir C:\AWS-Projects\NASA-Gallery
cd C:\AWS-Projects\NASA-Gallery

# Salvar o script aqui
# Copiar deploy-nasa-gallery.ps1 para esta pasta

# Executar
.\deploy-nasa-gallery.ps1
```

---

## 🎯 **Resumo Rápido**

1. **Salvar**: arquivo com extensão `.ps1`
2. **Abrir**: PowerShell como **Administrador**
3. **Navegar**: `cd` até a pasta do script
4. **Habilitar**: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` (primeira vez)
5. **Executar**: `.\deploy-nasa-gallery.ps1`

---

## 🚀 **Comando Copy-Paste (Tudo de uma vez)**

```powershell
# Cole isso no PowerShell (como Admin) - ajuste o caminho!

# 1. Ir para a pasta
cd C:\Users\$env:USERNAME\Downloads

# 2. Habilitar scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 3. Verificar AWS
aws sts get-caller-identity

# 4. Executar
.\deploy-nasa-gallery.ps1
```

Pronto! 🎉 Agora é só executar e acompanhar o progresso no terminal!