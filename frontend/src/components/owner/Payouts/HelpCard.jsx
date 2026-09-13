import React from "react";
import { Headphones } from "lucide-react";

function HelpCard() {
  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ead4df]">
          <Headphones size={19} className="text-[#54213f]" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#54213f]">
            Need Help?
          </h3>

          <p className="mt-1 text-[10px] leading-4 text-gray-500">
            Have questions about your payouts or tax documents?
            Our support team is here to help.
          </p>
        </div>
      </div>

      <button className="mt-3 w-full rounded-md border border-[#b37b97] py-2 text-xs font-medium text-[#54213f] transition hover:bg-[#faf1f5]">
        Contact Support
      </button>
    </div>
  );
}

export default HelpCard;