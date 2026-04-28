import { NextRequest, NextResponse } from 'next/server';
import { getUniversityBySlug } from '@/lib/data/universities';

/**
 * GET /s/[slug]
 * Branded short URL redirect — 301 permanent redirect to the public school preview page.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const university = await getUniversityBySlug(slug);

    if (!university) {
        return new NextResponse(
            `<html><body><h1>School not found</h1><p>The short URL <strong>/s/${slug}</strong> does not match any published institution.</p><a href="/">Go home</a></body></html>`,
            { status: 404, headers: { 'Content-Type': 'text/html' } }
        );
    }

    // 301 permanent redirect so browsers and search engines cache this
    return NextResponse.redirect(
        new URL(`/schools/${university.id}`, _request.url),
        { status: 301 }
    );
}
