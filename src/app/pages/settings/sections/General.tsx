// BranchProfile.tsx or General.tsx
import { PhoneIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import { HiPencil } from "react-icons/hi";
import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Input, Upload } from "@/components/ui";
import apiHelper from "@/utils/apiHelper";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthContext } from "@/app/contexts/auth/context";

export default function General() {
  console.log("GENERAL COMPONENT RENDERED");
  const savedUser = JSON.parse(localStorage.getItem("branchUser") || "{}");
  const id = savedUser?.id;
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState<File | null>(null);
  const [branch, setBranch] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Location states
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateCode, setStateCode] = useState("");

  // Country/State/City options
  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
  }, []);

  const stateOptions = useMemo(() => {
    if (!country) return [];
    return State.getStatesOfCountry(country).map((state) => ({
      value: state.isoCode,
      label: state.name,
      state,
    }));
  }, [country]);

  const cityOptions = useMemo(() => {
    if (!country || !state) return [];
    return City.getCitiesOfState(country, state).map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [country, state]);
  const fetchBranch = async () => {
    try {
      setLoading(true);

      const response = await apiHelper.get(`/branch/${id}`);

      console.log("API Response:", response);

      setCountry(response.countryCode || "");
      setState(response.stateCode || "");
      setStateCode(response.stateCode || "");
      setCity(response.city || "");
      setDistrict(response.district || "");

      setBranch(response);
    } catch (err) {
      console.log("API ERROR", err);
    } finally {
      console.log("Finally executed");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBranch();
    } else {
      toast.error("Branch ID not found");
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Append all branch fields (skip nested objects / handled separately)
      Object.keys(branch).forEach((key) => {
        if (
          key === "manager" ||
          key === "managerId" ||
          key === "company" ||
          key === "financialYear" ||
          key === "createdAt" ||
          key === "updatedAt"
        )
          return;
        if (branch[key] !== undefined && branch[key] !== null) {
          formData.append(key, String(branch[key]));
        }
      });

      // Manager id sent exactly once
      const managerId = branch.manager?.id ?? branch.managerId;
      if (managerId) {
        formData.append("managerId", String(managerId));
      }
      if (avatar) {
        formData.append("logo", avatar);
      }

      await apiHelper.put(`/branch/${branch.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditing(false);
      setAvatar(null);
      await fetchBranch();
      toast.success("Branch updated successfully");
    } catch (error: any) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.log("Error:", error);

      toast.error(error.response?.data?.message || "Failed to update branch");
    }
  };

  const isDark = () => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  };

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: state.isFocused
        ? "var(--color-primary-600)"
        : isDark()
          ? "var(--color-dark-450)"
          : "var(--color-gray-300)",
      boxShadow: state.isFocused
        ? "0 0 0 1px var(--color-primary-600)"
        : "none",
      minHeight: "42px",
      opacity: 1,
      "&:hover": {
        borderColor: state.isFocused
          ? "var(--color-primary-600)"
          : isDark()
            ? "var(--color-dark-400)"
            : "var(--color-gray-400)",
      },
    }),

    valueContainer: (provided: any) => ({
      ...provided,
      color: isDark() ? "var(--color-dark-100)" : "var(--color-gray-800)",
    }),

    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: state.isDisabled
        ? isDark()
          ? "var(--color-dark-100)"
          : "var(--color-gray-800)"
        : isDark()
          ? "var(--color-dark-100)"
          : "var(--color-gray-800)",
      opacity: 1,
    }),

    input: (provided: any) => ({
      ...provided,
      color: isDark() ? "var(--color-dark-100)" : "var(--color-gray-800)",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "var(--color-gray-400)",
    }),

    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark() ? "var(--color-dark-700)" : "#ffffff",
      border: isDark()
        ? "1px solid var(--color-dark-450)"
        : "1px solid var(--color-gray-300)",
      borderRadius: "0.75rem",
      overflow: "hidden",
    }),

    menuList: (provided: any) => ({
      ...provided,
      padding: 0,
      // Custom scrollbar styles
      "::-webkit-scrollbar": {
        width: "6px",
      },
      "::-webkit-scrollbar-track": {
        background: isDark() ? "var(--color-dark-600)" : "#f3f4f6",
      },
      "::-webkit-scrollbar-thumb": {
        background: isDark() ? "var(--color-primary-600)" : "#d1d5db",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: isDark() ? "var(--color-primary-500)" : "#9ca3af",
      },
      scrollbarWidth: "thin",
      scrollbarColor: isDark()
        ? "var(--color-primary-600) var(--color-dark-600)"
        : "#d1d5db #f3f4f6",
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--color-primary-600)"
        : state.isFocused
          ? isDark()
            ? "var(--color-dark-600)"
            : "var(--color-gray-100)"
          : isDark()
            ? "var(--color-dark-700)"
            : "#ffffff",
      color: state.isSelected
        ? "#ffffff"
        : isDark()
          ? "#ffffff"
          : "var(--color-gray-800)",
      cursor: "pointer",
    }),

    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: isDark() ? "var(--color-gray-400)" : "var(--color-gray-500)",
    }),

    clearIndicator: (provided: any) => ({
      ...provided,
      color: isDark() ? "var(--color-gray-400)" : "var(--color-gray-500)",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };
  // Loading state
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Loading branch details...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !branch) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <div className="text-center text-red-500 dark:text-red-400">
          <p className="text-lg font-semibold">{error || "Branch not found"}</p>
          <p className="mt-2 text-sm text-gray-500">
            The branch you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate("/branches")}>
          <ArrowLeftIcon className="mr-1.5 size-4.5" />
          Back to Branches
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex cursor-pointer items-center text-sm text-gray-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeftIcon className="mr-1.5 size-4" />
        Back to Branches
      </button>

      {/* Header with Avatar */}
      <div className="flex items-center justify-between">
        <h5 className="dark:text-dark-50 text-lg font-medium text-gray-800">
          {branch?.branchName || "Branch Profile"}
        </h5>

        <div className="mt-4 flex flex-col space-y-1.5">
          <Avatar
            size={20}
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : branch?.logo
                  ? apiHelper.getImageUrl(branch.logo)
                  : "/images/avatar/avatar-20.jpg"
            }
            classNames={{
              root: "ring-primary-600 dark:ring-primary-500 dark:ring-offset-dark-700 rounded-xl ring-offset-[3px] ring-offset-white transition-all hover:ring-3",
              display: "rounded-xl",
            }}
            indicator={
              isEditing && (
                <div className="dark:bg-dark-700 absolute right-0 bottom-0 -m-1 flex items-center justify-center rounded-full bg-white">
                  {avatar ? (
                    <Button
                      onClick={() => setAvatar(null)}
                      isIcon
                      className="size-6 rounded-full"
                    >
                      <XMarkIcon className="size-4" />
                    </Button>
                  ) : (
                    <Upload
                      name="avatar"
                      onChange={(files) => setAvatar(files[0])}
                      accept="image/*"
                    >
                      {(props) => (
                        <Button
                          isIcon
                          className="size-6 rounded-full"
                          {...props}
                        >
                          <HiPencil className="size-3.5" />
                        </Button>
                      )}
                    </Upload>
                  )}
                </div>
              )
            }
          />
        </div>
      </div>

      <div className="dark:bg-dark-500 my-5 h-px bg-gray-200" />

      {/* Form Fields */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 [&_.prefix]:pointer-events-none">
        {/* Branch Code */}
        <Input
          label="Branch Code"
          value={branch?.branchCode || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              branchCode: e.target.value,
            })
          }
          className="rounded-xl"
          prefix={<BuildingOfficeIcon className="size-4.5" />}
        />

        {/* Branch Name */}
        <Input
          label="Branch Name"
          value={branch?.branchName || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              branchName: e.target.value,
            })
          }
          className="rounded-xl"
          prefix={<UserIcon className="size-4.5" />}
        />

        {/* Branch Type */}
        <Input
          label="Branch Type"
          value={branch?.branchType || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              branchType: e.target.value,
            })
          }
          className="rounded-xl"
          prefix={<BuildingOfficeIcon className="size-4.5" />}
        />

        {/* Manager Name */}
        <Input
          label="Manager Name"
          value={branch?.manager?.accountName || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              manager: {
                ...branch.manager,
                accountName: e.target.value,
              },
            })
          }
          className="rounded-xl"
          prefix={<UserIcon className="size-4.5" />}
        />

        {/* Mobile Number */}
        <Input
          label="Mobile Number"
          value={branch?.mobileNo || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              mobileNo: e.target.value,
            })
          }
          className="rounded-xl"
          prefix={<PhoneIcon className="size-4.5" />}
        />

        {/* Gmail ID */}
        <Input
          label="Gmail ID"
          value={branch?.gmailId || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              gmailId: e.target.value,
            })
          }
          className="rounded-xl"
          prefix={<EnvelopeIcon className="size-4.5" />}
        />

        {/* GST Number */}
        <Input
          label="GST Number"
          value={branch?.gstNo || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              gstNo: e.target.value,
            })
          }
          className="rounded-xl"
        />

        {/* PAN Card Number */}
        <Input
          label="PAN Card Number"
          value={branch?.panCardNo || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              panCardNo: e.target.value,
            })
          }
          className="rounded-xl"
        />

        {/* Country */}

        <div>
          <label className="mb-1 inline-block">Country</label>
          {isEditing ? (
            <Select
              classNamePrefix="react-select"
              options={countryOptions}
              styles={customSelectStyles}
              value={countryOptions.find(
                (c) => c.value === branch?.countryCode,
              )}
              onChange={(selected: any) => {
                setCountry(selected?.value || "");
                setBranch({
                  ...branch,
                  countryCode: selected?.value || "",
                  country: selected?.label || "",
                  stateCode: "",
                  state: "",
                  district: "",
                  city: "",
                });
                setState("");
                setStateCode("");
                setDistrict("");
                setCity("");
              }}
            />
          ) : (
            <div
              className="flex h-[42px] items-center rounded-xl px-3"
              style={{
                border: isDark()
                  ? "1px solid var(--color-dark-500)"
                  : "1px solid var(--color-gray-300)",
                backgroundColor: "transparent",
                color: isDark()
                  ? "var(--color-dark-100)"
                  : "var(--color-gray-800)",
              }}
            >
              {countryOptions.find((c) => c.value === branch?.countryCode)
                ?.label || "-"}
            </div>
          )}
        </div>

        {/* State */}
        <div>
          <label className="mb-1 inline-block">State</label>
          {isEditing ? (
            <Select
              classNamePrefix="react-select"
              options={stateOptions}
              styles={customSelectStyles}
              value={stateOptions.find((s) => s.value === state)}
              onChange={(selected: any) => {
                setState(selected?.value || "");
                setStateCode(selected?.state?.isoCode || "");
                setBranch({
                  ...branch,
                  stateCode: selected?.value || "",
                  state: selected?.label || "",
                  district: "",
                  city: "",
                });
                setDistrict("");
                setCity("");
              }}
            />
          ) : (
            <div
              className="flex h-[42px] items-center rounded-xl px-3"
              style={{
                border: isDark()
                  ? "1px solid var(--color-dark-500)"
                  : "1px solid var(--color-gray-300)",
                backgroundColor: "transparent",
                color: isDark()
                  ? "var(--color-dark-100)"
                  : "var(--color-gray-800)",
              }}
            >
              {stateOptions.find((s) => s.value === state)?.label || "-"}
            </div>
          )}
        </div>
        {/* State Code (Readonly) */}
        <Input
          label="State Code"
          value={branch?.stateCode || ""}
          readOnly
          className="rounded-xl"
        />

        {/* District */}
        {/* District */}
        <div>
          <label className="mb-1 inline-block">District</label>
          {isEditing ? (
            <Select
              classNamePrefix="react-select"
              options={cityOptions}
              styles={customSelectStyles}
              value={cityOptions.find((d) => d.value === branch?.district)}
              onChange={(selected: any) => {
                setDistrict(selected?.value || "");
                setBranch({
                  ...branch,
                  district: selected?.value || "",
                });
              }}
            />
          ) : (
            <div
              className="flex h-[42px] items-center rounded-xl px-3"
              style={{
                border: isDark()
                  ? "1px solid var(--color-dark-500)"
                  : "1px solid var(--color-gray-300)",
                backgroundColor: "transparent",
                color: isDark()
                  ? "var(--color-dark-100)"
                  : "var(--color-gray-800)",
              }}
            >
              {cityOptions.find((d) => d.value === branch?.district)?.label ||
                "-"}
            </div>
          )}
        </div>
        {/* City */}
        {/* City */}
        <div>
          <label className="mb-1 inline-block">City</label>
          {isEditing ? (
            <Select
              classNamePrefix="react-select"
              options={cityOptions}
              styles={customSelectStyles}
              value={cityOptions.find((c) => c.value === branch?.city)}
              onChange={(selected: any) => {
                setCity(selected?.value || "");
                setBranch({
                  ...branch,
                  city: selected?.value || "",
                });
              }}
            />
          ) : (
            <div
              className="flex h-[42px] items-center rounded-xl px-3"
              style={{
                border: isDark()
                  ? "1px solid var(--color-dark-500)"
                  : "1px solid var(--color-gray-300)",
                backgroundColor: "transparent",
                color: isDark()
                  ? "var(--color-dark-100)"
                  : "var(--color-gray-800)",
              }}
            >
              {cityOptions.find((c) => c.value === branch?.city)?.label || "-"}
            </div>
          )}
        </div>
        {/* PIN Code */}
        <Input
          label="PIN Code"
          value={branch?.pinCode || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              pinCode: e.target.value,
            })
          }
          className="rounded-xl"
        />

        {/* Address Line 1 */}
        <Input
          label="Address Line 1"
          value={branch?.address1 || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              address1: e.target.value,
            })
          }
          className="rounded-xl"
        />

        {/* Address Line 2 */}
        <Input
          label="Address Line 2"
          value={branch?.address2 || ""}
          readOnly={!isEditing}
          onChange={(e) =>
            setBranch({
              ...branch,
              address2: e.target.value,
            })
          }
          className="rounded-xl"
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-3">
        {!isEditing ? (
          <Button color="primary" onClick={() => setIsEditing(true)}>
            <PencilSquareIcon className="size-4" />
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                setIsEditing(false);
                fetchBranch();
                toast.info("Changes discarded");
              }}
            >
              Cancel
            </Button>
            <Button color="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
