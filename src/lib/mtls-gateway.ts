import https from 'https';
import fs from 'fs';

/**
 * mTLS Gateway for secure communication with institutional funders (UN, World Bank, etc.)
 */
export class InstitutionalMTLSGateway {
  private clientCert: string | undefined = undefined;
  private clientKey: string | undefined = undefined;
  private caCert: string | undefined = undefined;

  constructor() {
    // In production, these would be loaded from environment variables or a secure vault
    this.clientCert = process.env.INSTITUTIONAL_CERT;
    this.clientKey = process.env.INSTITUTIONAL_KEY;
    this.caCert = process.env.INSTITUTIONAL_CA;
  }

  /**
   * Performs a secure request to an institutional endpoint using mTLS
   */
  async request(url: string, options: any = {}) {
    if (!this.clientCert || !this.clientKey) {
      console.warn('mTLS certificates not configured. Falling back to standard HTTPS.');
      return fetch(url, options);
    }

    const agent = new https.Agent({
      cert: this.clientCert as string | undefined,
      key: this.clientKey as string | undefined,
      ca: this.caCert as string | undefined,
    });

    // Note: fetch in Node.js (undici) handles agent differently, 
    // but for this skeleton we'll use the standard https approach for compatibility.
    return new Promise((resolve, reject) => {
      const reqOptions = {
        ...options,
        agent,
      };

      const req = https.request(url, reqOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            ok: res.statusCode && res.statusCode < 400,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data),
          });
        });
      });

      req.on('error', reject);
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    });
  }
}

export const institutionalGateway = new InstitutionalMTLSGateway();
