import Head from 'next/head';
import {useSelector} from 'react-redux';
import Box from '../components/Box';
import {selectUser} from '../redux/user';
import {lastWeekDates} from '../util/dates';
import styles from '../styles/Dashboard.module.css';
import DaySelector from '../components/DaySelector';
import {useState} from 'react';

function MetaData({name = 'Name Namesson'}) {
  return (
    <Head>
      <title>{`Speakeasy - ${name}`}</title>
      <meta name="description" content="A page for staff to oversee their work"/>
    </Head>
  );
}

function Summary({reports}) {
  return <div className={styles.bla}>
    {"Total hours worked this week: "}
    {reports.reduce((sum, {hours}) => sum + hours, 0)}
  </div>
}

function Report({date, hours, notes}) {
  return <div className={styles.report}>
    <div className={styles.hoursAndDates}>
      <p className={styles.date}>{date}</p>
      <p className={styles.hours}>{hours} hours </p>
    </div>
    <p className={styles.notes}>
      "{notes}"
    </p>
  </div>

}

function NewReport({
                     makeReport,
                     selectedDate,
                     setSelectedDate,
                     hours,
                     setHours,
                     setNote,
                     disableSubmit,
                     notes
                   }) {
  const dates = lastWeekDates();

  return (
    <div className={styles.newReport}>
      <Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!disableSubmit)
              makeReport({selectedDate, hours, notes});
          }}
        >
          <DaySelector dates={dates} selected={selectedDate} onChange={setSelectedDate}/>
          <table>
            <tbody>
            <tr>
              <td>
                <label>Hours:</label>
              </td>
              <td>
                <input value={hours} onInput={(e) => setHours(e.target.value)} placeholder="0"/>
              </td>
            </tr>
            <tr>
              <td>
                <label>Note:</label>
              </td>
              <td>
                <textarea onChange={(e) => setNote(e.target.value)}/>
              </td>
            </tr>
            </tbody>
          </table>

          <button type="submit" disabled={disableSubmit}>
            Submit report
          </button>
        </form>
      </Box>
    </div>
  );
}

function OldReports({reports}) {
  return (
    <div className={styles.submittedReports}>
      {reports.map(({selectedDate, hours, notes}) => {
        return <Box>
          <Report style={styles.hoursAndDates}
                  date={selectedDate}
                  hours={hours} notes={notes}/>
        </Box>
      })}
    </div>
  );
}

export default function Dashboard() {
  const user = useSelector(selectUser);

  // new report form values
  const [date, setDate] = useState('');
  const [hours, setHours] = useState(0);
  const [note, setNote] = useState('');
  const [reports, setReports] = useState([])

  function setHoursWorked(input) {
    setHours(Number(input.replace(/\D/g, '')));
  }

  return (
    <>
      <MetaData name={user.name}/>
      <main className={styles.container}>
        <NewReport
          makeReport={report => {
            setReports([...reports, report])
            fetch('api/reports/insert', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `${user.pnr}+${user.password}`,
              },
              body: report
            })
          }}
          selectedDate={date}
          setSelectedDate={setDate}
          hours={hours}
          setHours={setHoursWorked}
          setNote={setNote}
          notes={note}
          disableSubmit={!date || !hours}
        />
        <div className={styles.reportsAndHours}>
          <Summary reports={reports}/>
          <OldReports reports={reports}/>
        </div>
      </main>
    </>
  );
}
