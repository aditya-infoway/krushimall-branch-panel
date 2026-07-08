import { NavigationTree } from "@/@types/navigation";

export const master: NavigationTree = {
  id: "master",
  type: "root",
  title: "Master Data",
  icon: "master",
  childs: [
    {
      id: "category",
      type: "item",
      title: "Category",
      path: "/master/category",
   
    },
    {
      id: "brand",
      type: "item",
      title: "Brand",
      path: "/master/brand",
   
    },
    {
      id: "model",
      type: "item",
      title: "Model",
      path: "/master/model",
   
    },
    {
      id: "year",
      type: "item",
      title: "Year",
      path: "/master/year",
  
    },
     {
      id: "color",
      type: "item",
      title: "Colour",
      path: "/master/color",
  
    },

    // Dropdown
    {
      id: "variant",
      type: "collapse",
      title: "Variant",
        path: "/master/variant", 
      icon: "variant",
      childs: [
        {
          id: "createvariant",
          type: "item",
          title: "Create Variant",
          path: "/master/variant/create",
        },
        {
          id: "websitevariant",
          type: "item",
          title: "Website Variant",
          path: "/master/variant/website",
        },
        {
          id: "showroomvariant",
          type: "item",
          title: "Showroom Variant",
          path: "/master/variant/showroom",
        },
      ],
    },
  ],
};