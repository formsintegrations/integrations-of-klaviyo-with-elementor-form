export default function SingleToggle2({ className, title, action, disabled, checked, name = null }) {
  const onChange = (e) => {
    if (!disabled) {
      action(e)
    }
  }
  return (
    <div className={`${className}`}>
      <span>{title}</span>
      <label className="btcd-label">
        <div className="btcd-toggle">
          <input aria-label={title} onChange={onChange} className="btcd-toggle-state" type="checkbox" name={name || 'check'} value="check" checked={checked} />
          <div className="btcd-toggle-inner">
            <div className="btcd-indicator" />
          </div>
          <div className="btcd-active-bg" />
        </div>
        <div className="btcd-label-text" />
      </label>
    </div>
  )
}
