import { uploadPDFToCloudinary } from "@/services/uploadPDFtoCloudinary";
import { uploadPDFToUploadcare } from "@/services/uploadPDFtoCloudcare";
import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const formData = await req.formData();
    const rawData = formData.get("data") as string;

    const data = JSON.parse(rawData);
    const supportingDocuments = formData.getAll(
      "supportingDocuments",
    ) as File[];

    const uploadedUrls: string[] = [];

    const claimData = {
      acquittalStatus: "PENDING",
      acquittedAmount: data.acquittedAmount,
      refundAmount: data.refundAmount,
      extraClaimAmount: data.extraClaimAmount,
    };
    const id = params.id;

    const find_claim = await prisma.claimForm.findUnique({
      where: {
        id,
      },
    });

    if (!find_claim) {
      return new Response(JSON.stringify({ message: "Acquittal Not Found!" }), {
        status: 404,
      });
    }

    const updated_claim = await prisma.claimForm.update({
      where: { id },
      data: claimData,
    });

    for (const file of supportingDocuments) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadPDFToUploadcare(buffer);
      uploadedUrls.push(url);
    }
    console.log("claim data: ", data);
    console.log("supporting documents: ", uploadedUrls);

    await Promise.all(
      uploadedUrls.map(async (documentUrl: string) => {
        const new_supportingDocument = await prisma.supportingDocument.create({
          data: {
            url: documentUrl,
            claimId: id,
          },
        });
      }),
    );

    if (updated_claim) {
      // Return the processed data
      return new Response(
        JSON.stringify({ message: "Acquittal updated successfully" }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ message: "Failed to update Acquittal" }),
      {
        status: 400,
      },
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
