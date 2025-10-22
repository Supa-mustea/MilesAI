import { randomUUID } from "crypto";
import type {
  UserProfile,
  InsertUserProfile,
  OpportunityAlert,
  InsertOpportunityAlert,
  TherapySession,
  InsertTherapySession,
  ChatMessage,
  InsertChatMessage,
  MoodEntry,
  InsertMoodEntry,
} from "@shared/schema";

export interface IStorage {
  // User Profile
  getProfile(userId: string): Promise<UserProfile | undefined>;
  createOrUpdateProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;

  // Opportunities
  getOpportunities(userId: string): Promise<OpportunityAlert[]>;
  getOpportunityById(id: string): Promise<OpportunityAlert | undefined>;
  createOpportunity(userId: string, opportunity: InsertOpportunityAlert): Promise<OpportunityAlert>;
  updateOpportunity(id: string, updates: Partial<OpportunityAlert>): Promise<OpportunityAlert>;

  // Therapy Sessions
  getSessions(userId: string): Promise<TherapySession[]>;
  createSession(userId: string, session: InsertTherapySession): Promise<TherapySession>;
  updateSession(id: string, updates: Partial<TherapySession>): Promise<TherapySession>;

  // Chat Messages
  getMessages(userId: string, mode?: string): Promise<ChatMessage[]>;
  createMessage(userId: string, message: InsertChatMessage): Promise<ChatMessage>;

  // Mood Entries
  getMoodEntries(userId: string): Promise<MoodEntry[]>;
  getCurrentMood(userId: string): Promise<MoodEntry | undefined>;
  createMoodEntry(userId: string, mood: InsertMoodEntry): Promise<MoodEntry>;

