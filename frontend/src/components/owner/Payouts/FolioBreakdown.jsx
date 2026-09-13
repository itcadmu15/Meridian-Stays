import React from "react";
import { Download } from "lucide-react";

function FolioBreakdown() {
  const transactions = [
    {
      date: "02 Sep 2026",
      reservation: "RES-10432",
      property: "Serenity Villa",
      guest: "John Carter",
      stay: "28 Aug – 01 Sep",
      amount: "18,000",
      status: "Included",
    },
    {
      date: "05 Sep 2026",
      reservation: "RES-10487",
      property: "Lakeside Retreat",
      guest: "Aditi Verma",
      stay: "01 Sep – 04 Sep",
      amount: "24,500",
      status: "Included",
    },
    {
      date: "10 Sep 2026",
      reservation: "RES-10521",
      property: "Urban Nest",
      guest: "Rahul Mehta",
      stay: "05 Sep – 09 Sep",
      amount: "16,000",
      status: "Included",
    },
    {
      date: "14 Sep 2026",
      reservation: "RES-10567",
      property: "Serenity Villa",
      guest: "Sneha Iyer",
      stay: "10 Sep – 12 Sep",
      amount: "12,000",
      status: "Included",
    },
    {
      date: "18 Sep 2026",
      reservation: "RES-10603",
      property: "Lakeside Retreat",
      guest: "David Kim",
      stay: "14 Sep – 17 Sep",
      amount: "22,000",
      status: "Included",
    },
    {
      date: "21 Sep 2026",
      reservation: "RES-10644",
      property: "Urban Nest",
      guest: "Rohan Das",
      stay: "18 Sep – 20 Sep",
      amount: "11,500",
      status: "Included",
    },
    {
      date: "26 Sep 2026",
      reservation: "RES-10688",
      property: "Serenity Villa",
      guest: "Neha Kapoor",
      stay: "22 Sep – 27 Sep",
      amount: "24,500",
      status: "Pending",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="font-serif text-lg font-semibold text-[#54213f]">
            Folio Breakdown
          </h2>

          <p className="text-[11px] text-gray-500">
            Listing of completed stays and adjustments for the selected period.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-md border border-[#b37b97] px-3 py-2 text-xs font-medium text-[#54213f] transition hover:bg-[#faf1f5]">
          <Download size={14} />
          Download Folio
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-y border-gray-100 bg-[#fcfafb]">
              <th className="px-3 py-3 text-[10px] font-semibold text-[#54213f]">
                Date
              </th>

              <th className="px-3 py-3 text-[10px] font-semibold text-[#54213f]">
                Reservation ID
              </th>

              <th className="px-3 py-3 text-[10px] font-semibold text-[#54213f]">
                Property
              </th>

              <th className="px-3 py-3 text-[10px] font-semibold text-[#54213f]">
                Guest
              </th>

              <th className="px-3 py-3 text-[10px] font-semibold text-[#54213f]">
                Stay Dates
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-semibold text-[#54213f]">
                Amount (₹)
              </th>

              <th className="px-3 py-3 text-center text-[10px] font-semibold text-[#54213f]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.reservation}
                className={`border-b border-gray-100 last:border-0 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#fdfbfc]"
                }`}
              >
                <td className="px-3 py-3 text-[10px] text-gray-600">
                  {transaction.date}
                </td>

                <td className="px-3 py-3 text-[10px] text-gray-600">
                  {transaction.reservation}
                </td>

                <td className="px-3 py-3 text-[10px] font-medium text-[#54213f]">
                  {transaction.property}
                </td>

                <td className="px-3 py-3 text-[10px] text-gray-600">
                  {transaction.guest}
                </td>

                <td className="px-3 py-3 text-[10px] text-gray-600">
                  {transaction.stay}
                </td>

                <td className="px-3 py-3 text-right text-[10px] font-medium text-[#54213f]">
                  {transaction.amount}
                </td>

                <td className="px-3 py-3 text-center">
                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-medium ${
                      transaction.status === "Included"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FolioBreakdown;