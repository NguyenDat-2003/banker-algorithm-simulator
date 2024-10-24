import { Button } from 'antd'
import AvailableMatrix from './AvailableMatrix/AvailableMatrix'
import NeedMaTrix from './NeedMaTrix/NeedMaTrix'

function AvailableNeedMaTrix({
  available,
  need,
  resources,
  displaySafeSequences,
  error,
  safeSequence,
  hideSafeSequences,
  hideContentMaxtrix,
  displayStepsForAvailableResources,
  displayStepsForNeedMatrix
}) {
  return (
    <>
      {hideContentMaxtrix && (
        <>
          <AvailableMatrix available={available} displayStepsForAvailableResources={displayStepsForAvailableResources} />
          <NeedMaTrix need={need} resources={resources} displayStepsForNeedMatrix={displayStepsForNeedMatrix} />

          <Button type='primary' className='p-5 my-4 !bg-green-600 text-lg hover:!bg-green-700' onClick={displaySafeSequences} disabled={error && 'true'}>
            Tìm chuỗi an toàn
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
