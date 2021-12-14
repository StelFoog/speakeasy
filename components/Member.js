import styles from '../styles/Member.module.css';

export default function Member({name, pnr, status}){
  return(
    <div className={styles.container}>
      <div className={styles.memberIdentity}>
        <span className={styles.memberName}>
          {name}
        </span>
        <span className={styles.memberPnr}>
          {pnr}
        </span>
      </div>
      <div className={styles.memberInfo}>
        <div className={`${styles.status} ${status === "INSIDE" ? styles.green : styles.red}`}/>
      </div>
    </div>
  )
}