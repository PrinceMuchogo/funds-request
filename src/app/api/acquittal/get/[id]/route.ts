import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const id = params.id;
    const claims = await prisma.claimForm.findMany({
      where: {
        userId: id,
        acquittalStatus: {
          not: null,
          notIn: ["NOT SET", ""],

        },
      },
      include: {
        expertAndAdministrationAllowances: true,
        travellingAndSubsistence: true,
        user: true,
      },
    });

    return new Response(JSON.stringify(claims), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Servor Error" }), {
      status: 500,
    });
  }
}
