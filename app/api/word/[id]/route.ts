import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Quote, PartialQuotePayload, NewQuotePayload } from '../_lib';

type RouteContext = {
    params: Promise<{ id: string }>;
};

function parseId(param: string | string[] | undefined): number | null {
    if (!param) return null;
    const s = Array.isArray(param) ? param[0] : param;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

export async function GET(_: NextRequest, { params }: RouteContext) {
    try {
        const id = parseId((await params)?.id);
        if (id == null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        const db = await readDb();
        const found = db.find((q) => q.id === id);
        if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(found, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: `Failed to read item : ${err}` }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const id = parseId((await params)?.id);
        if (id == null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        const patch = (await req.json()) as PartialQuotePayload;
        const db = await readDb();
        const idx = db.findIndex((q) => q.id === id);
        if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const updated: Quote = { ...db[idx], ...patch, id };
        db[idx] = updated;
        await writeDb(db);
        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: `Failed to update item : ${err}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
    // For PUT we require a full resource shape (except id)
    try {
        const id = parseId(ctx.params?.id);
        if (id == null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        const body = (await req.json()) as NewQuotePayload;
        if (!body || !body.author || !body.display_author || !body.message || typeof body.year !== 'number') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }
        const db = await readDb();
        const idx = db.findIndex((q) => q.id === id);
        const updated: Quote = { id, ...body };
        if (idx === -1) {
            db.push(updated);
        } else {
            db[idx] = updated;
        }
        await writeDb(db);
        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: `Failed to upsert item : ${err}` }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
    try {
        const id = parseId((await params)?.id);
        if (id == null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        const db = await readDb();
        const idx = db.findIndex((q) => q.id === id);
        if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        db.splice(idx, 1);
        await writeDb(db);
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: `Failed to delete item : ${err}` }, { status: 500 });
    }
}
