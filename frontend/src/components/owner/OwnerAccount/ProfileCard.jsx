import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Edit3,
} from "lucide-react";

const ProfileCard = () => {
  return (
    <section className="flex flex-col justify-between rounded-xl border border-[#eee2e7] bg-white p-5 shadow-sm md:flex-row md:items-center">

      {/* ================= PROFILE INFO ================= */}
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f2dfe7] text-xl font-medium text-[#70254e]">
          PS
        </div>


        {/* Details */}
        <div>

          {/* Name + Verification */}
          <div className="flex flex-wrap items-center gap-2">

            <h2 className="font-serif text-lg font-semibold text-[#54213f]">
              Priyam Sharma
            </h2>

            <span className="rounded-full bg-[#f5e6ed] px-2 py-0.5 text-[10px] font-medium text-[#74264f]">
              ✓ Verified
            </span>

          </div>


          {/* Contact Information */}
          <div className="mt-1 space-y-1 text-xs text-gray-500">

            {/* Email */}
            <div className="flex items-center gap-2">

              <Mail size={13} />

              <span>
                priyam.sharma@example.com
              </span>

            </div>


            {/* Phone */}
            <div className="flex items-center gap-2">

              <Phone size={13} />

              <span>
                +91 98765 43210
              </span>

            </div>


            {/* Location */}
            <div className="flex items-center gap-2">

              <MapPin size={13} />

              <span>
                Bangalore, Karnataka
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ================= EDIT BUTTON ================= */}
      <button
        type="button"
        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#6d214d] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#57183d] md:mt-0"
      >

        <Edit3 size={14} />

        Edit Profile

      </button>

    </section>
  );
};

export default ProfileCard;