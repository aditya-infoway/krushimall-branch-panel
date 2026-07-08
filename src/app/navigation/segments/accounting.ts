import { NavigationTree } from "@/@types/navigation";

export const accounting: NavigationTree = {
  id: "accounting",
  type: "root",
  title: "Accounting MASTER",
  icon: "accounting",
  childs: [
    {
      id: "debit-note",
      type: "item",
      title: "Debit Note",
      path: "/accounting/debit-note",
    },
    {
      id: "credit-note",
      type: "item",
      title: "Credit Note",
      path: "/accounting/credit-note",
    },
    {
      id: "cash-payment",
      type: "item",
      title: "Cash Payment",
      path: "/accounting/cash-payment",
    },
    {
      id: "cash-receipt",
      type: "item",
      title: "Cash Receipt",
      path: "/accounting/cash-receipt",
    },
    {
      id: "bank-payment",
      type: "item",
      title: "Bank Payment",
      path: "/accounting/bank-payment",
    },
    {
      id: "bank-receipt",
      type: "item",
      title: "Bank Receipt",
      path: "/accounting/bank-receipt",
    },
    {
      id: "contra",
      type: "item",
      title: "Contra",
      path: "/accounting/contra",
    },
    {
      id: "journal-entries",
      type: "item",
      title: "Journal Entries",
      path: "/accounting/journal-entries",
    },
  ],
};
