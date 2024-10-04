import { useState } from 'react'
import { Button, InputNumber } from 'antd'
import _ from 'lodash'
import AvailableNeedMaTrix from './AvailableNeedMaTrix'
import GenerateTableContent from './GenerateTableContent'

const BankersAlgorithmSimulator = () => {
  const [processes, setProcesses] = useState('')
  const [resources, setResources] = useState('')
  const [totalResources, setTotalResources] = useState([])
  const [processRequest, setProcessRequest] = useState([])
  const [maximum, setMaximum] = useState([])
  const [allocation, setAllocation] = useState([])
  const [safeSequence, setSafeSequence] = useState([])
  const [error, setError] = useState(null)
  const [available, setAvailable] = useState([])
  const [need, setNeed] = useState([])
  const [hideSafeSequences, setHideSafeSequences] = useState(false)
  const [hideBtnSafe, setHideBtnSafe] = useState(false)
  const [hideBtnMakeRequest, setHideBtnMakeRequest] = useState(false)
  const [hideContent, setHideContent] = useState(false)
  const [hideContentMaxtrix, setHideContentMaxtrix] = useState(false)
  const [hideProRequest, setHideProRequest] = useState(false)
  const [disabledBtnProRequest, setDisabledBtnProRequest] = useState(false)
  const [idxProRequest, setIdxProRequest] = useState(1)

  const initializeArrays = () => {
    if (processes === '' || resources === '') {
      alert('Number of Process and Number of Resources can not be NULL or 0')
      return
    }
    setTotalResources(new Array(resources).fill(0))
    setMaximum(Array.from({ length: processes }, () => new Array(resources).fill(0)))
    setAllocation(Array.from({ length: processes }, () => new Array(resources).fill(0)))
    setHideContent(true)
  }

  const runBankersAlgorithm = () => {
    let allocatedResources = Array(resources).fill(0)
    allocation.forEach((alloc) => {
      alloc.forEach((val, idx) => {
        allocatedResources[idx] += val
      })
    })

    let availableResources = totalResources.map((total, idx) => total - allocatedResources[idx])
    setAvailable(availableResources)

    let needMatrix = Array.from({ length: processes }, (_, p) => maximum[p].map((max, r) => max - allocation[p][r]))
    setNeed(needMatrix)

    let work = [...availableResources]
    let finish = Array(processes).fill(false)
    let sequence = []
    let safe = false
    for (let count = 0; count < processes; count++) {
      for (let i = 0; i < processes; i++) {
        if (!finish[i]) {
          let exec = true
          for (let j = 0; j < resources; j++) {
            if (needMatrix[i][j] > work[j]) {
              exec = false
              break
            }
          }

          if (exec) {
            for (let k = 0; k < resources; k++) {
              work[k] += allocation[i][k]
            }
            sequence.push(i)
            finish[i] = true
            safe = true
          }
        }
      }
      if (!safe) {
        setError('Hệ thống ở trạng thái không an toàn')
        return
      }
    }

    setSafeSequence(sequence)
    setError(null)
  }

  const displaySafeSequences = () => {
    runBankersAlgorithm()
    setHideSafeSequences(true)
    setHideBtnMakeRequest(true)
  }

  const checkMaxGTEAllocated = (max, allocation, totalResources) => {
    for (let i = 0; i < processes; i++) {
      for (let j = 0; j < resources; j++) {
        if (max[i][j] < allocation[i][j]) {
          alert('Tài nguyên yêu cầu tối đa phải lớn hơn hoặc bằng tài nguyên đã cấp phát!')
          return false
        }
        if (max[i][j] > totalResources[j]) {
          alert('Tài nguyên yêu cầu tối đa phải bé hơn hoặc bằng tổng số lượng của từng tài nguyên!')
          return false
        }
        if (allocation[i][j] > totalResources[j]) {
          alert('Tài nguyên đã cấp phát phải bé hơn hoặc bằng tổng số lượng của từng tài nguyên!')
          return false
        }
      }
    }
    return true
  }

  const hanldeCreateAvailableAndNeedMatrix = () => {
    if (!checkMaxGTEAllocated(maximum, allocation, totalResources)) return
    const check = totalResources.every((item) => item > 0)
    if (!check) {
      alert('Instances of resources must be atleast 1')
      return
    }
    runBankersAlgorithm()
    setHideBtnSafe(true)
    setHideContentMaxtrix(true)
  }

  const handleResetValues = () => {
    setHideContent(false)
    setHideContentMaxtrix(false)
    setProcesses('')
    setResources('')
    setSafeSequence([])
    setHideSafeSequences(false)
    setHideProRequest(false)
    setHideBtnMakeRequest(false)
    setAvailable([])
    setNeed([])
  }

  const hanldeMakeProcessRequest = () => {
    setIdxProRequest(1)
    setHideProRequest(true)
    setProcessRequest(new Array(resources).fill(0))
    setDisabledBtnProRequest(true)
  }

  const hanldeRequestValidate = () => {
    setDisabledBtnProRequest(false)
    runBankersAlgorithm()
    if (idxProRequest && processRequest) {
      const process = idxProRequest - 1
      setAvailable(available.map((avai, idx) => avai - processRequest[idx]))
      const _allocation = _.cloneDeep(allocation)
      const _need = _.cloneDeep(need)
      _allocation[process] = _allocation[process].map((all, idx) => all + processRequest[idx])
      _need[process] = _need[process].map((need, idx) => need - processRequest[idx])
      setAllocation(_allocation)
      setNeed(_need)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold mb-4 text-center text-blue-500'>BANKER&apos;S ALGORITHM SIMULATOR</h1>

      <div className='bg-white p-4 rounded shadow'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Số tiến trình</label>
            <InputNumber min={1} value={processes} onChange={(value) => setProcesses(value)} className='w-full' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Số lượng tài nguyên</label>
            <InputNumber min={1} value={resources} onChange={(value) => setResources(value)} className='w-full' />
          </div>
        </div>
        <div className='mt-4'>
          <Button type='primary' className='p-5 mr-4 !bg-blue-600 text-lg hover:!bg-blue-700' onClick={initializeArrays} disabled={hideContent && true}>
            Generate Tables
          </Button>
          {hideContent && (
            <Button danger type='primary' className='p-5 !bg-rose-600 text-lg hover:!bg-rose-700' onClick={handleResetValues}>
              Reset Values
            </Button>
          )}
        </div>
      </div>

      <GenerateTableContent
        resources={resources}
        totalResources={totalResources}
        setTotalResources={setTotalResources}
        allocation={allocation}
        setAllocation={setAllocation}
        maximum={maximum}
        setMaximum={setMaximum}
        hanldeCreateAvailableAndNeedMatrix={hanldeCreateAvailableAndNeedMatrix}
        hideContent={hideContent}
      />

      <AvailableNeedMaTrix
        available={available}
        totalResources={totalResources}
        allocation={allocation}
        need={need}
        resources={resources}
        processes={processes}
        maximum={maximum}
        displaySafeSequences={displaySafeSequences}
        hideBtnSafe={hideBtnSafe}
        error={error}
        safeSequence={safeSequence}
        hideSafeSequences={hideSafeSequences}
        hideContentMaxtrix={hideContentMaxtrix}
      ></AvailableNeedMaTrix>

      {hideBtnMakeRequest && (
        <Button type='primary' className='p-5 my-4 !bg-cyan-600 text-lg hover:!bg-cyan-700' onClick={hanldeMakeProcessRequest} disabled={disabledBtnProRequest && 'true'}>
          Make Process Request
        </Button>
      )}

      {hideProRequest && (
        <>
          <table className='table-auto w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2 text-center'>
                  Resources Name /<br /> Process Name - Id
                </th>
                {Array.from({ length: resources }, (_, index) => (
                  <th key={index} className='border px-4 py-2 text-center'>
                    R{index + 0}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <InputNumber min={1} max={5} value={idxProRequest} onChange={(value) => setIdxProRequest(value)} />
                </td>
                {processRequest.map((value, index) => (
                  <td key={index} className='border px-4 py-2 text-center'>
                    <InputNumber min={0} value={value} onChange={(val) => setProcessRequest((prev) => prev.map((v, i) => (i === index ? val : v)))} className='w-full' />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <Button type='primary' className='p-5 my-4 !bg-yellow-500 text-lg hover:!bg-yellow-600' onClick={hanldeRequestValidate} disabled={error && 'true'}>
            Request Validation
          </Button>
        </>
      )}
    </div>
  )
}

export default BankersAlgorithmSimulator
