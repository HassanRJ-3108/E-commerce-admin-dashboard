import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"

export async function POST(req: Request) {
  try {
    const order = await req.json()

    const result = await client.createOrReplace({
      _type: "order",
      _id: order._id,
      ...order,
    })

    return NextResponse.json({ success: true, order: result })
  } catch (error) {
    console.error("Failed to update order:", error)
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}

