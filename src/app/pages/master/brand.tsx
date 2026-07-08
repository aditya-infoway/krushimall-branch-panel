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
import { Fragment, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import apiHelper from "@/utils/apiHelper";

// Local UI Imports
import { Button, Checkbox, Input } from "@/components/ui";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import { Listbox } from "@/components/shared/form/StyledListbox";

type Brand = {
  id: number;
  _id?: string;
  image: string;
  brandName: string;
  name?: string;
  category: string;
  categoryId?: number;
  status: string;
  createdAt: string;
};

type FormValues = {
  name: string;
  category: string; // For display
  categoryId: number | string; // For API
  status: string;
  image: string;
};

// Updated exactly to your requested sequence layout
const entriesOptions = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 30, name: "30" },
  { id: 40, name: "40" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

const statusOptions = [
  { id: "ACTIVE", name: "On" },
  { id: "INACTIVE", name: "Off" },
];

export default function Brand() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination states (Defaulting to 10 based on your new options list)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);

  // Three distinct filter dropdown states
  const [selectedNameFilter, setSelectedNameFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  const categoryOptions = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  useEffect(() => {
    getBrands();
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await apiHelper.get("/category");

      let categoriesData = [];
      if (response && response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }

      // Store both id and name
      const categoryList = categoriesData.map((item: any) => ({
        id: item.id || item._id,
        name: item.categoryName || item.name,
      }));
      setCategories(categoryList);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const getBrands = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.get("/brand");

      let brandsData = [];
      if (response && response.data && Array.isArray(response.data)) {
        brandsData = response.data;
      } else if (Array.isArray(response)) {
        brandsData = response;
      }

      const mappedData = brandsData.map((item: any) => ({
        ...item,

        name: item.brandName || item.name || "Unknown",
        image: apiHelper.getImageUrl(item.image), // ✅ Use helper
        category:
          typeof item.category === "object"
            ? item.category?.categoryName || item.category?.name || ""
            : item.category || "",
        categoryId:
          typeof item.category === "object"
            ? item.category?.id
            : item.categoryId,
        id: item.id || item._id,
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
      }));

      setBrands(mappedData);
    } catch (error) {
      console.error(error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  // React Hook Form for validation rules
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      category: "",
      categoryId: "",
      status: "ACTIVE",
      image: "",
    },
  });

  const formStatusValue = useWatch({ control, name: "status" });
  const formCategoryValue = useWatch({ control, name: "category" });
  const formImageValue = useWatch({ control, name: "image" });

  const formValidationRules = {
    name: { required: "Brand name is required" },
    category: { required: "Category selection is required" },
  };

  // Dropdown list arrays for the 3 data model filters
  const nameFilterOptions = [
    { id: "All", name: "All Brands" },
    ...Array.from(new Set(brands.map((b) => b.name))).map((name) => ({
      id: name,
      name,
    })),
  ];

  const categoryFilterOptions = [
    { id: "All", name: "All Categories" },
    ...categories.map((c) => ({ id: c.name, name: c.name })),
  ];

  const statusFilterOptions = [
    { id: "All", name: "All Statuses" },
    { id: "ACTIVE", name: "On" },
    { id: "INACTIVE", name: "Off" },
  ];

  const handleOpenAddDrawer = () => {
    setEditId(null);
    const firstCategory = categories[0] || { id: "", name: "" };
    reset({
      name: "",
      category: firstCategory.name,
      categoryId: firstCategory.id,
      status: "ACTIVE",
      image: "",
    });
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (item: Brand) => {
    setEditId(item.id);
    reset({
      name: item.brandName || item.name,
      category: item.category,
      categoryId: item.categoryId || "",
      status: item.status,
      image: item.image || "", // ✅ Keep existing image
    });
    setShowDrawer(true);
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("🗑️ Deleting brand ID:", id);
      await apiHelper.delete(`/brand/${id}`);
      console.log("✅ Brand deleted successfully");
      getBrands();
    } catch (error: any) {
      console.error("❌ Delete error:", error);
      console.error("Backend response:", error.response?.data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => apiHelper.delete(`/brand/${id}`)),
      );
      await getBrands();
      setSelectedIds([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  const handleToggleTableStatus = async (id: number) => {
    const brand = brands.find((item) => item.id === id);
    if (!brand) return;

    try {
      const newStatus = brand.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await apiHelper.put(`/brand/${id}`, {
        brandName: brand.brandName || brand.name,
        categoryId: brand.categoryId,
        status: newStatus,
      });

      setBrands((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );

      await getBrands();
    } catch (error: any) {
      console.error("Failed to toggle status:", error);
      await getBrands();
    }
  };

  const onFormSubmit = async (data: FormValues) => {
    try {
      // Check if there's a new image (base64 from file input)
      const hasNewImage = data.image && data.image.startsWith("data:");

      if (hasNewImage) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("brandName", data.name);
        formData.append("categoryId", String(data.categoryId));
        formData.append("status", data.status);

        // Convert base64 back to file blob
        const response = await fetch(data.image);
        const blob = await response.blob();
        formData.append("image", blob, "brand-image.jpg");

        console.log("📤 Uploading with FormData (multipart)");
        console.log("Fields:", {
          brandName: data.name,
          categoryId: data.categoryId,
          status: data.status,
        });
        console.log("Image blob size:", blob.size);

        let result;
        if (editId !== null) {
          result = await apiHelper.put(`/brand/${editId}`, formData);
        } else {
          result = await apiHelper.post("/brand", formData);
        }
        console.log("✅ Upload response:", result);
      } else {
        // No new image, send as JSON
        const payload: any = {
          brandName: data.name,
          categoryId: Number(data.categoryId),
          status: data.status,
        };

        // Only include image if it exists and is not a new upload
        if (data.image && !data.image.startsWith("data:")) {
          payload.image = data.image;
        }

        console.log("📤 Sending JSON (no new image):", payload);

        if (editId !== null) {
          await apiHelper.put(`/brand/${editId}`, payload);
        } else {
          await apiHelper.post("/brand", payload);
        }
      }

      await getBrands();
      setShowDrawer(false);
      reset();
    } catch (error: any) {
      console.error("❌ Failed to save brand:", error);
      console.error("Backend error:", error.response?.data);
    }
  };

  // Filter evaluation layer targeting Brand fields: Name, Category, and Status
  const filteredData = brands.filter((item) => {
    const itemName = item.brandName || item.name || "";
    const matchesSearch =
      itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesNameDropdown =
      selectedNameFilter === "All" || itemName === selectedNameFilter;
    const matchesCategoryDropdown =
      selectedCategoryFilter === "All" ||
      item.category === selectedCategoryFilter;
    const matchesStatusDropdown =
      selectedStatusFilter === "All" || item.status === selectedStatusFilter;

    return (
      matchesSearch &&
      matchesNameDropdown &&
      matchesCategoryDropdown &&
      matchesStatusDropdown
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredData, currentPage, totalPages]);

  const isAllPageSelected =
    currentItems.length > 0 &&
    currentItems.every((item) => selectedIds.includes(item.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = currentItems.map((item) => item.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = currentItems.map((item) => item.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  return (
    <div className="relative min-h-screen space-y-6 p-4 pb-28 text-gray-900 md:p-6 dark:text-gray-100">
      {/* Upper Actions Control Toolbar Layout */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 md:text-2xl dark:text-white">
            Brand List
          </h1>
          <p className="dark:text-dark-300 mt-1 text-sm text-gray-500">
            Manage all product brands from here
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilterBar(!showFilterBar)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              showFilterBar
                ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-white"
                : "dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FunnelIcon className="size-4.5" />
            Filter
          </button>

          <button
            type="button"
            className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="size-4.5 text-gray-400" />
            Excel
          </button>

          <button
            type="button"
            className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="size-4.5 text-gray-400" />
            PDF
          </button>

         
        </div>
      </div>

      {/* Global Context Search Box */}
      <div className="relative w-full max-w-md">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search brand or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="dark:border-dark-500 dark:bg-dark-800 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none"
        />
      </div>

      {/* Explicit Triple Dropdown Filters: Name, Category, and Status */}
      {showFilterBar && (
        <div className="dark:bg-dark-700 dark:border-dark-500 animate-in fade-in slide-in-from-top-2 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Filter 1: Brand Name Criteria */}
            <div className="flex flex-col gap-1">
              <span className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Brand Name
              </span>
              <Listbox
                data={nameFilterOptions}
                value={
                  nameFilterOptions.find((o) => o.id === selectedNameFilter) ||
                  nameFilterOptions[0]
                }
                placeholder="All Brands"
                onChange={(opt: any) => {
                  setSelectedNameFilter(opt.id);
                  setCurrentPage(1);
                }}
                displayField="name"
              />
            </div>

            {/* Filter 2: Category Criteria */}
            <div className="flex flex-col gap-1">
              <span className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Brand Category
              </span>
              <Listbox
                data={categoryFilterOptions}
                value={
                  categoryFilterOptions.find(
                    (o) => o.id === selectedCategoryFilter,
                  ) || categoryFilterOptions[0]
                }
                placeholder="All Categories"
                onChange={(opt: any) => {
                  setSelectedCategoryFilter(opt.id);
                  setCurrentPage(1);
                }}
                displayField="name"
              />
            </div>

            {/* Filter 3: Status Criteria */}
            <div className="flex flex-col gap-1">
              <span className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Brand Status
              </span>
              <Listbox
                data={statusFilterOptions}
                value={
                  statusFilterOptions.find(
                    (o) => o.id === selectedStatusFilter,
                  ) || statusFilterOptions[0]
                }
                placeholder="All Statuses"
                onChange={(opt: any) => {
                  setSelectedStatusFilter(opt.id);
                  setCurrentPage(1);
                }}
                displayField="name"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Table Layout Panel Container */}
      <div className="dark:bg-dark-800 dark:border-dark-700 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table
            hoverable
            className="w-full min-w-[700px] text-left [&_.table-th]:font-semibold"
          >
            <THead className="dark:bg-dark-700/60 dark:border-dark-600 border-b border-gray-200 bg-gray-100">
              <Tr>
                <Th className="w-12 py-3.5 text-center">
                  <Checkbox
                    className="size-4.5"
                    checked={isAllPageSelected}
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                  />
                </Th>
                <Th className="w-16 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  S.No
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Image
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Brand Name
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Category
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Status
                </Th>
                <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Created
                </Th>
               
              </Tr>
            </THead>

            <TBody className="dark:divide-dark-700 divide-y divide-gray-200">
              {currentItems.map((item, index) => {
                const isRowSelected = selectedIds.includes(item.id);
                return (
                  <Tr
                    key={item.id}
                    className={`${isRowSelected ? "dark:bg-dark-600/30 bg-gray-50/50" : ""} dark:hover:bg-dark-700/40 transition-colors hover:bg-gray-50/30`}
                  >
                    <Td className="py-4 text-center">
                      <Checkbox
                        className="size-4.5"
                        checked={isRowSelected}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </Td>
                    <Td className="py-4 font-medium text-gray-500">
                      {indexOfFirstItem + index + 1}
                    </Td>
                    <Td className="py-4">
                      <div className="dark:border-dark-500 flex h-15 w-15 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              console.error(
                                "❌ Image failed to load:",
                                item.image,
                              );
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            {(item.name || "NA").substring(0, 2)}
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td className="py-4 font-medium text-gray-900 dark:text-gray-400">
                      {item.brandName || item.name || "N/A"}
                    </Td>
                    <Td className="dark:text-dark-200 py-4 text-gray-600">
                      {item.category}
                    </Td>
                    <Td className="py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleTableStatus(item.id)}
                        className={`relative h-6 w-12 rounded-full transition-all ${
                          item.status === "ACTIVE"
                            ? "bg-primary-500"
                            : "dark:bg-dark-600 bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                            item.status === "ACTIVE" ? "left-6.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </Td>
                    <Td className="py-4 text-gray-500 dark:text-gray-400">
                      {item.createdAt}
                    </Td>
                                     </Tr>
                );
              })}

              {currentItems.length === 0 && (
                <Tr>
                  <Td
                    colSpan={8}
                    className="py-12 text-center text-gray-400 dark:text-gray-500"
                  >
                    No brands found
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>

        {/* --- THREE-COLUMN FOOTER SYSTEM --- */}
        {totalItems > 0 && (
          <div className="dark:border-dark-700 dark:bg-dark-800 flex flex-col gap-4 rounded-b-xl border-t border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center">
            {/* Column 1: Row Limits Selection Dropdown Menu (Configured exactly to 10,20,30,40,50,100 sequence) */}
            <div className="order-1 flex items-center justify-center gap-2 text-sm text-gray-600 md:w-1/3 md:justify-start dark:text-gray-400">
              <span>Show</span>
              <div className="w-20">
                <Menu
                  as="div"
                  className="relative inline-block w-full text-left"
                >
                  <MenuButton className="dark:border-dark-600 dark:bg-dark-700 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none dark:text-gray-200">
                    <span>{itemsPerPage}</span>
                    <svg
                      className="ml-2 h-4 w-4 transform transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      anchor="top start"
                      className="dark:bg-dark-700 dark:border-dark-600 z-[200] w-20 space-y-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-xl ring-1 ring-black/5 [--anchor-gap:6px] focus:outline-none"
                    >
                      {entriesOptions.map((opt) => (
                        <MenuItem key={opt.id}>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => {
                                setItemsPerPage(opt.id);
                                setCurrentPage(1);
                              }}
                              className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium ${
                                opt.id === itemsPerPage
                                  ? "bg-primary-500 text-white"
                                  : active
                                    ? "dark:bg-dark-600 bg-gray-100 text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {opt.name}
                              {opt.id === itemsPerPage && (
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
              <span>entries</span>
            </div>

            {/* Column 2: Page Navigation Bar controls */}
            <div className="order-2 flex justify-center md:w-1/3">
              <div className="dark:border-dark-700 dark:bg-dark-800 inline-flex items-center space-x-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400"
                >
                  <ChevronLeftIcon className="size-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-primary-500 text-white"
                          : "dark:hover:bg-dark-700 text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400"
                >
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </div>

            {/* Column 3: Stats Summary Metadata Counter info */}
            <div className="order-3 flex items-center justify-center text-sm text-gray-500 select-none md:w-1/3 md:justify-end dark:text-gray-400">
              <span>
                {totalItems === 0 ? 0 : indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar for Selected Checks */}
      {/* {selectedIds.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 w-full max-w-xs px-2 duration-200">
          <div className="dark:border-dark-500 dark:bg-dark-700/95 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="dark:text-dark-200 text-sm font-medium text-gray-600">
              Selected{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedIds.length}
              </span>{" "}
              items
            </div>
            <Button
              variant="filled"
              color="error"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 shadow-sm"
            >
              <TrashIcon className="size-4" />
              <span className="text-xs font-semibold">Delete Selected</span>
            </Button>
          </div>
        </div>
      )} */}

      {/* Slide Transition Form Drawer Wrapper with Validation */}
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
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu transition-transform duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="dark:bg-dark-700 fixed top-0 right-0 flex h-full w-full max-w-md transform-gpu flex-col bg-white shadow-2xl transition-transform duration-200">
              <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex h-full flex-col"
              >
                {/* Header */}
                <div className="dark:border-dark-500 flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <h2 className="dark:text-dark-50 text-lg font-semibold text-gray-800">
                    {editId !== null ? "Edit Brand" : "Add Brand"}
                  </h2>
                  <Button
                    onClick={() => setShowDrawer(false)}
                    variant="flat"
                    isIcon
                    className="size-8 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    type="button"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                </div>

                {/* Content Input Fields Body */}
                <div className="grow space-y-5 overflow-y-auto p-5">
                  <div>
                    <span className="mb-2 block text-sm font-medium">
                      Category
                    </span>
                    <Listbox
                      data={categoryOptions}
                      value={
                        categoryOptions.find(
                          (opt) => opt.id === Number(formCategoryValue),
                        ) || categoryOptions[0]
                      }
                      placeholder="Select Category"
                      onChange={(selectedOpt: any) => {
                        setValue("category", selectedOpt.name); // For display
                        setValue("categoryId", selectedOpt.id); // For API
                      }}
                      displayField="name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Brand Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter brand name"
                      {...register("name", formValidationRules.name)}
                      error={errors?.name && errors.name.message}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Brand Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="dark:file:bg-dark-800 dark:file:text-dark-200 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {formImageValue ? (
                      <div>
                        <img
                          src={formImageValue}
                          alt="Preview"
                          className="dark:border-dark-500 mt-3 h-20 w-20 rounded-xl border border-gray-200 object-contain"
                        />
                        {editId && (
                          <p className="mt-1 text-xs text-gray-400">
                            Current image (upload new to replace)
                          </p>
                        )}
                      </div>
                    ) : (
                      editId && (
                        <p className="mt-1 text-xs text-gray-400">
                          No image uploaded
                        </p>
                      )
                    )}
                  </div>

                  <div>
                    <span className="mb-2 block text-sm font-medium">
                      Status
                    </span>
                    <Listbox
                      data={statusOptions}
                      value={
                        statusOptions.find(
                          (opt) => opt.id === formStatusValue,
                        ) || statusOptions[0]
                      }
                      placeholder="Select Status"
                      onChange={(selectedOpt: any) =>
                        setValue("status", selectedOpt.id)
                      }
                      displayField="name"
                    />
                  </div>
                </div>

                {/* Footer Submit layout controls */}
                <div className="dark:border-dark-500 flex items-center justify-end gap-3 border-t border-gray-200 p-5">
                  <Button
                    variant="outlined"
                    color="neutral"
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    className="h-10 w-1/2"
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" className="h-10 w-1/2">
                    Save
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
