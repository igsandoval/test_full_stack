import Image from "next/image";
import localFont from "next/font/local";
import GetList from "@/components/get-list";
import styles from "../styles/globals.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <GetList />
    </div>
  );
}
