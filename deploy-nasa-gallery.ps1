# ============================================================
# Script Completo: Deploy NASA Gallery com VPC Customizada
# Arquitetura: VPC + 4 Subnets + NAT Gateway + EC2
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host @"
╔══════════════════════════════════════════════════════════╗
║  🚀 Deploy NASA Gallery - Arquitetura Completa AWS      ║
║  VPC Customizada + Subnets Públicas/Privadas + NAT      ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# ============================================================
# PARTE 1: VERIFICAÇÕES INICIAIS
# ============================================================

Write-Host "`n[CHECK] Verificando AWS CLI..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "✅ AWS CLI configurado" -ForegroundColor Green
    Write-Host "   Conta: $($identity.Account)" -ForegroundColor Gray
} catch {
    Write-Host "❌ AWS CLI não configurado!" -ForegroundColor Red
    exit 1
}

# ============================================================
# PARTE 2: CRIAR VPC
# ============================================================

Write-Host "`n[1/20] Criando VPC customizada (10.0.0.0/16)..." -ForegroundColor Yellow
aws ec2 create-vpc `
  --cidr-block 10.0.0.0/16 `
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=NASA-Gallery-VPC}]' | Out-Null

$VPC_ID = aws ec2 describe-vpcs `
  --filters "Name=tag:Name,Values=NASA-Gallery-VPC" `
  --query 'Vpcs[0].VpcId' `
  --output text

Write-Host "   ✅ VPC criada: $VPC_ID" -ForegroundColor Green

# Habilitar DNS
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames

# ============================================================
# PARTE 3: CRIAR INTERNET GATEWAY
# ============================================================

Write-Host "`n[2/20] Criando Internet Gateway..." -ForegroundColor Yellow
aws ec2 create-internet-gateway `
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=NASA-Gallery-IGW}]' | Out-Null

$IGW_ID = aws ec2 describe-internet-gateways `
  --filters "Name=tag:Name,Values=NASA-Gallery-IGW" `
  --query 'InternetGateways[0].InternetGatewayId' `
  --output text

aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
Write-Host "   ✅ Internet Gateway: $IGW_ID" -ForegroundColor Green

# ============================================================
# PARTE 4: CRIAR 4 SUBNETS
# ============================================================

Write-Host "`n[3/20] Criando Public Subnet 1 (10.0.0.0/24, us-west-2a)..." -ForegroundColor Yellow
aws ec2 create-subnet `
  --vpc-id $VPC_ID `
  --cidr-block 10.0.0.0/24 `
  --availability-zone us-west-2a `
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-1}]' | Out-Null

$PUBLIC_SUBNET_1 = aws ec2 describe-subnets `
  --filters "Name=tag:Name,Values=Public-Subnet-1" `
  --query 'Subnets[0].SubnetId' `
  --output text
Write-Host "   ✅ Public Subnet 1: $PUBLIC_SUBNET_1" -ForegroundColor Green

Write-Host "`n[4/20] Criando Private Subnet 1 (10.0.1.0/24, us-west-2a)..." -ForegroundColor Yellow
aws ec2 create-subnet `
  --vpc-id $VPC_ID `
  --cidr-block 10.0.1.0/24 `
  --availability-zone us-west-2a `
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-1}]' | Out-Null

$PRIVATE_SUBNET_1 = aws ec2 describe-subnets `
  --filters "Name=tag:Name,Values=Private-Subnet-1" `
  --query 'Subnets[0].SubnetId' `
  --output text
Write-Host "   ✅ Private Subnet 1: $PRIVATE_SUBNET_1" -ForegroundColor Green

Write-Host "`n[5/20] Criando Public Subnet 2 (10.0.2.0/24, us-west-2b) - Web Server..." -ForegroundColor Yellow
aws ec2 create-subnet `
  --vpc-id $VPC_ID `
  --cidr-block 10.0.2.0/24 `
  --availability-zone us-west-2b `
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-2}]' | Out-Null

