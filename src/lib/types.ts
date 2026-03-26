export type ComplaintStatus = "pending" | "in-progress" | "resolved";

export type ComplaintCategory = 
  | "plumbing"
  | "electrical"
  | "furniture"
  | "it-network"
  | "sanitation"
  | "civil"
  | "other";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  status: ComplaintStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  reporterName: string;
  reporterEmail: string;
  assignedTo?: string;
  feedback?: string;
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  furniture: "Furniture",
  "it-network": "IT / Network",
  sanitation: "Sanitation",
  civil: "Civil / Infrastructure",
  other: "Other",
};

export const CATEGORY_DEPARTMENTS: Record<ComplaintCategory, string> = {
  plumbing: "Maintenance Dept.",
  electrical: "Electrical Dept.",
  furniture: "Estate Office",
  "it-network": "IT Department",
  sanitation: "Housekeeping",
  civil: "Civil Works",
  other: "General Admin",
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
};
