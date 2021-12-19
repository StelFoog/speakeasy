import styles from '../styles/Loader.module.css';

export default function Loader({ size = 150, spacing = 8, style = {} }) {
	return (
		<div
			className={styles.loader}
			style={{
				minWidth: `${size}px`,
				maxWidth: `${size}px`,
				minHeight: `${size}px`,
				maxHeight: `${size}px`,
				padding: `${spacing}px`,
				...style,
			}}
		>
			<div style={{ padding: `${spacing}px` }}>
				<div style={{ padding: `${spacing}px` }}>
					<div style={{ padding: `${spacing}px` }}>
						<div />
					</div>
				</div>
			</div>
		</div>
	);
}

const SMALL_ROTATE_TIME = '2s';

export function SmallLoader({ size = 50, spacing = 5, style = {} }) {
	return (
		<div
			className={styles.loader}
			style={{
				minWidth: `${size}px`,
				maxWidth: `${size}px`,
				minHeight: `${size}px`,
				maxHeight: `${size}px`,
				padding: `${spacing}px`,
				animationDuration: SMALL_ROTATE_TIME,
				...style,
			}}
		>
			<div style={{ animationDuration: SMALL_ROTATE_TIME }} />
		</div>
	);
}
