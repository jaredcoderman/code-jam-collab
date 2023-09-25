import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.get("search")
  try {
    if(!searchParams) throw new Error("Bad query")
    const projects = await prisma.project.findMany({
      where: {
        name: {
          contains: searchParams,
        }
      }
    })
    return NextResponse.json({ projects }, { status: 201 });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const { name, description } = body;

  if (!session) {
    return NextResponse.redirect("/api/auth/signin");
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: name,
        description: description,
        owner: { connect: { email: session?.user?.email as string } },
      },
    });

    return NextResponse.json({ id: project.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
