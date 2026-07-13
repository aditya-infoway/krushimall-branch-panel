import React, { useState,useEffect } from "react";
import {
  DocumentArrowDownIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "@/components/shared/form/Datepicker";
import { Listbox } from "@/components/shared/form/StyledListbox";
import apiHelper from "@/utils/apiHelper";
interface CashBookRow {
  sr: number;
  date: string;
  voucherNo: string;
  type: string;
  accountName: string;
  partyName: string;
  receipt: string;
  payment: string;
  narration: string;
  createdType: string;
  createdBy: string;
}

const CashBook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState<string>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Transaction type options
  const transactionTypeOptions = [
    { id: "all", name: "All Types" },
    { id: "receipt", name: "Receipt" },
    { id: "payment", name: "Payment" },
  ];

  // Sample table data (empty for now)
const [tableData, setTableData] = useState<CashBookRow[]>([]);

  // Summary data
const [summaryData, setSummaryData] = useState({
  totalReceipts: {
    value: "₹0.00",
    subtext: "0 transactions",
  },
  totalPayments: {
    value: "₹0.00",
    subtext: "0 transactions",
  },
  closingBalance: {
    value: "₹0.00",
    subtext: "0 transactions",
  },
});
const filteredTableData = tableData.filter((item) => {
  const matchesSearch =
    searchTerm === "" ||
    item.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.narration?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesType =
    !transactionType ||
    transactionType === "all" ||
    (transactionType === "payment" && Number(item.payment) > 0) ||
    (transactionType === "receipt" && Number(item.receipt) > 0);

  const itemDate = new Date(item.date);

  const matchesFrom =
    !fromDate || itemDate >= new Date(fromDate);

  const matchesTo =
    !toDate || itemDate <= new Date(toDate + "T23:59:59");

  return (
    matchesSearch &&
    matchesType &&
    matchesFrom &&
    matchesTo
  );
});
  // Pagination
const totalItems = filteredTableData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
 const currentItems = filteredTableData.slice(
  indexOfFirstItem,
  indexOfLastItem
);


useEffect(() => {
  getCashBook();
}, []);

const getCashBook = async () => {
  try {
    const [cashPayments, ] = await Promise.all([
      apiHelper.get("/cash-payment"),
      // apiHelper.get("/cash-receipt"),
    ]);
// console.log("Cash Payments:", cashPayments);
   const paymentData = (cashPayments || []).map((p: any) => ({
  date: p.date,
  voucherNo: p.voucherNo,
  type: "CP",
  accountName: p.cashAccount?.accountName,
  partyName: p.oppAccount?.accountName,
  receipt: 0,
  payment: Number(p.amount),
  narration: p.narration,
  createdType: p.createdType,
  createdBy: p.createdBy,
}));

    // const receiptData = cashReceipts.data.map(
    //   (item: any, index: number) => ({
    //     sr: paymentData.length + index + 1,
    //     date: item.date,
    //     voucherNo: item.voucherNo,
    //     type: item.type,
    //     accountName: item.cashAccount?.accountName || "-",
    //     partyName: item.oppAccount?.accountName || "-",
    //     receipt: Number(item.amount),
    //     payment: 0,
    //     narration: item.narration || "",
    //     createdType: item.createdType,
    //     createdBy: item.createdBy,
    //   })
    // );

const finalData = [...paymentData].sort(
  (a, b) =>
    new Date(b.date).getTime() -
    new Date(a.date).getTime()
);
const totalReceipt = filteredTableData.reduce(
  (sum, item) => sum + Number(item.receipt || 0),
  0
);

const totalPayment = filteredTableData.reduce(
  (sum, item) => sum + Number(item.payment || 0),
  0
);

const balance = totalReceipt - totalPayment;

setSummaryData({
  totalPayments: {
    value: `₹${totalPayment.toFixed(2)}`,
    subtext: `${filteredTableData.filter(x => Number(x.payment) > 0).length} transactions`,
  },
  totalReceipts: {
    value: `₹${totalReceipt.toFixed(2)}`,
    subtext: `${filteredTableData.filter(x => Number(x.receipt) > 0).length} transactions`,
  },
  closingBalance: {
    value: `₹${balance.toFixed(2)}`,
    subtext: `${filteredTableData.length} transactions`,
  },
});


setTableData(finalData);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  const receipt = filteredTableData.reduce(
    (sum, item) => sum + Number(item.receipt || 0),
    0
  );

  const payment = filteredTableData.reduce(
    (sum, item) => sum + Number(item.payment || 0),
    0
  );

  setSummaryData({
    totalReceipts: {
      value: `₹${receipt.toFixed(2)}`,
      subtext: `${filteredTableData.filter(x => Number(x.receipt) > 0).length} transactions`,
    },
    totalPayments: {
      value: `₹${payment.toFixed(2)}`,
      subtext: `${filteredTableData.filter(x => Number(x.payment) > 0).length} transactions`,
    },
    closingBalance: {
      value: `₹${(receipt - payment).toFixed(2)}`,
      subtext: `${filteredTableData.length} transactions`,
    },
  });

  setCurrentPage(1);
}, [searchTerm, transactionType, fromDate, toDate, tableData]);
  return (
    <div className="dark:bg-dark-800 min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-5 xl:p-6">
      <div className="mx-auto w-full max-w-480">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between lg:mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cash Book
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              View all cash transactions
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0">
            {/* Action Buttons Group */}
            <div className="flex items-center gap-1.5">
              <button className="dark:border-dark-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9.5 cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-2 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:px-3 dark:text-gray-300">
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button className="dark:border-dark-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9.5 cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-2 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:px-3 dark:text-gray-300">
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button className="dark:border-dark-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:text-gray-300">
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Receipts - Green */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-5 shadow-lg">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative">
              <div className="text-xs font-semibold tracking-wider text-emerald-100 uppercase">
                Total Receipts
              </div>
              <div className="my-2 text-[28px] font-bold text-white">
                {summaryData.totalReceipts.value}
              </div>
              <div className="text-[13px] text-emerald-100/80">
                {summaryData.totalReceipts.subtext}
              </div>
            </div>
          </div>

          {/* Total Payments - Red/Rose */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-rose-500 to-rose-600 p-5 shadow-lg">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative">
              <div className="text-xs font-semibold tracking-wider text-rose-100 uppercase">
                Total Payments
              </div>
              <div className="my-2 text-[28px] font-bold text-white">
                {summaryData.totalPayments.value}
              </div>
              <div className="text-[13px] text-rose-100/80">
                {summaryData.totalPayments.subtext}
              </div>
            </div>
          </div>

          {/* Closing Balance - Purple */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500 to-violet-600 p-5 shadow-lg">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative">
              <div className="text-xs font-semibold tracking-wider text-violet-100 uppercase">
                Closing Balance
              </div>
              <div className="my-2 text-[28px] font-bold text-white">
                {summaryData.closingBalance.value}
              </div>
              <div className="text-[13px] text-violet-100/80">
                {summaryData.closingBalance.subtext}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Voucher No, Party, Account, Narration..."
              className="focus:border-primary-500 focus:ring-primary-500/20 dark:border-dark-600 dark:bg-dark-700 h-9.5 w-full rounded-lg border border-gray-300 bg-white pr-3 pl-9 text-sm text-gray-900 transition-all outline-none focus:ring-2 dark:text-white dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Transaction Type - Listbox */}
          <div>
            <Listbox
              data={transactionTypeOptions}
              value={
                transactionTypeOptions.find((t) => t.id === transactionType) ||
                null
              }
              onChange={(val: any) => setTransactionType(val.id)}
              displayField="name"
              placeholder="Select Transaction Type"
            />
          </div>

          {/* From Date */}
          <div>
            <DatePicker
              placeholder="From Date"
              options={{ disableMobile: true }}
              value={fromDate ? new Date(fromDate + "T00:00:00") : undefined}
              onChange={(dates) => {
                if (dates && dates.length > 0) {
                  const date = dates[0];
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    setFromDate(`${year}-${month}-${day}`);
                  }
                }
              }}
              className="w-full"
            />
          </div>

          {/* To Date */}
          <div>
            <DatePicker
              placeholder="To Date"
              value={toDate ? new Date(toDate + "T00:00:00") : undefined}
              options={{ disableMobile: true }}
              onChange={(dates) => {
                if (dates && dates.length > 0) {
                  const date = dates[0];
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    setToDate(`${year}-${month}-${day}`);
                  }
                }
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="dark:bg-dark-700 dark:border-dark-600 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="dark:bg-dark-600 bg-gray-50 whitespace-nowrap">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    SR
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Voucher No.
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Account Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Party Name
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Receipt (₹)
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Payment (₹)
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Narration
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Created Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody className="dark:divide-dark-600 divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  currentItems.map((row, index) => (
                    <tr
                      key={index}
                      className="dark:hover:bg-dark-600 transition-colors hover:bg-gray-50"
                    >
                    <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white">
                     {new Date(row.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white whitespace-nowrap">
                        {row.voucherNo}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white">
                        {row.type}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white whitespace-nowrap">
                        {row.accountName}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white whitespace-nowrap">
                        {row.partyName}
                      </td>
                      <td className="px-3 py-2.5 text-right text-green-600 dark:text-green-400">
                        {row.receipt}
                      </td>
                      <td className="px-3 py-2.5 text-right text-red-600 dark:text-red-400">
                        {row.payment}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white">
                        {row.narration}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white">
                        {row.createdType}
                      </td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white whitespace-nowrap">
                        {row.createdBy}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {/* Footer Totals */}
              <tfoot>
                <tr className="dark:bg-dark-700 border bg-white dark:border-black">
                  {/* Spans SR, Date, Voucher No, Type, Account Name, Party Name */}
                  <td
                    colSpan={6}
                    className="px-3 py-2.5 text-right text-sm font-bold text-gray-900 dark:text-white"
                  >
                    TOTAL —
                  </td>
                  <td className="px-3 py-2.5 text-right text-sm font-bold text-green-600 dark:text-green-400">
                 ₹{summaryData.totalReceipts.value.replace("₹", "")}
                  </td>
                  <td className="px-3 py-2.5 text-right text-sm font-bold text-red-600 dark:text-red-400">
                 ₹{summaryData.totalPayments.value.replace("₹", "")}
                  </td>
                  {/* Spans Narration, Created Type, Created By */}
                  <td
                    colSpan={3}
                    className="px-3 py-2.5 text-right text-sm font-bold text-gray-900 dark:text-white"
                  >
                  Bal: {summaryData.closingBalance.value}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="dark:border-dark-600 dark:bg-dark-800 flex flex-col items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row">
              <div className="mb-3 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="dark:hover:bg-dark-600 flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-primary-500 text-white"
                          : "dark:hover:bg-dark-700 text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="dark:hover:bg-dark-600 flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashBook;