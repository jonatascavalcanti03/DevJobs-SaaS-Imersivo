import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parâmetros da vaga
    const title = searchParams.get('title') || 'Vaga de Programação';
    const company = searchParams.get('company') || 'Match.js';
    const location = searchParams.get('location') || 'Brasil';
    const salary = searchParams.get('salary') || 'A combinar';
    const type = searchParams.get('type') || 'Remoto';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0F172A',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #6366F122 0%, transparent 50%), radial-gradient(circle at 75% 75%, #06B6D422 0%, transparent 50%)',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(to bottom right, #6366F1, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div style={{ display: 'flex', fontSize: '48px', fontWeight: 'bold' }}>
              <span style={{ color: '#F8FAFC' }}>Match</span>
              <span style={{ color: '#06B6D4' }}>.js</span>
            </div>
          </div>

          {/* Vaga Info */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ fontSize: '72px', fontWeight: '800', color: 'white', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              {title}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '32px', color: '#94A3B8', marginBottom: '40px' }}>
              <span style={{ color: '#FBBF24', marginRight: '15px' }}>{company}</span>
              <span style={{ marginRight: '15px' }}>•</span>
              <span>{location}</span>
              <span style={{ marginLeft: '15px', padding: '6px 16px', borderRadius: '12px', backgroundColor: '#334155', color: '#F8FAFC', fontSize: '24px' }}>
                {type}
              </span>
            </div>

            {/* Footer with Salary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#10B981', fontSize: '40px', fontWeight: 'bold' }}>
                {salary}
              </div>
              <div style={{ fontSize: '24px', color: '#64748B' }}>
                vagas.matchjs.com.br
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
