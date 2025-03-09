// import { Card, Button } from 'antd';
// import { FaClock, FaTimesCircle, FaPause, FaCheckCircle } from 'react-icons/fa';
// import { Tree, TreeNode } from 'react-organizational-chart';
// import CampaignRequest from '../CampaignRequest';
// import React, { useState } from 'react';
// import CreateNewCampaign from './CreateNewCampaign';
// const AdvertiserDashboard: React.FC = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   return (
//     <div className="bg-white p-5">
//       <div className="mb-2 flex items-center justify-between">
//         <h2 className="text-2xl font-bold">Xin chào, Tri</h2>
//         <Button
//           type="primary"
//           className="bg-orange "
//           onClick={() => setIsModalVisible(true)}
//         >
//           Tạo mới chiến dịch
//         </Button>
//         <CreateNewCampaign
//           visible={isModalVisible} // Truyền trạng thái hiển thị
//           onCancel={() => setIsModalVisible(false)} // Đóng modal khi hủy
//           onCreate={(values) => {
//             console.log('Dữ liệu chiến dịch:', values);
//             setIsModalVisible(false);
//           }}
//         />
//       </div>
//       <h5 className="text-md mb-6">Chúc bạn có 1 ngày tốt lành</h5>
//       <div className="flex justify-center bg-white p-6">
//         <Tree
//           lineWidth={'2px'}
//           lineColor={'#D3D3D3'}
//           lineBorderRadius={'10px'}
//           label={
//             <Card className="p-4 text-center shadow-md">
//               <div className="flex items-center gap-2 text-purple-500">
//                 <FaClock size={20} />{' '}
//                 <span className="font-bold">Cần phê duyệt</span>
//               </div>
//               <p className="text-lg font-bold">Số lượng: 0</p>
//             </Card>
//           }
//         >
//           <TreeNode
//             label={
//               <Card className="p-4 text-center shadow-md">
//                 <div className="flex items-center gap-2 text-red">
//                   <FaTimesCircle size={20} />{' '}
//                   <span className="font-bold">Đã từ chối</span>
//                 </div>
//                 <p className="text-lg font-bold">Số lượng: 0</p>
//               </Card>
//             }
//           />
//           <TreeNode
//             label={
//               <Card className="p-4 text-center shadow-md">
//                 <div className="flex items-center gap-2 text-orange">
//                   <FaPause size={20} />{' '}
//                   <span className="font-bold">Tạm dừng</span>
//                 </div>
//                 <p className="text-lg font-bold">Số lượng: 0</p>
//               </Card>
//             }
//           />
//           <TreeNode
//             label={
//               <Card className="p-4 text-center shadow-md">
//                 <div className="flex items-center gap-2 text-blue">
//                   <FaCheckCircle size={20} />{' '}
//                   <span className="font-bold">Đang thực hiện</span>
//                 </div>
//                 <p className="text-lg font-bold">Số lượng: 0</p>
//               </Card>
//             }
//           />
//           <TreeNode
//             label={
//               <Card className="p-4 text-center shadow-md">
//                 <div className="flex items-center gap-2 text-green-500">
//                   <FaCheckCircle size={20} />{' '}
//                   <span className="font-bold">Đã hoàn thành</span>
//                 </div>
//                 <p className="text-lg font-bold">Số lượng: 0</p>
//               </Card>
//             }
//           />
//         </Tree>
//       </div>
//       <CampaignRequest />
//     </div>
//   );
// };

// export default AdvertiserDashboard;

import React, { useState } from 'react';
import { FaClock, FaTimesCircle, FaPause, FaCheckCircle } from 'react-icons/fa';
import CreateNewCampaign from './CreateNewCampaign';
import CampaignRequest from './CampaignRequest';

const AdvertiserDashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <div className="min-h-screen ">
      {/* HEADER */}
      <header className="bg-transparent px-10 py-5">
        <div className="text-center text-white">
          <h1 className="mb-0 text-3xl font-bold text-[#DD83E0]">
            Xin chào, Tri
          </h1>
          <p className="text-gray-500">Chúc bạn có một ngày tốt lành</p>
        </div>
      </header>

      {/* NỘI DUNG */}
      <main className="px-10 py-5">
        {/* Nút tạo chiến dịch */}
        <div className="mb-5 text-right">
          <button
            type="button"
            onClick={() => setIsModalVisible(true)}
            className="rounded bg-[#ff7f50] px-4 py-2 text-white"
          >
            Tạo mới chiến dịch
          </button>
        </div>

        {/* Các thẻ thống kê trạng thái chiến dịch */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Cần phê duyệt */}
          <div className="rounded-xl bg-[#99D1D3] p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaClock size={30} />
            <h4 className="my-2 text-xl font-bold text-black">Cần phê duyệt</h4>
            <p className="text-2xl font-bold">0</p>
          </div>

          {/* Đã từ chối */}
          <div className="rounded-xl bg-[#E54646] p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaTimesCircle size={30} />
            <h4 className="my-2 text-xl font-bold text-black">Đã từ chối</h4>
            <p className="text-2xl font-bold">0</p>
          </div>

          {/* Tạm dừng */}
          <div className="rounded-xl bg-[#EC870E] p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaPause size={30} />
            <h4 className="my-2 text-xl font-bold text-black">Tạm dừng</h4>
            <p className="text-2xl font-bold">0</p>
          </div>

          {/* Đã hoàn thành */}
          <div className="rounded-xl bg-[#00AE72] p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaCheckCircle size={30} />
            <h4 className="my-2 text-xl font-bold text-black">Đã hoàn thành</h4>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        {/* Phần hiển thị yêu cầu hoặc chi tiết chiến dịch */}
        <div className="mt-10">
          <CampaignRequest />
        </div>
      </main>

      {/* Modal tạo chiến dịch */}
      <CreateNewCampaign
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onCreate={(values: unknown) => {
          console.log('Dữ liệu chiến dịch:', values);
          setIsModalVisible(false);
        }}
      />
    </div>
  );
};

export default AdvertiserDashboard;
