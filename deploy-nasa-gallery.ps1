# ============================================================
# Script: Deploy NASA Gallery (Full Stack Automation)
# Versão: 6.0 (Secure Mode - External Secrets)
# ============================================================

$ErrorActionPreference = "Stop"
Clear-Host

Write-Host @"
╔══════════════════════════════════════════════════════════╗
║  🚀 Deploy NASA Gallery - Secure Automation             ║
║  Infra + App + Gestão Segura de Segredos                ║
║  Status: Production-Ready                                ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# ============================================================
# PARTE 0: CARREGAR SEGREDOS (NOVO!)
# ============================================================

Write-Host "`n[INIT] Verificando arquivo de segredos..." -ForegroundColor Yellow
$secretsFile = "secrets.json"

if (-not (Test-Path $secretsFile)) {
    Write-Host "❌ ERRO CRÍTICO: Arquivo '$secretsFile' não encontrado!" -ForegroundColor Red
    Write-Host "   Para segurança, a API Key não está mais no script." -ForegroundColor Gray
    Write-Host "   1. Crie um arquivo chamado 'secrets.json'" -ForegroundColor Yellow
    Write-Host "   2. Use o modelo abaixo:" -ForegroundColor Yellow
    Write-Host @"
   {
       "NASA_API_KEY": "SUA_CHAVE_DA_NASA_AQUI",
       "NASA_API_BASE_URL": "https://api.nasa.gov"
   }
"@ -ForegroundColor Gray
    exit 1
}

try {
    $secrets = Get-Content $secretsFile -Raw | ConvertFrom-Json
    $NASA_KEY = $secrets.NASA_API_KEY
    $NASA_URL = $secrets.NASA_API_BASE_URL
    
    if ([string]::IsNullOrWhiteSpace($NASA_KEY) -or $NASA_KEY -eq "SUA_CHAVE_AQUI") {
        throw "Chave inválida"
    }
    Write-Host "✅ Segredos carregados com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao ler '$secretsFile'. Verifique o formato JSON." -ForegroundColor Red
    exit 1
}

# ============================================================
# PARTE 1: VERIFICAÇÕES
# ============================================================

Write-Host "`n[CHECK 1/4] Validando credenciais..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity --output json | Out-Null
    Write-Host "✅ AWS CLI Autenticado" -ForegroundColor Green
    Write-Host "   🔒 Conta: ************ (Oculto)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Falha na autenticação AWS CLI" -ForegroundColor Red
    exit 1
}

Write-Host "`n[CHECK 2/4] Verificando região..." -ForegroundColor Yellow
$currentRegion = aws configure get region
if ($currentRegion -ne "us-west-2") {
    aws configure set region us-west-2
    Write-Host "✅ Região ajustada para: us-west-2" -ForegroundColor Green
} else {
    Write-Host "✅ Região: us-west-2" -ForegroundColor Green
}

Write-Host "`n[CHECK 3/4] Limpando chaves antigas..." -ForegroundColor Yellow
if (Test-Path "nasa-gallery-key.pem") {
    try {
        $null = icacls "nasa-gallery-key.pem" /reset 2>$null
        Remove-Item "nasa-gallery-key.pem" -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Chave antiga removida" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Aviso: Não foi possível remover a chave antiga." -ForegroundColor Yellow
    }
}

Write-Host "`n[CHECK 4/4] Preparando script de instalação (User Data)..." -ForegroundColor Yellow

# AQUI A VARIÁVEL $NASA_KEY É INJETADA NO SCRIPT BASH
$userDataContent = @"
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "--- INICIANDO INSTALAÇÃO AUTOMATICA ---"

# 1. Atualizar Sistema e Instalar Dependências
dnf update -y
dnf install -y git nginx ruby wget

# 2. Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs

# 3. Clonar Repositório
cd /home/ec2-user
git clone https://github.com/DessimA/NASA_Galery.git
cd NASA_Galery

# 4. Ajustar package.json
sed -i 's|"homepage": "https://dessima.github.io/NASA_Galery",|"homepage": ".",|' package.json

# 5. INJETAR VARIÁVEIS DE AMBIENTE (DO SECRETS.JSON)
echo "Configurando variáveis de ambiente seguras..."
echo "REACT_APP_NASA_API_KEY=$NASA_KEY" > .env
echo "NASA_API_BASE_URL=$NASA_URL" >> .env

