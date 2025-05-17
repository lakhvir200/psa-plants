"use client"; // Required in Next.js 13 app directory for client components

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // for Next.js 13 app directory
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef();
  const router = useRouter();

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
        <div className={styles.dropdown}>
          <button
            className={styles.navButton}
            onClick={() => toggleDropdown("equipment")}
          >
            Equipment
          </button>
          
          {activeDropdown === "equipment" && (
            <div className={styles.dropdownContent}>
              {/* <div
                className={styles.dropdownItem}
                onClick={() => router.push("/equipments")}
                style={{ cursor: "pointer" }}
              >
                Equipments
              </div> */}
              <div
                className={styles.dropdownItem}
                onClick={() => router.push("/psa")

                  
                }
                style={{ cursor: "pointer" }}
              >
                PSA Plants
              </div>
            </div>
          )}
        </div>

        <div className={styles.dropdown}>
          <button
            className={styles.navButton}
            onClick={() => toggleDropdown("cmc")}
          >
            CMC
          </button>
          {activeDropdown === "cmc" && (
            <div className={styles.dropdownContent}>
              <div
                className={styles.dropdownItem}
                onClick={() => router.push("/cmc/option1")}
                style={{ cursor: "pointer" }}
              >
                Option 1
              </div>
              <div
                className={styles.dropdownItem}
                onClick={() => router.push("/cmc/option2")}
                style={{ cursor: "pointer" }}
              >
                Option 2
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
