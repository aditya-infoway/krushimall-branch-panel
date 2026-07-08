import { NavigationTree } from "@/@types/navigation";

export const item: NavigationTree = {
  id: "item",
  type: "root",
  title: "Item MASTER",
  icon: "item",
  childs: [
    {
      id: "tractor",
      type: "item",
      title: "Tractor Item",
      path: "/item/tractor",
      
    },
    {
      id: "accessories",
      type: "item",
      title: "Accessories",
      path: "/item/accessories",
      
    },
  ],
};