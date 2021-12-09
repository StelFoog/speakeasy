import Head from 'next/head';
import { useSelector } from 'react-redux';
import Box from '../components/Box';
import { selectUser } from '../redux/user';
import { lastWeekDates } from '../util/dates';
import styles from '../styles/Dashboard.module.css';
import DaySelector from '../components/DaySelector';
import { useEffect, useState } from 'react';

function MetaData({ name = 'Name Namesson' }) {
	return (
		<Head>
			<title>{`Speakeasy - ${name}`}</title>
			<meta name="description" content="A page for staff to oversee their work" />
		</Head>
	);
}

function NewReport({ makeReport, selectedDate, setSelectedDate }) {
	const dates = lastWeekDates();

	return (
		<div className={styles.newReport}>
			<Box>
				<DaySelector dates={dates} selected={selectedDate} onChange={setSelectedDate} />
			</Box>
		</div>
	);
}

function OldReports({}) {
	return (
		<div className={styles.submittedReports}>
			<Box>2</Box>
			<Box>3</Box>
		</div>
	);
}

export default function Dashboard() {
	const user = useSelector(selectUser);

	// new report form values
	const [date, setDate] = useState('');

	// TEMP: log changes to the form values
	useEffect(() => {
		console.log('date:', date);
	}, [date]);

	function makeNewReport() {}

	return (
		<>
			<MetaData name={user.name} />
			<main className={styles.container}>
				<NewReport makeReport={makeNewReport} selectedDate={date} setSelectedDate={setDate} />
				<OldReports />
			</main>
		</>
	);
}
