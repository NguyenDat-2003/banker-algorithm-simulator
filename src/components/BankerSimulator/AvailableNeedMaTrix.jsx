import { Button } from 'antd'

function AvailableNeedMaTrix({
  available,
  totalResources,
  allocation,
  need,
  resources,
  processes,
  maximum,
  hideBtnSafe,
  displaySafeSequences,
  error,
  safeSequence,
  hideSafeSequences,
  hideContentMaxtrix
}) {
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

  return (
    <>
      {hideContentMaxtrix && (
        <>
          {available.length > 0 && (
            <div className='bg-white p-4 rounded shadow mt-4'>
              <h2 className='text-xl font-semibold mb-4'>Tài nguyên có sẵn của hệ thống</h2>
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
              <h2 className='text-xl font-semibold mb-2'>Các bước tìm kiếm tài nguyên có sẵn của hệ thống</h2>
              {displayStepsForAvailableResources().map((step, index) => (
                <p key={index} className='font-mono'>
                  {step}
                </p>
              ))}
            </div>
          )}

          {need.length > 0 && (
            <div className='bg-white p-4 rounded shadow mt-4'>
              <h2 className='text-xl font-semibold mb-2'>Ma trận tài nguyên tối đa mà các tiến trình cần dùng</h2>
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
              <h2 className='text-xl font-semibold mb-2'>Các bước tìm kiếm ma trận Need</h2>
              {displayStepsForNeedMatrix().map((step, index) => (
                <p key={index} className='font-mono'>
                  {step}
                </p>
              ))}
            </div>
          )}
          <Button type='primary' className='p-5 my-4 !bg-green-600 text-lg hover:!bg-green-700' onClick={displaySafeSequences} disabled={!hideBtnSafe && 'true'}>
            Find Safe Sequences
          </Button>

          {hideSafeSequences && (
            <>
              {safeSequence.length > 0 && !error && (
                <div className='mt-4 p-4 bg-green-100 text-green-700 rounded'>
                  <p>Hệ thống an toàn vì tồn tại thứ tự an toàn: {safeSequence.map((p) => `P${p + 1}`).join(' -> ')}</p>
                </div>
              )}
            </>
          )}

          {error && (
            <div className='mt-4 p-4 bg-red-100 text-red-700 rounded'>
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default AvailableNeedMaTrix
