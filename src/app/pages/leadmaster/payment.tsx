import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  UserIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChatBubbleLeftEllipsisIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import apiHelper from "@/utils/apiHelper";
import { toast } from "sonner";

type PaymentEntry = {
  id: string;                 // ✅ "cash-32" / "bank-15" jaisa string id hai
  voucherNo: string;
  paidAmount: number;
  pendingAmount: number;
  paymentMode: string;
  narration?: string;
  createdBy: string;
  createdAt: string;
};

type PaymentDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  leadId?: number;
  customerName?: string;
};

// ─── Payment Mode Badge ────────────────────────────────────
const ModeBadge = ({ mode }: { mode: string }) => {
  const colorMap: Record<string, string> = {
    Cash: "bg-emerald-500",
    UPI: "bg-sky-500",
    Card: "bg-purple-500",
    "Bank Transfer": "bg-blue-500",
    Cheque: "bg-orange-500",
  };
  const color = colorMap[mode] || "bg-gray-500";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${color}`}>
      {mode}
    </span>
  );
};

export function PaymentDrawer({
  isOpen,
  onClose,
  leadId,
  customerName,
}: PaymentDrawerProps) {
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [loading, setLoading] = useState(false);

const fetchPayments = async () => {
  if (!leadId) return;
  setLoading(true);
  try {
    const res = await apiHelper.get(`/branch-panel/leads/${leadId}/payments`);
    const list = res.data?.payments ?? [];   // ✅ correct unwrap
    setPayments(list);
  } catch (error) {
    console.error("Payment fetch error:", error);
    toast.error("Failed to load payment history");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (isOpen && leadId) {
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, leadId]);

  const latestPending =
    payments.length > 0 ? payments[0].pendingAmount : undefined;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        {/* Right side sliding panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-3xl">
                  <div className="flex h-full flex-col overflow-y-auto bg-[#141a21] shadow-xl">
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#141a21] px-5 py-4">
                      <div>
                        <Dialog.Title className="text-lg font-semibold text-white">
                          Payment Details
                        </Dialog.Title>
                        {customerName && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {customerName}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                      >
                        <XMarkIcon className="size-5" />
                      </button>
                    </div>

                    {/* Pending amount summary strip */}
                    {latestPending !== undefined && (
                      <div className="mx-5 mt-4 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5">
                        <span className="flex items-center gap-1.5 text-sm text-red-400">
                          <ExclamationCircleIcon className="size-4" />
                          Pending Amount
                        </span>
                        <span className="text-sm font-bold text-red-400">
                          ₹{latestPending.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {/* Body — Payment entries list */}
               {/* Body — Payment entries list */}
                    <div className="flex-1 px-5 py-4">
                      {loading && (
                        <p className="py-10 text-center text-sm text-gray-400">
                          Loading payment history...
                        </p>
                      )}

                      {!loading && payments.length === 0 && (
                        <p className="py-10 text-center text-sm text-gray-500">
                          No payment records found
                        </p>
                      )}

                      {!loading && payments.length > 0 && (
                        <div className="relative pl-6">
                          {/* continuous vertical timeline rail */}
                          <span className="absolute top-2 bottom-2 left-[7px] w-px bg-white/10" />

                          <div className="space-y-4">
                            {payments.map((p) => (
                              <div key={p.id} className="relative">
                                {/* timeline dot, centered on the rail */}
                                <span className="absolute top-1 -left-6 z-0 size-3.5 rounded-full border-2 border-[#141a21] bg-blue-500" />

                                <div className="rounded-xl border border-white/10 bg-[#1b232c] p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      <DocumentTextIcon className="size-4 text-gray-400" />
                                      <span className="text-sm font-bold text-white">
                                        {p.voucherNo}
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-gray-500">
                                      {new Date(p.createdAt).toLocaleString(
                                        "en-GB",
                                        {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        },
                                      )}
                                    </span>
                                  </div>

                                  <div className="mt-3 grid grid-cols-2 gap-y-2.5 text-[13px]">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                      <BanknotesIcon className="size-3.5 text-emerald-400" />
                                      Paid Amount:
                                    </div>
                                    <div className="text-right font-semibold text-emerald-400">
                                      ₹{p.paidAmount.toLocaleString("en-IN")}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-gray-400">
                                      <ExclamationCircleIcon className="size-3.5 text-red-400" />
                                      Pending Amount:
                                    </div>
                                    <div className="text-right font-semibold text-red-400">
                                      ₹{p.pendingAmount.toLocaleString("en-IN")}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-gray-400">
                                      <CreditCardIcon className="size-3.5" />
                                      Payment Mode:
                                    </div>
                                    <div className="text-right">
                                      <ModeBadge mode={p.paymentMode} />
                                    </div>

                                    <div className="flex items-center gap-1.5 text-gray-400">
                                      <UserIcon className="size-3.5" />
                                      Created By:
                                    </div>
                                    <div className="text-right text-gray-200">
                                      {p.createdBy}
                                    </div>
                                  </div>

                                  {p.narration && (
                                    <div className="mt-3 flex items-start gap-1.5 border-t border-white/10 pt-2.5 text-[13px] text-gray-400">
                                      <ChatBubbleLeftEllipsisIcon className="mt-0.5 size-3.5 shrink-0" />
                                      <span>{p.narration}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                    
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default PaymentDrawer;