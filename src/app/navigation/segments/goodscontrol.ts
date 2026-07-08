import { NavigationTree } from "@/@types/navigation";

export const goodcontrol: NavigationTree = {
  id: "goodscontrol",
  type: "root",
  title: "Goods Control MASTER",
  icon: "control",
  childs: [
    {
      id: "tractorinventory",
      type: "item",
      title: "Tractor Inventory",
      path: "/goodscontrol/tractorinventory",
    },
    {
      id: "accessoriesinventory",
      type: "item",
      title: "Accessories Inventory",
       path: "/goodscontrol/accessoriesinventory",
    },
  ],
};