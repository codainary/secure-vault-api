import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { VaultService } from './vault.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { OpenVaultDto } from './dto/open-vault.dto';

@Controller('vaults')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Post()
  async create(@Body() dto: CreateVaultDto, @Req() req: any) {
    const userId = req.user.id; // Simulado
    return this.vaultService.createVault(userId, dto);
  }

  @Post(':id/open')
  async open(@Param('id') id: string, @Body() dto: OpenVaultDto) {
    return this.vaultService.openVault(id, dto);
  }
}
