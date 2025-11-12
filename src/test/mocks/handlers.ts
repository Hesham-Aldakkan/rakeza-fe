import { http, HttpResponse } from 'msw';
import { getConfig } from '@/lib/config';

const config = getConfig();

export const handlers = [
  // Example handlers for API endpoints
  http.get(`${config.api.baseUrl}/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
  }),

  http.get(`${config.api.baseUrl}/models`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          provider: 'OpenAI',
          capabilities: ['text', 'vision'],
          availability: 'available',
        },
      ],
    });
  }),

  http.post(`${config.api.baseUrl}/chats`, () => {
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: '1',
          title: 'New Chat',
          messages: [],
          models: [],
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),
];
