import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const TYPE_LABELS: Record<string, string> = {
  review:     'Review',
  comparison: 'Comparison',
  'best-of':  'Best Of',
  tutorial:   'Tutorial',
  news:       'News',
  opinion:    'Opinion',
  category:   'Category',
}

// Brand colours
const BRAND_BLACK  = '#0a0a0a'
const BRAND_WHITE  = '#fafafa'
const BRAND_PRIMARY = '#2563eb'   // blue-600 — adjust to match your actual primary
const BRAND_MUTED  = '#71717a'
const BRAND_BORDER = '#27272a'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const title    = searchParams.get('title')    || 'Verza'
    const type     = searchParams.get('type')     || ''
    const category = searchParams.get('category') || ''
    const author   = searchParams.get('author')   || ''
    const rating   = searchParams.get('rating')   || ''

    // Truncate title so it never overflows
    const displayTitle = title.length > 80 ? title.slice(0, 77) + '…' : title

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: BRAND_BLACK,
            padding: '0',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Top accent bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: BRAND_PRIMARY, display: 'flex' }} />

          {/* Main content area */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '64px 80px 56px',
            }}
          >
            {/* Top row: type badge + category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {type && TYPE_LABELS[type] && (
                <div
                  style={{
                    display: 'flex',
                    padding: '6px 18px',
                    borderRadius: '100px',
                    backgroundColor: BRAND_PRIMARY,
                    color: BRAND_WHITE,
                    fontSize: '22px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  {TYPE_LABELS[type]}
                </div>
              )}
              {category && (
                <div
                  style={{
                    display: 'flex',
                    padding: '6px 18px',
                    borderRadius: '100px',
                    border: `2px solid ${BRAND_BORDER}`,
                    color: BRAND_MUTED,
                    fontSize: '22px',
                    fontWeight: 500,
                  }}
                >
                  {category}
                </div>
              )}
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flex: 1,
                marginTop: '32px',
                marginBottom: '32px',
              }}
            >
              <h1
                style={{
                  fontSize: displayTitle.length > 50 ? '60px' : '72px',
                  fontWeight: 800,
                  color: BRAND_WHITE,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  maxWidth: rating ? '780px' : '100%',
                  margin: 0,
                }}
              >
                {displayTitle}
              </h1>

              {/* Rating badge */}
              {rating && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    width: '200px',
                    height: '200px',
                    borderRadius: '24px',
                    border: `3px solid ${BRAND_PRIMARY}`,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', fontSize: '72px', fontWeight: 800, color: BRAND_PRIMARY, lineHeight: 1 }}>
                    {rating}
                  </div>
                  <div style={{ display: 'flex', fontSize: '24px', color: BRAND_MUTED, marginTop: '4px' }}>
                    out of 5
                  </div>
                </div>
              )}
            </div>

            {/* Bottom row: Verza brand + author */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '24px',
                borderTop: `1px solid ${BRAND_BORDER}`,
              }}
            >
              {/* Logo wordmark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: BRAND_PRIMARY,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: 900,
                    color: BRAND_WHITE,
                  }}
                >
                  V
                </div>
                <div style={{ display: 'flex', fontSize: '30px', fontWeight: 800, color: BRAND_WHITE }}>
                  Verza
                </div>
                <div style={{ display: 'flex', fontSize: '22px', color: BRAND_MUTED, marginLeft: '4px' }}>
                  · Expert Tool Reviews
                </div>
              </div>

              {/* Author */}
              {author && (
                <div style={{ display: 'flex', fontSize: '22px', color: BRAND_MUTED }}>
                  By {author}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 })
  }
}
