export default function AuthButton({
    buttonText,
    isPending = false
}) {
    
   return <>
       <div className="button-auth" data-testid="button-auth">
           <input type="submit" value={buttonText} disabled={isPending}/>
       </div>
   </>
}