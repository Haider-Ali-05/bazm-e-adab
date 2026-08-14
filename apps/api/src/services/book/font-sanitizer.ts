import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface FontSanitizationResult {
    success: boolean;
    error?: string;
    fontFamily?: string;
    safePath?: string;
}

export class FontSanitizer {
    private static readonly ALLOWED_MIME_TYPES = [
        'font/ttf',
        'font/otf',
        'font/woff',
        'font/woff2',
        'application/x-font-ttf',
        'application/x-font-opentype'
    ];

    private static readonly MAGIC_BYTES = {
        'TTF': [0x00, 0x01, 0x00, 0x00],
        'OTF': [0x4F, 0x54, 0x54, 0x4F], // 'OTTO'
        'WOFF': [0x77, 0x4F, 0x46, 0x46], // 'wOFF'
        'WOFF2': [0x77, 0x4F, 0x46, 0x32] // 'wOF2'
    };

    /**
     * Sanitizes an uploaded font file.
     * Simulates the OTS (OpenType Sanitizer) process.
     */
    public static async sanitize(filePath: string, originalName: string, mimeType: string, destinationDir: string): Promise<FontSanitizationResult> {
        try {
            // 1. Check MIME type (superficial check)
            if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
                return { success: false, error: 'Invalid font MIME type.' };
            }

            // 2. Check Magic Bytes
            const buffer = Buffer.alloc(4);
            const fd = await fs.promises.open(filePath, 'r');
            await fd.read(buffer, 0, 4, 0);
            await fd.close();

            let isValidMagic = false;
            for (const [, signature] of Object.entries(this.MAGIC_BYTES)) {
                if (buffer.equals(Buffer.from(signature))) {
                    isValidMagic = true;
                    break;
                }
            }

            if (!isValidMagic) {
                return { success: false, error: 'Invalid font file signature.' };
            }

            // 3. Simulate OTS processing (OpenType Sanitizer)
            // In a real scenario, we would spawn a child process to run `ots-sanitize`
            const isOtsSimulatedSuccess = this.simulateOts(buffer);
            if (!isOtsSimulatedSuccess) {
                return { success: false, error: 'Font failed security sanitization (OTS).' };
            }

            // 4. Securely store the file
            const ext = path.extname(originalName).toLowerCase();
            const safeName = crypto.randomBytes(16).toString('hex') + ext;
            const safePath = path.join(destinationDir, safeName);
            
            await fs.promises.mkdir(destinationDir, { recursive: true });
            await fs.promises.copyFile(filePath, safePath);

            return {
                success: true,
                fontFamily: path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, ''),
                safePath
            };

        } catch (error: any) {
            return { success: false, error: `Sanitization error: ${error.message}` };
        }
    }

    private static simulateOts(buffer: Buffer): boolean {
        // Just a dummy simulation, assuming 99% of valid magic byte files pass
        return true;
    }
}
