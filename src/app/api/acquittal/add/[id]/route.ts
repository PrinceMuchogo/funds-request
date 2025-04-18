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
      acquittalStatus: "PENDING CHECKER",
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

    await Promise.all(
      data.newTravelExpenses.map(async (travelExpense: any) => {
        const newTravelExpense = await prisma.travellingAndSubsistence.create({
          data: {
            day: String(travelExpense.day),
            fromPlace: travelExpense.fromPlace,
            toPlace: travelExpense.toPlace,
            dateDeparture: new Date(travelExpense.dateDeparture).toISOString(),
            dateArrived: new Date(travelExpense.dateArrived).toISOString(),
            board: travelExpense.board,
            breakfast: travelExpense.breakfast,
            lunch: travelExpense.lunch,
            dinner: travelExpense.dinner,
            fares: travelExpense.fares,
            supper: travelExpense.supper,
            total: travelExpense.total,
            claimId: id,
          },
        });
      }),
    );

    await Promise.all(
      data.newExpertAllowances.map(async (expertAllowance: any) => {
        const newExpertAllowances =
          await prisma.expertAndAdministrationAllowance.create({
            data: {
              day: String(expertAllowance.day),
              designation: expertAllowance.designation,
              activity: expertAllowance.activity,
              allowance: Number(expertAllowance.allowance),
              units: expertAllowance.units,
              rate: expertAllowance.rate,
              total: expertAllowance.total,
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
