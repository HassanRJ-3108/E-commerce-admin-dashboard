import { NextResponse } from "next/server"
import { client } from "@/lib/sanity"

export async function GET() {
  try {
    const promoCodes = await client.fetch('*[_type == "promoCode"]')
    return NextResponse.json(promoCodes)
  } catch (error) {
    console.error("Error fetching promo codes:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await client.create({
      _type: "promoCode",
      ...body,
      isActive: true,
      usageCount: 0,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating promo code:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

