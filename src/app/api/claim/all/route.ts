import prisma from "@/utils/dbconfig";

export async function GET(req: Request) {
  try {
    const claims = await prisma.claimForm.findMany({
      include: {
        expertAndAdministrationAllowances: true,
        travellingAndSubsistence: true,
        user: true,
        checker: true
      },
    });

    return new Response(JSON.stringify(claims), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Servor Error" }), {
      status: 500,
    });
  }
}
