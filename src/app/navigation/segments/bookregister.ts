import { NavigationTree } from "@/@types/navigation";

export const bookregister: NavigationTree = {
  id: "bookregister",
  type: "root",
  title: "Cash/Bank Register",
  icon: "cashbank",
  childs: [
    {
      id: "bookregister",
      type: "item",
      title: "Cash Book",
      path: "/bookregister/cashbook",
      
    },
    {
      id: "bookregister",
      type: "item",
      title: "Bank Book",
      path: "/bookregister/bankbook",
      
    },
  ],
};
