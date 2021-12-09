import Head from 'next/head';
import { useSelector } from 'react-redux';
import Box from '../components/Box';
import { selectUser } from '../redux/user';
import { lastWeekDates } from '../util/dates';
import styles from '../styles/Dashboard.module.css';
import DaySelector from '../components/DaySelector';
import { useState } from 'react';

function MetaData({ name = 'Name Namesson' }) {
	return (
		<Head>
			<title>{`Speakeasy - ${name}`}</title>
			<meta name="description" content="A page for staff to oversee their work" />
		</Head>
	);
}

function NewReport({
	makeReport,
	selectedDate,
	setSelectedDate,
	hours,
	setHours,
	setNote,
	disableSubmit,
}) {
	const dates = lastWeekDates();

	return (
		<div className={styles.newReport}>
			<Box>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (!disableSubmit) makeReport();
					}}
				>
					<DaySelector dates={dates} selected={selectedDate} onChange={setSelectedDate} />
					<table>
						<tbody>
							<tr>
								<td>
									<label>Hours:</label>
								</td>
								<td>
									<input value={hours} onInput={(e) => setHours(e.target.value)} placeholder="0" />
								</td>
							</tr>
							<tr>
								<td>
									<label>Note:</label>
								</td>
								<td>
									<textarea onChange={(e) => setNote(e.target.value)} />
								</td>
							</tr>
						</tbody>
					</table>

					<button type="submit" disabled={disableSubmit}>
						Report
					</button>
				</form>
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
	const [hours, setHours] = useState('');
	const [note, setNote] = useState('');

	function setHoursWorked(input) {
		setHours(input.replace(/\D/g, ''));
	}

	function makeNewReport() {
		console.log({ date, hours, note });
	}

	return (
		<>
			<MetaData name={user.name} />
			<main className={styles.container}>
				<NewReport
					makeReport={makeNewReport}
					selectedDate={date}
					setSelectedDate={setDate}
					hours={hours}
					setHours={setHoursWorked}
					setNote={setNote}
					disableSubmit={!date || !hours}
				/>
				<OldReports />
			</main>
		</>
	);
}
