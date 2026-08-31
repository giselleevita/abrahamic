import { ImageResponse } from 'next/og'

export const alt = 'Abrahamic Texts — public engineering demo for cross-tradition scripture comparison'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(145deg, #1a1613 0%, #231d19 45%, #0a3666 100%)',
          color: '#f1ede7',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '72px', height: '8px', borderRadius: '999px', background: '#3366ff' }} />
          <div style={{ width: '72px', height: '8px', borderRadius: '999px', background: '#8b2942' }} />
          <div style={{ width: '72px', height: '8px', borderRadius: '999px', background: '#0d7a55' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '920px' }}>
          <div
            style={{
              fontSize: '22px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#d4cfc5',
            }}
          >
            Public engineering demo
          </div>
          <div style={{ fontSize: '72px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Abrahamic Texts
          </div>
          <div style={{ fontSize: '30px', lineHeight: 1.35, color: '#e3ddd3' }}>
            Cross-tradition scripture comparison — editorial workflows, search, and side-by-side reading.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '22px', color: '#a89d91', maxWidth: '760px', lineHeight: 1.4 }}>
            License-free demo · original Hebrew & Arabic · project-authored reader notes
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f8f6f3' }}>abrahamic.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
