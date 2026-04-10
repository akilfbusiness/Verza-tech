import { NextRequest, NextResponse } from 'next/server'

/**
 * Newsletter subscription endpoint.
 *
 * Currently logs the subscription — ready to wire to any email provider:
 *   - Resend:     POST https://api.resend.com/audiences/{id}/contacts
 *   - Mailchimp:  POST https://us1.api.mailchimp.com/3.0/lists/{id}/members
 *   - ConvertKit: POST https://api.convertkit.com/v3/forms/{id}/subscribe
 *   - Brevo:      POST https://api.brevo.com/v3/contacts
 *
 * Set the relevant env vars and swap in the provider block below.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, source } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Valid email is required.' }, { status: 400 })
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 })
    }

    const sanitisedEmail  = email.toLowerCase().trim()
    const sanitisedSource = typeof source === 'string' ? source.slice(0, 100) : 'unknown'

    // ── Provider integration (uncomment and configure one) ──────────────────

    // Option A: Resend Audiences
    // const RESEND_API_KEY     = process.env.RESEND_API_KEY
    // const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID
    // if (RESEND_API_KEY && RESEND_AUDIENCE_ID) {
    //   await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
    //     method: 'POST',
    //     headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: sanitisedEmail, unsubscribed: false }),
    //   })
    // }

    // Option B: Mailchimp
    // const MC_API_KEY  = process.env.MAILCHIMP_API_KEY   // e.g. "abc123-us1"
    // const MC_LIST_ID  = process.env.MAILCHIMP_LIST_ID
    // const MC_SERVER   = MC_API_KEY?.split('-')[1]       // e.g. "us1"
    // if (MC_API_KEY && MC_LIST_ID && MC_SERVER) {
    //   await fetch(`https://${MC_SERVER}.api.mailchimp.com/3.0/lists/${MC_LIST_ID}/members`, {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Basic ${Buffer.from(`anystring:${MC_API_KEY}`).toString('base64')}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email_address: sanitisedEmail, status: 'subscribed' }),
    //   })
    // }

    // ── Fallback: log (remove once provider is configured) ─────────────────
    if (process.env.NODE_ENV === 'development') {
      console.log(`[newsletter] New subscriber: ${sanitisedEmail} via ${sanitisedSource}`)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
