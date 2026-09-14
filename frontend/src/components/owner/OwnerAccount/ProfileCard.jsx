import React, { useState } from "react";
import { Mail, Phone, MapPin, Pencil } from "lucide-react";
import EditOwnerModal from "./EditOwnerModal";

function ProfileCard({ owner, setOwner }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = (updatedOwner) => {
    setOwner(updatedOwner);
    setIsModalOpen(false);
  };

  // Generate initials from owner name
  const initials = owner.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="rounded-xl border border-[#eadde3] bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f2dce6] text-lg font-medium text-[#713653]">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-semibold text-[#54213f]">
                  {owner.name}
                </h2>

                {owner.is_active && (
                  <span className="rounded-full bg-[#f7e5ee] px-2 py-1 text-[9px] font-medium text-[#713653]">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={13} />
                  <span>{owner.email}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={13} />
                  <span>{owner.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={13} />
                  <span>Bangalore, Karnataka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[#681744] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#54213f]"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <EditOwnerModal
          owner={owner}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default ProfileCard;