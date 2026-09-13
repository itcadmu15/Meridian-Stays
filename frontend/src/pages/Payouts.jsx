import React, { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

import PayoutHeader from "../components/owner/Payouts/PayoutHeader";
import PayoutTabs from "../components/owner/Payouts/PayoutTabs";
import PayoutSummary from "../components/owner/Payouts/PayoutSummary";
import FolioBreakdown from "../components/owner/Payouts/FolioBreakdown";
import PayoutSettings from "../components/owner/Payouts/PayoutSettings";
import HelpCard from "../components/owner/Payouts/HelpCard";

function Payouts() {
  const [activeTab, setActiveTab] = useState("folio");

  return (
    <div>

      {/* Header */}
      <PayoutHeader />

      {/* Tabs + Date */}
      <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">

        <PayoutTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Date Selector */}
        <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-xs font-medium text-gray-600">
          <CalendarDays
            size={16}
            className="text-[#713653]"
          />

          <span>
            Sep 01, 2026 – Sep 30, 2026
          </span>

          <ChevronDown
            size={14}
            className="ml-1"
          />
        </button>

      </div>

      {/* Summary Cards */}
      <PayoutSummary />

      {/* Main Content */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">

        {/* Folio */}
        <div className="xl:col-span-2">
          <FolioBreakdown />
        </div>

        {/* Right Side */}
        <div>
          <PayoutSettings />
          <HelpCard />
        </div>

      </div>

    </div>
  );
}

export default Payouts;