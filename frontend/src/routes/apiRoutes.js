const BACKEND_URL = "http://localhost:8000";

export const API_ROUTES = {
  OWNER: {
    GET: (ownerId) =>
      `${BACKEND_URL}/api/v1/owners/${ownerId}`,

    UPDATE: (ownerId) =>
      `${BACKEND_URL}/api/v1/owners/${ownerId}`,

    PROPERTIES: (ownerId) =>
      `${BACKEND_URL}/api/v1/owners/${ownerId}/properties`,
  },
};

export default BACKEND_URL;