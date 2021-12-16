import styles from '../styles/Box.module.css';

export default function Box({ children, className = '', ...rest }) {
	return (
		<div className={`${styles.box} ${className}`} {...rest}>
			{children}
		</div>
	);
}
