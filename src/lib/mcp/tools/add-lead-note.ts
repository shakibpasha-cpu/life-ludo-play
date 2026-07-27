import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthorized } from "./_supabase";

export default defineTool({
  name: "add_lead_note",
  title: "Add lead note",
  description: "Attach a follow-up note to an existing lead.",
  inputSchema: {
    lead_id: z.string().describe("The lead's id."),
    note: z.string().describe("Note text."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ lead_id, note }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthorized();
    const { data, error } = await supabaseForUser(ctx)
      .from("lead_notes")
      .insert({ lead_id, note, created_by: ctx.getUserId() })
      .select();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data?.[0]) }], structuredContent: { note: data?.[0] } };
  },
});
