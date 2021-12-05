import styles from './FormView.module.css'

export function SubmitButtonView(props) {
    return (
        <>
            {props.formState === "register" ?
                <button
                    disabled={props.isDisabled}
                    onClick={props.onRegister}>
                    Register
                </button>
                : <button
                    disabled={props.isDisabled}
                    onClick={props.onLogin}>
                    Login
                </button>}
        </>
    );
}

function RequiredTextview() {
    return (<span className={styles.required}> *required {' '} </span>)
}

export function LoginRegisterForm(props) {
    return (
        <form onSubmit={(event) => {
            event.preventDefault()
        }}>
            <label htmlFor="pnr">
                Personal ID Number {' '}
                <input id="pnr" placeholder="YYMMDDXXXX" type="text"  maxLength={10} minLength={10}
                       onChange={(change) => {
                           props.onPnrChange(change.target.value)
                       }}/>
                {(!props.pnr || props.pnr.length < 10) && <RequiredTextview/>}
            </label>
            <br/>
            <label htmlFor="name"  hidden={props.formState !== "register"}>
                Username {' '}
                <input id="name" placeholder="Name" type="text" autoComplete="name" required
                       onChange={(change) => {
                           props.onNameChange(change.target.value)
                       }}/>
                {!props.username && <RequiredTextview/>}
                <br/>
            </label>
            <label htmlFor="password">
                Password {' '}
                <input id="password" placeholder="Password" type="password" required
                                onChange={(change) => {
                                    props.onPasswordChange(change.target.value)
                                }}/>
                {!props.password && <RequiredTextview/>}
            </label>
            <br/>
            <label htmlFor="repeat-password" hidden={props.formState !== "register"}>
                Repeat Password {' '}
                <input id="repeat-password" type="password" required placeholder="Confirm Password"
                       onChange={(change) => {
                           props.onRepeatPasswordChange(change.target.value)
                       }}
                />
                {!props.repeatPassword && <RequiredTextview/>}
                <br/>
            </label>

        </form>
    )
}

export function StaffTypeRadioView(props) {
    return (
        <>
            <form id="staffTypeChoice"
                  onChange={
                      (change) => {
                          props.onStaffTypeChange(change.target.value)
                      }}
            >
                <label htmlFor="manager">
                    <input type="radio" id="manager" name="formStaffType" value="MANAGER" required/>
                    Manager
                </label>
                {' '}
                <label htmlFor="service">
                    <input type="radio" id="service" name="formStaffType" value="SERVICE" required/>
                    Service
                </label>
                <label htmlFor="staffTypeChoice">
                    {!props.staffType && <RequiredTextview/>}
                </label>
            </form>
        </>)
}

export function FormStateRadioView(props) {
    return (
        <div>
            <form id="formAction"
                  onChange={
                      (change) => {
                          props.onFormStateChange(change.target.value)
                      }
                  }>
                <label htmlFor="login">
                    <input type="radio" id="login" name="formActionType" value="login" defaultChecked={true}/>
                    Login
                </label>
                {' '}
                <label htmlFor="register">
                    <input type="radio" id="register" name="formActionType" value="register"/>
                    Register
                </label>
            </form>
        </div>

    )
}