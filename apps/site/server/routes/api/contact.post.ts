export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Basic validation
    if (!body.email || !body.name || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      })
    }

    // TODO: Send email using email service (SMTP)
    // For now, just log it
    console.log('Contact form submission:', body)

    return { success: true, message: 'Message received' }
  } catch (error) {
    console.error('Error processing contact form:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process contact form',
    })
  }
})
