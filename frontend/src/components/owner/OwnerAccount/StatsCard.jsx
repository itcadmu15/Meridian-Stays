import React from "react";

const StatsCard = ({
  icon,
  value,
  title,
  subtitle,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#eee2e7] bg-white p-4 shadow-sm">

      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4e2e9] text-[#70254e]">
        {icon}
      </div>


      {/* Content */}
      <div className="min-w-0">

        {/* Value */}
        <p className="text-lg font-semibold text-[#3f1731]">
          {value}
        </p>

        {/* Title */}
        <p className="text-xs font-medium text-[#4d2940]">
          {title}
        </p>

        {/* Subtitle */}
        <p className="truncate text-[10px] text-gray-400">
          {subtitle}
        </p>

      </div>

    </div>
  );
};

export default StatsCard;