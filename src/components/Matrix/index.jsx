function Matrix({ matrix, resources, displayStepsForNeedMatrix, hideSteptoFindMatrix, title }) {
  return (
    <>
      {matrix?.length > 0 && (
        <div className='bg-white p-4 rounded shadow mt-4'>
          <h2 className='text-xl font-semibold mb-2'>{title}</h2>
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
              {matrix.map((row, i) => (
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
      {!hideSteptoFindMatrix && (
        <>
          {matrix.length > 0 && (
            <div className='bg-white p-4 rounded shadow mt-4'>
              <h2 className='text-xl font-semibold mb-2'>Các bước tìm kiếm ma trận</h2>
              {displayStepsForNeedMatrix().map((step, index) => (
                <p key={index} className='font-mono'>
                  {step}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Matrix
