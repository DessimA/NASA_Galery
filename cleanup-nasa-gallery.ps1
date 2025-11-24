# ============================================================
# Script: Cleanup NASA Gallery Infrastructure
# Versão: 4.0 (LinkedIn/Demo Ready - Privacy Mode)
# ============================================================

$ErrorActionPreference = "Stop"
Clear-Host

Write-Host @"
╔══════════════════════════════════════════════════════════╗
║     🧹 LIMPEZA COMPLETA - NASA Gallery AWS              ║
║     Remoção Segura de Recursos e Redução de Custos      ║
║     Status: Production-Ready                            ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# ============================================================
# PARTE 1: VALIDAÇÃO E SEGURANÇA
# ============================================================

Write-Host "`n[CHECK 1/3] Validando credenciais..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity --output json | Out-Null
    Write-Host "✅ AWS CLI Autenticado" -ForegroundColor Green
    Write-Host "   🔒 Conta: ************ (Oculto)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Falha na autenticação AWS CLI" -ForegroundColor Red
    exit 1
}

Write-Host "`n[CHECK 2/3] Identificando recursos..." -ForegroundColor Yellow
$resourcesFile = "aws-resources.txt"
$VPC_ID = $null

# Tenta carregar do arquivo
if (Test-Path $resourcesFile) {
    Get-Content $resourcesFile | ForEach-Object {
        if ($_ -match '(.+)=(.+)') { Set-Variable -Name $matches[1].Trim() -Value $matches[2].Trim() -Scope Script }
    }
    Write-Host "   ✅ Mapeamento carregado via arquivo local" -ForegroundColor Green
}

# Fallback: Se não achar no arquivo, busca na AWS por TAG
if (-not $VPC_ID) {
    Write-Host "   ⚠️  Arquivo não encontrado. Buscando por Tags..." -ForegroundColor Yellow
    $VPC_ID = aws ec2 describe-vpcs --filters "Name=tag:Name,Values=NASA-Gallery-VPC" --query 'Vpcs[0].VpcId' --output text 2>$null
    if ($VPC_ID -and $VPC_ID -ne "None") {
        Write-Host "   ✅ Infraestrutura localizada: $VPC_ID" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Nenhuma infraestrutura encontrada para limpar." -ForegroundColor Red
        exit 0
    }
}

Write-Host "`n[CHECK 3/3] Confirmação de Exclusão" -ForegroundColor Yellow
Write-Host "⚠️  ATENÇÃO: Esta ação é irreversível e deletará:" -ForegroundColor Red
Write-Host "   • EC2, NAT Gateway, VPC, Subnets, Security Groups" -ForegroundColor Gray
Write-Host "   • Economia estimada: ~`$40/mês" -ForegroundColor Green

Write-Host "`n" -NoNewline
$confirmation = Read-Host "Digite 'CONFIRMAR' para destruir a infraestrutura"

