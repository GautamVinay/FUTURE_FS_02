import { z } from 'zod';
import { insertLeadSchema, insertNoteSchema, leads, notes, activities, insertUserSchema } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof leads.$inferSelect>(), // Returns user object
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof leads.$inferSelect>(), // Returns user object
        401: errorSchemas.unauthorized,
      },
    },
    register: {
        method: 'POST' as const,
        path: '/api/register' as const,
        input: insertUserSchema,
        responses: {
            201: z.custom<typeof leads.$inferSelect>(),
            400: errorSchemas.validation
        }
    }
  },
  leads: {
    list: {
      method: 'GET' as const,
      path: '/api/leads' as const,
      responses: {
        200: z.array(z.custom<typeof leads.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/leads/:id' as const,
      responses: {
        200: z.custom<typeof leads.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/leads' as const,
      input: insertLeadSchema,
      responses: {
        201: z.custom<typeof leads.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/leads/:id' as const,
      input: insertLeadSchema.partial(),
      responses: {
        200: z.custom<typeof leads.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/leads/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  notes: {
    list: {
      method: 'GET' as const,
      path: '/api/leads/:leadId/notes' as const,
      responses: {
        200: z.array(z.custom<typeof notes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/leads/:leadId/notes' as const,
      input: z.object({ content: z.string() }),
      responses: {
        201: z.custom<typeof notes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  activities: {
    list: {
      method: 'GET' as const,
      path: '/api/leads/:leadId/activities' as const,
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
      },
    },
  },
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats' as const,
      responses: {
        200: z.object({
          totalLeads: z.number(),
          newLeads: z.number(),
          convertedLeads: z.number(),
          conversionRate: z.number(),
          leadsByStatus: z.array(z.object({ status: z.string(), count: z.number() })),
          recentActivity: z.array(z.custom<typeof activities.$inferSelect>()),
        }),
      },
    },
  },
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
