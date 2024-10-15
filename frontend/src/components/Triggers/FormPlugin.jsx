import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useHistory } from 'react-router-dom'
import { $flowStep, $formFields, $newFlow } from '../../GlobalStates'
import useFetch from '../../hooks/useFetch'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import LoaderSm from '../Loaders/LoaderSm'
import Note from '../Utilities/Note'
import SnackMsg from '../Utilities/SnackMsg'

const FormPlugin = () => {
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowStep = useSetRecoilState($flowStep)
  const setFormFields = useSetRecoilState($formFields)
  const { data, isLoading } = useFetch({ payload: {}, action: newFlow.triggerDetail.list.action, method: newFlow.triggerDetail.list.method })
  const [snack, setSnackbar] = useState({ show: false, msg: '' })
  const [isLoad, setIsLoad] = useState(false)
  const history = useHistory()

  const setTriggerData = (val) => {
    console.log(newFlow)
    const tmpNewFlow = { ...newFlow }
    if (!val) {
      delete tmpNewFlow.triggerData
      setNewFlow(tmpNewFlow)
    } else {
      setIsLoad(true)
      let queryData = { id: val }

      // Page Builder triggers requires postId
      if (newFlow?.triggerDetail?.name === 'Elementor') {
        const filterData = data?.data?.filter((item) => item.id === val)[0]?.post_id ?? null
        queryData = { ...queryData, postId: filterData }
      }

      bitsFetch(queryData, newFlow.triggerDetail.fields.action)
        .then(resp => {
          if (resp.success) {
            tmpNewFlow.triggerData = {
              formID: val,
              fields: resp.data.fields,
              postId: resp.data.postId,
            }
            setFormFields(resp.data.fields)
            setNewFlow(tmpNewFlow)
          } else {
            setSnackbar({ show: true, msg: __(resp.data) })
            delete tmpNewFlow.triggerData
            setNewFlow(tmpNewFlow)
          }
        })
      setIsLoad(false)
    }
  }

  const updatedStep = () => {
    history.push('action/new/Zoho CRM')
    // setFlowStep(2)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <br />
      {isLoading || isLoad ? (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          transform: 'scale(0.7)',
        }}
        />
      ) : (
        <div>
          {data?.success === false ? (
            <span>{data.data}</span>
          ) : (
            <>
              <h4>Select a Form/Task Name</h4>
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={newFlow.triggerData?.formID}
                options={data?.data?.map(form => ({ label: form.title, value: form.id.toString() }))}
                onChange={(val) => setTriggerData(val)}
                singleSelect
                style={{ width: '100%', minWidth: 400, maxWidth: 450 }}
              />
              <div>
                <button type="button" onClick={updatedStep} className="btn ml-auto btcd-btn-lg green sh-sm flx mt-4" disabled={!newFlow?.triggerData?.formID}>
                  &nbsp;Next
                  <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
                  {isLoad && <LoaderSm size={20} clr="#fff" className="ml-2" />}
                </button>
              </div>

              {newFlow.triggerDetail?.note && (
                <Note note={newFlow.triggerDetail.note} />
              )}
            </>
          )}

        </div>
      )}

    </div>
  )
}
export default FormPlugin
