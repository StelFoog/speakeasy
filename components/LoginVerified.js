import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/user';

const LOGIN_PAGE_PATH = '/';

export default function LoginVerified({ children, whitelist = [LOGIN_PAGE_PATH] }) {
	const router = useRouter();
	const user = useSelector(selectUser);

	useEffect(() => {
		if (!whitelist.includes(router.asPath) && (!user || !user.name || !user.pnr || !user.password))
			router.push(LOGIN_PAGE_PATH);
	}, [router]);

	return children;
}
