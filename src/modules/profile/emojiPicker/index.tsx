"use client";
import { useState } from "react";
import { SmileIcon } from "~/common/icon"; // Dùng icon tuỳ chỉnh của bạn
import styles from "./styles.module.scss"; // Đảm bảo rằng bạn có file CSS module

// Danh sách các emoji
const emojiList = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "😘",
  "🥰",
  "😗",
  "😙",
  "😚",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "😴",
  "😌",
  "😛",
  "😜",
  "😝",
  "🤤",
  "😒",
  "😓",
  "😔",
  "😕",
  "🙃",
  "🤑",
  "😲",
  "☹️",
  "🙁",
  "😖",
  "😞",
  "😟",
  "😤",
  "😢",
  "😭",
  "😦",
  "😧",
  "🥺",
  "😨",
  "😩",
  "🤯",
  "😬",
  "😰",
  "😱",
  "🥵",
  "🥶",
  "😳",
  "🤪",
  "😵",
  "😡",
  "😠",
  "🤬",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "😇",
  "🥳",
];

const EmojiPicker = ({ onEmojiSelect }: { onEmojiSelect: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle việc mở/đóng emoji picker
  const toggleEmojiPicker = () => {
    setIsOpen(!isOpen);
  };

  // Xử lý khi người dùng chọn emoji
  const handleEmojiClick = (emoji: any) => {
    onEmojiSelect(emoji);
    setIsOpen(false); // Đóng picker sau khi chọn emoji
  };

  return (
    <div className={styles.emojiPicker}>
      <button className={styles.emojiButton} onClick={toggleEmojiPicker}>
        <SmileIcon /> Add Emoji
      </button>
      {isOpen && (
        <div className={styles.emojiGrid}>
          {emojiList.map((emoji, index) => (
            <span
              key={index}
              className={styles.emojiItem}
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
