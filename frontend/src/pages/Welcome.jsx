
import { Link } from 'react-router-dom'
import { __ } from '../Utils/i18nwrap'
import greeting from '../resource/img/elementor-crm.jpg'

export default function Welcome({ setModal }) {
  return (
    <div className="btcd-greeting">
      <img src={greeting} alt="" />
      <h2>{__('Welcome to Elementor Zoho CRM')}</h2>
      <div className="sub">
        {__('You can easily send data Elementor to Zoho CRM. Ensure that this plugin makes your life easier.')}
      </div>
      <Link to="/flow/new" className="btn round btcd-btn-lg dp-blue">
        {__('Create Integration')}
      </Link>
    </div>
  )
}