$PUBLIC_SUBNET_2 = aws ec2 describe-subnets `
  --filters "Name=tag:Name,Values=Public-Subnet-2" `
  --query 'Subnets[0].SubnetId' `
  --output text
Write-Host "   ✅ Public Subnet 2 (Web Server): $PUBLIC_SUBNET_2" -ForegroundColor Green

Write-Host "`n[6/20] Criando Private Subnet 2 (10.0.3.0/24, us-west-2b)..." -ForegroundColor Yellow
aws ec2 create-subnet `
  --vpc-id $VPC_ID `
  --cidr-block 10.0.3.0/24 `
  --availability-zone us-west-2b `
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-2}]' | Out-Null

$PRIVATE_SUBNET_2 = aws ec2 describe-subnets `
  --filters "Name=tag:Name,Values=Private-Subnet-2" `
  --query 'Subnets[0].SubnetId' `
  --output text
Write-Host "   ✅ Private Subnet 2: $PRIVATE_SUBNET_2" -ForegroundColor Green

# ============================================================
# PARTE 5: CRIAR NAT GATEWAY
# ============================================================

Write-Host "`n[7/20] Criando Elastic IP para NAT Gateway..." -ForegroundColor Yellow
aws ec2 allocate-address `
  --domain vpc `
  --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=NAT-Gateway-EIP}]' | Out-Null

$EIP_ALLOC_ID = aws ec2 describe-addresses `
  --filters "Name=tag:Name,Values=NAT-Gateway-EIP" `
  --query 'Addresses[0].AllocationId' `
  --output text
Write-Host "   ✅ Elastic IP: $EIP_ALLOC_ID" -ForegroundColor Green

Write-Host "`n[8/20] Criando NAT Gateway (aguarde 2-3 minutos)..." -ForegroundColor Yellow
aws ec2 create-nat-gateway `
  --subnet-id $PUBLIC_SUBNET_1 `
  --allocation-id $EIP_ALLOC_ID `
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=NASA-Gallery-NAT}]' | Out-Null

$NAT_GW_ID = aws ec2 describe-nat-gateways `
  --filter "Name=tag:Name,Values=NASA-Gallery-NAT" `
  --query 'NatGateways[0].NatGatewayId' `
  --output text

Write-Host "   ⏳ Aguardando NAT Gateway disponível..." -ForegroundColor Cyan
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW_ID
Write-Host "   ✅ NAT Gateway: $NAT_GW_ID" -ForegroundColor Green

# ============================================================
# PARTE 6: CRIAR ROUTE TABLES
# ============================================================

Write-Host "`n[9/20] Criando Public Route Table..." -ForegroundColor Yellow
aws ec2 create-route-table `
  --vpc-id $VPC_ID `
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Public-Route-Table}]' | Out-Null

$PUBLIC_RT = aws ec2 describe-route-tables `
  --filters "Name=tag:Name,Values=Public-Route-Table" `
  --query 'RouteTables[0].RouteTableId' `
  --output text

aws ec2 create-route --route-table-id $PUBLIC_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID | Out-Null
Write-Host "   ✅ Public Route Table: $PUBLIC_RT" -ForegroundColor Green

Write-Host "`n[10/20] Associando subnets públicas..." -ForegroundColor Yellow
aws ec2 associate-route-table --route-table-id $PUBLIC_RT --subnet-id $PUBLIC_SUBNET_1 | Out-Null
aws ec2 associate-route-table --route-table-id $PUBLIC_RT --subnet-id $PUBLIC_SUBNET_2 | Out-Null
Write-Host "   ✅ Subnets públicas associadas" -ForegroundColor Green

Write-Host "`n[11/20] Criando Private Route Table..." -ForegroundColor Yellow
aws ec2 create-route-table `
  --vpc-id $VPC_ID `
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Private-Route-Table}]' | Out-Null

