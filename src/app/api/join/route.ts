import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      console.warn("GOOGLE_SCRIPT_URL is not set. Simulating success for local development.");
      return NextResponse.json({ message: "Simulated success" }, { status: 200 });
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Google Script Error:", errText);
      throw new Error(`Google Script responded with status: ${response.status}`);
    }

    const resultText = await response.text();
    console.log("Google Script Success Response:", resultText);

    return NextResponse.json(
      { message: "Pendaftaran berhasil dikirim ke Spreadsheet!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Join form error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan data." },
      { status: 500 }
    );
  }
}
