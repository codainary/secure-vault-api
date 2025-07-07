import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateVaultDto } from './dto/create-vault.dto';
import { OpenVaultDto } from './dto/open-vault.dto';
import { CryptoService } from '../crypto/crypto.service';
import { generateKeyHash } from './utils/key-hash.util';

@Injectable()
export class VaultService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly cryptoService: CryptoService
  ) {}

  async createVault(userId: string, dto: CreateVaultDto) {
    const contentBuffer = Buffer.from(dto.content, 'utf-8');
    const { cipher, dekWrapped, iv } = await this.cryptoService.encrypt(contentBuffer);

    // Calcula hash como clave de acceso (no se almacena)
    const dekPlain = await this.cryptoService.decrypt(cipher, dekWrapped, iv);
    const keyHash = generateKeyHash(dekPlain);

    const vault = await this.prisma.vault.create({
      data: {
        cipher,
        dekWrapped,
        iv,
        ownerId: userId,
        expiresAt: new Date(dto.expiresAt),
      },
    });

    return { id: vault.id, keyHash }; // Devuelve solo al creador
  }

  async openVault(vaultId: string, dto: OpenVaultDto) {
    const vault = await this.prisma.vault.findUnique({ where: { id: vaultId } });
    if (!vault) throw new UnauthorizedException('Cofre no encontrado');

    // Hash de la clave ingresada
    const userKey = Buffer.from(dto.key, 'utf-8');
    const userHash = generateKeyHash(userKey);

    const decryptedDek = await this.cryptoService.decrypt(
      vault.cipher,
      vault.dekWrapped,
      vault.iv
    );

    const originalHash = generateKeyHash(decryptedDek);
    const isValid = userHash === originalHash;

    // Log de auditoría simulado
    await this.prisma.vaultAccessLog.create({
      data: {
        vaultId,
        ip: dto.ip,
        userAgent: dto.userAgent,
        result: isValid ? 'SUCCESS' : 'FAIL',
      },
    });

    if (!isValid) throw new UnauthorizedException('Clave inválida');

    const content = await this.cryptoService.decrypt(vault.cipher, vault.dekWrapped, vault.iv);
    const masked = content.toString().replace(/./g, '*'); // Enmascarado

    return { maskedContent: masked };
  }
}
