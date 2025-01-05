"use client"

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./Result.module.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const Result = () => {
  const params = useSearchParams()

  const images = ["/futon0.png", "/futon1.png", "/futon2.png", "/futon3.png", "/futon4.png"];
  const [isVisible, setIsVisible] = useState(true);
  const [explanation, setExplanation] = useState("解説を取得中..."); // 解説文の状態を管理
  const number = parseInt(params.getAll("number")[0], 10);
  const dajare = params.getAll("text")[0];
  const isSettai = true;

  const fetchExplanation = async () => {
    try {
      const response = await axios.post("http://localhost:8000/explanation", {
        dajare: dajare
      });
      const formatedExplanation = response.data.response
      .replace(/```/g, '')
      .replace(/text/g, '')
      .replace(/string/g, '')
      .replace(/plain/g, '')
      setExplanation(formatedExplanation+"\n"); // 解説文を設定
    } catch (error) {
      console.error("Failed to fetch explanation:", error);
      setExplanation("解説を取得できませんでした。");
    }
  };

  const fetchSettai = async () => {
    try {
      const response = await axios.post("http://localhost:8000/settai", {
        dajare: dajare
      });
      const formatedExplanation = response.data.response
      .replace(/```/g, '')
      .replace(/text/g, '')
      .replace(/string/g, '')
      .replace(/plain/g, '')
      setExplanation(formatedExplanation+"\n"); // 解説文を設定
    } catch (error) {
      console.error("Failed to fetch explanation:", error);
      setExplanation("解説を取得できませんでした。");
    }
  } 

  
  const fetchData = () => {
    if(isSettai) {
      fetchSettai();
    } else {
      fetchExplanation();
    }
  }
  
  useEffect(() => {
    fetchData();

    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // 2.5秒後に非表示

    return () => clearTimeout(hideTimeout);
  }, []);

  // 5分割した位置を計算
  const initialPositions = [-60, -30, 0, 30, 60]; // 画像を中央から±60%, ±30%, 0%に配置

  return (
    <div className={styles.container}>
      <div className={styles.jokeBox}>{`${dajare}`}</div>
      <div className={styles.scoreContainer}>
        <div className={styles.score}>{`${number}`}</div>
        <div className={styles.maxScore}>/5</div>
      </div>
      <div className={styles.explanationBox}>{explanation}</div>

      <div className={styles.imgContainer}>
        {images.slice(0, number).map((src, index) => (
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
      <Link href="/" className={styles.button}>BACK</Link>
    </div>
  );
};

export default Result;
