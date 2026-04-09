import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'Verza'
    const subtitle = searchParams.get('subtitle') || 'SaaS & AI Tool Reviews'
    const rating = searchParams.get('rating')
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#000',
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(167, 139, 250, 0.15) 0%, transparent 50%)',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '24px',
                maxWidth: '90%',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#a1a1aa',
                lineHeight: 1.4,
                maxWidth: '80%',
              }}
            >
              {subtitle}
            </p>
            {rating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '40px',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '64px',
                    fontWeight: 'bold',
                    color: '#6366f1',
                  }}
                >
                  {rating}
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    color: '#a1a1aa',
                  }}
                >
                  / 5
                </div>
              </div>
            )}
          </div>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              Verza
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#6366f1',
              }}
            >
              •
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#a1a1aa',
              }}
            >
              Expert Tool Reviews
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
    console.error('[v0] OG image generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
