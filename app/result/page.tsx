"use client"

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./Result.module.css";
import { useSearchParams } from "next/navigation";

const Result = () => {
  const params = useSearchParams()

  const images = ["/futon0.png", "/futon1.png", "/futon2.png", "/futon3.png", "/futon4.png"];
  const [isVisible, setIsVisible] = useState(true);


  useEffect(() => {
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // 2.5秒後に非表示

    return () => clearTimeout(hideTimeout);
  }, []);

  // 5分割した位置を計算
  const initialPositions = [-60, -30, 0, 30, 60]; // 画像を中央から±60%, ±30%, 0%に配置

  return (
    <div className={styles.container}>
      <div className={styles.jokeBox}>{`${params.getAll("text")}`}</div>
      <div className={styles.scoreContainer}>
        <div className={styles.score}>{`${params.getAll("number")}`}</div>
        <div className={styles.maxScore}>/5</div>
      </div>
      <div className={styles.explanationBox}>ダジャレの解説文がここに入ります。</div>

      <div className={styles.imgContainer}>
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`futon ${index}`}
            width={150} // 画像サイズを大きく
            height={150} // 画像サイズを大きく
            initial={{
              y: "100vh", // 初期位置は画面外
              x: `${initialPositions[index]}vw`, // 5分割した位置に配置
            }}
            animate={{ 
              y: ["100vh", "-60vh", "150vh"], // より高く飛ばす
              x: `${Math.random() * 200 - 100}vw` // ランダムに左右移動
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
            style={{
              display: isVisible ? "block" : "none",
              position: "absolute",
              opacity: isVisible ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Result;
