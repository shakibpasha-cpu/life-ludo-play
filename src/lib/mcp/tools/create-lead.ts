import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthorized } from "./_supabase";

export default defineTool({
  name: "create_lead",
  title: "Create lead",
  description: "Create a new booking enquiry (lead) for a Human Size Ludo event.",
  inputSchema: {
    name: z.string().describe("Contact name."),
    phone: z.string().describe("Contact phone number."),
    email: z.string().describe("Contact email address."),
    city: z.string().optional(),
    event_type: z.string().optional().describe("e.g. Corporate Team Building, Wedding, Family Event."),
    event_date: z.string().optional().describe("Event date in YYYY-MM-DD format."),
    participants: z.number().optional(),
    message: z.string().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthorized();
    const { data, error } = await supabaseForUser(ctx)
      .from("leads")
      .insert({ ...input, source: "mcp" })
      .select();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data?.[0]) }], structuredContent: { lead: data?.[0] } };
  },
});
