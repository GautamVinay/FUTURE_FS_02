import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  source: text("source").notNull(), // e.g., Website, LinkedIn, Referral
  status: text("status").notNull().default("New"), // New, Contacted, Qualified, Lost, Converted
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"), // Quick notes, separate from detailed notes collection if needed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(), // Foreign key to leads
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(), // Foreign key to leads
  type: text("type").notNull(), // 'status_change', 'note_added', 'follow_up_set', 'created'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const leadsRelations = relations(leads, ({ many }) => ({
  notes: many(notes),
  activities: many(activities),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  lead: one(leads, {
    fields: [notes.leadId],
    references: [leads.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  lead: one(leads, {
    fields: [activities.leadId],
    references: [leads.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Activity = typeof activities.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;

// Request types
export type CreateLeadRequest = InsertLead;
export type UpdateLeadRequest = Partial<InsertLead>;
export type CreateNoteRequest = InsertNote;

// Response types
export type LeadResponse = Lead;
export type LeadsListResponse = Lead[];
export type NoteResponse = Note;
export type ActivityResponse = Activity;

// Analytics types
export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  conversionRate: number;
  leadsByStatus: { status: string; count: number }[];
  recentActivity: Activity[];
}