$PRIVATE_RT = aws ec2 describe-route-tables `
  --filters "Name=tag:Name,Values=Private-Route-Table" `
  --query 'RouteTables[0].RouteTableId' `
  --output text

aws ec2 create-route --route-table-id $PRIVATE_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_GW_ID | Out-Null
Write-Host "   ✅ Private Route Table: $PRIVATE_RT" -ForegroundColor Green

Write-Host "`n[12/20] Associando subnets privadas..." -ForegroundColor Yellow
aws ec2 associate-route-table --route-table-id $PRIVATE_RT --subnet-id $PRIVATE_SUBNET_1 | Out-Null
aws ec2 associate-route-table --route-table-id $PRIVATE_RT --subnet-id $PRIVATE_SUBNET_2 | Out-Null
Write-Host "   ✅ Subnets privadas associadas" -ForegroundColor Green

# ============================================================
# PARTE 7: CRIAR KEY PAIR
# ============================================================

Write-Host "`n[13/20] Criando Key Pair..." -ForegroundColor Yellow
$keyExists = aws ec2 describe-key-pairs --key-names nasa-gallery-key 2>$null

if ($keyExists) {
    Write-Host "   ⚠️  Key Pair já existe" -ForegroundColor Yellow
    if (-not (Test-Path "nasa-gallery-key.pem")) {
        Write-Host "   ❌ Arquivo .pem não encontrado!" -ForegroundColor Red
        exit 1
    }
} else {
    aws ec2 create-key-pair --key-name nasa-gallery-key --query 'KeyMaterial' --output text | Out-File -Encoding ascii -FilePath nasa-gallery-key.pem
    icacls nasa-gallery-key.pem /reset | Out-Null
    icacls nasa-gallery-key.pem /inheritance:r | Out-Null
    icacls nasa-gallery-key.pem /grant:r "$env:USERNAME`:(R)" | Out-Null
    Write-Host "   ✅ Key Pair criada" -ForegroundColor Green
}

# ============================================================
# PARTE 8: CRIAR SECURITY GROUP
# ============================================================

Write-Host "`n[14/20] Criando Security Group..." -ForegroundColor Yellow
aws ec2 create-security-group `
  --group-name nasa-gallery-sg `
  --description "Security group for NASA Gallery" `
  --vpc-id $VPC_ID | Out-Null

$SG_ID = aws ec2 describe-security-groups `
  --filters "Name=group-name,Values=nasa-gallery-sg" `
  --query 'SecurityGroups[0].GroupId' `
  --output text

aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0 2>$null
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 2>$null
Write-Host "   ✅ Security Group: $SG_ID" -ForegroundColor Green

# ============================================================
# PARTE 9: CRIAR EC2
# ============================================================

Write-Host "`n[15/20] Obtendo AMI..." -ForegroundColor Yellow
$AMI_ID = aws ec2 describe-images `
  --owners amazon `
  --filters "Name=name,Values=al2023-ami-2023*" "Name=architecture,Values=x86_64" `
  --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' `
  --output text
Write-Host "   ✅ AMI: $AMI_ID" -ForegroundColor Green

Write-Host "`n[16/20] Criando instância EC2 na Public Subnet 2..." -ForegroundColor Yellow
aws ec2 run-instances `
  --image-id $AMI_ID `
  --instance-type t3.micro `
  --key-name nasa-gallery-key `
  --security-group-ids $SG_ID `
  --subnet-id $PUBLIC_SUBNET_2 `
  --associate-public-ip-address `
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=NASA-Gallery-Web-Server}]' | Out-Null

Start-Sleep -Seconds 3

$INSTANCE_ID = aws ec2 describe-instances `
  --filters "Name=tag:Name,Values=NASA-Gallery-Web-Server" "Name=instance-state-name,Values=pending,running" `
  --query 'Reservations[0].Instances[0].InstanceId' `
  --output text

Write-Host "   ✅ Instância: $INSTANCE_ID" -ForegroundColor Green

Write-Host "`n[17/20] Aguardando instância iniciar..." -ForegroundColor Yellow
aws ec2 wait instance-running --instance-ids $INSTANCE_ID
Write-Host "   ✅ Instância rodando" -ForegroundColor Green

