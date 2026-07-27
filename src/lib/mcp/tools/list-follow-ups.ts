import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthorized } from "./_supabase";

export default defineTool({
  name: "list_follow_ups",
  title: "List follow-up reminders",
  description: "List CRM follow-up reminders, soonest first. Optionally only pending (incomplete) ones.",
  inputSchema: {
    only_pending: z.boolean().optional().describe("When true, exclude completed reminders."),
    limit: z.number().optional().describe("Max reminders to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ only_pending, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthorized();
    let query = supabaseForUser(ctx)
      .from("follow_up_reminders")
      .select("*")
      .order("reminder_date", { ascending: true })
      .limit(Math.min(limit ?? 25, 100));
    if (only_pending) query = query.eq("completed", false);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { reminders: data ?? [] } };
  },
});
