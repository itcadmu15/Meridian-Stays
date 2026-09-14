import React, { useState } from "react";
import { X } from "lucide-react";

function EditOwnerModal({ owner, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: owner.name || "",
    email: owner.email || "",
    phone: owner.phone || "",
    payout_terms: owner.payout_terms || "Monthly",
    payout_percentage: owner.payout_percentage ?? 80,
    is_active: owner.is_active ?? true,
  });

  const [errors, setErrors] = useState({});

  // Name: letters and spaces only
  const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

  // Phone: exactly 10 digits
  const phoneRegex = /^[0-9]{10}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number: allow digits only and maximum 10 digits
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");

      if (onlyDigits.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          phone: onlyDigits,
        }));

        // Clear phone error while typing
        setErrors((prev) => ({
          ...prev,
          phone: "",
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleStatusChange = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const payoutPercentage = Number(formData.payout_percentage);

    const newErrors = {};

    // Name validation
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name should contain only letters and spaces.";
    }

    // Phone validation
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must contain exactly 10 digits.";
    }

    // Payout percentage validation
    if (
      formData.payout_percentage === "" ||
      Number.isNaN(payoutPercentage)
    ) {
      newErrors.payout_percentage = "Payout percentage is required.";
    } else if (payoutPercentage < 0 || payoutPercentage > 100) {
      newErrors.payout_percentage =
        "Payout percentage must be between 0 and 100.";
    }

    // Stop submission if there are validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedOwner = {
      ...formData,
      name,
      phone,
      payout_percentage: payoutPercentage,
    };

    // Frontend only — sends updated data back to ProfileCard
    onSave(updatedOwner);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eadde3] px-6 py-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#54213f]">
              Edit Owner Profile
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Update your profile and payout preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              pattern="^[A-Za-z]+(?:\s[A-Za-z]+)*$"
              title="Name should contain only letters and spaces."
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#eadde3] ${
                errors.name
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              placeholder="Enter your name"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 outline-none"
            />

            <p className="mt-1 text-[10px] text-gray-400">
              Email address cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              inputMode="numeric"
              maxLength={10}
              pattern="[0-9]{10}"
              title="Phone number must contain exactly 10 digits."
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#eadde3] ${
                errors.phone
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              placeholder="Enter 10 digit phone number"
            />

            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone}
              </p>
            )}

            {!errors.phone && (
              <p className="mt-1 text-[10px] text-gray-400">
                Enter exactly 10 digits.
              </p>
            )}
          </div>

          {/* Payout Terms */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Payout Terms
            </label>

            <select
              name="payout_terms"
              value={formData.payout_terms}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#eadde3]"
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* Payout Percentage */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Payout Percentage
            </label>

            <div className="relative">
              <input
                type="number"
                name="payout_percentage"
                value={formData.payout_percentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                required
                className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-[#eadde3] ${
                  errors.payout_percentage
                    ? "border-red-400"
                    : "border-gray-200"
                }`}
                placeholder="80"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                %
              </span>
            </div>

            {errors.payout_percentage && (
              <p className="mt-1 text-xs text-red-500">
                {errors.payout_percentage}
              </p>
            )}

            {!errors.payout_percentage && (
              <p className="mt-1 text-[10px] text-gray-400">
                Enter a value between 0 and 100.
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-lg border border-[#eadde3] bg-[#faf7f8] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Account Status
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                {formData.is_active
                  ? "Your account is currently active."
                  : "Your account is currently inactive."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleStatusChange}
              className={`relative h-6 w-11 rounded-full transition ${
                formData.is_active
                  ? "bg-[#681744]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  formData.is_active
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-[#eadde3] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#681744] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#54213f]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditOwnerModal;