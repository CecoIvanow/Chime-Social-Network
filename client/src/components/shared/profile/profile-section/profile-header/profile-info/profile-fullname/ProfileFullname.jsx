export default function ProfileFullname({
    userData
}) {
   return <>
       <h2>{(userData?.firstName)} {(userData?.lastName)}</h2>
   </>
}