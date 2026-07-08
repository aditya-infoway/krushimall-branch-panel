// Import Dependencies
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import apiHelper from "@/utils/apiHelper";

// Local UI Imports
import { Button, Checkbox, Input } from "@/components/ui";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import { Listbox } from "@/components/shared/form/StyledListbox";

// ─── Types ───────────────────────────────────────────────────────────
type Accessory = {
  accessoryId?: number;
  name: string;
  qty: number;
  price: number;
  taxPercent: number;
  totalPrice: number;
};

type FormValues = {
  modelId: number | string;
  modelName: string;
  variantName: string;
  purPrice: string;
  purTaxPercent: string;
  exShowroomPrice: string;
  exShowroomTaxPercent: string;
  insurance: string;
  insuranceTaxPercent: string;
  rtoCharge: string;
  rtoTaxType: string;
  rtoTaxPercent: string;
  salesPrice: string;
  status: string;
};

// ─── Constants ────────────────────────────────────────────────────────
const taxOptions = [
  { id: "0", name: "0%" },
  { id: "5", name: "5%" },
  { id: "12", name: "12%" },
  { id: "18", name: "18%" },
  { id: "28", name: "28%" },
];

const rtoTaxTypes = [
  { id: "Agriculture", name: "Agriculture (1%)" },
  { id: "Commercial", name: "Commercial (10%)" },
];

const RTO_TAX_MAP: Record<string, string> = {
  Agriculture: "1",
  Commercial: "10",
};

const accessoryOptions = [
  "Alloy Wheels",
  "Sunroof",
  "Leather Seats",
  "Navigation System",
  "Premium Audio",
  "Parking Sensors",
  "Rear Camera",
  "Ambient Lighting",
  "Keyless Entry",
  "Push Start",
  "Floor Mats",
  "Roof Rails",
  "Tow Bar",
  "Running Boards",
  "Spoiler",
];

const statusOptions = [
  { id: "ACTIVE", name: "On" },
  { id: "INACTIVE", name: "Off" },
];

// ─── Helper: Calculate price with tax ──────────────────────────────────
const calcWithTax = (price: number, taxPercent: number) =>
  price + (price * taxPercent) / 100;

