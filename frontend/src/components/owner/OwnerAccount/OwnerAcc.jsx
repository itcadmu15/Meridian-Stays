import React from "react";

import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import PayoutTerms from "./PayoutTerms";
import PropertyCard from "./PropertyCard";
import PromotionalBanner from "./PromotionalBanner";

import {
  ChevronRight,
  Home,
  IndianRupee,
  CalendarDays,
  Star,
} from "lucide-react";

const OwnerAccount = () => {
  return (
    <div className="min-h-full bg-[#faf7f8]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="mb-5 flex items-start justify-between">

        <div>

          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">

            <span>
              Home
            </span>

            <ChevronRight size={13} />

            <span className="font-medium text-[#54213f]">
              Owner Account
            </span>

          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl font-semibold text-[#54213f]">
            Owner Account
          </h1>

          {/* Description */}
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile, payout preferences and your properties in
            one place.
          </p>

        </div>


        {/* Decorative Text */}
        <div className="hidden pr-4 text-right font-serif italic text-[#8b4968] md:block">

          <p className="text-lg">
            Good Stays,
          </p>

          <p className="text-lg">
            Great Returns
          </p>

        </div>

      </div>


      {/* =====================================================
          PROFILE + PROMOTIONAL CARD
      ===================================================== */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_0.75fr]">

        <ProfileCard />

        <PromotionalBanner />

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          icon={<Home size={21} />}
          value="3"
          title="Properties"
          subtitle="You have 3 active listings"
        />

        <StatsCard
          icon={<IndianRupee size={21} />}
          value="₹ 4,28,500"
          title="Total Earnings"
          subtitle="This year"
        />

        <StatsCard
          icon={<CalendarDays size={21} />}
          value="28"
          title="Total Bookings"
          subtitle="Across all properties"
        />

        <StatsCard
          icon={<Star size={21} />}
          value="4.8"
          title="Average Rating"
          subtitle="From 120+ guests"
        />

      </div>


      {/* =====================================================
          PAYOUT + PROPERTIES
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

        <PayoutTerms />


        {/* Owned Properties */}
        <section className="rounded-xl border border-[#eee2e7] bg-white p-4 shadow-sm">

          {/* Section Header */}
          <div className="mb-3 flex items-center justify-between">

            <h2 className="font-serif text-sm font-semibold text-[#54213f]">
              Owned Properties
            </h2>

            <button className="flex items-center gap-1 text-xs text-[#8a4166] transition hover:text-[#54213f]">

              View All

              <ChevronRight size={13} />

            </button>

          </div>


          {/* Property Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

            <PropertyCard
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80"
              name="Serenity Villa"
              location="Coorg, Karnataka"
              active={true}
            />

            <PropertyCard
              image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&q=80"
              name="Lakeside Retreat"
              location="Udaipur, Rajasthan"
              active={true}
            />

            <PropertyCard
              image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80"
              name="Urban Nest"
              location="Bangalore, Karnataka"
              active={false}
            />

          </div>

        </section>

      </div>


      {/* =====================================================
          BOTTOM PROMOTIONAL BANNER
      ===================================================== */}
      <PromotionalBanner bottom />

    </div>
  );
};

export default OwnerAccount;