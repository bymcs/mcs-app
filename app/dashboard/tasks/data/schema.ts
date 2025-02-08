import { z } from "zod"

// Define the task schema
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["backlog", "todo", "in_progress", "done", "canceled"]),
  label: z.enum(["bug", "feature", "documentation", "enhancement"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignee: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

// Export type for TypeScript usage
export type Task = z.infer<typeof taskSchema>