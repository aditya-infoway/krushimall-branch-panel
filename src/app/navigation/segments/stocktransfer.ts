import { NavigationTree } from "@/@types/navigation";

export const stocktransfer: NavigationTree = {
  id: "stocktransfer",
  type: "root",
  title: "Stock Transfer",
  icon: "stocktransfer",
  childs: [
    {
      id: "vehiclestock",
      type: "item",
      title: "Stock Verify",
      path: "/stocktransfer/vehiclestock",
      
    },
   
  ],
};