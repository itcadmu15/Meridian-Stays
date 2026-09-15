import { API_ROUTES } from "../routes/apiRoutes";

// Owner ID from the seeded database
const DEMO_OWNER_ID = "00f51ec1-197a-4197-abe5-cf5ab5c7b08a";

/**
 * Get owner account details
 */
export const getOwnerAccount = async () => {
  const response = await fetch(
    API_ROUTES.OWNER.GET(DEMO_OWNER_ID),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch owner account."
    );
  }

  return data;
};

/**
 * Update owner account details
 */
export const updateOwnerAccount = async (
  ownerId,
  ownerData
) => {
  if (!ownerId) {
    throw new Error("Owner ID is required.");
  }

  const payload = {
    name: ownerData.name,
    email: ownerData.email,
    phone: ownerData.phone,
    payout_terms: ownerData.payout_terms,
    payout_percentage: Number(ownerData.payout_percentage),
    is_active: ownerData.is_active,
  };

  const response = await fetch(
    API_ROUTES.OWNER.UPDATE(ownerId),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to update owner account."
    );
  }

  return data;
};

/**
 * Get owner properties
 */
export const getOwnerProperties = async (ownerId) => {
  if (!ownerId) {
    throw new Error("Owner ID is required.");
  }

  const response = await fetch(
    API_ROUTES.OWNER.PROPERTIES(ownerId),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch owner properties."
    );
  }

  return data;
};