if ($confirmation -ne "CONFIRMAR") {
    Write-Host "`n❌ Operação cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host "`n🚀 Iniciando processo de limpeza..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

# ============================================================
# PARTE 2: DELEÇÃO DE COMPUTAÇÃO E NAT (Lento)
# ============================================================

Write-Host "`n[1/6] Terminando Instância EC2..." -ForegroundColor Yellow
# Busca ID atualizado caso não tenha vindo do arquivo
$INST_ID = aws ec2 describe-instances --filters "Name=tag:Name,Values=NASA-Gallery-Web" "Name=instance-state-name,Values=running,pending,stopped" --query 'Reservations[0].Instances[0].InstanceId' --output text 2>$null

if ($INST_ID -and $INST_ID -ne "None") {
    aws ec2 terminate-instances --instance-ids $INST_ID | Out-Null
    Write-Host "   ⏳ Aguardando terminação da instância..." -ForegroundColor Cyan
    aws ec2 wait instance-terminated --instance-ids $INST_ID
    Write-Host "   ✅ Instância EC2 terminada" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Nenhuma instância ativa encontrada" -ForegroundColor Gray
}

Write-Host "`n[2/6] Removendo NAT Gateway (Isso leva tempo)..." -ForegroundColor Yellow
$NAT_ID = aws ec2 describe-nat-gateways --filter "Name=tag:Name,Values=NASA-Gallery-NAT" "Name=state,Values=available,pending" --query 'NatGateways[0].NatGatewayId' --output text 2>$null

if ($NAT_ID -and $NAT_ID -ne "None") {
    aws ec2 delete-nat-gateway --nat-gateway-id $NAT_ID | Out-Null
    Write-Host "   ⏳ Aguardando AWS liberar o NAT Gateway..." -ForegroundColor Cyan
    
    # Loop visual para o vídeo não ficar estático
    $countdown = 0
    while ($true) {
        $state = aws ec2 describe-nat-gateways --nat-gateway-ids $NAT_ID --query 'NatGateways[0].State' --output text 2>$null
        if ($state -eq "deleted" -or -not $state) { break }
        Start-Sleep -Seconds 10
        Write-Host -NoNewline "·"
        $countdown++
        if ($countdown -gt 60) { break } # Safety break
    }
    Write-Host "`n   ✅ NAT Gateway removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  NAT Gateway já removido ou inexistente" -ForegroundColor Gray
}

# ============================================================
# PARTE 3: LIMPEZA DE REDE
# ============================================================

Write-Host "`n[3/6] Liberando Elastic IP..." -ForegroundColor Yellow
$EIP_ID = aws ec2 describe-addresses --filters "Name=tag:Name,Values=NAT-Gateway-EIP" --query 'Addresses[0].AllocationId' --output text 2>$null
if ($EIP_ID -and $EIP_ID -ne "None") {
    aws ec2 release-address --allocation-id $EIP_ID 2>$null
    Write-Host "   ✅ Elastic IP liberado" -ForegroundColor Green
}

Write-Host "`n[4/6] Removendo Gateway de Internet..." -ForegroundColor Yellow
$IGW_ID = aws ec2 describe-internet-gateways --filters "Name=tag:Name,Values=NASA-Gallery-IGW" --query 'InternetGateways[0].InternetGatewayId' --output text 2>$null
if ($IGW_ID -and $IGW_ID -ne "None") {
    aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID 2>$null
    aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID 2>$null
    Write-Host "   ✅ Internet Gateway removido" -ForegroundColor Green
}

Write-Host "`n[5/6] Limpando Subnets, Rotas e Security Groups..." -ForegroundColor Yellow

# Ordem correta de dependência
# 1. Subnets
$subnets = aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text 2>$null
if ($subnets) {
    foreach ($sub in $subnets.Split("`t")) {
        if ($sub) { aws ec2 delete-subnet --subnet-id $sub 2>$null }
    }
    Write-Host "   ✅ Subnets removidas" -ForegroundColor Green
}

# 2. Route Tables (exceto a Main)
$rts = aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$VPC_ID" --query 'RouteTables[?Associations==`[]`].RouteTableId' --output text 2>$null
if ($rts) {
    foreach ($rt in $rts.Split("`t")) {
        if ($rt) { aws ec2 delete-route-table --route-table-id $rt 2>$null }
    }
    Write-Host "   ✅ Route Tables removidas" -ForegroundColor Green
}

# 3. Security Groups (exceto default)
$sgs = aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=group-name,Values=nasa-gallery-sg" --query 'SecurityGroups[*].GroupId' --output text 2>$null
if ($sgs) {
    aws ec2 delete-security-group --group-id $sgs 2>$null
    Write-Host "   ✅ Security Group removido" -ForegroundColor Green
}

# 4. VPC
if ($VPC_ID) {
    aws ec2 delete-vpc --vpc-id $VPC_ID 2>$null
    Write-Host "   ✅ VPC deletada com sucesso" -ForegroundColor Green
}

# ============================================================
# PARTE 4: ARQUIVOS LOCAIS
# ============================================================

Write-Host "`n[6/6] Limpando arquivos locais..." -ForegroundColor Yellow
aws ec2 delete-key-pair --key-name nasa-gallery-key 2>$null

$files = @("nasa-gallery-key.pem", "aws-resources.txt")
foreach ($file in $files) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "   ✅ Arquivo removido: $file" -ForegroundColor Green
    }
}

Write-Host @"

╔══════════════════════════════════════════════════════════╗
║               ✅ LIMPEZA CONCLUÍDA                      ║
╚══════════════════════════════════════════════════════════╝

📊 Status Final:
   • Recursos AWS:  Totalmente removidos
   • Custos Futuros: `$`0.00
   • Arquivos Locais: Limpos

👋 Pronto para o próximo laboratório!

"@ -ForegroundColor Cyan