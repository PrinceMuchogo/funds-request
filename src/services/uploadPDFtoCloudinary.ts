import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload a PDF buffer to Cloudinary as a raw resource with enforced .pdf extension.
 * @param buffer - The PDF file as a Node.js Buffer.
 * @returns The secure URL of the uploaded file.
 */

export const uploadPDFToCloudinary = async (
  buffer: Buffer,
): Promise<string> => {
  const bufferSize = buffer.length;

  const uploadResult = await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "pdf_uploads",
        public_id: `claim_${Date.now()}.pdf`,
        type: "upload", // 👈 ensures the file is public (default is "upload", but set it explicitly)
        access_mode: "public", // 👈 ensures it's not protected (Cloudinary recently added access modes)
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("No secure_url returned from Cloudinary."));
        }
      },
    );

    let uploadedBytes = 0;

    uploadStream.on("data", (chunk) => {
      uploadedBytes += chunk.length;
      const progress = (uploadedBytes / bufferSize) * 100;
      console.log(`Upload progress: ${progress.toFixed(2)}%`);
    });

    uploadStream.on("finish", () => {
      console.log("Upload finished.");
    });

    uploadStream.end(buffer);
  });

  return uploadResult;
};
