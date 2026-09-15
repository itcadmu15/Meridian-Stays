import { request } from "./api";

const ASSISTANT_PATH = "/api/v1/assistant/query";

/**
 * Ask the Meridian assistant a question.
 *
 * `unitId` scopes retrieval to a specific property's listing when the guest is
 * chatting from a unit page; the backend falls back to all listings when it is
 * not provided. `guestId` enables profile/preference-aware answers.
 */
export function queryAssistant({ question, guestId, unitId }) {
  return request(ASSISTANT_PATH, {
    method: "POST",
    body: JSON.stringify({
      question,
      ...(guestId ? { guest_id: guestId } : {}),
      ...(unitId ? { unit_id: unitId } : {}),
    }),
  });
}
