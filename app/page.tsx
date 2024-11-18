"use client"

import axios from "axios";
import styles from "./Home.module.css"
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("")

  const handleClick = async () =>{

    try {
      // APIを呼び出し
      const response = await axios.get("http://localhost:8000/", {
        params: {query: text}
      });
      
      const {Score, Length} = response.data; // 返り値の数字を取得
      
      // クエリパラメータを生成
      const params = new URLSearchParams();
      params.append("number", Length); // 取得した数字をクエリに追加

      // リダイレクト
      const href = `/result?${params}`;
      router.push(href); // URLは /result?number=123 のようになる
    } catch (error) {
      console.error(error)
    } finally {
      setText("")
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>タイトル</h1>
      <div className={styles.inputContainer}>
        <input 
          type="text"
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {setText(e.target.value)}} 
          placeholder="ダジャレを入力" 
          className={styles.input} 
          />
        <button onClick={handleClick} className={styles.button}>SEND!</button>
      </div>
    </div>
  );
}
