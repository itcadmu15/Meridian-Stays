import React from "react";

import ProfileCard from "../components/owner/OwnerAccount/ProfileCard";
import PayoutTerms from "../components/owner/OwnerAccount/PayoutTerms";
import PromotionalBanner from "../components/owner/OwnerAccount/PromotionalBanner";
import PropertyCard from "../components/owner/OwnerAccount/PropertyCard";
import StatsCard from "../components/owner/OwnerAccount/StatsCard";

function OwnerAccount({ owner, setOwner }) {
  return (
    <div>

      {/* Page Header */}
      <div className="mb-7">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <span>Home</span>
          <span>/</span>
          <span className="font-medium text-[#54213f]">
            Owner Account
          </span>
        </div>

        {/* Heading */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#54213f]">
              Owner Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your profile, payout preferences and your
              properties in one place.
            </p>
          </div>

          {/* Decorative Text */}
          <div className="hidden text-right md:block">
            <p className="font-serif text-xl italic text-[#9b5475]">
              Good Stays,
            </p>

            <p className="font-serif text-xl italic text-[#54213f]">
              Great Returns
            </p>
          </div>
        </div>
      </div>

      {/* Profile + Promotional Banner */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Owner Profile */}
        <div className="lg:col-span-2">
          <ProfileCard
            owner={owner}
            setOwner={setOwner}
          />
        </div>

        {/* Promotional Banner */}
        <div>
          <PromotionalBanner type="top" />
        </div>

      </div>

      {/* Statistics */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatsCard
          value="4"
          title="Total Properties"
          subtitle="Properties listed"
        />

        <StatsCard
          value="3"
          title="Active Listings"
          subtitle="Currently active"
        />

        <StatsCard
          value="128"
          title="Total Bookings"
          subtitle="All time bookings"
        />

        <StatsCard
          value="₹8.4L"
          title="Total Earnings"
          subtitle="Lifetime earnings"
        />

      </div>

      {/* Payout Terms */}
      <div className="mt-5">
        <PayoutTerms />
      </div>

      {/* Properties Section */}
      <div className="mt-8">

        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#54213f]">
              Your Properties
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the properties you currently have listed.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-[#681744] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#54213f]"
          >
            View All
          </button>

        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          <PropertyCard
            name="Serenity Villa"
            location="Coorg, Karnataka"
            status="Active"
            image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
          />

          <PropertyCard
            name="Lakeside Retreat"
            location="Udaipur, Rajasthan"
            status="Active"
            image="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80"
          />

          <PropertyCard
            name="Urban Nest"
            location="Bangalore, Karnataka"
            status="Inactive"
            image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80"
          />

        </div>
      </div>

      {/* Bottom Promotional Banner */}
      <div className="mt-8 pb-6">
        <PromotionalBanner type="bottom" />
      </div>

    </div>
  );
}

export default OwnerAccount;