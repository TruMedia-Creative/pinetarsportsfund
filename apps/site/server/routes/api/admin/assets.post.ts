import { AssetSchema } from '~/lib/schemas'
import { createAsset } from '~/server/utils/mockStore'

const createAssetSchema = AssetSchema.pick({
  name: true,
  type: true,
  url: true,
  alt: true,
  tags: true,
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const input = createAssetSchema.parse(body)
    return createAsset(input)
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid asset payload',
        data: (error as { flatten: () => unknown }).flatten(),
      })
    }

    console.error('Error creating asset:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create asset',
    })
  }
})
