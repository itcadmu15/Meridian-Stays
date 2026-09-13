import React from "react";

function PayoutTabs({ activeTab, setActiveTab }) {
  const tabs = [
    {
      name: "Folio",
      value: "folio",
    },
    {
      name: "Payout Terms",
      value: "terms",
    },
    {
      name: "Transactions",
      value: "transactions",
    },
    {
      name: "Tax Documents",
      value: "tax",
    },
  ];

  return (
    <div className="flex items-center gap-7 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`relative pb-3 text-sm font-medium transition ${
            activeTab === tab.value
              ? "text-[#54213f]"
              : "text-gray-500 hover:text-[#54213f]"
          }`}
        >
          {tab.name}

          {activeTab === tab.value && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#713653]" />
          )}
        </button>
      ))}
    </div>
  );
}

export default PayoutTabs;