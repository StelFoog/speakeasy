import {useEffect, useState} from "react";
import Member from "../components/Member";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/user";
import styles from '../styles/Speakeasy.module.css'
import memberStyles from '../styles/Members.module.css'
import {getMembers, setMemberOutside, setMemberInside} from '../util/db/members'
import Link from "next/link";

function InsideMembers({members, onLeave}) {
  return (
    <div className={memberStyles.container}>
      <div className = {styles.membersStatus}>
        Members inside
      </div>
      {members.map(({_id, name, pnr}) => {
        return <div key={_id}>
          <Member name={name} pnr={pnr} status={'INSIDE'}/>
          <button>
            <Link href="/" passHref>
              <a> Open tab</a>
            </Link>
          </button>

          <button onClick={() => {
            onLeave(pnr)
          }}>
            Leave
          </button>
        </div>
      })}
    </div>
  )
}

function OutsideMembers({members, onEnter}) {
  return (
    <div className={memberStyles.container}>
      <div className = {styles.membersStatus}>
        Members outside
      </div>
    {members.map(({_id, name, pnr}) => {
      return (<div key={_id}>
        <Member name={name} pnr={pnr} status={""}/>
        <button>
          <Link href= {`/tabs/${pnr}` } passHref>
            <a> Open tab</a>
          </Link>
        </button>
        <button onClick={() => {
          onEnter(pnr)
        }}>
          Enter
        </button>
      </div>)
    })}
  </div>)
}

export default function Speakeasy() {
  const [outsideMembers, setOutsideMembers] = useState([])
  const [insideMembers, setInsideMembers] = useState([])
  const user = useSelector(selectUser)

  useEffect(() => {
    getMembers({pnr: user.pnr, password: user.password})
      .then(members => {
          setInsideMembers(members.filter(({inside}) => {
            return inside
          }))
          setOutsideMembers(members.filter(({inside}) => {
            return !inside
          }))
        }
      );
  }, []);

  return <main>
    <div className={styles.container}>
    <InsideMembers
      members={insideMembers}
      onLeave={(memberPnr) => {
        setMemberOutside({pnr: user.pnr, password: user.password}, memberPnr)
          .then(res => {
            if (res.acknowledged) {
              const member = insideMembers.find(({pnr}) => {
                return pnr === memberPnr
              })
              setInsideMembers(insideMembers.filter(({pnr}) => {
                return pnr !== memberPnr
              }))

              setOutsideMembers([member, ...outsideMembers])
            }
          }).catch(console.error)
      }}
    />
    <OutsideMembers members={outsideMembers}
                    onEnter={(memberPnr) => {
                      setMemberInside({pnr: user.pnr, password: user.password}, memberPnr)
                        .then(res => {
                          if (res.acknowledged) {

                            const member = outsideMembers.find(({pnr}) => {
                              return pnr === memberPnr
                            })
                            setOutsideMembers(outsideMembers.filter(({pnr}) => {
                              return pnr !== memberPnr
                            }))
                            setInsideMembers([member, ...insideMembers])
                          }
                        }).catch(console.error)
                    }}/>
    </div>

  </main>
}
