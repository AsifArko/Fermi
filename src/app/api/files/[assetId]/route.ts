import { NextRequest, NextResponse } from 'next/server';

import { projectId, dataset } from '@/sanity/env';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    // Construct the Sanity asset URL - assetId is now the full Sanity document ID
    const assetUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}`;

    // Fetch the file from Sanity
    const response = await fetch(assetUrl);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: 'File not found',
          details: errorText,
          assetUrl,
          assetId,
        },
        { status: 404 }
      );
    }

    // Get the file blob
    const blob = await response.blob();

    // Get filename from URL or use asset ID
    const filename = assetId.includes('.') ? assetId : `${assetId}.pdf`;

    // Return the file with proper headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
