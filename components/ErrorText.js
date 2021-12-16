import styles from "../styles/Home.module.css";

export default function ErrorText(props) {
    return (props.isDisabled || <div className={styles.error}>
        {props.error}
    </div>)
}
