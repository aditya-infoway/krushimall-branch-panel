import { NavigationTree } from "@/@types/navigation";

export const report: NavigationTree = {
  id: "report",
  type: "root",
  title: "Report",
  icon: "report",
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
  ],
};