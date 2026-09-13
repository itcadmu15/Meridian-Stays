import React from "react";
import {
  WalletCards,
  Coins,
  Hourglass,
  FileText,
  TrendingUp,
} from "lucide-react";

function SummaryCard({
  icon: Icon,
  title,
  value,
  subtitle,
  subtitleColor = "text-gray-500",
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4e4eb]">
          <Icon size={21} className="text-[#713653]" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-gray-600">
            {title}
          </p>

          <p className="mt-1 font-serif text-xl font-semibold text-[#54213f]">
            {value}
          </p>

          <p className={`mt-1 text-[10px] ${subtitleColor}`}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function PayoutSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={WalletCards}
        title="Total Earnings (This Period)"
        value="₹1,28,500"
        subtitle={
          <span className="flex items-center gap-1">
            <TrendingUp size={11} />
            +12% from last month
          </span>
        }
        subtitleColor="text-green-600"
      />

      <SummaryCard
        icon={Coins}
        title="Paid Out"
        value="₹1,00,000"
        subtitle="on 05 Sep 2026"
        subtitleColor="text-green-600"
      />

      <SummaryCard
        icon={Hourglass}
        title="Pending Payout"
        value="₹28,500"
        subtitle="Scheduled on 05 Oct 2026"
        subtitleColor="text-amber-600"
      />

      <SummaryCard
        icon={FileText}
        title="Next Payout Date"
        value="05 Oct 2026"
        subtitle="For Sep 2026 earnings"
      />
    </div>
  );
}

export default PayoutSummary;