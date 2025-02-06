import { NextResponse, NextRequest } from "next/server"
import { client } from "@/lib/sanity"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const result = await client.patch(params.id).set(body).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating promo code:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await client.delete(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting promo code:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

