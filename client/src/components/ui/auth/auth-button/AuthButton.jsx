export default function AuthButton({
    buttonText,
    isPending,
}) {
    const isDisabled = isPending ?? false;
    
   return (
       <div className="button-auth">
           <input type="submit" value={buttonText} disabled={isDisabled}/>
       </div>
   )
}