import { z } from 'zod'

const contactSubmissionSchema = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(1).max(120),
  message: z.string().trim().min(10).max(5000),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const submission = contactSubmissionSchema.parse(body)
    const emailDomain = submission.email.split('@')[1] || 'unknown'

    // TODO: Send email using email service (SMTP)
    console.info('Contact form submission received', {
      emailDomain,
      nameLength: submission.name.length,
      messageLength: submission.message.length,
    })

    return { success: true, message: 'Message received' }
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid contact payload',
        data: (error as { flatten: () => unknown }).flatten(),
      })
    }

    console.error('Error processing contact form:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process contact form',
    })
  }
})
