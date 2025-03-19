export default function AuthButton({
    buttonText
}) {
   return <>
       <div className="button-auth">
           <input type="submit" value={buttonText} />
       </div>
   </>
}