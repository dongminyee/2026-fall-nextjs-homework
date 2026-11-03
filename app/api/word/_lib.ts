import { promises as fs } from 'fs';
import path from 'path';

export type Quote = {
    id: number;
    author: string;
    display_author: string;
    message: string;
    year: number;
    context?: string;
};

export type NewQuotePayload = {
    author: string;
    display_author: string;
    message: string;
    year: number;
    context?: string;
};

export type PartialQuotePayload = Partial<NewQuotePayload>;

export function getDbPath(): string {
    // Resolve to the db.json inside the Next.js project (cwd should be the homework folder)
    return path.join(process.cwd(), 'app', 'api', 'word', 'db.json');
}

export async function readDb(): Promise<Quote[]> {
    const file = getDbPath();
    const content = await fs.readFile(file, 'utf-8');
    return JSON.parse(content) as Quote[];
}

export async function writeDb(data: Quote[]): Promise<void> {
    const file = getDbPath();
    const json = JSON.stringify(data, null, 4);
    await fs.writeFile(file, json, 'utf-8');
}

export function nextId(items: Quote[]): number {
    const max = items.reduce((m, it) => (it.id > m ? it.id : m), 0);
    return max + 1;
}

export function matchesFilter(item: Quote, filters: Partial<{ author: string; display_author: string; message: string; year: number }>): boolean {
    const norm = (s: string) => s.toLowerCase();
    const contains = (hay: string, needle: string) => norm(hay).includes(norm(needle));

    if (filters.author && !contains(item.author ?? '', filters.author)) return false;
    if (filters.display_author && !contains(item.display_author ?? '', filters.display_author)) return false;
    if (filters.message && !contains(item.message ?? '', filters.message)) return false;
    if (typeof filters.year === 'number' && item.year !== filters.year) return false;
    return true;
}
