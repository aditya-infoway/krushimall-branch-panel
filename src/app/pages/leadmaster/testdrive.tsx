// TestDriveModal.tsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Combobox } from "@/components/shared/form/Combobox";
import { DatePicker } from "@/components/shared/form/Datepicker";
import { Timepicker } from "@/components/shared/form/Timepicker";
import apiHelper from "@/utils/apiHelper";
import { toast } from "sonner";

interface TestDriveFormData {
  modelId: number | null;
  variantId: number | null;
  colourId: number | null;
  testDriveDate: string;
  testDriveFromTime: string;
  testDriveToTime: string;
  duration: string;
  vehicleSpeedometerRunning: string;
  licenceNo: string;
  feedback: string;
  remarks: string;
  placeOfTestDrive: "Dealership" | "Other Place";
}

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: number;
  onSuccess?: () => void;
}

export function TestDriveModal({
  isOpen,
  onClose,
  leadId,
  onSuccess,
}: TestDriveModalProps) {
  const [formData, setFormData] = useState<TestDriveFormData>({
    modelId: null,
    variantId: null,
    colourId: null,
    testDriveDate: "",
    testDriveFromTime: "",
    testDriveToTime: "",
    duration: "",
    vehicleSpeedometerRunning: "",
    licenceNo: "",
    feedback: "",
    remarks: "",
    placeOfTestDrive: "Dealership",
  });

  const [models, setModels] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [filteredVariants, setFilteredVariants] = useState<any[]>([]);
  const [filteredColors, setFilteredColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch dropdown data
  useEffect(() => {
    if (isOpen) {
      fetchModels();
      fetchColors();
    }
  }, [isOpen]);

  const fetchModels = async () => {
    try {
      const res = await apiHelper.get("/model");
      const data = Array.isArray(res.data) ? res.data : [];
      setModels(
        data.map((item: any) => ({
          id: item.id,
          name: item.modelName,
        })),
      );
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchVariants = async (modelId: number) => {
    try {
      const res = await apiHelper.get(`/showroom-variant?modelId=${modelId}`);
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      setVariants(
        data.map((item: any) => ({
          id: item.id,
          name: item.variantName,
          modelId: item.modelId,
        })),
      );
      setFilteredVariants(
        data.map((item: any) => ({
          id: item.id,
          name: item.variantName,
          modelId: item.modelId,
        })),
      );
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const fetchColors = async () => {
    try {
      const res = await apiHelper.get("/colours");
      const data = Array.isArray(res.data) ? res.data : [];
      setColors(
        data.map((item: any) => ({
          id: item.id,
          name: item.colourName,
          showroomVariantId: item.showroomVariantId,
        })),
      );
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const handleModelChange = (model: any) => {
    setFormData((prev) => ({
      ...prev,
      modelId: model?.id || null,
      variantId: null,
      colourId: null,
    }));
    if (model) {
      fetchVariants(model.id);
      setFilteredColors([]);
    } else {
      setFilteredVariants([]);
      setFilteredColors([]);
    }
  };

  const handleVariantChange = (variant: any) => {
    setFormData((prev) => ({
      ...prev,
      variantId: variant?.id || null,
      colourId: null,
    }));
    if (variant) {
      const filtered = colors.filter(
        (c: any) => Number(c.showroomVariantId) === Number(variant.id),
      );
      setFilteredColors(filtered);
    } else {
      setFilteredColors([]);
    }
  };

  const handleColorChange = (color: any) => {
    setFormData((prev) => ({ ...prev, colourId: color?.id || null }));
    if (errors.colourId) {
      const newErrors = { ...errors };
      delete newErrors.colourId;
      setErrors(newErrors);
    }
  };

  const handleInputChange = (field: keyof TestDriveFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.modelId) newErrors.modelId = "Model is required";
    if (!formData.variantId) newErrors.variantId = "Variant is required";
    if (!formData.colourId) newErrors.colourId = "Colour is required";
    if (!formData.testDriveDate)
      newErrors.testDriveDate = "Test Drive Date is required";
    if (!formData.testDriveFromTime)
      newErrors.testDriveFromTime = "From Time is required";
    if (!formData.testDriveToTime)
      newErrors.testDriveToTime = "To Time is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.licenceNo) newErrors.licenceNo = "Licence No is required";
    if (!formData.feedback) newErrors.feedback = "Feedback is required";
    if (!formData.vehicleSpeedometerRunning)
      newErrors.vehicleSpeedometerRunning =
        "Vehicle Speedometer Reading is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validate()) return;

  setLoading(true);
  try {
    const payload = {
      leadId: leadId,
      modelId: formData.modelId,
      variantId: formData.variantId,
      colourId: formData.colourId,
      testDriveDate: formData.testDriveDate,
      testDriveFromTime: formData.testDriveFromTime,
      testDriveToTime: formData.testDriveToTime,
      duration: formData.duration,
      vehicleSpeedometerRunning: formData.vehicleSpeedometerRunning,
      licenceNo: formData.licenceNo,
      feedback: formData.feedback,
      remarks: formData.remarks,
      placeOfTestDrive: formData.placeOfTestDrive,
    };

    await apiHelper.post("/test-drives", payload);
    
    toast.success("Test drive added successfully!");

    if (onSuccess) onSuccess();
    onClose();
  } catch (error: any) {
    console.error("Error submitting test drive:", error);
    toast.error(error.response?.data?.message || "Failed to add test drive. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/60"
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <DialogPanel className="dark:bg-dark-700 flex h-full w-screen max-w-2xl flex-col bg-white shadow-xl">
          {/* Header - Matches your theme exactly */}
          <div className="dark:bg-dark-600 flex items-center justify-between bg-[#003399] px-6 py-4">
            <DialogTitle className="dark:text-dark-50 font-semibold text-white">
              Add Test Drive
            </DialogTitle>
            <button
              onClick={onClose}
              className="dark:text-dark-200 text-white/80 hover:text-white dark:hover:text-white"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Model */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Model
                </label>
                <Combobox
                  data={models}
                  displayField="name"
                  value={models.find((m) => m.id === formData.modelId) || null}
                  onChange={handleModelChange}
                  placeholder="Select Model"
                  searchFields={["name"]}
                />
                {errors.modelId && (
                  <span className="text-xs text-orange-500">
                    {errors.modelId}
                  </span>
                )}
              </div>

              {/* Variant */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Variant
                </label>
                <Combobox
                  data={filteredVariants}
                  displayField="name"
                  value={
                    filteredVariants.find((v) => v.id === formData.variantId) ||
                    null
                  }
                  onChange={handleVariantChange}
                  placeholder="Select Variant"
                  searchFields={["name"]}
                />
                {errors.variantId && (
                  <span className="text-xs text-orange-500">
                    {errors.variantId}
                  </span>
                )}
              </div>

              {/* Colour */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Colour
                </label>
                <Combobox
                  data={filteredColors}
                  displayField="name"
                  value={
                    filteredColors.find((c) => c.id === formData.colourId) ||
                    null
                  }
                  onChange={handleColorChange}
                  placeholder="Select Colour"
                  searchFields={["name"]}
                />
                {errors.colourId && (
                  <span className="text-xs text-orange-500">
                    {errors.colourId}
                  </span>
                )}
              </div>

              {/* Test Drive Date */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Test Drive Date
                </label>
                <DatePicker
                  value={formData.testDriveDate}
                  onChange={(val) => handleInputChange("testDriveDate", val)}
                  placeholder="DD-MM-YYYY"
                  options={{ dateFormat: "d-m-Y", disableMobile: true }}
                />
                {errors.testDriveDate && (
                  <span className="text-xs text-orange-500">
                    {errors.testDriveDate}
                  </span>
                )}
              </div>

              {/* Test Drive From Time */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  From Time
                </label>
                <Timepicker
                  value={formData.testDriveFromTime}
                  onChange={(val) =>
                    handleInputChange("testDriveFromTime", val)
                  }
                  placeholder="Select time"
                />
                {errors.testDriveFromTime && (
                  <span className="text-xs text-orange-500">
                    {errors.testDriveFromTime}
                  </span>
                )}
              </div>

              {/* Test Drive To Time */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  To Time
                </label>
                <Timepicker
                  value={formData.testDriveToTime}
                  onChange={(val) => handleInputChange("testDriveToTime", val)}
                  placeholder="Select time"
                />
                {errors.testDriveToTime && (
                  <span className="text-xs text-orange-500">
                    {errors.testDriveToTime}
                  </span>
                )}
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30 mins"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.duration && (
                  <span className="text-xs text-orange-500">
                    {errors.duration}
                  </span>
                )}
              </div>

              {/* Vehicle Speedometer Running */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  <span className="md:hidden">Vehicle Speedometer</span>
                  <span className="hidden md:inline">
                    Vehicle Speedometer Running
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter reading"
                  value={formData.vehicleSpeedometerRunning}
                  onChange={(e) =>
                    handleInputChange(
                      "vehicleSpeedometerRunning",
                      e.target.value,
                    )
                  }
                  className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.vehicleSpeedometerRunning && (
                  <span className="text-xs text-orange-500">
                    {errors.vehicleSpeedometerRunning}
                  </span>
                )}
              </div>

              {/* Licence No */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Licence No
                </label>
                <input
                  type="text"
                  placeholder="Enter licence number"
                  value={formData.licenceNo}
                  onChange={(e) =>
                    handleInputChange("licenceNo", e.target.value)
                  }
                  className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.licenceNo && (
                  <span className="text-xs text-orange-500">
                    {errors.licenceNo}
                  </span>
                )}
              </div>

              {/* Feedback */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Feedback
                </label>
                <Combobox
                  data={[
                    { id: "Excellent", name: "Excellent" },
                    { id: "Good", name: "Good" },
                    { id: "Average", name: "Average" },
                    { id: "Poor", name: "Poor" },
                  ]}
                  displayField="name"
                  value={
                    formData.feedback
                      ? { id: formData.feedback, name: formData.feedback }
                      : null
                  }
                  onChange={(val: any) =>
                    handleInputChange("feedback", val?.id || "")
                  }
                  placeholder="Select Feedback"
                />
                {errors.feedback && (
                  <span className="text-xs text-orange-500">
                    {errors.feedback}
                  </span>
                )}
              </div>

              {/* Remarks - Full Width */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Place of Test Drive - Full Width */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Mention the Place of Test Drive Given
                </label>
                <div className="flex gap-6">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="placeOfTestDrive"
                      value="Dealership"
                      checked={formData.placeOfTestDrive === "Dealership"}
                      onChange={() =>
                        handleInputChange("placeOfTestDrive", "Dealership")
                      }
                      className="h-4 w-4 accent-blue-600"
                    />
                    Dealership
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="placeOfTestDrive"
                      value="Other Place"
                      checked={formData.placeOfTestDrive === "Other Place"}
                      onChange={() =>
                        handleInputChange("placeOfTestDrive", "Other Place")
                      }
                      className="h-4 w-4 accent-blue-600"
                    />
                    Other Place
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="dark:border-dark-500 flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="dark:border-dark-500 dark:text-dark-200 dark:hover:bg-dark-600 rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
