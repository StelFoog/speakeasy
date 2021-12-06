import {useState, Fragment} from "react";
import {SubmitButtonView, LoginForm, ErrorText} from "./HomeViews";
import WelcomeView from "./WelcomeView"
import { useRouter } from 'next/router'



function HomePresenter(props) {
    const [password, setPassword] = useState('');
    const [pnr, setPnr] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
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
                    onSubmit={() => {
                        fetch('/api/staff/login', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${pnr}+${(password)}`
                            },
                        })
                            .then(res => res.json())
                            .then(data => {
                                const {error, type} = data
                                if (!error) {
                                    // TODO router.push("nextpage")
                                } else {
                                    setError(error)
                                    setTimeout(()=>{setError('')}, 5000)
                                }
                            }).catch(err => console.log(err.statusText))

                    }
                    }
                    isDisabled={!pnr || !password || pnr.length !== 10}>
                </SubmitButtonView>
                <ErrorText isDisabled= {!error} error = {error}/>
            </Fragment>
        }/>
    )
}

export default HomePresenter
