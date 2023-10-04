import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const { data } = await req.json();
    await kv.set("state", JSON.stringify(data));
    const value = await kv.get("state");
    console.log("Value set successfully : ", data);

    return NextResponse.json({ data: value }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500, message: "Internal Server Error" });
  }
}

export async function GET(req) {
  try {
    const value = await kv.get("state");
    console.log("sended")
    return NextResponse.json({ data: value }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500, message: "Internal Server Error" });
  }
}
