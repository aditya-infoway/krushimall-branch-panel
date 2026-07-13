import { Navigate, RouteObject } from "react-router";

import AuthGuard from "@/middleware/AuthGuard";
import { DynamicLayout } from "../layouts/DynamicLayout";
import { AppLayout } from "../layouts/AppLayout";

/**
 * Protected routes configuration
 * These routes require authentication to access
 * Uses AuthGuard middleware to verify user authentication
 */
const protectedRoutes: RouteObject = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // Separate page
    {
      path: "select-company",
      lazy: async () => ({
        Component: (await import("@/app/pages/Auth/Selectecompany")).default,
      }),
    },

    // Dashboard pages only
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards/dashboard" replace />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },

            {
              path: "dashboard",
              lazy: async () => ({
                Component: (await import("@/app/pages/dashboards/dashboard"))
                  .default,
              }),
            },
            {
              path: "inventory",
              lazy: async () => ({
                Component: (await import("@/app/pages/dashboards/inventory"))
                  .default,
              }),
            },
          ],
        },
        {
          path: "master",
          children: [
            {
              path: "category",
              lazy: async () => ({
                Component: (await import("@/app/pages/master/category"))
                  .default,
              }),
            },

            {
              path: "brand",
              lazy: async () => ({
                Component: (await import("@/app/pages/master/brand")).default,
              }),
            },

            {
              path: "model",
              lazy: async () => ({
                Component: (await import("@/app/pages/master/model")).default,
              }),
            },

            {
              path: "year",
              lazy: async () => ({
                Component: (await import("@/app/pages/master/modelyear"))
                  .default,
              }),
            },

            {
              path: "color",
              lazy: async () => ({
                Component: (await import("@/app/pages/master/colour")).default,
              }),
            },

            {
              path: "variant",
              children: [
                {
                  index: true,
                  element: <Navigate to="create" replace />,
                },

                {
                  path: "create",
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/master/variant/createvariant")
                    ).default,
                  }),
                },
                {
                  path: "website",
                  children: [
                    {
                      index: true,
                      lazy: async () => ({
                        Component: (
                          await import("@/app/pages/master/variant/websitevariantList")
                        ).default,
                      }),
                    },

                    {
                      path: "create",
                      lazy: async () => ({
                        Component: (
                          await import("@/app/pages/master/variant/WebsiteVariant")
                        ).default,
                      }),
                    },
                  ],
                },

                {
                  path: "showroom",
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/master/variant/showroomvariant")
                    ).default,
                  }),
                },
              ],
            }, //   {
            //   path: "showroomvariant",
            //   lazy: async () => ({
            //     Component: (
            //       await import("@/app/pages/master/variant/showroomvariant")
            //     ).default,
            //   }),
            // },
          ],
        },

        {
          path: "leadmaster",
          children: [
            {
              path: "leadbuilder",
              lazy: async () => ({
                Component: (await import("@/app/pages/leadmaster/leadbuilder"))
                  .default,
              }),
            },
            {
              path: "Followup/:id",
              lazy: async () => ({
                Component: (await import("@/app/pages/leadmaster/followup"))
                  .default,
              }),
            },
            {
              path: "order",
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (await import("@/app/pages/leadmaster/order"))
                      .default,
                  }),
                },
                {
                  path: ":id",
                  lazy: async () => ({
                    Component: (await import("@/app/pages/leadmaster/order"))
                      .default,
                  }),
                },
              ],
            },
          ],
        },
        {
          path: "usermaster",
          children: [
            {
              path: "account",
              lazy: async () => ({
                Component: (await import("@/app/pages/usermaster/account"))
                  .default,
              }),
            },
            {
              path: "newaccount",
              lazy: async () => ({
                Component: (await import("@/app/pages/usermaster/newaccount"))
                  .default,
              }),
            },
            {
              path: "newaccount/:id", // For edit with ID param
              lazy: async () => ({
                Component: (await import("@/app/pages/usermaster/newaccount"))
                  .default,
              }),
            },
            {
              path: "employee",
              lazy: async () => ({
                Component: (await import("@/app/pages/usermaster/employee"))
                  .default,
              }),
            },
            {
              path: "createbroker",
              lazy: async () => ({
                Component: (await import("@/app/pages/usermaster/broker"))
                  .default,
              }),
            },
          ],
        },

        {
          path: "stocktransfer",
          children: [
            {
              path: "vehiclestock",
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/stocktransfer/vehiclestock")
                    ).default,
                  }),
                },
              ],
            },
          ],
        },

        {
          path: "enquirysettings",
          children: [
            {
              path: "enquirytype",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/enquirysettings/enquirytype")
                ).default,
              }),
            },
            {
              path: "enquirysource",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/enquirysettings/enquirysource")
                ).default,
              }),
            },
            {
              path: "profession",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/enquirysettings/profession")
                ).default,
              }),
            },
            {
              path: "banker",
              lazy: async () => ({
                Component: (await import("@/app/pages/enquirysettings/banker"))
                  .default,
              }),
            },
            {
              path: "finance",
              lazy: async () => ({
                Component: (await import("@/app/pages/enquirysettings/finance"))
                  .default,
              }),
            },
            {
              path: "enquirystatus",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/enquirysettings/enquirystatus")
                ).default,
              }),
            },
          ],
        },

        {
          path: "item",
          children: [
            {
              path: "tractor",
              lazy: async () => ({
                Component: (await import("@/app/pages/item/tractor")).default,
              }),
            },
            {
              path: "accessories",
              lazy: async () => ({
                Component: (await import("@/app/pages/item/accessories"))
                  .default,
              }),
            },
          ],
        },

        {
          path: "purchase",
          children: [
            {
              path: "tractor",
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (await import("@/app/pages/purchase/tractor"))
                      .default,
                  }),
                },
                {
                  path: "add",
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/purchase/purchasebill")
                    ).default,
                  }),
                },
                {
                  path: ":id",
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/purchase/purchasebill")
                    ).default,
                  }),
                },
                {
                  path: "inward/:id",
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/purchase/purchaseitemlist")
                    ).default,
                  }),
                },
              ],
            },

            {
              path: "accessories-inward/:id",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/purchase/accessoriesitemlist")
                ).default,
              }),
            },

            {
              path: "accessories",
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/purchase/accessories")
                    ).default,
                  }),
                },
                {
                  path: "add",
                  lazy: async () => ({
                    Component: (
                      await import("@/app/pages/purchase/puraccessories")
                    ).default,
                  }),
                },
              ],
            },
          ],
        },

        {
          path: "accounting",
          children: [
            {
              path: "cash-payment",
              lazy: async () => ({
                Component: (await import("@/app/pages/accounting/cashpayment"))
                  .default,
              }),
            },
            {
              path: "cash-receipt",
              lazy: async () => ({
                Component: (await import("@/app/pages/accounting/cashreceipt"))
                  .default,
              }),
            },
            {
              path: "bank-payment",
              lazy: async () => ({
                Component: (await import("@/app/pages/accounting/bankpayment"))
                  .default,
              }),
            },
            {
              path: "bank-receipt",
              lazy: async () => ({
                Component: (await import("@/app/pages/accounting/bankreceipt"))
                  .default,
              }),
            },
            {
              path: "contra",
              lazy: async () => ({
                Component: (await import("@/app/pages/accounting/contra"))
                  .default,
              }),
            },
            {
              path: "journal-entries",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/accounting/journalentries")
                ).default,
              }),
            },
            {
              path: "debit-note",
              lazy: async () => ({
                Component: (await import("@/app/pages/accounting/debitnote"))
                  .default,
              }),
            },
            {
              path: "credit-note",
              lazy: async () => ({
                Component: (await import("@/app/pages/accounting/creditnote"))
                  .default,
              }),
            },
          ],
        },
        {
          path: "goodscontrol",
          children: [
            {
              path: "tractorinventory",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/goodscontrol/tractorinventory")
                ).default,
              }),
            },
            {
              path: "accessoriesinventory",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/goodscontrol/accessoriesinventory")
                ).default,
              }),
            },
          ],
        },

        {
          path: "bookregister",
          children: [
            {
              path: "cashbook",
              lazy: async () => ({
                Component: (await import("@/app/pages/cash-bank/cashbook"))
                  .default,
              }),
            },
            {
              path: "bankbook",
              lazy: async () => ({
                Component: (await import("@/app/pages/cash-bank/bankbook"))
                  .default,
              }),
            },
          ],
        },

        {
          path: "ledgerdetails",
          children: [
            {
              path: "ledgerreport",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/ledgerdetails/ledgerreport")
                ).default,
              }),
            },
            {
              path: "ledgerdetails",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/ledgerdetails/ledgerdetails")
                ).default,
              }),
            },
          ],
        },

        {
          path: "report",
          children: [
            {
              path: "dynemicreport",
              lazy: async () => ({
                Component: (await import("@/app/pages/report/dynemicreport"))
                  .default,
              }),
            },
            {
              path: "enquirysource",
              lazy: async () => ({
                Component: (await import("@/app/pages/report/enquirysource"))
                  .default,
              }),
            },
          ],
        },

        {
          path: "bookingbalance",
          children: [
            {
              path: "bookingbalance",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/bookingbalance/bookingbalance")
                ).default,
              }),
            },
          ],
        },

        {
          path: "followups",
          children: [
            {
              index: true,
              element: <Navigate to="todayfollowups" replace />,
            },
            {
              path: "todayfollowups",
              lazy: async () => ({
                Component: (await import("@/app/pages/followup/todayfolloups"))
                  .default,
              }),
            },
            {
              path: "follow-up/:id", // Add :id param
              lazy: async () => ({
                Component: (await import("@/app/pages/followup/follow-up"))
                  .default,
              }),
            },
            {
              path: "history/:id",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/followup/followuphistory")
                ).default,
              }),
            },
          ],
        },


        {
      path: "accessories",
      children: [
        {
          index: true,
          lazy: async () => ({
            Component: (await import("@/app/pages/purchase/accessories"))
              .default,
          }),
        },

        {
          path: "add",
          lazy: async () => ({
            Component: (await import("@/app/pages/purchase/puraccessories"))
              .default,
          }),
        },

        {
          path: "add/:id",
          lazy: async () => ({
            Component: (await import("@/app/pages/purchase/puraccessories"))
              .default,
          }),
        },

      ],
    },


    {
      path: "settings",
      lazy: async () => ({
        Component: (await import("@/app/pages/settings/Layout")).default,
      }),
      children: [
        {
          index: true,
          element: <Navigate to="general" replace />,
        },
        {
          path: "general",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/settings/sections/General")
            ).default,
          }),
        },
        {
          path: "appearance",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/settings/sections/Appearance")
            ).default,
          }),
        },
      ],
    },

      ],
    },

    


    
  ],
}


    


export { protectedRoutes };
