import { __ } from '../../Utils/i18nwrap'

export default function Note({ note , className = '' }) {
  return (
    <div className={className}>
      <h4 className="mt-0">Hello, hopefully this info is helpful to you.</h4>
      <div className="note-text" dangerouslySetInnerHTML={{ __html: __(note) }} />
    </div>
  )
}
