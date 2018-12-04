const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    {emoji && <span className={`emoji ${emoji}`}></span>}
  </button>
);

export default PopoverButton;