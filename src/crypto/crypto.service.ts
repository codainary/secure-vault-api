import { Injectable } from '@nestjs/common';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

@Injectable()
export class CryptoService {
  private readonly kms = new KMSClient({ region: process.env.AWS_REGION });

  async encrypt(plain: Buffer) {
    // 1. Genera clave de datos (DEK)
    const dek = randomBytes(32); // AES-256 = 32 bytes
    const iv = randomBytes(12);  // IV recomendado para GCM

    // 2. Cifrado con AES-256-GCM
    const cipher = createCipheriv('aes-256-gcm', dek, iv);
    const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
    const tag = cipher.getAuthTag();

    // 3. Envuelve DEK con AWS KMS (KEK)
    const { CiphertextBlob } = await this.kms.send(new EncryptCommand({
      KeyId: process.env.KMS_KEY_ID,
      Plaintext: dek,
    }));

    return {
      cipher: Buffer.concat([ciphertext, tag]),
      dekWrapped: CiphertextBlob as Buffer,
      iv,
    };
  }

  async decrypt(cipher: Buffer, dekWrapped: Buffer, iv: Buffer) {
    // 1. Desencripta la DEK con KMS
    const { Plaintext } = await this.kms.send(new DecryptCommand({
      CiphertextBlob: dekWrapped,
    }));
    const dek = Plaintext as Buffer;

    // 2. Separa el tag del mensaje
    const tag = cipher.slice(cipher.length - 16);
    const content = cipher.slice(0, cipher.length - 16);

    // 3. Desencripta con AES-256-GCM
    const decipher = createDecipheriv('aes-256-gcm', dek, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(content), decipher.final()]);
  }
}
