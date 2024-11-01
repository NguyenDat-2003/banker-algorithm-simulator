import { Button, InputNumber } from 'antd'

function GenerateTableContent({ resources, totalResources, setTotalResources, allocation, setAllocation, maximum, setMaximum, hanldeCreateAvailableAndNeedMatrix, hideContent }) {
  const handle2DInputChange = (setter, row, col, value) => {
    setter((prev) => {
      const newArray = prev.map((r) => [...r])
      newArray[row][col] = parseInt(value) || 0
      return newArray
    })
  }

  return (
    <>
      {hideContent && (
        <>
          <div className='bg-white p-4 rounded shadow mt-4'>
            <h2 className='text-xl font-semibold mb-4'>Tổng số tài nguyên mỗi loại</h2>
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
            <h2 className='text-xl font-semibold mb-4'>Nhập ma trận tài nguyên đã cấp phát (Allocated)</h2>
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
            <h2 className='text-xl font-semibold mb-4'>Nhập ma trận tài nguyên yêu cầu tối đa của mỗi tiến trình (Max)</h2>
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

          <Button danger type='primary' className='p-5 !bg-green-600 text-lg hover:!bg-green-700 mt-4' onClick={hanldeCreateAvailableAndNeedMatrix}>
            Tạo ma trận Available & Need
          </Button>
        </>
      )}
    </>
  )
}

export default GenerateTableContent
