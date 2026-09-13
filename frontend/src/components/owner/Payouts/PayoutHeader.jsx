import React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

function PayoutHeader() {
  return (
    <div className="mb-5">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <span>›</span>
        <span className="font-medium text-[#54213f]">
          Payouts
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-[#54213f]">
            Payout Terms
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your folio, payout schedule and transaction history.
          </p>
        </div>

        {/* Decorative Text */}
        <div className="hidden text-right md:block">
          <p className="font-serif text-xl italic text-[#9b5475]">
            Your
          </p>
          <p className="font-serif text-xl italic text-[#9b5475]">
            Earnings
          </p>
          <p className="font-serif text-xl italic text-[#9b5475]">
            Our Commitment
          </p>
        </div>
      </div>
    </div>
  );
}

export default PayoutHeader;
