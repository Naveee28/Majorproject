import { ACCOUNT_TYPE } from "../utils/constants"

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/provider",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Offerings",
    path: "/dashboard/my-services",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscTools",
  },

  // {
  //   id: 4,
  //   name: "Cart",
  //   path: "/dashboard/cart",
  //   type: ACCOUNT_TYPE.USER,
  //   icon: "VscArchive",
  // },
  {
    id: 4,
    name: "Wishlist",
    path: "/dashboard/wishlist/services",
    path2:"/dashboard/wishlist/rents",
    type: ACCOUNT_TYPE.USER,
    icon: "VscHeartFilled",
  },
  {
    id: 5,
    name: "Purchase History",
    path: "/dashboard/history/services",
    type: ACCOUNT_TYPE.USER,
    icon: "VscHistory",
  },
  // {
  //   id: 6,
  //   name: "Dashboard",
  //   path: "/dashboard/admin",
  //   type: ACCOUNT_TYPE.ADMIN,
  //   icon: "VscDashboard",
  // },
  {
    id: 7,
    name: "My Categories",
    path: "/dashboard/my-categories",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscTasklist",
  },
  {
    id: 8,
    name: "Add Category",
    path: "/dashboard/add-category",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 9,
    name: "Add",
    path: "/dashboard/add",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscAdd", 
  }
]
