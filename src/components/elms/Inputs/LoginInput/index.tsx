"use client";
import { Rule } from "antd/es/form";
import { Form, Input as AntInput } from "antd";
import styles from "./styles.module.scss";
interface InputProps {
  name: string;
  placeholder?: string;
  label?: string;
  rules?: Rule[];
  className?: string;
  onChange?: any;
  prefix?: any;
  dependencies?: string[];
  initialValue?: string | null;
  autocomplete?: string;
  type?: "password" | "text";
}

function Input({
  name,
  placeholder,
  label,
  rules,
  className,
  dependencies,
  initialValue,
  onChange,
  autocomplete,
  prefix,
  type,
}: InputProps) {
  const TypeInput = type === "password" ? AntInput.Password : AntInput;
  return (
    <Form.Item
      name={name}
      className={styles.formItem}
      rules={rules}
      label={label}
      initialValue={initialValue}
      dependencies={dependencies}
    >
      <TypeInput
        onChange={onChange} prefix={prefix}
        className={`${styles.input} ${className}`}
        autoComplete={autocomplete}
        placeholder={placeholder}
      ></TypeInput>
    </Form.Item>
  );
}

export default Input;
