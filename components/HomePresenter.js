import {useState, Fragment} from "react";
import {SubmitButtonView, LoginForm} from "./HomeViews";
import WelcomeView from "./WelcomeView";
import bcrypt from 'bcrypt';
import {SALT_ROUNDS} from "../util/db";


function HomePresenter(props) {
    const [password, setPassword] = useState('');
    const [pnr, setPnr] = useState('')
    return (
        <WelcomeView components={
            <Fragment>
                <LoginForm
                    password={password}
                    pnr={pnr}
                    onPnrChange={setPnr}
                    onPasswordChange={setPassword}>
                </LoginForm>
                <SubmitButtonView
                    action={"Login"}
                    onSubmit={async () => {
                        const result = await fetch('/api/staff/login', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${pnr}+${bcrypt.hash(password, SALT_ROUNDS)}`
                            },
                        })

                        console.log(result)
                    }
                    }
                    isDisabled={!pnr || !password || pnr.length !== 10}>
                </SubmitButtonView>
            </Fragment>
        }/>
    )
}

export default HomePresenter
