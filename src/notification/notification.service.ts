import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NotificationService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      dkim: {
        domainName: 'securevault.com',
        keySelector: 'default',
        privateKey: process.env.DKIM_KEY?.replace(/\\n/g, '\n'),
      },
    });
  }

  async sendVaultLink(to: string, vaultId: string) {
    const templatePath = path.join(__dirname, 'templates', 'vault-link.hbs');
    const source = fs.readFileSync(templatePath, 'utf-8');
    const compiled = hbs.compile(source);

    const html = compiled({
      link: `${process.env.FRONTEND_URL}/vault/${vaultId}`,
    });

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Has recibido un cofre seguro',
        html,
      });
    } catch (err) {
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }
}
