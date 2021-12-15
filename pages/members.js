import {useEffect, useState} from "react";
import Member from "../components/Member";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/user";
import styles from '../styles/Members.module.css'

function MembersList({members}) {
  return (
    <main>
      <div className={styles.container}>
        {members.map(({_id, name, pnr, inside}) => {
          return <div key={_id}>
            <Member name={name} pnr={pnr} status={inside ? "INSIDE" : ""}/>
          </div>
        })}
      </div>
    </main>
  )
}

export default function Members() {
  const [members, setMembers] = useState([])
  const user = useSelector(selectUser)
  useEffect(() => {
    fetch("api/members/get", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${user.pnr}+${user.password}`,
      }
    })
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch((err) => console.log(err.statusText));
  }, [])
  return <MembersList members={members}/>
}

