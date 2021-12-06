import styles from './FormView.module.css'

export function SubmitButtonView(props) {
    return (
        <button
            disabled={props.isDisabled}
            onClick={props.onSubmit}>
            {props.action}
        </button>
    );
}

export function ErrorText(props) {
    return (props.isDisabled || <div className={styles.error}>
        {props.error}
    </div>)
}

function RequiredTextview() {
    return (<span className={styles.required}> *required {' '} </span>)
}

export function RegisterForm(props) {
    return (<form onSubmit={(event) => {
        event.preventDefault()
    }}>
        <label htmlFor="pnr">
            Personal ID Number {' '}
            <input id="pnr" placeholder="YYMMDDXXXX" type="text" maxLength={10} minLength={10}
                   onChange={(change) => {
                       props.onPnrChange(change.target.value)
                   }}/>
            {(!props.pnr || props.pnr.length < 10) && <RequiredTextview/>}
        </label>
        <br/>
        <label htmlFor="name">
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
        <label htmlFor="repeat-password">
            Repeat Password {' '}
            <input id="repeat-password" type="password" required placeholder="Confirm Password"
                   onChange={(change) => {
                       props.onRepeatPasswordChange(change.target.value)
                   }}
            />
            {!props.repeatPassword && <RequiredTextview/>}
            <br/>
        </label>

    </form>)
}

export function LoginForm(props) {
    return (
        <form onSubmit={(event) => {
            event.preventDefault()
        }}>
            <label htmlFor="pnr">
                Personal ID Number {' '}
                <input id="pnr" placeholder="YYMMDDXXXX" type="text" maxLength={10} minLength={10}
                       onChange={(change) => {
                           props.onPnrChange(change.target.value)
                       }}/>
                {(!props.pnr || props.pnr.length < 10) && <RequiredTextview/>}
            </label>
            <br/>
            <label htmlFor="password">
                Password {' '}
                <input id="password" placeholder="Password" type="password" required
                       onChange={(change) => {
                           props.onPasswordChange(change.target.value)
                       }}/>
                {!props.password && <RequiredTextview/>}
            </label>
            <br/>
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
