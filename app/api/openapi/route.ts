import { NextResponse } from 'next/server';

export async function GET() {
    const spec = {
        openapi: '3.0.3',
        info: {
            title: 'Word API',
            version: '1.0.0',
            description: 'CRUD and search over quotes stored in db.json',
        },
        paths: {
            '/api/word': {
                get: {
                    summary: 'List all quotes',
                    responses: {
                        '200': {
                            description: 'OK',
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/Quote' } },
                                },
                            },
                        },
                    },
                },
                post: {
                    summary: 'Create a quote',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/NewQuotePayload' } },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Created',
                            content: {
                                'application/json': { schema: { $ref: '#/components/schemas/IdResponse' } },
                            },
                        },
                        '400': { description: 'Invalid payload' },
                    },
                },
            },
            '/api/word/{id}': {
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
                ],
                get: {
                    summary: 'Get a quote by id',
                    responses: {
                        '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Quote' } } } },
                        '404': { description: 'Not found' },
                    },
                },
                patch: {
                    summary: 'Patch update a quote',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/PartialQuotePayload' } },
                        },
                    },
                    responses: {
                        '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Quote' } } } },
                        '404': { description: 'Not found' },
                    },
                },
                put: {
                    summary: 'Replace or upsert a quote',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/NewQuotePayload' } },
                        },
                    },
                    responses: {
                        '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Quote' } } } },
                    },
                },
                delete: {
                    summary: 'Delete a quote',
                    responses: {
                        '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/OkResponse' } } } },
                        '404': { description: 'Not found' },
                    },
                },
            },
            '/api/word/search': {
                get: {
                    summary: 'Search quotes by filters',
                    parameters: [
                        { name: 'author', in: 'query', required: false, schema: { type: 'string' } },
                        { name: 'display_author', in: 'query', required: false, schema: { type: 'string' } },
                        { name: 'message', in: 'query', required: false, schema: { type: 'string' } },
                        { name: 'year', in: 'query', required: false, schema: { type: 'integer' } },
                    ],
                    responses: {
                        '200': {
                            description: 'OK',
                            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Quote' } } } },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                Quote: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        author: { type: 'string' },
                        display_author: { type: 'string' },
                        message: { type: 'string' },
                        year: { type: 'integer' },
                        context: { type: 'string', nullable: true },
                    },
                    required: ['id', 'author', 'display_author', 'message', 'year'],
                },
                NewQuotePayload: {
                    type: 'object',
                    properties: {
                        author: { type: 'string' },
                        display_author: { type: 'string' },
                        message: { type: 'string' },
                        year: { type: 'integer' },
                        context: { type: 'string', nullable: true },
                    },
                    required: ['author', 'display_author', 'message', 'year'],
                },
                PartialQuotePayload: {
                    type: 'object',
                    properties: {
                        author: { type: 'string' },
                        display_author: { type: 'string' },
                        message: { type: 'string' },
                        year: { type: 'integer' },
                        context: { type: 'string', nullable: true },
                    },
                },
                IdResponse: {
                    type: 'object',
                    properties: { id: { type: 'integer' } },
                    required: ['id'],
                },
                OkResponse: {
                    type: 'object',
                    properties: { ok: { type: 'boolean' } },
                    required: ['ok'],
                },
                Error: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                    required: ['error'],
                },
            },
        },
    } as const;

    return NextResponse.json(spec);
}
