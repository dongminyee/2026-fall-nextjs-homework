import { NextRequest, NextResponse } from 'next/server';
import { matchesFilter, readDb } from '../_lib';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filters = {
            author: searchParams.get('author') ?? undefined,
            display_author: searchParams.get('display_author') ?? undefined,
            message: searchParams.get('message') ?? undefined,
            year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
        } as const;

        const db = await readDb();
        const results = db.filter((q) => matchesFilter(q, filters));
        return NextResponse.json(results, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
    }
}
