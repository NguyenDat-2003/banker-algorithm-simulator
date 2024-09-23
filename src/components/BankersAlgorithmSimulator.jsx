import { useState } from 'react'
import { Button, InputNumber } from 'antd'

const BankersAlgorithmSimulator = () => {
  const [processes, setProcesses] = useState(1)
  const [resources, setResources] = useState(1)
  const [totalResources, setTotalResources] = useState([])
  const [maximum, setMaximum] = useState([])
  const [allocation, setAllocation] = useState([])
  const [safeSequence, setSafeSequence] = useState([])
  const [error, setError] = useState(null)
  const [available, setAvailable] = useState([])
  const [need, setNeed] = useState([])
  const [hideSafeSequences, setHideSafeSequences] = useState(false)
  const [hideBtnSafe, setHideBtnSafe] = useState(false)
  const [hideContent, setHideContent] = useState(false)

  const initializeArrays = () => {
    setTotalResources(new Array(resources).fill(0))
    setMaximum(Array.from({ length: processes }, () => new Array(resources).fill(0)))
    setAllocation(Array.from({ length: processes }, () => new Array(resources).fill(0)))
    setError(null)
    setHideContent(true)
  }

  const handle2DInputChange = (setter, row, col, value) => {
    setter((prev) => {
      const newArray = prev.map((r) => [...r])
      newArray[row][col] = parseInt(value) || 0
      return newArray
    })
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
            break
          }
        }
      }
      if (!safe) {
        setError('The system is in an unsafe state!')
        return
      }
    }

    setSafeSequence(sequence)
    setError(null)
  }

  const displayStepsForAvailableResources = () => {
    const steps = totalResources.map((total, idx) => {
      const allocatedSum = allocation.reduce((sum, alloc) => sum + alloc[idx], 0)
      return `Available R${idx} = ${total} - (${allocation.map((alloc) => alloc[idx]).join(' + ')}) = ${total - allocatedSum}`
    })

    return steps
  }

  const displayStepsForNeedMatrix = () => {
    const steps = []
    for (let i = 0; i < processes; i++) {
      for (let j = 0; j < resources; j++) {
        steps.push(
          `Need [${i + 1}][${j + 1}] = Max [${i + 1}][${j + 1}] - Allocated [${i + 1}][${j + 1}] = ${maximum[i][j]} - ${allocation[i][j]} = ${maximum[i][j] - allocation[i][j]}`
        )
      }
    }
    return steps
  }

  const displaySafeSequences = () => {
    runBankersAlgorithm()
    setHideSafeSequences(true)
  }

  const hanldeCreateAvailableAndNeedMatrix = () => {
    runBankersAlgorithm()
    setHideBtnSafe(true)
  }

  const handleResetValues = () => {
    setHideContent(false)
    setProcesses(1)
    setResources(1)
    setHideBtnSafe(false)
    setSafeSequence(false)
    setAvailable([])
    setNeed([])
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold mb-4 text-center'>Banker&apos;s Algorithm Simulator</h1>

      <div className='bg-white p-4 rounded shadow'>
        <h2 className='text-xl font-semibold mb-2'>Configuration</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Processes</label>
            <InputNumber min={1} value={processes} onChange={(value) => setProcesses(value)} className='w-full' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Resources</label>
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

      {hideContent && (
        <>
          <div className='bg-white p-4 rounded shadow mt-4'>
            <h2 className='text-xl font-semibold mb-6'>Total Instances of all resources</h2>
            <table className='table-auto w-full border border-gray-300'>
              <thead>
                <tr className='bg-gray-100'>
                  {Array.from({ length: resources }, (_, index) => (
                    <th key={index} className='border px-4 py-2 text-center'>
                      R{index + 0}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {totalResources.map((value, index) => (
                    <td key={index} className='border px-4 py-2 text-center'>
                      <InputNumber min={0} value={value} onChange={(val) => setTotalResources((prev) => prev.map((v, i) => (i === index ? val : v)))} className='w-full' />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className='bg-white p-4 rounded shadow mt-4'>
            <h2 className='text-xl font-semibold mb-2'>Instances Allocated</h2>
            <table className='table-auto w-full border border-gray-300'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>Processes</th>
                  {Array.from({ length: resources }, (_, index) => (
                    <th key={index} className='border px-4 py-2 text-center'>
                      R{index + 0}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocation.map((row, i) => (
                  <tr key={i}>
                    <td className='border px-4 py-2 text-center'>P{i + 1}</td>
                    {row.map((value, j) => (
                      <td key={j} className='border px-4 py-2 text-center'>
                        <InputNumber min={0} value={value} onChange={(val) => handle2DInputChange(setAllocation, i, j, val)} className='w-full' />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='bg-white p-4 rounded shadow mt-4'>
            <h2 className='text-xl font-semibold mb-2'>Maximum Allocation Required</h2>
            <table className='table-auto w-full border border-gray-300'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>Processes</th>
                  {Array.from({ length: resources }, (_, index) => (
                    <th key={index} className='border px-4 py-2 text-center'>
                      R{index + 0}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {maximum.map((row, i) => (
                  <tr key={i}>
                    <td className='border px-4 py-2 text-center'>P{i + 1}</td>
                    {row.map((value, j) => (
                      <td key={j} className='border px-4 py-2 text-center'>
                        <InputNumber min={0} value={value} onChange={(val) => handle2DInputChange(setMaximum, i, j, val)} className='w-full' />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600' onClick={hanldeCreateAvailableAndNeedMatrix}>
            Generate Available & Need Matrix
          </button>
        </>
      )}
      {error && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded'>
          <p>{error}</p>
        </div>
      )}

      {/* Available Resources */}
      {available.length > 0 && (
        <div className='bg-white p-4 rounded shadow mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Resource Instances Available</h2>
          <table className='table-auto w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                {available.map((value, index) => (
                  <th key={index} className='border px-4 py-2 text-center'>
                    R{index + 0}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {available.map((value, index) => (
                  <td key={index} className='border px-4 py-2 text-center'>
                    {value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {available.length > 0 && (
        <div className='bg-white p-4 rounded shadow mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Steps to Find Available Resources</h2>
          {displayStepsForAvailableResources().map((step, index) => (
            <p key={index} className='font-mono'>
              {step}
            </p>
          ))}
        </div>
      )}

      {/* Need Matrix */}
      {need.length > 0 && (
        <div className='bg-white p-4 rounded shadow mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Need Matrix</h2>
          <table className='table-auto w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>Processes</th>
                {Array.from({ length: resources }, (_, index) => (
                  <th key={index} className='border px-4 py-2 text-center'>
                    R{index + 0}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {need.map((row, i) => (
                <tr key={i}>
                  <td className='border px-4 py-2 text-center'>P{i + 1}</td>
                  {row.map((value, j) => (
                    <td key={j} className='border px-4 py-2 text-center'>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {need.length > 0 && (
        <div className='bg-white p-4 rounded shadow mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Steps to Find Need Matrix</h2>
          {displayStepsForNeedMatrix().map((step, index) => (
            <p key={index} className='font-mono'>
              {step}
            </p>
          ))}
        </div>
      )}

      {hideBtnSafe && (
        <>
          <button className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600' onClick={displaySafeSequences}>
            Find Safe Sequences
          </button>
        </>
      )}

      {hideSafeSequences && (
        <>
          {safeSequence.length > 0 && !error && (
            <div className='mt-4 p-4 bg-green-100 text-green-700 rounded'>
              <p>Safe sequence found: {safeSequence.map((p) => `P${p + 1}`).join(' -> ')}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BankersAlgorithmSimulator
