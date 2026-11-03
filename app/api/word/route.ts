import { NextRequest, NextResponse } from 'next/server';
import { NewQuotePayload, readDb, writeDb, nextId, Quote } from './_lib';

export async function GET() {
    try {
        const data = await readDb();
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = (await req.json()) as NewQuotePayload;

        // Basic validation
        if (!payload || !payload.author || !payload.display_author || !payload.message || typeof payload.year !== 'number') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const db = await readDb();
        const id = nextId(db);
        const item: Quote = { id, ...payload };
        db.push(item);
        await writeDb(db);

        return NextResponse.json({ id }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: `Failed to create quote : ${err}` }, { status: 500 });
    }
}
