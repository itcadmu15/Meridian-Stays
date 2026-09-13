import React from "react";
import { Plus } from "lucide-react";

const PromotionalBanner = ({
  bottom = false,
}) => {

  /* ==========================================================
     TOP PROMOTIONAL CARD
  ========================================================== */

  if (!bottom) {
    return (
      <div className="relative min-h-[105px] overflow-hidden rounded-xl bg-[#f2dce4]">

        {/* Text */}
        <div className="relative z-10 flex h-full w-[60%] flex-col justify-center px-5">

          <p className="font-serif text-base leading-5 text-[#64233f]">
            "Transforming spaces
            <br />
            into memorable stays."
          </p>

          <div className="mt-3 h-[1px] w-8 bg-[#8e4162]" />

        </div>


        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80"
          alt="Beautiful property interior"
          className="absolute right-0 top-0 h-full w-[45%] object-cover"
        />


        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f2dce4] via-[#f2dce4]/30 to-transparent" />

      </div>
    );
  }


  /* ==========================================================
     BOTTOM PROMOTIONAL BANNER
  ========================================================== */

  return (
    <div className="relative mt-4 min-h-[82px] overflow-hidden rounded-xl bg-[#42172f]">

      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80"
        alt="Mountain landscape"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />


      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3c142d] via-[#4a1c36]/70 to-transparent" />


      {/* Content */}
      <div className="relative z-10 flex min-h-[82px] items-center justify-between px-6">

        {/* Text */}
        <div>

          <p className="font-serif text-lg text-white">
            More than properties,
          </p>

          <p className="font-serif text-lg text-white">
            we build possibilities.
          </p>

          <div className="mt-1 h-[2px] w-5 bg-[#d5b34c]" />

        </div>


        {/* Button */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-white/50 bg-[#571c42]/70 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-[#6d214d]"
        >

          <Plus size={14} />

          Add a New Property

        </button>

      </div>

    </div>
  );
};

export default PromotionalBanner;