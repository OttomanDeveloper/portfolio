import { NextResponse } from 'next/server'
import * as z from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = contactSchema.parse(body)

    // In a real application, you would send an email here using a service like Resend, SendGrid, etc.
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'Portfolio <onboarding@resend.dev>',
    //   to: 'your-email@example.com',
    //   subject: `New contact from ${validated.name}`,
    //   text: validated.message,
    // })

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Valid contact submission:', validated)

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
