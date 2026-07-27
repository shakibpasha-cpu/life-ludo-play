import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLeads from "./tools/list-leads";
import createLead from "./tools/create-lead";
import updateLeadStatus from "./tools/update-lead-status";
import addLeadNote from "./tools/add-lead-note";
import listFollowUps from "./tools/list-follow-ups";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "human-size-ludo-mcp",
  title: "Human Size Ludo CRM",
  version: "0.1.0",
  instructions:
    "Tools for the Human Size Ludo Experience booking CRM. Use `list_leads` to review enquiries, `create_lead` to log a new booking enquiry, `update_lead_status` to move a lead through the pipeline, `add_lead_note` to record follow-up context, and `list_follow_ups` for upcoming reminders.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listLeads, createLead, updateLeadStatus, addLeadNote, listFollowUps],
});
