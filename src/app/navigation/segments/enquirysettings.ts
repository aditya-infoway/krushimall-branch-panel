import { NavigationTree } from "@/@types/navigation";

export const enquirysettings: NavigationTree = {
 id: "enquirysettings",
 type: "root",
 title: "Enquiry MASTER",
 icon: "settings",
 childs: [
  {
   id: "enquirytype",
   type: "item",
   title: "Enquiry Type",
   path: "/enquirysettings/enquirytype",
  
  },
  {
   id: "enquirysource",
   type: "item",
   title: "Enquiry Source",
   path: "/enquirysettings/enquirysource",
   
  },
  {
   id: "profession",
   type: "item",
   title: "Profession",
   path: "/enquirysettings/profession",

  },
  {
   id: "banker",
   type: "item",
   title: "Banker",
   path: "/enquirysettings/banker",
  
  },
  {
   id: "finance",
   type: "item",
   title: "Finance",
   path: "/enquirysettings/finance",
  
  },
    {
   id: "enquirystatus",
   type: "item",
   title: "Enquiry Status",
   path: "/enquirysettings/enquirystatus",

  },
 ],
};