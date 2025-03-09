import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Sendo.vn',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeERbH1RnP4ywu49tpMfK7AXyrktCvZbG7Zw&s'
  },
  {
    name: 'NguyenKim',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaLwuwEqRRxi64apf7lhwXKkIBdAUiGlZNug&s'
  },
  {
    name: 'Atadi.vn',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7v6mIqjediuT1WiVw-gFIlNRsEJaHp8wmQ&s'
  },
  {
    name: 'Topica Edumall',
    src: 'https://static.ybox.vn/2018/7/1/1531711616488-Thi%E1%BA%BFt%20k%E1%BA%BF%20kh%C3%B4ng%20t%C3%AAn%20(9).png'
  },
  {
    name: 'FPT Shop',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyq19Le_afh7wCEdKcniMZHMPbcTQsEviMHA&s'
  },
  {
    name: 'Shoppee',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ana0g1Cq4lEK6kjWFYJFaBtCEQJ51iCmUg&s'
  },
  {
    name: 'Lazada',
    src: 'https://image.sggp.org.vn/w1000/Uploaded/2025/yfsgf/2019_06_20/3_BIXQ.png.webp'
  }
];

const Partner = () => {
  return (
    <div className="to-blue-50 bg-gradient-to-r from-purple-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
          Đối tác của chúng tôi
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Các thương hiệu lớn đã hợp tác với chúng tôi
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-lg transition duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={partner.src}
                alt={partner.name}
                className="h-20 object-contain"
              />
              <p className="mt-2 text-sm font-semibold text-gray-700">
                {partner.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partner;
