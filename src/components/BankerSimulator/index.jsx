import { useState } from 'react'
import { Button, InputNumber } from 'antd'
import _ from 'lodash'
import AvailableNeedMaTrix from './AvailableNeedMaTrix'
import GenerateTableContent from './GenerateTableContent'
import AvailableMatrix from './AvailableNeedMaTrix/AvailableMatrix/AvailableMatrix'
import NeedMaTrix from './AvailableNeedMaTrix/NeedMaTrix/NeedMaTrix'

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
  const [disabledBtnProConfirmRequest, setDisabledBtnProConfirmRequest] = useState(false)
  const [hideNewMaTrixRequest, setHideNewMaTrixRequest] = useState(false)
  const [idxProRequest, setIdxProRequest] = useState(1)

  const [newAllocation, setNewAllocation] = useState([])
  const [newAvailable, setNewAvailable] = useState([])
  const [newNeed, setNewNeed] = useState([])

  const initializeArrays = () => {
    if (processes === '' || resources === '') {
      alert('Number of Process and Number of Resources can not be NULL or 0')
      return
    }
    setTotalResources(new Array(resources).fill(0))
    setMaximum(Array.from({ length: processes }, () => new Array(resources).fill(0)))
    setAllocation(Array.from({ length: processes }, () => new Array(resources).fill(0)))
    setNewAllocation(Array.from({ length: processes }, () => new Array(resources).fill(0)))
    setHideContent(true)
  }

  const createAvaiNeedMatrix = () => {
    const allocatedResources = Array(resources).fill(0)
    allocation.forEach((alloc) => {
      alloc.forEach((val, idx) => {
        allocatedResources[idx] += val
      })
    })

    const newAllocatedResources = Array(resources).fill(0)
    newAllocation.forEach((alloc) => {
      alloc.forEach((val, idx) => {
        newAllocatedResources[idx] += val
      })
    })
    setNewAllocation(allocation)

    const availableResources = totalResources.map((total, idx) => total - allocatedResources[idx])
    setAvailable(availableResources)

    const newAvailableResources = totalResources.map((total, idx) => total - allocatedResources[idx])
    setNewAvailable(newAvailableResources)

    const needMatrix = Array.from({ length: processes }, (_, p) => maximum[p].map((max, r) => max - allocation[p][r]))
    setNeed(needMatrix)
    setNewNeed(needMatrix)
  }

  const checkSafeState = (allocationMatrix, availableResources, needMatrix) => {
    const work = [...availableResources]
    const finish = Array(processes).fill(false)
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
              work[k] += allocationMatrix[i][k]
            }
            sequence.push(i)
            finish[i] = true
            safe = true
          }
        }
      }
      if (!safe) {
        return { isSafe: false, sequence: [] }
      }
    }

    return { isSafe: true, sequence }
  }

  const displaySafeSequences = () => {
    const result = checkSafeState(newAllocation, newAvailable, newNeed)
    if (!result.isSafe) {
      setError('Không tìm thấy chuỗi an toàn, hệ thống có thể đang bị tắc nghẽn')
      return
    }
    setSafeSequence(result.sequence)
    setError(null)
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
      alert('Tổng số tài nguyên không nhỏ hơn 1')
      return
    }
    createAvaiNeedMatrix()
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
    setHideNewMaTrixRequest(false)
    setError(null)
    setDisabledBtnProConfirmRequest(false)
    setAvailable([])
    setNeed([])
    setAllocation([])
    setNewAllocation([])
    setNewAvailable([])
    setNewNeed([])
  }

  const hanldeMakeProcessRequest = () => {
    setIdxProRequest(1)
    setHideProRequest(true)
    setProcessRequest(new Array(resources).fill(0))
    setDisabledBtnProRequest(true)
    setDisabledBtnProConfirmRequest(false)
  }

  const hanldeRequestValidate = () => {
    setHideNewMaTrixRequest(true)
    setDisabledBtnProRequest(false)
    setDisabledBtnProConfirmRequest(true)
    if (idxProRequest && processRequest) {
      const process = idxProRequest - 1

      // Bước 1: Kiểm tra nếu yêu cầu tài nguyên lớn hơn Need
      for (let i = 0; i < resources; i++) {
        if (processRequest[i] > newNeed[process][i]) {
          alert(`Yêu cầu tài nguyên vượt quá nhu cầu của tiến trình P${process + 1} cho tài nguyên R${i}`)
          return
        }
      }

      // Bước 2: Kiểm tra nếu yêu cầu tài nguyên lớn hơn Available
      for (let i = 0; i < resources; i++) {
        if (processRequest[i] > newAvailable[i]) {
          alert(`Tài nguyên không đủ để cấp phát cho tiến trình P${process + 1}`)
          return
        }
      }

      // Bước 3: Giả định cấp phát tài nguyên
      let _avai = _.cloneDeep(newAvailable)
      _avai = _avai.map((all, idx) => all - processRequest[idx])

      let _allocation = _.cloneDeep(newAllocation)
      let _need = _.cloneDeep(newNeed)
      _allocation[process] = _allocation[process].map((all, idx) => all + processRequest[idx])
      _need[process] = _need[process].map((need, idx) => need - processRequest[idx])

      // Bước 4: Chạy thuật toán Banker để kiểm tra trạng thái an toàn
      const result = checkSafeState(_allocation, _avai, _need)

      if (!result.isSafe) {
        setError('Không tìm thấy chuỗi an toàn, hệ thống có thể ở trạng thái tắc nghẽn!')
        alert('Không tìm thấy chuỗi an toàn, hệ thống có thể ở trạng thái tắc nghẽn!')
        return
      }

      // Bước 5: Nếu trạng thái an toàn, cập nhật trạng thái hệ thống
      setNewAvailable(_avai)
      setNewAllocation(_allocation)
      setNewNeed(_need)
      setSafeSequence(result.sequence)
      setError(null)
    }
  }

  const displayStepsForAvailableResources = () => {
    const steps = totalResources.map((total, idx) => {
      const allocatedSum = newAllocation.reduce((sum, alloc) => sum + alloc[idx], 0)
      return `Available R${idx} = ${total} - (${newAllocation.map((alloc) => alloc[idx]).join(' + ')}) = ${total - allocatedSum}`
    })

    return steps
  }

  const displayStepsForNeedMatrix = () => {
    const steps = []
    for (let i = 0; i < processes; i++) {
      for (let j = 0; j < resources; j++) {
        steps.push(
          `Need [${i + 1}][${j + 1}] = Max [${i + 1}][${j + 1}] - Allocated [${i + 1}][${j + 1}] = ${maximum[i][j]} - ${newAllocation[i][j]} = ${
            maximum[i][j] - newAllocation[i][j]
          }`
        )
      }
    }
    return steps
  }

  return (
    <div className='container mx-auto p-4'>
      <span className='text-3xl font-bold text-center text-blue-500'>Minh họa giải thuật Banker</span>
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
            Tạo các bảng
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
        need={need}
        resources={resources}
        displaySafeSequences={displaySafeSequences}
        hideBtnSafe={hideBtnSafe}
        error={error}
        safeSequence={safeSequence}
        hideSafeSequences={hideSafeSequences}
        hideContentMaxtrix={hideContentMaxtrix}
        displayStepsForAvailableResources={displayStepsForAvailableResources}
        displayStepsForNeedMatrix={displayStepsForNeedMatrix}
      ></AvailableNeedMaTrix>

      {hideBtnMakeRequest && (
        <Button type='primary' className='p-5 my-4 !bg-cyan-600 text-lg hover:!bg-cyan-700' onClick={hanldeMakeProcessRequest} disabled={disabledBtnProRequest && 'true'}>
          Yêu cầu thêm tài nguyên
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
                  <InputNumber min={1} max={processes} value={idxProRequest} onChange={(value) => setIdxProRequest(value)} />
                </td>
                {processRequest.map((value, index) => (
                  <td key={index} className='border px-4 py-2 text-center'>
                    <InputNumber min={0} value={value} onChange={(val) => setProcessRequest((prev) => prev.map((v, i) => (i === index ? val : v)))} className='w-full' />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <Button type='primary' className='p-5 my-4 !bg-yellow-500 text-lg hover:!bg-yellow-600' onClick={hanldeRequestValidate} disabled={disabledBtnProConfirmRequest && 'true'}>
            Xác nhận yêu cầu
          </Button>
        </>
      )}

      {hideNewMaTrixRequest && (
        <>
          <NeedMaTrix need={newAllocation} resources={resources} displayStepsForNeedMatrix={displayStepsForNeedMatrix} hideSteptoFindNeed />
          <AvailableMatrix available={newAvailable} displayStepsForAvailableResources={displayStepsForAvailableResources} />
          <NeedMaTrix need={newNeed} resources={resources} displayStepsForNeedMatrix={displayStepsForNeedMatrix} />
        </>
      )}
    </div>
  )
}

export default BankersAlgorithmSimulator
