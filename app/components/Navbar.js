"use client"; // Required in Next.js 13 app directory for client components

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; // updated here
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef();
  const router = useRouter();
  const currentPath = usePathname(); // ✅ this provides the current route

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <div className={styles.navbar} ref={navRef}>
      <div className={styles.leftMenu}>
        <button
          className={`${styles.navButton} ${currentPath === "/" ? styles.active : ""}`}
          onClick={() => router.push("/")}
        >
          Dashboard
        </button>

        <button
          className={`${styles.navButton} ${currentPath === "/psa" ? styles.active : ""}`}
          onClick={() => router.push("/psa")}
        >
          PSA Plants
        </button>

        <button
          className={`${styles.navButton} ${currentPath === "/cmc" ? styles.active : ""}`}
          onClick={() => router.push("/cmc")}
        >
          CMC Detail
        </button>
      </div>
    </div>
  );
}
