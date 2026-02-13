import { db } from "./db";
import {
  users, leads, notes, activities,
  type User, type InsertUser,
  type Lead, type InsertLead, type UpdateLeadRequest,
  type Note, type InsertNote,
  type Activity, type DashboardStats
} from "@shared/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUserRequest): Promise<User>;

  // Leads
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead>;
  deleteLead(id: number): Promise<void>;

  // Notes
  getNotes(leadId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;

  // Activities
  getActivities(leadId: number): Promise<Activity[]>;
  createActivity(activity: Omit<Activity, "id" | "createdAt">): Promise<Activity>;
  getAllRecentActivities(limit: number): Promise<Activity[]>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: UpdateUserRequest): Promise<User> {
    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    
    // Log creation activity
    await this.createActivity({
      leadId: newLead.id,
      type: 'created',
      description: `Lead created: ${newLead.name}`,
    });
    
    return newLead;
  }

  async updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead> {
    const [current] = await db.select().from(leads).where(eq(leads.id, id));
    const [updated] = await db.update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (current.status !== updated.status) {
      await this.createActivity({
        leadId: id,
        type: 'status_change',
        description: `Status changed from ${current.status} to ${updated.status}`,
      });
    }

    if (updates.followUpDate) {
         await this.createActivity({
            leadId: id,
            type: 'follow_up_set',
            description: `Follow-up set for ${new Date(updates.followUpDate).toLocaleDateString()}`
         });
    }

    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getNotes(leadId: number): Promise<Note[]> {
    return await db.select().from(notes)
        .where(eq(notes.leadId, leadId))
        .orderBy(desc(notes.createdAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    
    await this.createActivity({
        leadId: note.leadId,
        type: 'note_added',
        description: 'New note added',
    });

    return newNote;
  }

  async getActivities(leadId: number): Promise<Activity[]> {
    return await db.select().from(activities)
        .where(eq(activities.leadId, leadId))
        .orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: Omit<Activity, "id" | "createdAt">): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getAllRecentActivities(limit: number): Promise<Activity[]> {
      return await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(limit);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const allLeads = await db.select().from(leads);
    const totalLeads = allLeads.length;
    const newLeads = allLeads.filter(l => l.status === 'New').length;
    const convertedLeads = allLeads.filter(l => l.status === 'Converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const leadsByStatusRaw = await db
      .select({ status: leads.status, count: count() })
      .from(leads)
      .groupBy(leads.status);
    
    const leadsByStatus = leadsByStatusRaw.map(item => ({
        status: item.status!,
        count: item.count
    }));

    const recentActivity = await this.getAllRecentActivities(10);

    return {
      totalLeads,
      newLeads,
      convertedLeads,
      conversionRate,
      leadsByStatus,
      recentActivity,
    };
  }
}

export const storage = new DatabaseStorage();
