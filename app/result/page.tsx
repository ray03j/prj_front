"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Result.module.css";

// 画像の位置の型を定義
interface ImagePosition {
  top: string;
  left: string;
  velocity: number; // 上昇/下降速度
}

const Result = () => {
  // 画像パスの配列
  const images: string[] = [
    "/futon0.png",
    "/futon1.png",
    "/futon2.png",
    "/futon3.png",
    "/futon4.png",
  ];

  // 画像位置を管理するstate（ImagePosition型の配列）
  const [positions, setPositions] = useState<ImagePosition[]>([]);
  const [isVisible, setIsVisible] = useState(true); // 画像表示状態の管理
  const [isFadedOut, setIsFadedOut] = useState(false); // フェードアウトが完了したか管理

  // canvas要素の参照（HTMLCanvasElement型）
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 画像の参照を保持する配列（HTMLImageElement型の配列）
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // 画像位置をランダムに再設定する関数
  const randomizePositions = () => {
    const newPositions: ImagePosition[] = images.map(() => ({
      top: "150vh", // 最初の位置は画面外
      left: `${Math.random() * 100}vw`,
      velocity: 2 + 3  * Math.random(), // 上昇/下降の速度をランダムに設定
    }));
    setPositions(newPositions);
  };

  // コンポーネントのマウント時にアニメーションを開始
  useEffect(() => {
    randomizePositions(); // 最初に1回実行

    // 2秒後に画像をフェードアウト開始
    const timeoutId = setTimeout(() => {
      setIsFadedOut(true); // 画像をフェードアウト
    }, 2000); // 2秒後にフェードアウト開始

    // 2.5秒後に完全に非表示にする
    const hideTimeoutId = setTimeout(() => {
      setIsVisible(false); // 画像を完全に非表示に
    }, 1500); // 2.5秒後に非表示

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
    }; // クリーンアップ
  }, []); // 空配列で初回レンダリング時のみ実行

  // アニメーションを行うためのcanvas描画処理
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // canvasが取得できない場合は終了
    const ctx = canvas.getContext("2d");

    if (!ctx) return; // コンテキストが取得できない場合は終了

    let animationFrameId: number;

    // 画像の描画とアニメーション
    const drawImages = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア

      positions.forEach((position, index) => {
        const img = imageRefs.current[index];
        if (img) {
          const x = parseFloat(position.left);
          let y = parseFloat(position.top);

          // 画像が非表示の場合は描画しない
          if (!isVisible) {
            return; // 描画をスキップ
          }

          // 上昇後、最頂点で下降
          if (y < 0) {
            position.velocity = Math.abs(position.velocity); // 下降
          }
          if (y > canvas.height + 50) {
            position.velocity = -Math.abs(position.velocity); // 上昇
          }
          // 位置を更新
          position.top = `${y + position.velocity}px`;

          // 画像を描画
          ctx.drawImage(img, x, y, 50, 50);
        }
      });

      animationFrameId = requestAnimationFrame(drawImages); // 次のフレームで再描画
    };

    drawImages(); // 初回描画

    // クリーンアップ
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [positions, isVisible]); // isVisibleを監視して、状態が変更されるたびに再描画

  return (
    <div className={styles.container}>
      {/* 背景としてのCanvas */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* 他のコンテンツ */}
      <div className={styles.jokeBox}>ダジャレがここに入ります</div>

      <h1 className={styles.title}>70点</h1>

      <div className={styles.explanationBox}>ダジャレの解説文がここに入ります。</div>

      {/* Imageコンポーネントで画像を非表示で読み込み */}
      <div className={styles.imgContainer}>
        {images.map((src, index) => (
          <img
            key={index}
            ref={(el) => (imageRefs.current[index] = el)} // 画像の参照を設定
            src={src}
            alt={`futon ${index}`}
            width={50} // Imageコンポーネントにサイズを指定
            height={50} // Imageコンポーネントにサイズを指定
            style={{
              opacity: 0, // フェードアウト
              // display: isVisible ? "block" : "none", // 2秒後に非表示
              transition: "opacity 0.5s ease", // フェードアウトのトランジション
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Result;
