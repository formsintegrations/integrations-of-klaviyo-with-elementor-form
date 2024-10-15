import { useState, useCallback, useRef, memo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { __ } from '../../Utils/i18nwrap'
import SnackMsg from '../Utilities/SnackMsg'
import Table from '../Utilities/Table'
import bitsFetch from '../../Utils/bitsFetch'
import CopyText from '../Utilities/CopyText'
import noData from '../../resource/img/nodata.svg'

function Log({ allIntegURL }) {
  const { id, type } = useParams()
  const [snack, setSnackbar] = useState({ show: false })
  const fetchIdRef = useRef(0)
  const [confMdl, setconfMdl] = useState({ show: false })
  const [pageCount, setPageCount] = useState(0)
  const [countEntries, setCountEntries] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshLog, setRefreshLog] = useState(0)

  const [log, setLog] = useState([])
  const [cols, setCols] = useState([
    { width: 250, minWidth: 80, Header: __('Status'), accessor: 'response_type' },
    { width: 250, minWidth: 80, Header: __('Record Type'), accessor: 'api_type' },
    { width: 220, minWidth: 200, Header: __('Response'), accessor: 'response_obj', Cell: val => <CopyText value={val.row.values.response_obj} setSnackbar={setSnackbar} className="cpyTxt" /> },
    { width: 220, minWidth: 200, Header: __('Date'), accessor: 'created_at' },
  ])
  const setTableCols = useCallback(newCols => { setCols(newCols) }, [])

  const closeConfMdl = useCallback(() => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }, [confMdl])

  const setBulkDelete = useCallback((rows, action) => {
    const rowID = []
    const entries = []
    if (typeof rows[0] === 'object') {
      for (let i = 0; i < rows.length; i += 1) {
        rowID.push(rows[i].id)
        entries.push(rows[i].original.id)
      }
    } else {
      rowID.push(rows.id)
      entries.push(rows.original.id)
    }
    const ajaxData = { id: entries }
    bitsFetch(ajaxData, 'log/delete').then((res) => {
      if (res.success) {
        if (action && action.fetchData && action.data) {
          action.fetchData(action.data)
        }
        setSnackbar({ show: true, msg: 'Response delete successfully' })
      }
    })
  }, [])

  const delConfMdl = useCallback(
    (row, data) => {
      if (row.idx !== undefined) {
        row.id = row.idx
        row.original = row.data[0].row.original
      }
      confMdl.btnTxt = 'Delete'
      confMdl.body = 'Are you sure to delete this entry'
      confMdl.btnClass = ''

      confMdl.action = () => {
        setBulkDelete(row, data)
        closeConfMdl()
      }
      confMdl.show = true
      setconfMdl({ ...confMdl })
    },
    [closeConfMdl, confMdl, setBulkDelete],
  )

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    if (refreshLog) {
      setRefreshLog(0)
      setIsLoading(true)
    }

    const fetchId = ++fetchIdRef.current
    if (log.length < 1) {
      setIsLoading(true)
    }
    if (fetchId === fetchIdRef.current) {
      const startRow = pageSize * pageIndex
      bitsFetch(
        {
          id,
          offset: startRow,
          pageSize,
        },
        'log/get',
      ).then((res) => {
        if (res?.success) {
          setPageCount(Math.ceil(res.data.count / pageSize))
          setCountEntries(res.data.count)
          setLog(res.data.data)
        }
        setIsLoading(false)
      })
    }
  }, [delConfMdl, id, refreshLog])
  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx">
        <div>
          <Link to={allIntegURL} className="btn btcd-btn-o-gray">
            <span className="btcd-icn icn-chevron-left" />
            &nbsp;Back
          </Link>
          <button
            onClick={() => setRefreshLog(1)}
            className="icn-btn ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh Log')}'` }}
            type="button"
            disabled={isLoading}
          >
            &#x21BB;
          </button>
        </div>
        <div className="w-8 txt-center">
          <b className="f-lg">{type}</b>
          <div>{__('Integration Log')}</div>
        </div>
      </div>

      <div className="forms">
        <Table
          className="f-table btcd-all-frm"
          height={500}
          columns={cols}
          data={log}
          loading={isLoading}
          countEntries={countEntries}
          rowSeletable
          resizable
          columnHidable
          setTableCols={setTableCols}
          setBulkDelete={setBulkDelete}
          fetchData={fetchData}
          pageCount={pageCount}
        />

        {!isLoading && log.length === 0 && (
          <div className="btcd-no-data txt-center">
            <img src={noData} alt="no data found" />
            <div className="mt-2 data-txt">{__('No Log Found.')}</div>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(Log)
