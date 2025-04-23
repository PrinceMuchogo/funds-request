import prisma from "@/utils/dbconfig";
import bcrypt from "bcryptjs";

interface Params {
  id: string;
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const id = params.id;

    const data = await req.json()

    const role = data.role;

    const find_user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!find_user) {
      return new Response(JSON.stringify({ message: "User Not Found!" }), {
        status: 404,
      });
    }


    const updated_user = await prisma.user.update({
      where: { id },
      data: {
        role
      },
    });

    if (updated_user) {
      // Return the processed data
      return new Response(
        JSON.stringify({ message: "Account updated successfully" }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ message: "Failed to change profile" }),
      { status: 400 },
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
