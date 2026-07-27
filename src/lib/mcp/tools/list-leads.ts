import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthorized } from "./_supabase";

export default defineTool({
  name: "list_leads",
  title: "List leads",
  description: "List booking leads/enquiries for the Human Size Ludo Experience, newest first. Optionally filter by status.",
  inputSchema: {
    status: z.string().optional().describe("Filter by lead status, e.g. new, contacted, confirmed_booking."),
    limit: z.number().optional().describe("Max number of leads to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthorized();
    let query = supabaseForUser(ctx)
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Math.min(limit ?? 25, 100));
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { leads: data ?? [] } };
  },
});
