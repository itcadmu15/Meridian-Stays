import React from "react";

import OwnerAcc from "../components/owner/OwnerAccount/OwnerAcc";
import PayoutTerms from "../components/owner/OwnerAccount/PayoutTerms";
import ProfileCard from "../components/owner/OwnerAccount/ProfileCard";
import PromotionalBanner from "../components/owner/OwnerAccount/PromotionalBanner";
import PropertyCard from "../components/owner/OwnerAccount/PropertyCard";
import StatsCard from "../components/owner/OwnerAccount/StatsCard";


function OwnerAccount() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <span>/</span>
        <span className="font-medium text-[#54213f]">
          Owner Account
        </span>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-[#54213f]">
            Owner Account
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your profile, payout preferences and your properties
            in one place.
          </p>
        </div>

        <div className="hidden text-right md:block">
          <p className="font-serif text-xl italic text-[#8b4a6b]">
            Good Stays,
          </p>
          <p className="font-serif text-xl italic text-[#54213f]">
            Great Returns
          </p>
        </div>
      </div>

      {/* Profile + Promotional Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Profile */}
        <div className="lg:col-span-2">
          <ProfileCard />
        </div>

        {/* Promotional Card */}
        <div>
          <PromotionalBanner type="top" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value="4"
          subtitle="Properties listed"
        />

        <StatsCard
          title="Active Listings"
          value="3"
          subtitle="Currently active"
        />

        <StatsCard
          title="Total Bookings"
          value="128"
          subtitle="All time bookings"
        />

        <StatsCard
          title="Total Earnings"
          value="₹8.4L"
          subtitle="Lifetime earnings"
        />
      </div>

      {/* Payout Terms */}
      <div className="mt-6">
        <PayoutTerms />
      </div>

      {/* Properties */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#54213f]">
              Your Properties
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the properties you currently have listed.
            </p>
          </div>

          <button className="rounded-lg bg-[#54213f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#713653]">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <PropertyCard
            name="Meridian Heights"
            location="Bangalore, Karnataka"
            status="Active"
            image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
          />

          <PropertyCard
            name="Meridian Lake View"
            location="Udaipur, Rajasthan"
            status="Active"
            image="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80"
          />

          <PropertyCard
            name="Meridian Garden Villa"
            location="Goa, India"
            status="Active"
            image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
          />
        </div>
      </div>

      {/* Bottom Promotional Banner */}
      <div className="mt-8">
        <PromotionalBanner type="bottom" />
      </div>

    </div>
  );
}

export default OwnerAccount;