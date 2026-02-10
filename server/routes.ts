import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertLeadSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
    const existingUsers = await storage.getUserByUsername("admin");
    if (!existingUsers) {
        const hashedPassword = await hashPassword("admin123");
        await storage.createUser({
            username: "admin",
            password: hashedPassword,
            name: "Admin User",
        });
        console.log("Seeded admin user: admin / admin123");
    }

    const leads = await storage.getLeads();
    if (leads.length === 0) {
        const lead1 = await storage.createLead({
            name: "Sarah Johnson",
            email: "sarah@techcorp.com",
            source: "Website",
            status: "New",
            followUpDate: new Date(Date.now() + 86400000), // tomorrow
            notes: "Interested in the enterprise plan.",
        });

        await storage.createNote({
            leadId: lead1.id,
            content: "Initial call scheduled for next week.",
        });

        const lead2 = await storage.createLead({
            name: "Michael Chen",
            email: "m.chen@startup.io",
            source: "LinkedIn",
            status: "Contacted",
            followUpDate: new Date(Date.now() - 86400000), // yesterday (overdue)
            notes: "Needs a custom integration demo.",
        });

         await storage.createNote({
            leadId: lead2.id,
            content: "Sent brochure via email.",
        });

        await storage.createLead({
            name: "Emma Davis",
            email: "emma.d@designstudio.net",
            source: "Referral",
            status: "Converted",
            followUpDate: null,
            notes: "Signed contract on Friday.",
        });

        console.log("Seeded sample leads and notes");
    }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication first
  setupAuth(app);

  // Helper to ensure user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Seed database on startup
  await seedDatabase();

  // === DASHBOARD ===
  app.get(api.dashboard.stats.path, requireAuth, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // === LEADS ===
  app.get(api.leads.list.path, requireAuth, async (req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.get(api.leads.get.path, requireAuth, async (req, res) => {
    const lead = await storage.getLead(Number(req.params.id));
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  });

  app.post(api.leads.create.path, requireAuth, async (req, res) => {
    try {
      const input = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.leads.update.path, requireAuth, async (req, res) => {
    try {
        const input = insertLeadSchema.partial().parse(req.body);
        const lead = await storage.updateLead(Number(req.params.id), input);
        res.json(lead);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        res.status(404).json({ message: "Lead not found" });
    }
  });

  app.delete(api.leads.delete.path, requireAuth, async (req, res) => {
    await storage.deleteLead(Number(req.params.id));
    res.status(204).send();
  });

  // === NOTES ===
  app.get(api.notes.list.path, requireAuth, async (req, res) => {
    const notes = await storage.getNotes(Number(req.params.leadId));
    res.json(notes);
  });

  app.post(api.notes.create.path, requireAuth, async (req, res) => {
     try {
         const { content } = req.body;
         const note = await storage.createNote({
             leadId: Number(req.params.leadId),
             content,
         });
         res.status(201).json(note);
     } catch (err) {
         res.status(400).json({ message: "Invalid note data" });
     }
  });

  // === ACTIVITIES ===
  app.get(api.activities.list.path, requireAuth, async (req, res) => {
    const activities = await storage.getActivities(Number(req.params.leadId));
    res.json(activities);
  });

  return httpServer;
}
