
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook for detecting the current path
import styles from "./Sidebar.module.css";

export default function Sidebar({ userType, isOpen }) {
  const pathname = usePathname();
  const links =
    userType === "admin"
      ? [
          { name: "Dashboard", href: "/dashboard" },
          // { name: "Equipment", href: "/admin/equipments" },
          { name: "PSA", href: "/admin/psa" },
          { name: "Repair", href: "/admin/repairs" },
          { name: "Maintenance", href: "/admin/maintenanace" },
          { name: "Inventory", href: "/admin/inventory" },
          // { name: "FFTH", href: "/admin/ftth" },
          // { name: "CCTV", href: "/admin/cctv" },
          { name: "AMC/CAMC", href: "/admin/cmc_amc" },
          // { name: "Printer Cartridge", href: "/admin/printercartridge" },
          // { name: "Solar", href: "/admin/solar" },
          { name: "Documentation", href: "/admin/documentation" },
          { name: "NSE", href: "/admin/nse" },
        ]
      : [
          { name: "Dashboard", href: "/user/dashboard" },
          { name: "Profile", href: "/user/profile" },
          { name: "Help", href: "/user/help" },
        ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2>{userType === "admin" ? "Admin " : "User "}</h2>
      <ul className={styles.linkList}>
        {links.map((link, index) => (
          <li key={index}

           className={styles.linkItem}>
           <Link
              href={link.href}
              className={`${styles.link} ${
                pathname === link.href ? styles.active : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
