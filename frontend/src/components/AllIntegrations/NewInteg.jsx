/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
import { lazy, Suspense } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'

// const ZohoCRM = lazy(() => import('./ZohoCRM/ZohoCRM'))
const ZohoCRM = lazy(() => import('./ZohoCRM/ZohoCRM'))

export default function NewInteg({ allIntegURL }) {
  const { integUrlName } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const history = useHistory()
  if (!window.opener && !Object.keys(flow).length) { history.push('/flow/new') }
  const NewIntegs = () => {
    switch (integUrlName) {
      case 'Zoho CRM':
        return <ZohoCRM allIntegURL={allIntegURL} formFields={flow?.triggerData?.fields} flow={flow} setFlow={setFlow} />
      default:
        return <></>
    }
  }

  const goBack = () => {
    const tmpFlow = { ...flow }
    delete tmpFlow.action
    setFlow(tmpFlow)
    history.goBack()
  }
  return (
    <div>
      <div className="flx">
        <button type="button" className="f-left btn btcd-btn-o-gray" onClick={goBack}>
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </button>
        <div className="w-10 txt-center" style={{ marginRight: '73px' }}>
          <div className="mb-1"><b className="f-lg">{integUrlName}</b></div>
          <div>{__('Integration Settings')}</div>
        </div>
      </div>

      <Suspense fallback={<Loader className="g-c" style={{ height: '82vh' }} />}>
        <NewIntegs />
      </Suspense>
    </div>
  )
}