  // Stats
  getStats(userId: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, UserProfile>;
  private opportunities: Map<string, OpportunityAlert>;
  private sessions: Map<string, TherapySession>;
  private messages: Map<string, ChatMessage>;
  private moods: Map<string, MoodEntry>;

  constructor() {
    this.profiles = new Map();
    this.opportunities = new Map();
    this.sessions = new Map();
    this.messages = new Map();
    this.moods = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create default profile
    const defaultProfile: UserProfile = {
      id: randomUUID(),
      name: "User",
      age: 28,
      location: "Lagos, Nigeria",
      currentIncome: 50000,
      careerGoals: ["Remote tech job", "Start online business", "Financial freedom"],
      painPoints: ["Financial stress", "Career uncertainty"],
      strengths: ["Tech-savvy", "Creative", "Determined"],
      financialGoals: 300000,
      preferredWorkStyle: "Remote/Freelance",
      skills: ["Programming", "Digital Marketing"],
      interests: ["Technology", "Business", "Personal Development"],
      emotionalState: "Hopeful",
      stressLevels: { financial: 7, career: 6, social: 5, health: 5 },
      successTriggers: ["Making money", "Learning new skills", "Progress"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set("user", defaultProfile);

    // Create sample opportunities
    const sampleOpportunities: InsertOpportunityAlert[] = [
      {
        userId: "user",
        opportunityType: "Remote Developer Job",
        description: "Full-stack developer position at UK startup, fully remote",
        potentialEarnings: 450000,
        timeInvestment: "40 hours/week",
        difficultyLevel: 6,
        requirements: ["React", "Node.js", "3+ years experience"],
        actionSteps: [
          "Update LinkedIn profile with React projects",
          "Prepare portfolio website",
          "Apply within 48 hours",
        ],
        deadline: "2 days",
        confidenceScore: 0.75,
        status: "active",
      },
      {
        userId: "user",
        opportunityType: "Freelance Content Creation",
        description: "AI-powered content creation service for Nigerian businesses",
        potentialEarnings: 200000,
        timeInvestment: "20 hours/week",
        difficultyLevel: 5,
        requirements: ["AI tools knowledge", "Marketing skills"],
        actionSteps: [
          "Research target market",
          "Develop service packages",
          "Create marketing strategy",
        ],
        deadline: "1 week",
        confidenceScore: 0.80,
        status: "active",
      },
    ];

    sampleOpportunities.forEach((opp) => {
      const id = randomUUID();
      this.opportunities.set(id, { ...opp, id, createdAt: new Date() });
    });
  }

  async getProfile(userId: string): Promise<UserProfile | undefined> {
    return this.profiles.get(userId);
  }

  async createOrUpdateProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile> {
    const existingProfile = this.profiles.get(userId);
    const newProfile: UserProfile = {
      ...profile,
      id: existingProfile?.id || randomUUID(),
      createdAt: existingProfile?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(userId, newProfile);
    return newProfile;
  }

  async getOpportunities(userId: string): Promise<OpportunityAlert[]> {
    return Array.from(this.opportunities.values())
      .filter((opp) => opp.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOpportunityById(id: string): Promise<OpportunityAlert | undefined> {
    return this.opportunities.get(id);
  }

  async createOpportunity(userId: string, opportunity: InsertOpportunityAlert): Promise<OpportunityAlert> {
    const id = randomUUID();
    const newOpp: OpportunityAlert = {
      ...opportunity,
      id,
      userId,
      createdAt: new Date(),
    };
    this.opportunities.set(id, newOpp);
    return newOpp;
  }

  async updateOpportunity(id: string, updates: Partial<OpportunityAlert>): Promise<OpportunityAlert> {
    const existing = this.opportunities.get(id);
    if (!existing) throw new Error("Opportunity not found");
    
    const updated = { ...existing, ...updates };
    this.opportunities.set(id, updated);
    return updated;
  }

  async getSessions(userId: string): Promise<TherapySession[]> {
    return Array.from(this.sessions.values())
      .filter((session) => session.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createSession(userId: string, session: InsertTherapySession): Promise<TherapySession> {
    const id = randomUUID();
    const newSession: TherapySession = {
      ...session,
      id,
      userId,
      timestamp: new Date(),
    };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async updateSession(id: string, updates: Partial<TherapySession>): Promise<TherapySession> {
    const existing = this.sessions.get(id);
    if (!existing) throw new Error("Session not found");
    
    const updated = { ...existing, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async getMessages(userId: string, mode?: string): Promise<ChatMessage[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.userId === userId && (!mode || msg.mode === mode))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(userId: string, message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const newMessage: ChatMessage = {
      ...message,
      id,
      userId,
      timestamp: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMoodEntries(userId: string): Promise<MoodEntry[]> {
    return Array.from(this.moods.values())
      .filter((mood) => mood.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getCurrentMood(userId: string): Promise<MoodEntry | undefined> {
    const moods = await this.getMoodEntries(userId);
    return moods[0];
  }

  async createMoodEntry(userId: string, mood: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const newMood: MoodEntry = {
      ...mood,
      id,
      userId,
      timestamp: new Date(),
    };
    this.moods.set(id, newMood);
    return newMood;
  }

  async getStats(userId: string): Promise<any> {
    const opportunities = await this.getOpportunities(userId);
    const sessions = await this.getSessions(userId);
    const activeOpps = opportunities.filter((o) => o.status === "active");
    
    const totalPotentialEarnings = activeOpps.reduce((sum, opp) => sum + opp.potentialEarnings, 0);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newOpportunitiesThisWeek = opportunities.filter((o) => o.createdAt >= weekAgo).length;
    const sessionsThisMonth = sessions.filter((s) => s.timestamp >= monthAgo).length;

    return {
      totalOpportunities: opportunities.length,
      activeOpportunities: activeOpps.length,
      totalPotentialEarnings,
      newOpportunitiesThisWeek,
      totalSessions: sessions.length,
      sessionsThisMonth,
      progressScore: 75,
      progressImprovement: 12,
    };
  }
}

export const storage = new MemStorage();
