import prisma from '@/lib/prisma';

/**
 * Converts a university name into a URL-safe slug.
 * e.g. "SRM Institute of Science & Technology" → "srm-institute-of-science-technology"
 */
export function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')   // strip special chars (& . , etc.)
        .replace(/\s+/g, '-')            // spaces → hyphens
        .replace(/-+/g, '-')             // collapse consecutive hyphens
        .substring(0, 60);               // max 60 chars
}

/**
 * Validates that a custom slug is properly formatted.
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 60;
}

/**
 * Generates a unique slug from a base slug, appending a numeric suffix if needed.
 * e.g. "srm-institute" → "srm-institute-2" if already taken
 */
export async function generateUniqueSlug(base: string, excludeId?: string): Promise<string> {
    let slug = base;
    let counter = 2;

    while (true) {
        const existing = await prisma.university.findFirst({
            where: {
                slug,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
            select: { id: true },
        });

        if (!existing) return slug;

        slug = `${base}-${counter}`;
        counter++;
    }
}
