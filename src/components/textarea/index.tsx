import styles from "@/components/textarea/styles.module.css";
import { HTMLProps } from "react";

export default function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
  return <textarea className={styles.textarea} {...rest}></textarea>;
}
