const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// takes a date or day in the week (number 0-6) and returns the corresponding weekday
export function getWeekday(day) {
	if (day instanceof Date) return weekdays[day.getDay()];
	else if (typeof day === 'number') return weekdays[day];
}

// returns an array containing the last 7 dates with a possible offset
export function lastWeekDates(offset = 0) {
	const dates = [];
	const now = new Date();
	let date = offset > 0 ? new Date(new Date().setDate(now.getDate() - offset)) : now;
	for (let i = 6; i >= 0; i--) dates.push(new Date(new Date().setDate(date.getDate() - i)));

	return dates;
}