# 6. Build e Deploy
npm install --legacy-peer-deps
npm run build
cp -r build/* /usr/share/nginx/html/

# 7. Permissões e Nginx
chown -R nginx:nginx /usr/share/nginx/html
chmod -R 755 /usr/share/nginx/html
systemctl enable --now nginx

echo "--- DEPLOY FINALIZADO ---"
"@

$userDataContent | Out-File -FilePath "user_data_script.sh" -Encoding ascii
Write-Host "✅ Script de automação gerado (Chaves injetadas)" -ForegroundColor Green

Start-Sleep -Seconds 2

# ============================================================
# PARTE 2: REDE (VPC & SUBNETS)
# ============================================================

Write-Host "`n[1/8] Construindo VPC e Gateway..." -ForegroundColor Yellow
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=NASA-Gallery-VPC}]' | Out-Null
$VPC_ID = aws ec2 describe-vpcs --filters "Name=tag:Name,Values=NASA-Gallery-VPC" --query 'Vpcs | sort_by(@, &State) | [-1].VpcId' --output text
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames

aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=NASA-Gallery-IGW}]' | Out-Null
$IGW_ID = aws ec2 describe-internet-gateways --filters "Name=tag:Name,Values=NASA-Gallery-IGW" --query 'InternetGateways | sort_by(@, &Tags[0].Value) | [-1].InternetGatewayId' --output text
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
Write-Host "   ✅ VPC ID: $VPC_ID" -ForegroundColor Green

Write-Host "`n[2/8] Provisionando Subnets (Multi-AZ)..." -ForegroundColor Yellow
# Public 1
aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.0.0/24 --availability-zone us-west-2a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-1}]' | Out-Null
$PUB_1 = aws ec2 describe-subnets --filters "Name=tag:Name,Values=Public-Subnet-1" "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0].SubnetId' --output text

# Private 1
aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone us-west-2a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-1}]' | Out-Null
$PRIV_1 = aws ec2 describe-subnets --filters "Name=tag:Name,Values=Private-Subnet-1" "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0].SubnetId' --output text

# Public 2
aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone us-west-2b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-2}]' | Out-Null
$PUB_2 = aws ec2 describe-subnets --filters "Name=tag:Name,Values=Public-Subnet-2" "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0].SubnetId' --output text

# Private 2
aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.3.0/24 --availability-zone us-west-2b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-2}]' | Out-Null
$PRIV_2 = aws ec2 describe-subnets --filters "Name=tag:Name,Values=Private-Subnet-2" "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0].SubnetId' --output text
Write-Host "   ✅ 4 Subnets criadas com sucesso" -ForegroundColor Green

# ============================================================
# PARTE 3: CONECTIVIDADE (NAT & ROTAS)
# ============================================================

Write-Host "`n[3/8] Configurando NAT Gateway..." -ForegroundColor Yellow
aws ec2 allocate-address --domain vpc --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=NAT-Gateway-EIP}]' | Out-Null
$EIP_ID = aws ec2 describe-addresses --filters "Name=tag:Name,Values=NAT-Gateway-EIP" --query 'Addresses | sort_by(@, &AllocationId) | [-1].AllocationId' --output text

$EXISTING_NAT = aws ec2 describe-nat-gateways --filter "Name=tag:Name,Values=NASA-Gallery-NAT" "Name=state,Values=pending,available" --query 'NatGateways[0].NatGatewayId' --output text 2>$null

if ($EXISTING_NAT -and $EXISTING_NAT -ne "None") {
    $NAT_ID = $EXISTING_NAT
} else {
    aws ec2 create-nat-gateway --subnet-id $PUB_1 --allocation-id $EIP_ID --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=NASA-Gallery-NAT}]' | Out-Null
    $NAT_ID = aws ec2 describe-nat-gateways --filter "Name=tag:Name,Values=NASA-Gallery-NAT" --query 'NatGateways | sort_by(@, &CreateTime) | [-1].NatGatewayId' --output text
}

Write-Host "   ⏳ Aguardando provisionamento do NAT (pode levar alguns minutos)..." -ForegroundColor Cyan
$timeout = 900; $elapsed = 0; $interval = 15
while ($elapsed -lt $timeout) {
    $state = aws ec2 describe-nat-gateways --nat-gateway-ids $NAT_ID --query 'NatGateways[0].State' --output text
    if ($state -eq "available") { Write-Host "`n   ✅ NAT Gateway Ativo" -ForegroundColor Green; break }
    if ($state -eq "failed") { Write-Host "`n   ❌ Falha no NAT Gateway" -ForegroundColor Red; exit 1 }
    Start-Sleep -Seconds $interval; $elapsed += $interval
    Write-Host -NoNewline "·"
}

Write-Host "`n[4/8] Configurando Tabelas de Roteamento..." -ForegroundColor Yellow
# Public RT
aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Public-Route-Table}]' | Out-Null
$PUB_RT = aws ec2 describe-route-tables --filters "Name=tag:Name,Values=Public-Route-Table" "Name=vpc-id,Values=$VPC_ID" --query 'RouteTables[0].RouteTableId' --output text
aws ec2 create-route --route-table-id $PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID | Out-Null
aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB_1 | Out-Null
aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB_2 | Out-Null

# Private RT
aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Private-Route-Table}]' | Out-Null
$PRIV_RT = aws ec2 describe-route-tables --filters "Name=tag:Name,Values=Private-Route-Table" "Name=vpc-id,Values=$VPC_ID" --query 'RouteTables[0].RouteTableId' --output text
aws ec2 create-route --route-table-id $PRIV_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_ID | Out-Null
aws ec2 associate-route-table --route-table-id $PRIV_RT --subnet-id $PRIV_1 | Out-Null
aws ec2 associate-route-table --route-table-id $PRIV_RT --subnet-id $PRIV_2 | Out-Null
Write-Host "   ✅ Rotas configuradas (Internet & NAT)" -ForegroundColor Green

# ============================================================
# PARTE 4: SEGURANÇA & COMPUTAÇÃO
# ============================================================

Write-Host "`n[5/8] Gerando Key Pair..." -ForegroundColor Yellow
aws ec2 delete-key-pair --key-name nasa-gallery-key 2>$null
$keyMaterial = aws ec2 create-key-pair --key-name nasa-gallery-key --query 'KeyMaterial' --output text
$keyMaterial | Out-File -Encoding ascii -FilePath nasa-gallery-key.pem

icacls nasa-gallery-key.pem /reset | Out-Null
icacls nasa-gallery-key.pem /inheritance:r | Out-Null
icacls nasa-gallery-key.pem /grant:r "$env:USERNAME`:(R)" | Out-Null
Write-Host "   ✅ Key Pair criada e protegida" -ForegroundColor Green

Write-Host "`n[6/8] Configurando Security Group..." -ForegroundColor Yellow
aws ec2 create-security-group --group-name nasa-gallery-sg --description "NASA Gallery SG" --vpc-id $VPC_ID | Out-Null
$SG_ID = aws ec2 describe-security-groups --filters "Name=group-name,Values=nasa-gallery-sg" "Name=vpc-id,Values=$VPC_ID" --query 'SecurityGroups[0].GroupId' --output text
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0 | Out-Null
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 | Out-Null
Write-Host "   ✅ Firewall configurado (Portas 22, 80)" -ForegroundColor Green

Write-Host "`n[7/8] Iniciando Instância EC2 com User Data..." -ForegroundColor Yellow
$AMI_ID = aws ec2 describe-images --owners amazon --filters "Name=name,Values=al2023-ami-2023*" "Name=architecture,Values=x86_64" --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' --output text

aws ec2 run-instances `
  --image-id $AMI_ID `
  --instance-type t3.micro `
  --key-name nasa-gallery-key `
  --security-group-ids $SG_ID `
  --subnet-id $PUB_2 `
  --associate-public-ip-address `
  --user-data file://user_data_script.sh `
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=NASA-Gallery-Web}]' | Out-Null

Start-Sleep -Seconds 5
$INST_ID = aws ec2 describe-instances --filters "Name=tag:Name,Values=NASA-Gallery-Web" "Name=instance-state-name,Values=pending,running" --query 'Reservations | sort_by(@, &Instances[0].LaunchTime) | [-1].Instances[0].InstanceId' --output text
Write-Host "   ✅ Instância lançada: $INST_ID" -ForegroundColor Green

Remove-Item "user_data_script.sh" -Force -ErrorAction SilentlyContinue

Write-Host "`n[8/8] Finalizando e obtendo IP..." -ForegroundColor Yellow
aws ec2 wait instance-running --instance-ids $INST_ID
$PUB_IP = aws ec2 describe-instances --instance-ids $INST_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text

$resources = "VPC_ID=$VPC_ID`nIGW_ID=$IGW_ID`nNAT_GW_ID=$NAT_ID`nPUBLIC_SUBNET_1=$PUB_1`nPUBLIC_SUBNET_2=$PUB_2`nPRIVATE_SUBNET_1=$PRIV_1`nPRIVATE_SUBNET_2=$PRIV_2`nPUBLIC_RT=$PUB_RT`nPRIVATE_RT=$PRIV_RT`nSG_ID=$SG_ID`nINSTANCE_ID=$INST_ID`nPUBLIC_IP=$PUB_IP`nEIP_ALLOC_ID=$EIP_ID"
$resources | Out-File -FilePath aws-resources.txt -Encoding UTF8

Write-Host @"

╔══════════════════════════════════════════════════════════╗
║               ✅ DEPLOY COMPLETO COM SUCESSO            ║
╚══════════════════════════════════════════════════════════╝

📊 Resumo:
   • Infraestrutura: Criada
   • Segredos:       Injetados via secrets.json (Seguro)
   • Aplicação:      Instalando... (Aguarde 3-5 min)

🌐 URL: http://$PUB_IP

"@ -ForegroundColor Cyan