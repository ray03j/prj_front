import styles from "./Home.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>タイトル</h1>
      <div className={styles.inputContainer}>
        <input type="text" placeholder="ダジャレを入力" className={styles.input} />
        <button className={styles.button}>SEND!</button>
      </div>
    </div>
  );
}
