import styles from "../styles/Home.module.css";

export default function ErrorTextView(props) {
    return (props.isDisabled || <div className={styles.error}>
        {props.error}
    </div>)
}
