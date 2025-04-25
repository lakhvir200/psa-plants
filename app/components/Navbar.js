import styles from "./Navbar.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

export default function Navbar({ onToggleSidebar, isSidebarOpen,userType, isOpen }) {
  
  return (
    <div
      className={`${styles.navbar} ${
        isSidebarOpen ? styles.shifted : styles.default
      }`}
    >
      <IconButton onClick={onToggleSidebar} className={styles.menuButton}>
        <MenuIcon style={{ color: "white" }} />
      </IconButton>
      <h2>Dashboard</h2>
    </div>
  );
}
