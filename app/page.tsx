"use client"

import axios from "axios";
import styles from "./Home.module.css"
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { isSettai } from "@/app/constants";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("")

  const handleClick = async () =>{
    console.log("clicked")
    try {
      // APIを呼び出し
      const response = await axios.get("http://localhost:8000/", {
        params: {dajare: text}
      });
      
      let {Score} = response.data; // 返り値の数字を取得
      if(isSettai){
        Score = Score *1.5
      }
      
      // クエリパラメータを生成
      const params = new URLSearchParams();
      params.append("number", Score); // 取得した数字をクエリに追加

      // リダイレクト
      const href = `/result?text=${text}&${params}`;
      router.push(href); // URLは /result?number=123 のようになる
    } catch (error) {
      console.error(error)
    } finally {
      setText("")
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ダジャッジ</h1>
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
