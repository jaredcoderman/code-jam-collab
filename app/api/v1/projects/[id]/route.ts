import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function DELETE(request: Request, { params }) {
  const { id } = params
  try {
    await prisma.project.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ id: id }, { status: 201 })
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }) {
  const { id } = params
  const { name, description } = await request.json()
  try {
    await prisma.project.update({
      where: {
        id: id
      },
      data: {
        name: name,
        description: description
      }
    })

    return NextResponse.json({ id: id }, { status: 201 })
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
