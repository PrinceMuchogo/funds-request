import { UploadClient } from '@uploadcare/upload-client';

const client = new UploadClient({ publicKey: process.env.UPLOADCARE_PUBLIC_KEY! });

export const uploadPDFToUploadcare = async (buffer: Buffer): Promise<string> => {
  const fileName = `claim_${Date.now()}.pdf`;

  const result = await client.uploadFile(buffer, {
    fileName,
    contentType: 'application/pdf',
    store: true, // Save permanently
  });

  if (!result?.cdnUrl) {
    throw new Error('Upload failed: no cdnUrl returned.');
  }

  console.log('Uploaded PDF to Uploadcare:', result.cdnUrl);
  return result.cdnUrl;
};
