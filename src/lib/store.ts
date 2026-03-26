import { Complaint, ComplaintCategory, ComplaintStatus } from "./types";

const STORAGE_KEY = "campus-complaints";

const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: "CMP-001",
    title: "Broken chair in Room 204",
    description: "Two chairs in lecture hall 204 have broken armrests and are unsafe to sit on.",
    category: "furniture",
    location: "Academic Block A, Room 204",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    reporterName: "Rahul Sharma",
    reporterEmail: "rahul@campus.edu",
  },
  {
    id: "CMP-002",
    title: "WiFi not working in Hostel Block C",
    description: "WiFi has been down for 3 days on the 2nd floor of Hostel C. Multiple students affected.",
    category: "it-network",
    location: "Hostel Block C, Floor 2",
    status: "in-progress",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    reporterName: "Priya Patel",
    reporterEmail: "priya@campus.edu",
    assignedTo: "IT Department",
  },
  {
    id: "CMP-003",
    title: "Water leakage in Lab 3",
    description: "Persistent water leak from ceiling in Chemistry Lab 3, damaging equipment.",
    category: "plumbing",
    location: "Science Block, Lab 3",
    status: "resolved",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    reporterName: "Amit Kumar",
    reporterEmail: "amit@campus.edu",
    assignedTo: "Maintenance Dept.",
  },
  {
    id: "CMP-004",
    title: "Flickering lights in corridor",
    description: "Multiple tube lights flickering in the main corridor of Admin Block.",
    category: "electrical",
    location: "Admin Block, Main Corridor",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    reporterName: "Sneha Reddy",
    reporterEmail: "sneha@campus.edu",
  },
  {
    id: "CMP-005",
    title: "Clogged drain near canteen",
    description: "Drain near the main canteen is clogged causing water stagnation and bad odor.",
    category: "sanitation",
    location: "Central Canteen Area",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 0.5 * 86400000).toISOString(),
    reporterName: "Vikram Singh",
    reporterEmail: "vikram@campus.edu",
    assignedTo: "Housekeeping",
  },
];

function initStore(): Complaint[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_COMPLAINTS));
  return SAMPLE_COMPLAINTS;
}

function save(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function getComplaints(): Complaint[] {
  return initStore();
}

export function getComplaint(id: string): Complaint | undefined {
  return initStore().find((c) => c.id === id);
}

export function addComplaint(data: Omit<Complaint, "id" | "status" | "createdAt" | "updatedAt">): Complaint {
  const complaints = initStore();
  const num = complaints.length + 1;
  const complaint: Complaint = {
    ...data,
    id: `CMP-${String(num).padStart(3, "0")}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  complaints.unshift(complaint);
  save(complaints);
  return complaint;
}

export function updateComplaintStatus(id: string, status: ComplaintStatus, assignedTo?: string): Complaint | undefined {
  const complaints = initStore();
  const idx = complaints.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  complaints[idx] = {
    ...complaints[idx],
    status,
    assignedTo: assignedTo || complaints[idx].assignedTo,
    updatedAt: new Date().toISOString(),
  };
  save(complaints);
  return complaints[idx];
}

export function getStats() {
  const complaints = initStore();
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter((c) => c.status === "in-progress").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  const byCategory = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const avgResolutionDays = resolved > 0
    ? complaints
        .filter((c) => c.status === "resolved")
        .reduce((sum, c) => {
          const diff = new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime();
          return sum + diff / 86400000;
        }, 0) / resolved
    : 0;

  return { total, pending, inProgress, resolved, byCategory, avgResolutionDays };
}
