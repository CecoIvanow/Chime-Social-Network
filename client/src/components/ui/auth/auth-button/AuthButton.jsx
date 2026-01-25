export default function AuthButton({
    buttonText,
    isPending = false
}) {
    
   return <>
       <div className="button-auth">
           <input type="submit" value={buttonText} disabled={isPending}/>
       </div>
   </>
}