import React, { useMemo, useState } from "react";

import PropertyHeader from "../components/owner/MyProperties/PropertyHeader";
// import PropertyFilters from "../components/owner/MyProperties/PropertyFilters";
import PropertyFilters from "../components/owner/MyProperties/PropertyFilters";
import PropertyCard from "../components/owner/MyProperties/PropertyCard";
import PropertyPromoBanner from "../components/owner/MyProperties/PropertyPromoBanner";

function MyProperties() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const properties = [
    {
      id: 1,
      name: "Serenity Villa",
      location: "Coorg, Karnataka",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
      status: "Active",
      occupancy: 82,
      revenue: "₹1,25,000",
      bookings: 12,
      beds: 3,
      baths: 3,
      sqft: "1,800",
      type: "active",
    },
    {
      id: 2,
      name: "Lakeside Retreat",
      location: "Udaipur, Rajasthan",
      image:
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
      status: "Active",
      occupancy: 76,
      revenue: "₹98,500",
      bookings: 8,
      beds: 2,
      baths: 2,
      sqft: "1,200",
      type: "active",
    },
    {
      id: 3,
      name: "Urban Nest",
      location: "Bangalore, Karnataka",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      status: "Inactive",
      occupancy: 0,
      revenue: "₹0",
      bookings: 0,
      beds: 2,
      baths: 2,
      sqft: "1,000",
      type: "inactive",
    },
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesTab =
        activeTab === "all" || property.type === activeTab;

      const matchesSearch =
        property.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        property.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  return (
    <div>

      {/* Header */}
      <PropertyHeader />

      {/* Filters + Search */}
      <PropertyFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Property Cards */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              name={property.name}
              location={property.location}
              image={property.image}
              status={property.status}
              occupancy={property.occupancy}
              revenue={property.revenue}
              bookings={property.bookings}
              beds={property.beds}
              baths={property.baths}
              sqft={property.sqft}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <h3 className="font-serif text-xl text-[#54213f]">
            No properties found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or selected filter.
          </p>
        </div>
      )}

      {/* Bottom Banner */}
      
      <div className="mt-8">
        <PropertyPromoBanner />

      </div>
    </div>
  );
}

export default MyProperties;