// ─── Custom Combobox Component ──────────────────────────────────────
const AccessoryCombobox = ({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  options: any[];
  placeholder?: string;
  error?: string;
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
const [filteredOptions, setFilteredOptions] =
  useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);

    if (val.trim()) {
     const filtered = options.filter((opt) =>
  opt.itemName.toLowerCase().includes(val.toLowerCase())
);
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredOptions(options);
      setShowDropdown(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

const handleFocus = () => {
  setFilteredOptions(options);
  setShowDropdown(true);
};

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder || "Type or select accessory..."}
        className={`dark:border-dark-500 dark:bg-dark-800 focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {showDropdown && filteredOptions.length > 0 && (
        <div className="dark:border-dark-500 dark:bg-dark-700 absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filteredOptions.map((option) => (
            <div
               key={option.id}
              className="dark:hover:bg-dark-600 cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-gray-100"
              onClick={() => handleOptionSelect(option.itemName)}
            >
              {option.itemName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ShowroomVariantPage() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedModelFilter, setSelectedModelFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
const [accessoryOptions, setAccessoryOptions] = useState<any[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([
    { name: "",   qty: 0, price: 0, taxPercent: 0, totalPrice: 0 },
  ]);
  const [accessoryErrors, setAccessoryErrors] = useState<{
    [key: number]: string;
  }>({});

  const modelOptions = models.map((m) => ({ id: String(m.id), name: m.name }));

  useEffect(() => {
    getVariants();
    getModels();
      getAccessories();
  }, []);

  const getVariants = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.get("/showroom-variant");
      let data = response?.data || response;
      if (!Array.isArray(data)) data = [];
      setVariants(data);
       console.log("", data);
    console.log("Accessories:", accessories);
    } catch (error) {
      console.error(error);
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  const getModels = async () => {
    try {
      const response = await apiHelper.get("/model");
      const data = response?.data || response;
      setModels(
        (Array.isArray(data) ? data : []).map((item: any) => ({
          id: item.id || item._id,
          name: item.modelName || item.name,
        })),
      );
    } catch (error) {
      setModels([]);
    }
  };
const getAccessories = async () => {
  try {
    const res = await apiHelper.get("/accessories");

    const data = res.data || [];

    console.log("Accessories API:", data);

    setAccessoryOptions(data);
  } catch (error) {
    console.error(error);
  }
};
  // ─── Validation Rules ──────────────────────────────────────────────
  const validationRules = {
    modelId: {
      required: "Model is required",
    },
    variantName: {
      required: "Variant name is required",
      minLength: {
        value: 2,
        message: "Variant name must be at least 2 characters",
      },
    },
    purPrice: {
      required: "Purchase price is required",
      min: {
        value: 0,
        message: "Price must be greater than 0",
      },
    },
    exShowroomPrice: {
      required: "Ex-showroom price is required",
      min: {
        value: 0,
        message: "Price must be greater than 0",
      },
    },
    insurance: {
      required: "Insurance amount is required",
      min: {
        value: 0,
        message: "Insurance must be greater than 0",
      },
    },
    rtoCharge: {
      required: "RTO charge is required",
      min: {
        value: 0,
        message: "RTO charge must be greater than 0",
      },
    },
    purTaxPercent: {
      required: "Tax percentage is required",
    },
    exShowroomTaxPercent: {
      required: "Tax percentage is required",
    },
    insuranceTaxPercent: {
      required: "Tax percentage is required",
    },
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      modelId: "",
      modelName: "",
      variantName: "",
      purPrice: "",
      purTaxPercent: "18",
      exShowroomPrice: "",
      exShowroomTaxPercent: "18",
      insurance: "",
      insuranceTaxPercent: "18",
      rtoCharge: "",
      rtoTaxType: "Agriculture",
      rtoTaxPercent: "1",
      salesPrice: "",
      status: "ACTIVE",
    },
    mode: "onChange",
  });

  // All useWatch hooks at the top level
  const formModelValue = useWatch({ control, name: "modelName" });
  const formRtoTaxType = useWatch({ control, name: "rtoTaxType" });
  const formStatus = useWatch({ control, name: "status" });
  const purPrice = useWatch({ control, name: "purPrice" });
  const purTaxPercent = useWatch({ control, name: "purTaxPercent" });
  const exShowroomPrice = useWatch({ control, name: "exShowroomPrice" });
  const exShowroomTaxPercent = useWatch({
    control,
    name: "exShowroomTaxPercent",
  });
  const insurance = useWatch({ control, name: "insurance" });
  const insuranceTaxPercent = useWatch({
    control,
    name: "insuranceTaxPercent",
  });
  const rtoCharge = useWatch({ control, name: "rtoCharge" });
  const rtoTaxPercent = useWatch({ control, name: "rtoTaxPercent" });

  // Find current tax values for Listbox
  const currentPurTax =
    taxOptions.find((o) => o.id === purTaxPercent) || taxOptions[3];
  const currentExTax =
    taxOptions.find((o) => o.id === exShowroomTaxPercent) || taxOptions[3];
  const currentInsTax =
    taxOptions.find((o) => o.id === insuranceTaxPercent) || taxOptions[3];
  const displayRtoTotal = (
    Number(rtoCharge || 0) +
    (Number(rtoCharge || 0) * Number(rtoTaxPercent || 0)) / 100
  ).toFixed(2);
  // Auto-calculate Sales Price
  useEffect(() => {
    const pur = Number(purPrice || 0);
    const purTax = Number(purTaxPercent || 0);
    const ex = Number(exShowroomPrice || 0);
    const exTax = Number(exShowroomTaxPercent || 0);
    const ins = Number(insurance || 0);
    const insTax = Number(insuranceTaxPercent || 0);
    const rto = Number(rtoCharge || 0);
    const rtoTax = Number(rtoTaxPercent || 0);

    const purTotal = calcWithTax(pur, purTax);
    const exTotal = calcWithTax(ex, exTax);
    const insTotal = calcWithTax(ins, insTax);
    const rtoTotal = calcWithTax(rto, rtoTax);
    const accTotal = accessories.reduce(
      (sum, a) => sum + (a.totalPrice || 0),
      0,
    );

    const total = purTotal + exTotal + insTotal + rtoTotal + accTotal;
    setValue("salesPrice", total > 0 ? total.toFixed(2) : "");
  }, [
    purPrice,
    purTaxPercent,
    exShowroomPrice,
    exShowroomTaxPercent,
    insurance,
    insuranceTaxPercent,
    rtoCharge,
    rtoTaxPercent,
    accessories,
    setValue,
  ]);

  const handleRtoTaxTypeChange = (type: string) => {
    setValue("rtoTaxType", type);
    setValue("rtoTaxPercent", RTO_TAX_MAP[type] ?? "1");
  };

 const handleOpenAddDrawer = () => {
  setEditId(null);

  const firstModel = models[0] || {
    id: "",
    name: "",
  };

  setAccessories([
    {
      name: "",
      qty:0,
      price: 0,
      taxPercent: 0,
      totalPrice: 0,
    },
  ]);

  setAccessoryErrors({});

  reset({
    modelId: firstModel.id,
    modelName: firstModel.name,
    variantName: "",
    purPrice: "",
    purTaxPercent: "18",
    exShowroomPrice: "",
    exShowroomTaxPercent: "18",
    insurance: "",
    insuranceTaxPercent: "18",
    rtoCharge: "",
    rtoTaxType: "Agriculture",
    rtoTaxPercent: "1",
    salesPrice: "",
    status: "ACTIVE",
  });

  setShowDrawer(true);
};

const handleOpenEditDrawer = (item: any) => {
  setEditId(item.id);

  setAccessories(
    item.accessories?.length
      ? item.accessories.map((acc: any) => ({
        accessoryId: acc.accessoryId,



qty: Number(acc.qty) || 0,

price: Number(acc.price) || 0,
taxPercent: Number(acc.taxPercent) || 0,
totalPrice: Number(acc.totalPrice) || 0,
        }))
      : [{ name: "", price: 0, taxPercent: 0, totalPrice: 0 }]
  );

  setAccessoryErrors({});

  reset({
    modelId: item.modelId,
    modelName: item.model || "",
    variantName: item.variantName,
    purPrice: String(item.purPrice || ""),
    purTaxPercent: String(item.purTaxPercent || "18"),
    exShowroomPrice: String(item.exShowroomPrice || ""),
    exShowroomTaxPercent: String(item.exShowroomTaxPercent || "18"),
    insurance: String(item.insurance || ""),
    insuranceTaxPercent: String(item.insuranceTaxPercent || "18"),
    rtoCharge: String(item.rtoCharge || ""),
    rtoTaxType: item.rtoTaxType || "Agriculture",
    rtoTaxPercent: String(item.rtoTaxPercent || "1"),
    salesPrice: String(item.salesPrice || ""),
    status: item.status,
  });

  setShowDrawer(true);
};

  const handleDelete = async (id: number) => {
    try {
      await apiHelper.delete(`/showroom-variant/${id}`);
      getVariants();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => apiHelper.delete(`/showroom-variant/${id}`)),
      );
      await getVariants();
      setSelectedIds([]);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const addAccessory = () => {
    setAccessories([
      ...accessories,
      { name: "", qty: 0, price: 0, taxPercent: 0, totalPrice: 0 },
    ]);
    // Clear error for new accessory
    setAccessoryErrors({});
  };

  const removeAccessory = (index: number) => {
    if (accessories.length === 1) {
      setAccessories([{ name: "", qty: 0, price: 0, taxPercent: 0, totalPrice: 0 }]);
    } else {
      setAccessories(accessories.filter((_, i) => i !== index));
    }
    // Clear error for removed accessory
    const newErrors = { ...accessoryErrors };
    delete newErrors[index];
    setAccessoryErrors(newErrors);
  };
const calculateAccessoryTotal = (
  price: number,
  qty: number,
  taxPercent: number
) => {
  const subTotal = price * qty;
  const taxAmount = (subTotal * taxPercent) / 100;

  return subTotal + taxAmount;
};
const updateAccessory = (
  index: number,
  field: keyof Accessory,
  value: any
) => {
  const updated = [...accessories];

  updated[index] = {
    ...updated[index],
    [field]:
      field === "price" ||
      field === "taxPercent" ||
      field === "qty"
        ? Number(value)
        : value,
  };

  updated[index].totalPrice = calculateAccessoryTotal(
    Number(updated[index].price || 0),
    Number(updated[index].qty || 0),
    Number(updated[index].taxPercent || 0)
  );

  setAccessories(updated);
};

  // ─── Form Submit with Validation ───────────────────────────────────
  // ─── Form Submit with Validation ───────────────────────────────────
  const onFormSubmit = async (data: FormValues) => {
   

    // Validate accessories - make name required if row has any data
    const accessoryErrors: { [key: number]: string } = {};
    let hasAccessoryError = false;

    accessories.forEach((acc, index) => {
      const hasName = acc.name.trim() !== "";
      const hasPrice = acc.price > 0;
      const hasTax = acc.taxPercent > 0;

     

      // If name is empty AND (price > 0 OR tax > 0), show error
      if (!hasName && (hasPrice || hasTax)) {
        accessoryErrors[index] = "Accessory name is required";
        hasAccessoryError = true;
      }
    });

 

    // Set accessory errors
    if (hasAccessoryError) {
      setAccessoryErrors(accessoryErrors);
    } else {
      setAccessoryErrors({});
    }

    // Now check form validation
    const isValid = await trigger();
   

    // If either form has errors or accessories have errors, stop submission
    if (!isValid || hasAccessoryError) {
      // Scroll to first accessory error if any
      if (hasAccessoryError) {
        const firstErrorIndex = Object.keys(accessoryErrors)[0];
        if (firstErrorIndex) {
          const element = document.getElementById(
            `accessory-${firstErrorIndex}`,
          );
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
      return;
    }

    try {
      const payload = {
        modelId: Number(data.modelId),
        variantName: data.variantName,
        purPrice: Number(data.purPrice),
        purTaxPercent: Number(data.purTaxPercent),
        exShowroomPrice: Number(data.exShowroomPrice),
        exShowroomTaxPercent: Number(data.exShowroomTaxPercent),
        insurance: Number(data.insurance),
        insuranceTaxPercent: Number(data.insuranceTaxPercent),
        rtoCharge: Number(data.rtoCharge),
        rtoTaxType: data.rtoTaxType,
        rtoTaxPercent: Number(data.rtoTaxPercent),
        accessories: accessories.filter((a) => a.name.trim() !== ""),
        salesPrice: Number(data.salesPrice),
        status: data.status,
      };
        console.log("Payload:", payload);
      if (editId !== null)
        await apiHelper.put(`/showroom-variant/${editId}`, payload);
      else await apiHelper.post("/showroom-variant", payload);
      await getVariants();
    
      setShowDrawer(false);
      reset();
      setAccessoryErrors({});
    } catch (error) {
      console.error(error);
      alert("Failed to save variant. Please try again.");
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const filteredData = variants.filter((item) => {
    const matchesSearch =
      item.variantName?.toLowerCase().includes(search.toLowerCase()) ||
      item.model?.toLowerCase().includes(search.toLowerCase());
    const matchesModel =
      selectedModelFilter === "All" || item.model === selectedModelFilter;
    return matchesSearch && matchesModel;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const modelFilterOptions = [
    { id: "All", name: "All Models" },
    ...models.map((m) => ({ id: m.name, name: m.name })),
  ];

  const isAllPageSelected =
    currentItems.length > 0 &&
    currentItems.every((item) => selectedIds.includes(item.id));

  return (
    <div className="relative min-h-screen space-y-6 p-4 pb-28 text-gray-900 md:p-6 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 md:text-2xl dark:text-white">
            Showroom Variant List
          </h1>
          <p className="dark:text-dark-300 mt-1 text-sm text-gray-500">
            Manage showroom pricing and variants
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilterBar(!showFilterBar)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${showFilterBar ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-white" : "dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <FunnelIcon className="size-4.5" /> Filter
          </button>
         
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search variant..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="dark:border-dark-500 dark:bg-dark-800 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none"
        />
      </div>

      {/* Filters - Only Model filter */}
      {showFilterBar && (
        <div className="dark:bg-dark-700 dark:border-dark-500 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <span className="dark:text-dark-200 text-sm font-medium text-gray-700">
              Filter by Model
            </span>
            <div className="max-w-md">
              <Listbox
                data={modelFilterOptions}
                value={
                  modelFilterOptions.find(
                    (o) => o.id === selectedModelFilter,
                  ) || modelFilterOptions[0]
                }
                onChange={(opt: any) => {
                  setSelectedModelFilter(opt.id);
                  setCurrentPage(1);
                }}
                displayField="name"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table - Removed Status column */}
      <div className="dark:bg-dark-800 dark:border-dark-700 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table
            hoverable
            className="w-full min-w-[900px] text-left [&_.table-th]:font-semibold"
          >
            <THead className="dark:bg-dark-700/60 dark:border-dark-600 border-b border-gray-200 bg-gray-100">
              <Tr>
                <Th className="w-12 py-3.5 text-center">
                  <Checkbox
                    className="size-4.5"
                    checked={isAllPageSelected}
                    onChange={(e: any) => {
                      if (e.target.checked)
                        setSelectedIds(currentItems.map((i) => i.id));
                      else setSelectedIds([]);
                    }}
                  />
                </Th>
                <Th className="w-16 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  S.No
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Variant
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Model
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Pur Price
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Ex-Showroom
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Insurance
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  RTO
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Sales Price
                </Th>
              
              </Tr>
            </THead>
            <TBody className="dark:divide-dark-700 divide-y divide-gray-200">
              {currentItems.map((item, index) => (
                <Tr
                  key={item.id}
                  className={`${selectedIds.includes(item.id) ? "dark:bg-dark-600/30 bg-gray-50/50" : ""} dark:hover:bg-dark-700/40 transition-colors hover:bg-gray-50/30`}
                >
                  <Td className="py-4 text-center">
                    <Checkbox
                      className="size-4.5"
                      checked={selectedIds.includes(item.id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id],
                        )
                      }
                    />
                  </Td>
                  <Td className="py-4 font-medium text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </Td>
                  <Td className="py-4 font-medium text-gray-900 dark:text-gray-400">
                    {item.variantName}
                  </Td>
                  <Td className="py-4 font-medium text-gray-900 dark:text-gray-400">
                    {item.model}
                  </Td>
                  <Td className="py-4 font-medium text-gray-900 dark:text-gray-400">
                    ₹{item.purPrice} ({item.purTaxPercent}%)
                  </Td>
                  <Td className="py-4 font-medium text-gray-900 dark:text-gray-400">
                    ₹{item.exShowroomPrice} ({item.exShowroomTaxPercent}%)
                  </Td>
                  <Td className="py-4 font-medium text-gray-900 dark:text-gray-400">
                    ₹{item.insurance} ({item.insuranceTaxPercent}%)
                  </Td>
                  <Td className="py-4 font-medium text-gray-900 dark:text-gray-400">
                    ₹{item.rtoCharge} ({item.rtoTaxType} {item.rtoTaxPercent}%)
                  </Td>
                  <Td className="text-primary-600 py-4 font-semibold">
                    ₹{item.salesPrice}
                  </Td>
                 
                </Tr>
              ))}
              {currentItems.length === 0 && (
                <Tr>
                  <Td colSpan={9} className="py-12 text-center text-gray-400">
                    No variants found
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>
        {totalItems > 0 && (
          <div className="dark:border-dark-700 dark:bg-dark-800 flex items-center justify-center rounded-b-xl border-t border-gray-200 bg-white px-4 py-3">
            <div className="flex space-x-2">
              <Button
                variant="outlined"
                className="px-3 py-1 text-sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "filled" : "outlined"}
                    color={page === currentPage ? "primary" : "neutral"}
                    className="px-3 py-1 text-sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
              <Button
                variant="outlined"
                className="px-3 py-1 text-sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bulk Actions */}
      {/* {selectedIds.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 duration-200">
          <div className="dark:border-dark-500 dark:bg-dark-700/95 flex items-center gap-4 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <span className="text-sm font-medium">
              Selected {selectedIds.length} items
            </span>
            <Button variant="filled" color="error" onClick={handleBulkDelete}>
              <TrashIcon className="mr-1 size-4" /> Delete Selected
            </Button>
          </div>
        </div>
      )} */}

      {/* Drawer */}
      <Transition appear show={showDrawer} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100]"
          onClose={() => setShowDrawer(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="dark:bg-dark-700 fixed top-0 right-0 flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl">
              <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex h-full flex-col"
              >
                <div className="dark:border-dark-600 flex items-center justify-between border-b px-5 py-4">
                  <h2 className="text-lg font-semibold">
                    {editId ? "Edit Variant" : "Add Variant"}
                  </h2>
                  <Button
                    onClick={() => setShowDrawer(false)}
                    variant="flat"
                    isIcon
                    className="size-8 rounded-full"
                    type="button"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                </div>
                <div className="grow space-y-5 overflow-y-auto p-5">
                  {/* Model */}
                  <div className="w-full">
                    <span className="mb-2 block text-sm font-medium">
                      Model
                    </span>
                    <div className="w-full">
                      <Listbox
                        data={modelOptions}
                        value={
                          modelOptions.find((o) => o.name === formModelValue) ||
                          modelOptions[0]
                        }
                        onChange={(opt: any) => {
                          setValue("modelId", opt.id);
                          setValue("modelName", opt.name);
                          trigger("modelId");
                        }}
                        displayField="name"
                        className="w-full"
                      />
                      {errors.modelId && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.modelId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Variant Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Variant Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. EX, LX, VX"
                      {...register("variantName", validationRules.variantName)}
                      error={errors?.variantName?.message}
                    />
                  </div>

                  {/* Pur Price + Tax */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Pur Price (₹)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...register("purPrice", validationRules.purPrice)}
                        error={errors?.purPrice?.message}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block text-sm font-medium">
                        Tax %
                      </span>
                      <Listbox
                        data={taxOptions}
                        value={currentPurTax}
                        onChange={(opt: any) => {
                          setValue("purTaxPercent", opt.id);
                          trigger("purTaxPercent");
                        }}
                        displayField="name"
                      />
                      {errors.purTaxPercent && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.purTaxPercent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ex-Showroom + Tax */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Ex-Showroom (₹)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...register(
                          "exShowroomPrice",
                          validationRules.exShowroomPrice,
                        )}
                        error={errors?.exShowroomPrice?.message}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block text-sm font-medium">
                        Tax %
                      </span>
                      <Listbox
                        data={taxOptions}
                        value={currentExTax}
                        onChange={(opt: any) => {
                          setValue("exShowroomTaxPercent", opt.id);
                          trigger("exShowroomTaxPercent");
                        }}
                        displayField="name"
                      />
                      {errors.exShowroomTaxPercent && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.exShowroomTaxPercent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Insurance + Tax */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Insurance (₹)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...register("insurance", validationRules.insurance)}
                        error={errors?.insurance?.message}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block text-sm font-medium">
                        Tax %
                      </span>
                      <Listbox
                        data={taxOptions}
                        value={currentInsTax}
                        onChange={(opt: any) => {
                          setValue("insuranceTaxPercent", opt.id);
                          trigger("insuranceTaxPercent");
                        }}
                        displayField="name"
                      />
                      {errors.insuranceTaxPercent && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.insuranceTaxPercent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RTO Section */}
                  <div className="dark:border-dark-600 space-y-4 rounded-lg border border-gray-200 p-4">
                    {/* RTO Tax Type */}
                    <div>
                      <span className="mb-2 block text-sm font-medium">
                        RTO Tax Type
                      </span>
                      <div className="flex gap-6">
                        {rtoTaxTypes.map((t) => (
                          <label
                            key={t.id}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                          >
                            <input
                              type="radio"
                              name="rtoTaxType"
                              value={t.id}
                              checked={formRtoTaxType === t.id}
                              onChange={() => handleRtoTaxTypeChange(t.id)}
                              className="accent-primary-600 size-4"
                            />{" "}
                            {t.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* RTO Charge and Tax % in same row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          RTO Charge (₹)
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...register("rtoCharge", validationRules.rtoCharge)}
                          error={errors?.rtoCharge?.message}
                        />
                      </div>
                      <div>
                        <span className="mb-2 block text-sm font-medium">
                          Tax %
                        </span>
                        <div className="dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200 flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700">
                          {formRtoTaxType === "Commercial" ? "10%" : "1%"}
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          RTO Total (Charge + Tax)
                        </label>
                        <Input
                          type="text"
                          readOnly
                          value={`₹ ${displayRtoTotal}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accessories with Error Messages */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Accessories</span>
                    </div>
                    {accessories.map((acc, i) => (
                      <div key={i} id={`accessory-${i}`}>
                        <div className="mb-2 flex items-center gap-2">
                          <div className="min-w-[200px] flex-1">
                           <AccessoryCombobox
  options={accessoryOptions}
  value={acc.name}
 onChange={(val) => {
  const selectedAccessory = accessoryOptions.find(
    (item: any) => item.itemName === val
  );

  const updatedAccessories = [...accessories];
updatedAccessories[i] = {
  ...updatedAccessories[i],

  accessoryId: selectedAccessory?.id,

  name: val,

  price: Number(selectedAccessory?.salesPrice || 0),
  taxPercent: Number(selectedAccessory?.taxSlab || 0),
};

  setAccessories(updatedAccessories);

  console.log(updatedAccessories[i]);
}}
  placeholder="Type or select accessory..."
  error={accessoryErrors[i]}
/>
                          </div>
                          <Input
  type="number"
  placeholder="Qty"
  value={acc.qty || 0}
  onChange={(e) =>
    updateAccessory(i, "qty", e.target.value)
  }
  className="w-20"
/>
                          <Input
                            type="number"
                            placeholder="Price"
                            value={acc.price || ""}
                            onChange={(e) =>
                              updateAccessory(i, "price", e.target.value)
                            }
                            className="w-32"
                          />
                          <Input
                            type="number"
                            placeholder="Tax %"
                            value={acc.taxPercent || ""}
                            onChange={(e) =>
                              updateAccessory(i, "taxPercent", e.target.value)
                            }
                            className="w-24"
                          />
                          <Input
                            type="number"
                            readOnly
                            value={
                              acc.totalPrice ? acc.totalPrice.toFixed(2) : ""
                            }
                            placeholder="Total"
                            className="dark:bg-dark-800 w-28 bg-gray-50 font-medium"
                          />
                          <div className="flex gap-1">
                            {i === 0 && (
                              <Button
                                variant="filled"
                                color="primary"
                                isIcon
                                className="size-8 rounded-full"
                                onClick={addAccessory}
                                type="button"
                              >
                                <PlusIcon className="size-4" />
                              </Button>
                            )}
                            {i > 0 && (
                              <Button
                                variant="filled"
                                color="error"
                                isIcon
                                className="size-8 rounded-full"
                                onClick={() => {
                                  removeAccessory(i);
                                  // Clear error for removed accessory
                                  const newErrors = { ...accessoryErrors };
                                  delete newErrors[i];
                                  setAccessoryErrors(newErrors);
                                }}
                                type="button"
                              >
                                <MinusIcon className="size-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {accessoryErrors[i] && (
                          <p className="mt-1 text-xs text-red-500">
                            {accessoryErrors[i]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Sales Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Sales Price (₹)
                    </label>
                    <Input
                      type="number"
                      readOnly
                      {...register("salesPrice")}
                      className="text-lg font-bold"
                    />
                  </div>
                </div>
                <div className="dark:border-dark-600 flex justify-end gap-3 border-t p-5">
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => setShowDrawer(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    {editId ? "Update Variant" : "Add Variant Price"}
                  </Button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  );
}
