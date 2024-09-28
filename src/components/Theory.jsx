function Theory() {
  return (
    <>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold mb-6 text-center text-blue-500'>GIẢI THUẬT BANKER</h1>

        <section className='mb-8 bg-white shadow-md rounded-lg p-6 text-left'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Khái niệm</h2>
          <p className='text-gray-600 '>
            Giải thuật Banker là một giải thuật cấp phát tài nguyên và tránh tắc nghẽn của hệ điều hành. Banker được thực thi bằng cách mô phỏng việc cấp phát cho số lượng tối đa
            có thể xác định trước của tất cả các tài nguyên, sau đó thực hiện kiểm tra trạng thái an toàn để kiểm tra các hoạt động có thể xảy ra, trước khi quyết định có nên cho
            phép cấp phát hay không.
          </p>
        </section>

        <section className='mb-8 bg-white shadow-md rounded-lg p-6 text-left'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Triển khai giải thuật Banker</h2>
          <p className='text-gray-600 text-lg'>Các cấu trúc dữ liệu sau được sử dụng để triển khai giải thuật Banker: Gọi n là số tiến trình; m là số tài nguyên</p>
          <ul className='list-disc pl-6 space-y-2 text-amber-600'>
            <li>
              <strong>Available:</strong> vector với độ dài m, là số thực thể đang khả dụng (có sẵn). Nếu available[j]=k, có k thực thể của tài nguyên Rj là khả dụng.
            </li>
            <li>
              <strong>Max:</strong> ma trận nxm, số thực thể tối đa mà tiến trình yêu cầu. Nếu Max[i,j]=k, thì tiến trình Pi có thể yêu cầu nhiều nhất k thực thể của tài nguyên Rj.
            </li>
            <li>
              <strong>Allocation:</strong> ma trận nxm, số thực thể của tài nguyên đã cấp phát cho tiến trình. Nếu Allocation[i,j]=k, thì hiện hành tiến trình Pi được cấp phát k
              thực thể của tài nguyên Rj.
            </li>
            <li>
              <strong>Need:</strong> ma trận nxm, số thực thể tiến trình cần để hoàn thành tác vụ. Nếu Need[i,j]=k, thì tiến trình Pi cần thêm k thực thể của Rj để hoàn thành tác
              vụ.
            </li>
          </ul>
          <p className='text-center my-4 font-medium text-amber-600'> Need[i,j]=Max[i,j]-Allocation[i,j]</p>
          <p className='text-lg mt-8'>Giải thuật Banker bao gồm 2 thuật toán: Thuật toán xác định trạng thái an toàn và thuật toán yêu cầu tài nguyên.</p>
          <span className='text-blue-500 text-lg font-medium'>1. Giải thuật xác định trạng thái an toàn</span>
          <ul className='list-none pl-6 space-y-2 text-gray-600'>
            <li>
              <strong>Bước 1:</strong> Gọi Work và Finish là 2 vector với độ dài tương ứng là m và n. Khởi tạo:
              <p>
                Work = Available <br /> Finish [i] = false với i = 0, 1, …, n- 1
              </p>
            </li>
            <li>
              <strong>Bước 2:</strong> Tìm i thỏa 2 điều kiện:
              <p>
                Finish[i]=false
                <br /> Needi &#8804; Work
                <br /> Nếu không tồn tại i như vậy thì qua Bước 4
              </p>
            </li>
            <li>
              <strong>Bước 3:</strong>
              <p>
                Work = Work + Allocation
                <br /> Finish[i] = true
                <br /> Quay lại Bước 2
              </p>
            </li>
            <li>
              <strong>Bước 4:</strong> Nếu Finish [i] == true với tất cả i, thì hệ thống ở trạng thái an toàn
            </li>
          </ul>
          <span className='text-blue-500 text-lg font-medium mt-4'>2. Giải thuật yêu cầu tài nguyên của tiến trình Pi</span>
          <ul className='list-none pl-6 space-y-2 text-gray-600'>
            <li>
              <strong>Requesti</strong> -- vector tài nguyên yêu cầu của tiến trình Pi. Nếu Requesti[j]=k thì tiến trình Pi muốn k thực thể của tài nguyên Rj
              <p>
                Work = Available <br /> Finish [i] = false với i = 0, 1, …, n- 1
              </p>
            </li>
            <li>
              <strong>Bước 1:</strong> Nếu Requesti &#8804; Needi tới Bước 2. Ngược lại, đưa ra lỗi vì tiến trình vượt quá đòi hỏi tối đa.
            </li>
            <li>
              <strong>Bước 2:</strong> Nếu Requesti &#8804; Available tới Bước 3. Ngược lại, Pi phải chờ vì tài nguyên không có sẵn.
            </li>
            <li>
              <strong>Bước 3:</strong> Giả sử hệ thống đã cấp phát cho Pi các tài nguyên mà nó yêu cầu và cập nhật tình trạng hệ thống như sau:
              <p className='ml-10 text-amber-600'>
                Available = Available – Requesti;
                <br /> Allocationi = Allocationi + Requesti;
                <br />
                Needi = Needi – Requesti;
              </p>
              <span>Nếu trạng thái là an toàn &#8594; tài nguyên được cấp phát cho Pi.</span>
              <br />
              <span>Nếu trạng thái là không an toàn &#8594; Pi phải chờ, và trạng thái cấp phát tài nguyên cũ được phục hồi.</span>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}

export default Theory