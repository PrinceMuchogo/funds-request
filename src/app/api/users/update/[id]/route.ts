import prisma from "@/utils/dbconfig";
import bcrypt from "bcryptjs";

interface Params {
  id: string;
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const id = params.id;

    const formData = await req.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const oldPassword = formData.get("oldPassword") as string;

    const hashedPassword = await bcrypt.hash(password, 10);

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

    if (oldPassword.length > 0) {
      const isValidPassword = await bcrypt.compare(
        oldPassword,
        find_user.password!,
      );

      if (!isValidPassword) {
        return new Response(
          JSON.stringify({ message: "Invalid old password" }),
          { status: 400 },
        );
      }
    }

    const updated_user = await prisma.user.update({
      where: { id },
      data: {
        name: username || find_user.name,
        email: email || find_user.email,
        password: hashedPassword || find_user.password,
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
