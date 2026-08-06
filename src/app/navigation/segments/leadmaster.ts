import { NavigationTree } from "@/@types/navigation";

export const leadmaster: NavigationTree = {
 id: "leadmaster",
 type: "root",
 title: "Lead Master",
 icon: "leadbuilder",
 childs: [
  {
   id: "leadbuilder",
   type: "item",
   title: "Lead Builder Report",
   path: "/leadmaster/leadbuilder",
  
  },
   {
   id: "Quatationhistory",
   type: "item",
   title: "Quotation History",
   path: "/leadmaster/Quatationhistory",
  
  },
  {
   id: "Testdrivehistory",
   type: "item",
   title: "Testdrive History",
   path: "/leadmaster/testdrivehistory",
  
  },
 
 ],
};