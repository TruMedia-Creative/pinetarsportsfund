import { createHmac, timingSafeEqual } from 'crypto'
import type { H3Event } from 'h3'

const AUTH_COOKIE_NAME = 'auth_token'

type RuntimeAuthConfig = {
  jwt?: {
    secret?: string
    expires?: string
  }
  adminAuth?: {
    username?: string
    password?: string
    email?: string
  }
}

type AuthTokenPayload = {
  sub: string
  username: string
  email: string
  iat: number
  exp: number
}

const TOKEN_HEADER = {
  alg: 'HS256',
  typ: 'JWT',
}

const durationToSeconds = (value: string) => {
  const normalized = value.trim().toLowerCase()
  const match = normalized.match(/^(\d+)([smhd])$/)
  if (!match) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid JWT expiration format. Use values like 15m, 12h, or 7d.',
    })
  }

  const amount = Number(match[1])
  const unit = match[2]

  switch (unit) {
    case 's':
      return amount
    case 'm':
      return amount * 60
    case 'h':
      return amount * 60 * 60
    case 'd':
      return amount * 60 * 60 * 24
    default:
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid JWT expiration unit. Use s, m, h, or d.',
      })
  }
}

const encodeBase64Url = (value: string) => Buffer.from(value).toString('base64url')
const decodeBase64Url = (value: string) => Buffer.from(value, 'base64url').toString('utf8')

const getSignature = (input: string, secret: string) => {
  return createHmac('sha256', secret).update(input).digest('base64url')
}

const secureCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export const getServerAuthConfig = (event: H3Event) => {
  const config = useRuntimeConfig(event) as RuntimeAuthConfig
  const jwtSecret = config.jwt?.secret?.trim()
  const jwtExpires = config.jwt?.expires?.trim() || '7d'
  const adminUsername = config.adminAuth?.username?.trim()
  const adminPassword = config.adminAuth?.password?.trim()
  const adminEmail = config.adminAuth?.email?.trim() || 'admin@pinetarsportsfund.com'

  if (!jwtSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server authentication is not configured. Missing JWT_SECRET.',
    })
  }

  if (!adminUsername || !adminPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server authentication is not configured. Missing ADMIN_USERNAME or ADMIN_PASSWORD.',
    })
  }

  return {
    jwtSecret,
    jwtExpires,
    adminUsername,
    adminPassword,
    adminEmail,
  }
}

export const isValidAdminCredentials = (username: string, password: string, event: H3Event) => {
  const { adminUsername, adminPassword } = getServerAuthConfig(event)
  return secureCompare(username, adminUsername) && secureCompare(password, adminPassword)
}

export const createAuthToken = (event: H3Event, user: { username: string; email: string }) => {
  const { jwtSecret, jwtExpires } = getServerAuthConfig(event)
  const nowSeconds = Math.floor(Date.now() / 1000)
  const expSeconds = nowSeconds + durationToSeconds(jwtExpires)

  const payload: AuthTokenPayload = {
    sub: 'admin',
    username: user.username,
    email: user.email,
    iat: nowSeconds,
    exp: expSeconds,
  }

  const encodedHeader = encodeBase64Url(JSON.stringify(TOKEN_HEADER))
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const signature = getSignature(signingInput, jwtSecret)

  return {
    token: `${signingInput}.${signature}`,
    maxAge: expSeconds - nowSeconds,
  }
}

export const verifyAuthToken = (token: string, event: H3Event) => {
  const { jwtSecret } = getServerAuthConfig(event)
  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  const encodedHeader = parts[0]
  const encodedPayload = parts[1]
  const providedSignature = parts[2]
  if (!encodedHeader || !encodedPayload || !providedSignature) {
    return null
  }
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const expectedSignature = getSignature(signingInput, jwtSecret)

  if (!secureCompare(providedSignature, expectedSignature)) {
    return null
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AuthTokenPayload
    const nowSeconds = Math.floor(Date.now() / 1000)
    if (!payload.exp || payload.exp <= nowSeconds) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export const getVerifiedAdminUser = (event: H3Event) => {
  const token = getCookie(event, AUTH_COOKIE_NAME)
  if (!token) {
    return null
  }

  return verifyAuthToken(token, event)
}

export const requireVerifiedAdminUser = (event: H3Event) => {
  const user = getVerifiedAdminUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    })
  }

  return user
}

export const clearAuthCookie = (event: H3Event) => {
  deleteCookie(event, AUTH_COOKIE_NAME, {
    path: '/',
  })
}

export const setAuthCookie = (event: H3Event, token: string, maxAge: number) => {
  setCookie(event, AUTH_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
  })
}