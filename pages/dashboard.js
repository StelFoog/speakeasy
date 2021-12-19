import Head from 'next/head';
import { useSelector } from 'react-redux';
import Box from '../components/Box';
import { selectUser } from '../redux/user';
import { lastWeekDates } from '../util/dates';
import styles from '../styles/Dashboard.module.css';
import DaySelector from '../components/DaySelector';
import { useEffect, useState } from 'react';
import { getOwnReports, insertReport } from '../util/db/reports';
import TextInput from '../components/TextInput';
import { SmallLoader } from '../components/Loader';
import { toast } from 'react-toastify';

function MetaData({ name = 'Name Namesson' }) {
	return (
		<Head>
			<title>{`Speakeasy - ${name}`}</title>
			<meta name="description" content="A page for staff to oversee their work" />
		</Head>
	);
}

function Summary({ reports }) {
	return (
		<div className={styles.bla}>
			{'Total hours worked last ten shifts: '}
			{reports.reduce((sum, { hours }) => sum + hours, 0)}
		</div>
	);
}

function Report({ date, hours, notes }) {
	return (
		<div className={styles.report}>
			<div className={styles.hoursAndDates}>
				<p className={styles.date}>{date}</p>
				<p className={styles.hours}>{hours} hours </p>
			</div>
			<p hidden={!notes} className={styles.notes}>
				"{notes}"
			</p>
		</div>
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
	notes,
}) {
	const dates = lastWeekDates();

	return (
		<div className={styles.newReport}>
			<Box>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (!disableSubmit) makeReport({ date: selectedDate, hours, note: notes });
					}}
				>
					<DaySelector dates={dates} selected={selectedDate} onChange={setSelectedDate} />
					<TextInput label="Hours" value={hours} onChange={setHours} fullWidth />
					<div className={styles.noteDiv}>
						<label>Note:</label>

						<textarea onChange={(e) => setNote(e.target.value)} />
					</div>

					<button type="submit" disabled={disableSubmit}>
						Submit report
					</button>
				</form>
			</Box>
		</div>
	);
}

function OldReports({ reports }) {
	return (
		<div className={styles.submittedReports}>
			{reports.map(({ date, hours, note, _id }) => {
				return (
					<Box key={_id}>
						<Report style={styles.hoursAndDates} date={date} hours={hours} notes={note} />
					</Box>
				);
			})}
		</div>
	);
}

function dateSorter(current, next) {
	if (current.date < next.date) {
		return 1;
	} else if (current.date > next.date) {
		return -1;
	} else {
		return 0;
	}
}

export default function Dashboard() {
	const { pnr, name, password } = useSelector(selectUser);

	// new report form values
	const [date, setDate] = useState('');
	const [hours, setHours] = useState(0);
	const [note, setNote] = useState('');
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getOwnReports({ pnr, password })
			.then((data) => {
				setReports(data);
				setLoading(false);
			})
			.catch((error) => {
				toast.error(error);
				setLoading(false);
			});
	}, []);

	function setHoursWorked(input) {
		setHours(Number(input.replace(/\D/g, '')));
	}

	return (
		<>
			<MetaData name={name} />
			<main className={styles.container}>
				<NewReport
					makeReport={(report) => {
						setLoading(true);
						insertReport({ pnr, password }, report)
							.then(() => {
								if (reports.length === 9) reports.pop();
								setReports([report, ...reports].sort(dateSorter));
								setLoading(false);
							})
							.catch((error) => {
								toast.error(error);
								setLoading(false);
							});
					}}
					selectedDate={date}
					setSelectedDate={setDate}
					hours={hours}
					setHours={setHoursWorked}
					setNote={setNote}
					notes={note}
					disableSubmit={
						!date || !hours || reports.filter((report) => report.date === date).length !== 0
					}
				/>
				<div className={styles.reportsAndHours}>
					{loading && <SmallLoader style={{ alignSelf: 'center' }} />}
					<Summary reports={reports} />
					<OldReports reports={reports} />
				</div>
			</main>
		</>
	);
}
