import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// No real database: every Prisma call is a stub the tests can override
const db = vi.hoisted(() => {
  const models: Record<string, Record<string, ReturnType<typeof vi.fn>>> = {};
  const model = (name: string) =>
    (models[name] ??= new Proxy({}, {
      get: (target: Record<string, ReturnType<typeof vi.fn>>, method: string) =>
        (target[method] ??= vi.fn().mockResolvedValue(null)),
    }));
  const prisma = new Proxy({}, {
    get: (_t, prop: string) => (prop === '$queryRaw' ? vi.fn().mockResolvedValue([1]) : model(prop)),
  });
  return { prisma, models, model };
});
vi.mock('../src/lib/prisma.js', () => ({ prisma: db.prisma }));

import app from '../src/app.js';

const OTHER_ID = '11111111-1111-4111-8111-111111111111';
const OWN_ID = '22222222-2222-4222-8222-222222222222';

function token(role: string, extra: Record<string, string> = {}) {
  return 'Bearer ' + jwt.sign({ userId: 'u1', email: `${role}@test`, role, ...extra }, 'test-secret');
}

beforeEach(() => {
  for (const m of Object.values(db.models)) for (const fn of Object.values(m)) fn.mockReset().mockResolvedValue(null);
});

describe('public endpoints', () => {
  it('GET /health is 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.database).toBe('connected');
  });

  it('QR redirect refuses non-http targets', async () => {
    db.model('qRCode').findUnique.mockResolvedValue({ id: 'q1', code: 'abc', isActive: true, targetUrl: 'javascript:alert(1)' });
    const res = await request(app).get('/qr/abc');
    expect(res.status).toBe(404);
  });
});

describe('unauthenticated requests are rejected', () => {
  const cases: [string, string][] = [
    ['get', '/api/advertisers'],
    ['post', '/api/advertisers'],
    ['delete', `/api/advertisers/${OTHER_ID}`],
    ['get', '/api/cafes'],
    ['post', '/api/cafes'],
    ['delete', `/api/cafes/${OTHER_ID}`],
    ['get', '/api/campaigns'],
    ['post', '/api/campaigns'],
    ['delete', `/api/campaigns/${OTHER_ID}`],
    ['get', `/api/recommendations?advertiser_id=${OTHER_ID}`],
    ['get', '/api/leads'],
    ['get', '/api/inventory'],
    ['get', '/api/analytics/overview'],
    ['get', '/api/enrichment/health'],
  ];
  it.each(cases)('%s %s → 401', async (method, path) => {
    const res = await (request(app) as any)[method](path);
    expect(res.status).toBe(401);
  });
});

describe('role and ownership checks', () => {
  it('advertiser cannot delete cafes', async () => {
    const res = await request(app).delete(`/api/cafes/${OTHER_ID}`).set('Authorization', token('advertiser', { advertiserId: OWN_ID }));
    expect(res.status).toBe(403);
  });

  it('advertiser cannot list leads', async () => {
    const res = await request(app).get('/api/leads').set('Authorization', token('advertiser', { advertiserId: OWN_ID }));
    expect(res.status).toBe(403);
  });

  it('sales cannot delete advertisers (admin only)', async () => {
    const res = await request(app).delete(`/api/advertisers/${OTHER_ID}`).set('Authorization', token('sales'));
    expect(res.status).toBe(403);
  });

  it('advertiser cannot get recommendations for another advertiser', async () => {
    const res = await request(app)
      .get(`/api/recommendations?advertiser_id=${OTHER_ID}`)
      .set('Authorization', token('advertiser', { advertiserId: OWN_ID }));
    expect(res.status).toBe(403);
  });

  it("advertiser cannot read another advertiser's campaign analytics", async () => {
    db.model('campaign').findUnique.mockResolvedValue({ id: OTHER_ID, advertiserId: OTHER_ID, placements: [] });
    const res = await request(app)
      .get(`/api/analytics/campaign/${OTHER_ID}`)
      .set('Authorization', token('advertiser', { advertiserId: OWN_ID }));
    expect(res.status).toBe(403);
  });

  it("restaurant cannot read another cafe's inventory", async () => {
    const res = await request(app)
      .get(`/api/inventory/restaurant/${OTHER_ID}`)
      .set('Authorization', token('restaurant', { restaurantId: OWN_ID }));
    expect(res.status).toBe(403);
  });

  it('restaurant cannot report usage for another cafe', async () => {
    const res = await request(app)
      .post('/api/inventory/usage')
      .set('Authorization', token('restaurant', { restaurantId: OWN_ID }))
      .send({ cafeId: OTHER_ID, packagingUsed: 5 });
    expect(res.status).toBe(403);
  });

  it('restaurant can read its own inventory', async () => {
    db.model('packagingInventory').findMany.mockResolvedValue([]);
    const res = await request(app)
      .get(`/api/inventory/restaurant/${OWN_ID}`)
      .set('Authorization', token('restaurant', { restaurantId: OWN_ID }));
    expect(res.status).toBe(200);
  });

  it('rejects tokens signed with the wrong secret', async () => {
    const bad = 'Bearer ' + jwt.sign({ userId: 'u1', role: 'admin' }, 'wrong');
    const res = await request(app).get('/api/cafes').set('Authorization', bad);
    expect(res.status).toBe(401);
  });
});

describe('CORS', () => {
  it('allows the configured frontend origin', async () => {
    const res = await request(app).get('/health').set('Origin', 'https://app.feidup.com');
    expect(res.headers['access-control-allow-origin']).toBe('https://app.feidup.com');
  });

  it('does not allow arbitrary origins', async () => {
    const res = await request(app).get('/health').set('Origin', 'https://evil.example');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
