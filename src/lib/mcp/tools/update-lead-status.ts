import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthorized } from "./_supabase";

export default defineTool({
  name: "update_lead_status",
  title: "Update lead status",
  description: "Update the pipeline status of an existing lead (e.g. new, contacted, confirmed_booking, lost).",
  inputSchema: {
    lead_id: z.string().describe("The lead's id."),
    status: z.string().describe("New status value."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ lead_id, status }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthorized();
    const { data, error } = await supabaseForUser(ctx)
      .from("leads")
      .update({ status })
      .eq("id", lead_id)
      .select();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length) return { content: [{ type: "text", text: "No lead updated (not found or no access)." }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data[0]) }], structuredContent: { lead: data[0] } };
  },
});
