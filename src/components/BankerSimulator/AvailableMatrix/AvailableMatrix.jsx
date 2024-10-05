function AvailableMatrix({ available, displayStepsForAvailableResources }) {
  return (
    <>
      {available?.length > 0 && (
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
    </>
  )
}

export default AvailableMatrix
