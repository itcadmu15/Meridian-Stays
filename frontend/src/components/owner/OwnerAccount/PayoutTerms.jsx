import React from "react";
import {
  ChevronRight,
  Landmark,
  CheckCircle2,
} from "lucide-react";

const PayoutTerms = () => {
  return (
    <section className="rounded-xl border border-[#eee2e7] bg-white p-4 shadow-sm">

      {/* ================= HEADER ================= */}
      <div className="mb-3 flex items-center justify-between">

        <h2 className="font-serif text-sm font-semibold text-[#54213f]">
          Payout Terms
        </h2>

        <button
          type="button"
          className="flex items-center gap-1 text-xs text-[#8a4166] transition hover:text-[#54213f]"
        >

          View Details

          <ChevronRight size={13} />

        </button>

      </div>


      {/* ================= PAYOUT DETAILS ================= */}
      <div className="rounded-lg border border-[#eee2e7] bg-[#fdfafb]">

        {/* Bank */}
        <div className="flex items-center gap-3 border-b border-[#eee2e7] p-3">

          {/* Bank Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e3ea] text-[#70254e]">

            <Landmark size={19} />

          </div>


          {/* Bank Details */}
          <div>

            <p className="text-sm font-semibold text-[#3f1731]">
              HDFC Bank
            </p>

            <p className="text-xs text-gray-500">
              •••• 5678
            </p>

          </div>

        </div>


        {/* Frequency */}
        <InfoRow
          label="Payout Frequency"
          value="Monthly (5th of every month)"
        />


        {/* Minimum Payout */}
        <InfoRow
          label="Minimum Payout Amount"
          value="₹ 5,000"
        />


        {/* Tax */}
        <div className="flex items-center justify-between px-3 py-2.5">

          <span className="text-xs text-gray-500">
            Tax Information
          </span>

          <span className="flex items-center gap-1 text-xs font-medium text-green-600">

            <CheckCircle2 size={14} />

            Submitted

          </span>

        </div>

      </div>

    </section>
  );
};


/* ============================================================
   INFORMATION ROW
============================================================ */

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-[#eee2e7] px-3 py-2.5">

      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className="text-xs font-medium text-[#4a1937]">
        {value}
      </span>

    </div>
  );
};

export default PayoutTerms;