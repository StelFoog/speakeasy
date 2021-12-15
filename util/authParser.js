// Parses authorization (pnr+password) and returns an array [pnr, password]
export default function authParser(authorization) {
	return authorization.split('+');
}

export function authPnr(authorization) {
	return authParser(authorization)[0];
}

export function authPassword(authorization) {
	return authParser(authorization)[1];
}