Write-Host "`n[18/20] Aguardando health checks (2-3 minutos)..." -ForegroundColor Yellow
aws ec2 wait instance-status-ok --instance-ids $INSTANCE_ID
Write-Host "   ✅ Health checks OK" -ForegroundColor Green

Write-Host "`n[19/20] Obtendo IP público..." -ForegroundColor Yellow
$PUBLIC_IP = aws ec2 describe-instances `
  --instance-ids $INSTANCE_ID `
  --query 'Reservations[0].Instances[0].PublicIpAddress' `
  --output text
Write-Host "   ✅ IP Público: $PUBLIC_IP" -ForegroundColor Green

# ============================================================
# RESUMO FINAL
# ============================================================

Write-Host @"

╔══════════════════════════════════════════════════════════╗
║          ✅ INFRAESTRUTURA CRIADA COM SUCESSO!          ║
╚══════════════════════════════════════════════════════════╝

📋 RESUMO DA ARQUITETURA:

🏢 VPC: $VPC_ID (10.0.0.0/16)

📍 Availability Zone A (us-west-2a):
   📡 Public Subnet 1:  $PUBLIC_SUBNET_1 (10.0.0.0/24)
   🔒 Private Subnet 1: $PRIVATE_SUBNET_1 (10.0.1.0/24)
   🔄 NAT Gateway:      $NAT_GW_ID

📍 Availability Zone B (us-west-2b):
   📡 Public Subnet 2:  $PUBLIC_SUBNET_2 (10.0.2.0/24) ⭐ WEB SERVER
   🔒 Private Subnet 2: $PRIVATE_SUBNET_2 (10.0.3.0/24)

🗺️ Route Tables:
   Public RT:  $PUBLIC_RT (→ Internet Gateway)
   Private RT: $PRIVATE_RT (→ NAT Gateway)

🖥️ EC2 Instance:
   Instance ID: $INSTANCE_ID
   IP Público:  $PUBLIC_IP

🔌 PRÓXIMOS PASSOS:

1. Conectar via SSH:
   ssh -i nasa-gallery-key.pem ec2-user@$PUBLIC_IP

2. Instalar software:
   sudo yum update -y
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs git

3. Clonar projeto:
   git clone https://github.com/DessimA/NASA_Galery.git
   cd NASA_Galery

4. ⚠️ CRÍTICO - Editar package.json:
   nano package.json
   # Remover ou alterar a linha "homepage"

5. Build e deploy:
   npm install --legacy-peer-deps
   npm run build
   sudo yum install -y nginx
   sudo cp -r build/* /usr/share/nginx/html/
   sudo systemctl start nginx

6. Acessar: http://$PUBLIC_IP

📝 SALVAR VARIÁVEIS:
   Execute este comando para salvar todas as IDs:

   echo "VPC_ID=$VPC_ID" > aws-resources.txt
   echo "IGW_ID=$IGW_ID" >> aws-resources.txt
   echo "NAT_GW_ID=$NAT_GW_ID" >> aws-resources.txt
   echo "PUBLIC_SUBNET_1=$PUBLIC_SUBNET_1" >> aws-resources.txt
   echo "PUBLIC_SUBNET_2=$PUBLIC_SUBNET_2" >> aws-resources.txt
   echo "PRIVATE_SUBNET_1=$PRIVATE_SUBNET_1" >> aws-resources.txt
   echo "PRIVATE_SUBNET_2=$PRIVATE_SUBNET_2" >> aws-resources.txt
   echo "PUBLIC_RT=$PUBLIC_RT" >> aws-resources.txt
   echo "PRIVATE_RT=$PRIVATE_RT" >> aws-resources.txt
   echo "SG_ID=$SG_ID" >> aws-resources.txt
   echo "INSTANCE_ID=$INSTANCE_ID" >> aws-resources.txt
   echo "PUBLIC_IP=$PUBLIC_IP" >> aws-resources.txt
   echo "EIP_ALLOC_ID=$EIP_ALLOC_ID" >> aws-resources.txt

"@ -ForegroundColor Green

Write-Host "`n[20/20] ✅ Script concluído!" -ForegroundColor Green
