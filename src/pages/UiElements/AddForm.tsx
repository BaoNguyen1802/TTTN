import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho form
interface ProductFormData {
  img: File | null; // Trường dành cho file ảnh
  productName: string;
  price: string;
  color: string;
  des: string;
  badge: boolean; // Badge mặc định là true
}

const AddProductForm: React.FC = () => {
  const navigate = useNavigate()
  // State để lưu dữ liệu của form
  const [formData, setFormData] = useState<ProductFormData>({
    img: null,
    productName: "",
    price: "",
    color: "",
    des: "",
    badge: true, // Mặc định là true
  });

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi cho trường ảnh
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        img: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.img) {
      alert("Please upload an image.");
      return;
    }

    try {
      // **Bước 1: Upload ảnh**
      const imgData = new FormData();
      const filename = "/images/" + Date.now() + formData.img.name;
      imgData.append("name", filename);
      imgData.append("file", formData.img);

      await axios.post("http://localhost:8000/api/v1/upload", imgData);

      console.log("Image uploaded:", filename)

      // **Bước 2: Gọi API tạo sản phẩm**
      const productData = {
        productName: formData.productName,
        price: formData.price,
        color: formData.color,
        des: formData.des,
        badge: formData.badge,
        img: filename, // Sử dụng URL/tên file từ bước upload ảnh
      };

      const productResponse = await axios.post("http://localhost:8000/api/v1/product", productData);
      console.log("Product created:", productResponse.data);

      alert("Product created successfully!");
      navigate(`/tables/products`); 
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };



  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Add New Product</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">Image</label>
            <input
              type="file"
              name="img"
              accept="image/*"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter product name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">Price</label>
            <input
              type="text"
              name="price"
              placeholder="Enter product price"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">Color</label>
            <input
              type="text"
              name="color"
              placeholder="Enter product color"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">Description</label>
            <textarea
              rows={6}
              name="des"
              placeholder="Enter product description"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={formData.des}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
