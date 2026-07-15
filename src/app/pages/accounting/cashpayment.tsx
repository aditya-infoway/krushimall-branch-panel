import { useState, useEffect } from "react";
import {
  // Tractor,
  // MapPin,
  // Heart,
  // Star,
  // Fuel,
  // Gauge,
  // Calendar,
  ChevronLeft,
  ChevronRight,
  // Sparkles,
  // ArrowRight,
  // BadgeCheck,
  // Shield,
  // Clock,
  // Phone,
  // Users,
  // ShoppingBag,
  // Package,
  Search,
  // SlidersHorizontal,
  Check,
  Filter,
  ChevronDown,
  // User,
  // Mail,
  // MessageSquare,
  // Send,
  // HelpCircle,
  // MessageCircle,
  X,
  Plus,
  Download,
  // RefreshCw,
  Trash2,
  // Eye,
  Edit,
  // ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
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
import { Fragment } from "react";
import { DatePicker } from "@/components/shared/form/Datepicker";
// import { Combobox } from "@/components/shared/form/StyledCombobox";
import { Combobox } from "@/components/shared/form/Combobox";
import { Input, Radio, Textarea } from "@/components/ui";
import apiHelper from "@/utils/apiHelper";
import { toast } from "sonner";


type EntryType = "Manual" | "Purchase" | "Lead Cancel";
import { RiFileExcel2Fill, RiFilePdfFill } from "react-icons/ri";
interface CashPayment {
  id: number;
  date: string;
  voucherNo: string;
  type: EntryType;
  cashAccount: string;
  oppAccount: string;
  amount: number;
  narration: string;
  createdType: string;
  createdBy: string;
  leadNo?: string;
}

const CASH_ACCOUNTS = [
  {
    id: 1,
    label: "Cash account (9081540777)",
    value: "Cash account (9081540777)",
    balance: "1,00,000.00 DR",
  },
  {
    id: 2,
    label: "Denish patel (9081540774)",
    value: "Denish patel (9081540774)",
    balance: "0.00 DR",
  },
];

const OPP_ACCOUNTS = [
  {
    id: 1,
    label: "Cash account (9081540777)",
    value: "Cash account (9081540777)",
    balance: "100,000.00 DR",
    balanceType: "DR",
  },
  {
    id: 2,
    label: "Denish patel (9081540774)",
    value: "Denish patel (9081540774)",
    balance: "0.00 DR",
    balanceType: "DR",
  },
  {
    id: 3,
    label: "Suresh Kumar (9081540775)",
    value: "Suresh Kumar (9081540775)",
    balance: "25,000.00 CR",
    balanceType: "CR",
  },
  {
    id: 4,
    label: "Ramesh Singh (9081540776)",
    value: "Ramesh Singh (9081540776)",
    balance: "50,000.00 DR",
    balanceType: "DR",
  },
];

const initialForm = {
  type: "Manual" as EntryType,
  cashAccount: null as any,
  voucherNo: "CP/25-26/001",
  date: [new Date()],
  oppAccount: null as any,
  amount: "",
  narration: "",
  createdType: "",
  createdBy: "",
  leadNo: null as any,
};

const entriesOptions = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 30, name: "30" },
  { id: 40, name: "40" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

export default function CashPayment() {
  const [rows, setRows] = useState<CashPayment[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [form, setForm] = useState({ ...initialForm });
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [purchaseBill, setPurchaseBill] = useState<any>(null);
  const [purchaseBills, setPurchaseBills] = useState<any[]>([]);
  // Filter states
  const [filterType, setFilterType] = useState("All");
  const [filterDateFrom, setFilterDateFrom] = useState<any>(null);
  const [filterDateTo, setFilterDateTo] = useState<any>(null);

  const filteredRows = rows.filter((r) => {
    const matchesSearch = Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase()),
    );
    const matchesType = filterType === "All" || r.type === filterType;
    return matchesSearch && matchesType;
  });
  const [cashAccounts, setCashAccounts] = useState<any[]>([]);
  const [oppAccounts, setOppAccounts] = useState<any[]>([]);
  const totalItems = filteredRows.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [financialYearId, setFinancialYearId] = useState<number | null>(null);
  const getCompany = async () => {
    try {
      const res = await apiHelper.get("/company");

      if (!res.data || res.data.length === 0) {
        console.log("No companies found");
        return;
      }

      const company = res.data[0];

      setCompanyId(company.id);

      if (company.financialYears?.length > 0) {
        setFinancialYearId(company.financialYears[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCompany();
  }, []);
  const getPurchaseBills = async () => {
    try {
      const res = await apiHelper.get("/purchases");

      setPurchaseBills(
        res.data.map((p: any) => ({
          value: p.id,
          label: p.billNo,
          party: p.account?.accountName,
          accountId: p.accountId,
          // amount: p.grandTotal,
        })),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getAccounts = async () => {
    try {
      const res = await apiHelper.get("/accounts");

      const accounts = res.data;

      setCashAccounts(
        accounts
          .filter((a: any) => a.group === "Cash-in-Hand")
          .map((a: any) => ({
            value: a.id,
            label: a.accountName,
            mobile: a.mobile,
            openingBalance: a.openingBalance,
            balance: a.closingBalance,
            balanceType: a.drCr,
          })),
      );

      setOppAccounts(
        accounts
          .filter((a: any) => a.group !== "Cash-in-Hand")
          .map((a: any) => ({
            value: a.id,
            label: a.accountName,
            mobile: a.mobile,
            openingBalance: a.openingBalance,
            balance: a.closingBalance,
            balanceType: a.drCr,
          })),
      );
    } catch (err) {
      console.log(err);
    }
  };
  const getVoucherNo = async () => {
    try {
      const res = await apiHelper.get("/cash-payment/generate-voucher");

      setForm((prev) => ({
        ...prev,
        voucherNo: res.voucherNo,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  const getCashPayments = async () => {
    try {
      const res = await apiHelper.get("/cash-payment");

      setRows(
        res.map((item: any) => ({
          id: item.id,
          date: item.date,
          voucherNo: item.voucherNo,
          type: item.type,
          cashAccount: item.cashAccount?.accountName,
          oppAccount: item.oppAccount?.accountName,
          amount: item.amount,
          narration: item.narration,
          createdType: item.createdType,
          createdBy: item.createdBy,
          leadNo: item.lead?.leadNo,
        })),
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAccounts();
    getPurchaseBills();
    getVoucherNo();
    getCashPayments();
  }, []);
  const purchaseBillOptions = purchaseBills;
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.cashAccount?.value) {
      newErrors.cashAccount = "Cash Account is required";
    }

    if (!form.oppAccount?.value) {
      newErrors.oppAccount = "Opp. Account is required";
    }
    if (!form.amount || form.amount === "") {
      newErrors.amount = "Amount is required";
    }
    if (form.type === "Lead Cancel" && !form.leadNo) {
      newErrors.leadNo = "Lead No. is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    setEditId(null);
    setErrors({});

    setForm({
      ...initialForm,
       date: [new Date()],
    });

    await getVoucherNo();

    setShowDrawer(true);
  };

  // Transform OPP_ACCOUNTS to include balance in label
  // Calculate the longest account name for proper alignment
  const OPP_ACCOUNTS_WITH_BALANCE = OPP_ACCOUNTS.map((account) => {
    // Use padEnd to ensure consistent length
    const maxLength = 50; // Adjust this value
    const paddedLabel = account.label.padEnd(maxLength, " ");

    return {
      ...account,
      label: `${paddedLabel}${account.balance}`,
    };
  });

  const handleEdit = (item: CashPayment) => {
    setEditId(item.id);
    setForm({
      type: item.type,
      cashAccount:
        CASH_ACCOUNTS.find((a) => a.value === item.cashAccount) || null,
      voucherNo: item.voucherNo,
      date: item.date ? [new Date(item.date)] : [],
      oppAccount: OPP_ACCOUNTS.find((a) => a.value === item.oppAccount) || null,
      amount: String(item.amount),
      narration: item.narration,
      createdType: item.createdType,
      createdBy: item.createdBy,
      leadNo: item.leadNo || "",
    });
    setErrors({});
    setShowDrawer(true);
  };

  // Add this after OPP_ACCOUNTS definition
  const LEADS = [
    { id: 1, leadNo: "LEAD-001", name: "John Doe", phone: "9876543210" },
    { id: 2, leadNo: "LEAD-002", name: "Jane Smith", phone: "9876543211" },
    { id: 3, leadNo: "LEAD-003", name: "Bob Johnson", phone: "9876543212" },
    { id: 4, leadNo: "LEAD-004", name: "Alice Brown", phone: "9876543213" },
    { id: 5, leadNo: "LEAD-005", name: "Charlie Wilson", phone: "9876543214" },
  ];

  const leadOptions = LEADS.map((lead) => ({
    value: lead.leadNo,
    label: `${lead.leadNo} - ${lead.name}`,
    phone: lead.phone,
    id: lead.id,
  }));

  const handleDelete = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleBulkDelete = () => {
    setRows(rows.filter((row) => !selectedIds.includes(row.id)));
    setSelectedIds([]);
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const payload = {
      companyId,
      financialYearId,
      date: form.date || new Date(),
      cashAccountId: form.cashAccount.value,
      oppAccountId: form.oppAccount.value,
      purchaseId: form.type === "Purchase" && purchaseBill ? purchaseBill.value : null,
      leadId: form.type === "Lead Cancel" && form.leadNo ? form.leadNo.id : null,
      amount: Number(form.amount),
      narration: form.narration,
    };
    console.log(payload);
    
    if (editId !== null) {
      await apiHelper.put(`/cash-payment/${editId}`, payload);
      toast.success("Cash payment updated successfully!");
    } else {
      await apiHelper.post("/cash-payment", payload);
      toast.success("Cash payment added successfully!");
    }

    setShowDrawer(false);
    await getCashPayments();
    await getVoucherNo();
  } catch (error: any) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to save cash payment. Please try again.");
  }
};
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

  // Apply filters automatically when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterDateFrom, filterDateTo, search]);
const handleExportExcel = async () => {
  try {
    const blob = await apiHelper.getBlob("/cash-payment/export/excel");

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "CashPaymentRegister.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div className="relative min-h-screen space-y-6 p-4 pb-28 text-gray-900 md:p-6 dark:text-gray-100">
      {/* Upper Actions Control Toolbar Layout */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 md:text-2xl dark:text-white">
            Cash Payment Register
          </h1>
          <p className="dark:text-dark-300 mt-1 text-sm text-gray-500">
            Manage all cash payment entries
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 md:flex-nowrap">
  {/* Left side - Filter and icons */}
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => setShowFilterBar(!showFilterBar)}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
        showFilterBar
          ? "dark:bg-dark-600 dark:border-dark-500 border-red-200 bg-red-50 text-red-600 dark:text-white"
          : "dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Filter className="size-4.5" />
      <span className="hidden sm:inline">Filter</span>
    </button>

    <button
      type="button"
      onClick={handleExportExcel}
      className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
    >
      <RiFileExcel2Fill className="text-lg text-green-500" />
    </button>

    <button
      type="button"
      className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
    >
      <RiFilePdfFill className="text-lg text-red-500" />
    </button>
  </div>

  {/* Right side - Add Cash Payment button */}
  <button
    type="button"
    onClick={handleAdd}
    className="bg-primary-600 hover:bg-primary-700 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors whitespace-nowrap"
  >
    <Plus className="size-4.5" />
    Add Cash Payment
  </button>
</div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search cash payments..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="dark:border-dark-500 dark:bg-dark-800 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none"
        />
      </div>

      {/* Filter Bar - Auto Apply */}
      {showFilterBar && (
        <div className="dark:bg-dark-700 dark:border-dark-500 animate-in fade-in slide-in-from-top-2 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="dark:text-dark-200 mb-1.5 block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="dark:border-dark-500 dark:bg-dark-600 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500"
              >
                <option value="All">All Types</option>
                <option value="Manual">Manual</option>
                <option value="Lead Cancel">Lead Cancel</option>
              </select>
            </div>
            <div>
              <label className="dark:text-dark-200 mb-1.5 block text-sm font-medium text-gray-700">
                Date From
              </label>
              <DatePicker
                placeholder="From Date"
                value={filterDateFrom}
                onChange={setFilterDateFrom}
              />
            </div>
            <div>
              <label className="dark:text-dark-200 mb-1.5 block text-sm font-medium text-gray-700">
                Date To
              </label>
              <DatePicker
                placeholder="To Date"
                value={filterDateTo}
                onChange={setFilterDateTo}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="dark:bg-dark-800 dark:border-dark-700 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-left [&_.table-th]:font-semibold">
            <thead className="dark:bg-dark-700/60 dark:border-dark-600 border-b border-gray-200 bg-gray-100">
              <tr>
                <th className="w-10 py-3.5 text-center">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    checked={isAllPageSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="w-12 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  S.No
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Date
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Voucher No.
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Type
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Cash Account
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Opp. Account
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Amount
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Narration
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Created Type
                </th>
                <th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                  Created By
                </th>
               
              </tr>
            </thead>

            <tbody className="dark:divide-dark-700 divide-y divide-gray-200">
              {currentItems.map((item, index) => {
                const isRowSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`${isRowSelected ? "dark:bg-dark-600/30 bg-gray-50/50" : ""} dark:hover:bg-dark-700/40 transition-colors hover:bg-gray-50/30`}
                  >
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        checked={isRowSelected}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-500">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-400">
                      {new Date(item.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-400">
                      {item.voucherNo}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <span className="bg-primary-500 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {item.cashAccount}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {item.oppAccount}
                    </td>
                    <td className="py-3 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-gray-400">
                      ₹
                      {item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.narration}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.createdType}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {item.createdBy}
                    </td>
                   
                  </tr>
                );
              })}

              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="py-12 text-center text-gray-400 dark:text-gray-500"
                  >
                    No cash payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="dark:border-dark-700 dark:bg-dark-800 flex flex-col gap-4 rounded-b-xl border-t border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center">
            <div className="order-1 flex items-center justify-center gap-2 text-sm text-gray-600 md:w-1/3 md:justify-start dark:text-gray-400">
              <span>Show</span>
              <div className="w-20">
                <Menu
                  as="div"
                  className="relative inline-block w-full text-left"
                >
                  <MenuButton className="dark:border-dark-600 dark:bg-dark-700 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none dark:text-gray-200">
                    <span>{itemsPerPage}</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
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
                                <Check className="h-4 w-4" />
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
                  <ChevronLeft className="size-4" />
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
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="order-3 flex items-center justify-center text-sm text-gray-500 select-none md:w-1/3 md:justify-end dark:text-gray-400">
              <span>
                {totalItems === 0 ? 0 : indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
              </span>
            </div>
          </div>
        )}
      </div>

    

      {/* Right Drawer */}
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
            <DialogPanel className="dark:bg-dark-700 fixed top-0 right-0 flex h-full w-full max-w-4xl transform-gpu flex-col bg-white shadow-2xl transition-transform duration-200">
              <div className="dark:border-dark-500 flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="dark:text-dark-50 text-lg font-semibold text-gray-800">
                  {editId !== null ? "Edit Cash Payment" : "Add Cash Payment"}
                </h2>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="size-8 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="grow space-y-5 overflow-y-auto p-5">
                {/* Radio Buttons + Lead No inline */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <Radio
                      label="Manual"
                      name="type"
                      checked={form.type === "Manual"}
                      onChange={() => {
                        setForm({ ...form, type: "Manual", leadNo: "" });
                        if (errors.leadNo) setErrors({ ...errors, leadNo: "" });
                      }}
                    />
                    <Radio
                      label="Purchase"
                      name="type"
                      checked={form.type === "Purchase"}
                      onChange={() => {
                        setForm({ ...form, type: "Purchase", leadNo: "" });
                        if (errors.leadNo) setErrors({ ...errors, leadNo: "" });
                      }}
                    />
                    <Radio
                      label="Lead Cancel"
                      name="type"
                      checked={form.type === "Lead Cancel"}
                      onChange={() => setForm({ ...form, type: "Lead Cancel" })}
                    />
                  </div>

                  {form.type === "Purchase" && (
                    <div className="w-full sm:max-w-md">
                      <Combobox
                        data={purchaseBillOptions}
                        displayField="label"
                        value={purchaseBill}
                        placeholder="Search Purchase Bill No..."
                        searchFields={["label", "party"]}
                        columns={[
                          {
                            header: "Bill No",
                            field: "label",
                            width: "2fr",
                          },
                          {
                            header: "Party",
                            field: "party",
                            width: "3fr",
                          },
                        ]}
                        onChange={(bill: any) => {
                          setPurchaseBill(bill);

                          const account = oppAccounts.find(
                            (a: any) =>
                              Number(a.value) === Number(bill.accountId),
                          );

                          setForm((prev) => ({
                            ...prev,
                            amount: String(bill.amount),
                            oppAccount: account || null,
                          }));
                        }}
                      />
                    </div>
                  )}
                  {form.type === "Lead Cancel" && (
                    <div className="w-full sm:max-w-sm">
                      <Combobox
                        data={leadOptions}
                        displayField="label"
                        value={form.leadNo}
                        onChange={(value: any) => {
                          setForm({ ...form, leadNo: value });
                          if (errors.leadNo)
                            setErrors({ ...errors, leadNo: "" });
                        }}
                        placeholder="Search or select lead..."
                        searchFields={["label"]}
                        error={errors.leadNo}
                      />
                    </div>
                  )}
                </div>
                {/* Row 1: Cash Account | Voucher No | Date */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cash Account <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      data={cashAccounts}
                      displayField="label"
                      value={form.cashAccount}
                      onChange={(val: any) => {
                        setForm({ ...form, cashAccount: val });

                        if (errors.cashAccount) {
                          setErrors({ ...errors, cashAccount: "" });
                        }
                      }}
                      placeholder="Search Cash Account"
                      searchFields={["label", "mobile"]}
                      columns={[
                        {
                          header: "Account",
                          field: "label",
                          width: "2fr",
                        },
                        {
                          header: "Mobile",
                          field: "mobile",
                          width: "1.5fr",
                        },
                        {
                          header: "Opening",
                          field: "openingBalance",
                          width: "1fr",
                        },
                      ]}
                    />
                    {errors.cashAccount && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.cashAccount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Voucher No.
                    </label>

                    <input
                      type="text"
                      value={form.voucherNo || ""}
                      readOnly
                      className="dark:border-dark-500 dark:bg-dark-600 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </label>
                    <DatePicker
                      placeholder="Select date..."
                      value={form.date}
                      onChange={(date) => setForm({ ...form, date })}
                      options={{ disableMobile: true }}
                    />
                  </div>
                </div>
                {/* Dotted Separator */}
                <div className="border-t border-dashed border-blue-300 dark:border-blue-700" />

                {/* Row 2: Opp. Account | Amount */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Opp. Account <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Combobox
                      data={oppAccounts}
                      displayField="label"
                      value={form.oppAccount}
                      onChange={(val: any) => {
                        setForm({ ...form, oppAccount: val });

                        if (errors.oppAccount) {
                          setErrors({ ...errors, oppAccount: "" });
                        }
                      }}
                      placeholder="Search Opp. Account"
                      searchFields={["label", "mobile"]}
                      columns={[
                        {
                          header: "Account",
                          field: "label",
                          width: "2fr",
                        },
                        {
                          header: "Mobile",
                          field: "mobile",
                          width: "1.5fr",
                        },
                        {
                          header: "Opening",
                          field: "openingBalance",
                          width: "1fr",
                        },
                      ]}
                    />
                    {errors.oppAccount && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.oppAccount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={form.amount}
                      onChange={(e) => {
                        setForm({ ...form, amount: e.target.value });
                        if (errors.amount) setErrors({ ...errors, amount: "" });
                      }}
                      placeholder="Enter amount"
                      error={errors.amount}
                    />
                  </div>
                </div>
                {/* Row 3: Narration */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Narration
                  </label>
                  <Textarea
                    value={form.narration}
                    onChange={(e) =>
                      setForm({ ...form, narration: e.target.value })
                    }
                    placeholder="Enter Narration"
                    className="dark:border-dark-500 dark:bg-dark-600 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm"
                  />
                </div>
              </div>
              {/* Footer Buttons */}
              <div className="dark:border-dark-500 flex items-center justify-end gap-3 border-t border-gray-200 p-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowDrawer(false);
                    setErrors({});
                  }}
                  className="dark:bg-dark-600 dark:hover:bg-dark-500 rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2.5 text-sm font-semibold text-white"
                >
                  {editId !== null ? "Update" : "Add"} Cash Payment
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  );
}
