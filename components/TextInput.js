import TextField from '@mui/material/TextField';

export default function TextInput({
	label,
	error,
	value,
	onChange,
	fullWidth = false,
	type = 'text',
}) {
	return (
		<TextField
			label={label}
			error={!!error}
			helperText={error ? error : error === null ? false : ' '}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			fullWidth={fullWidth}
			type={type}
		/>
	);
}
