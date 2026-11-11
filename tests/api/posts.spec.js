// tests/api/posts.spec.js
//
// API TESTING BASICS
// -------------------------------------------------------------
// Yeh tests browser KHOLTE HI NAHI — seedha HTTP request bhejte hain
// aur response (status code + JSON body) check karte hain. Isi liye
// API tests UI tests se bohot zyada FAST hote hain.
//
// 'request' ek built-in Playwright fixture hai jo HTTP calls karne
// deta hai (GET/POST/PUT/DELETE) — jaisa Postman karta hai.
//
// Site: https://jsonplaceholder.typicode.com — ek free fake REST API,
// bina kisi login/API-key ke, practice ke liye bani hai.

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder — Posts API', () => {
  test('GET /posts/1 returns a single post', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);

    // Status code check — 200 matlab "OK, sab theek hai"
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy(); // ok() = status 200-299

    const body = await response.json();

    // Response ke andar expected fields hone chahiye
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('userId');
  });

  test('GET /posts returns a list of 100 posts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBe(100);
  });

  test('POST /posts creates a new post', async ({ request }) => {
    const newPost = {
      title: 'Playwright Interview Prep',
      body: 'Learning API testing with Playwright',
      userId: 1,
    };

    // 'data' mein JSON body bhejते hain — yeh server ko "create karo" bolta hai.
    const response = await request.post(`${BASE_URL}/posts`, { data: newPost });

    // POST ka successful status code 201 (Created) hota hai, 200 nahi.
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe(newPost.title);
    expect(body).toHaveProperty('id'); // server ne naya id assign kiya
  });

  test('PUT /posts/1 updates an existing post', async ({ request }) => {
    const updatedPost = {
      id: 1,
      title: 'Updated Title',
      body: 'Updated body text',
      userId: 1,
    };

    const response = await request.put(`${BASE_URL}/posts/1`, { data: updatedPost });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe('Updated Title');
  });

  test('DELETE /posts/1 deletes a post', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/posts/1`);

    // DELETE ka successful status code bhi 200 hota hai (yeh fake API hai,
    // real backend hota to is ke baad GET /posts/1 par 404 milta).
    expect(response.status()).toBe(200);
  });
});
