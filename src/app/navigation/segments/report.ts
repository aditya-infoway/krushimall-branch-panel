import { NavigationTree } from "@/@types/navigation";

export const report: NavigationTree = {
  id: "report",
  type: "root",
  title: "Report",
  icon: "report",
  path: "/report",
  childs: [
    {
      id: "dynemicreport",
      type: "item",
      title: "Dynemic Report",
      path: "/report/dynemicreport",
    },
    {
      id: "enquirysource",
      type: "item",
      title: "Enquiry Source",
      path: "/report/enquirysource",
    },
    {
      id: "bookingbalance",
      type: "item",
      title: "Booking Balance",
      path: "/report/bookingbalance",
    },
  ],
};