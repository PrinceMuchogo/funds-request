import prisma from "@/utils/dbconfig";

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
    });

    return new Response(JSON.stringify(users), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Servor Error" }), {
      status: 500,
    });
  }
}
