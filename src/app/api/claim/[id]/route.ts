import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const id = params.id;
    const claim = await prisma.claimForm.findUnique({
      where: {
        id,
      },
      include: {
        expertAndAdministrationAllowances: true,
        travellingAndSubsistence: true,
        user: true,
        checker: true
      },
    });

    return new Response(JSON.stringify(claim), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Servor Error" }), {
      status: 500,
    });
  }
}
