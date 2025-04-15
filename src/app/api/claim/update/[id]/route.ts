import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const data = await req.json();

    const claimData = {
      status: data.status,
      comment: data.comment,
      userId: data.userId,
    };
    const id = params.id;

    const find_claim = await prisma.claimForm.findUnique({
      where: {
        id,
      },
    });

    if (!find_claim) {
      return new Response(JSON.stringify({ message: "Claim Not Found!" }), {
        status: 404,
      });
    }

    const updated_claim = await prisma.claimForm.update({
      where: { id },
      data: claimData,
    });

    if (updated_claim) {
      // Return the processed data
      return new Response(
        JSON.stringify({ message: "Claim updated successfully" }),
        { status: 200 },
      );
    }

    return new Response(JSON.stringify({ message: "Failed to update claim" }), {
      status: 400,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
