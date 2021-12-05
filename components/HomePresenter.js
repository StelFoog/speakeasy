import {useState, Fragment} from "react";
import {LoginViews, FormStateRadioView, StaffTypeRadioView, SubmitButtonView, LoginRegisterForm} from "./HomeViews";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import WelcomeView from "./WelcomeView";
import {btoa} from "next/dist/server/web/sandbox/polyfills";

function HomePresenter(props) {
    const [formState, setFormState] = useState("login")
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [staffType, setStaffType] = useState('')
    const [pnr, setPnr] = useState('')
    return (
        <WelcomeView components={
            <Fragment>
                <FormStateRadioView
                    onFormStateChange={(change) => {
                        setFormState(change)
                    }}>
                </FormStateRadioView>
                <br/>
                {formState === "register" &&
                <StaffTypeRadioView
                    staffType={staffType}
                    onStaffTypeChange={setStaffType}/>
                }
                <LoginRegisterForm
                    password={password}
                    username={name}
                    pnr={pnr}
                    repeatPassword={repeatPassword}
                    onPnrChange={setPnr}
                    onNameChange={setName}
                    onPasswordChange={setPassword}
                    onRepeatPasswordChange={setRepeatPassword}
                    formState={formState}>

                </LoginRegisterForm>
                <SubmitButtonView
                    formState={formState}
                    onLogin={() => {
                    }
                    }
                    onRegister={async () => {
                        const result = await fetch('/api/staff/create', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${name}+${password}`
                            },
                            body: JSON.stringify({
                                "name": name,
                                pnr,
                                "plainPassword": password,
                                "type": staffType
                            })

                        })
                        console.log(result)
                    }}
                    isDisabled={
                        formState === 'register' ?
                            !staffType || !name || !password || !repeatPassword && password !== repeatPassword :
                            !name || !password
                    }>
                </SubmitButtonView>
            </Fragment>
        }/>
    )
}

export default HomePresenter