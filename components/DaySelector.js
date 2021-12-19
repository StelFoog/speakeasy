import styles from '../styles/DaySelector.module.css';
import { getWeekday } from '../util/dates';

function DateSelect({ date, selected, onChange }) {
	const dateString = date.toISOString().substring(0, 10);
	return (
		<div onClick={() => onChange(dateString)} className={styles.day}>
			<span className={styles.weekday}>{getWeekday(date)}</span>
			<div className={`${styles.date} ${selected === dateString ? styles.selected : ''}`}>
				{date.getDate()}
			</div>
		</div>
	);
}

export default function DaySelector({ selected, onChange = () => {}, dates }) {
	return (
		<div className={`${styles.days} selfCenter`}>
			{dates.map((date) => (
				<DateSelect key={date.toISOString()} date={date} selected={selected} onChange={onChange} />
			))}
		</div>
	);
}
