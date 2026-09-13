import React from "react";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function PayoutSettings() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-serif text-lg font-semibold text-[#54213f]">
          Payout Settings
        </h2>

        <button className="flex items-center gap-1 text-xs font-medium text-[#713653] hover:underline">
          Edit
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Bank */}
      <div className="mx-4 flex items-center gap-3 rounded-lg bg-[#faf7f8] p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ead4df]">
          <Building2 size={19} className="text-[#54213f]" />
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-[#54213f]">
            HDFC Bank
          </p>

          <p className="mt-1 text-[10px] text-gray-500">
            •••• 5678
          </p>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[9px] font-medium text-green-700">
          <CheckCircle2 size={11} />
          Verified
        </span>
      </div>

      {/* Settings */}
      <div className="mt-3 px-4 pb-4">

        <div className="flex items-center justify-between border-b border-gray-100 py-3">
          <span className="text-[11px] text-gray-600">
            Payout Frequency
          </span>

          <span className="text-[11px] font-medium text-[#54213f]">
            Monthly (5th of every month)
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 py-3">
          <span className="text-[11px] text-gray-600">
            Minimum Payout Amount
          </span>

          <span className="text-[11px] font-medium text-[#54213f]">
            ₹5,000
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 py-3">
          <span className="text-[11px] text-gray-600">
            Tax Deduction (TDS)
          </span>

          <span className="text-[11px] font-medium text-[#54213f]">
            As per applicable rates
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="text-[11px] text-gray-600">
            Tax Information
          </span>

          <span className="flex items-center gap-1 text-[11px] font-medium text-green-600">
            <CheckCircle2 size={13} />
            Submitted
          </span>
        </div>

      </div>
    </div>
  );
}

export default PayoutSettings;