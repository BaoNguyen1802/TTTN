import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface ProductFormData {
  img: string; // Giữ URL hoặc tên ảnh
  productName: string;
  price: string;
  color: string;
  des: string;
  badge: boolean;
}

const EditProductForm: React.FC = () => {
  const { productId } = useParams<{ productId: string }>(); // Lấy productId từ URL
  const [formData, setFormData] = useState<ProductFormData>({
    img: "", // Giữ URL của ảnh
    productName: "",
    price: "",
    color: "",
    des: "",
    badge: true,
  });
  const [newImage, setNewImage] = useState<File | null>(null); // State cho ảnh mới nếu có
  const navigate = useNavigate();

   //@ts-ignore
   const env = import.meta.env.VITE_URL_BACKEND

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/product/${productId}`);
        const product = response.data;

        setFormData({
          img: product.img, // Lưu URL ảnh hoặc tên file
          productName: product.productName,
          price: product.price,
          color: product.color,
          des: product.des,
          badge: product.badge,
        });
      } catch (err) {
        console.error("Error fetching product data:", err);
        alert("An error occurred while fetching product data.");
      }
    };

    fetchProductData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]); // Lưu ảnh mới nếu người dùng thay đổi
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imgFilename = formData.img; // Giữ ảnh cũ nếu không thay đổi

      // **Nếu người dùng chọn ảnh mới, upload ảnh lên server**
      if (newImage) {
        const imgData = new FormData();
        imgData.append("name", `/images/${Date.now()}${newImage.name}`);
        imgData.append("file", newImage);

        // Gửi ảnh lên server
        const uploadResponse = await axios.post("http://localhost:8000/api/v1/upload", imgData);
        imgFilename = uploadResponse.data.filename; // Lấy tên file ảnh mới
        console.log("Image uploaded:", imgFilename);
      }

      // **Cập nhật thông tin sản phẩm**
      const updatedProductData = {
        productName: formData.productName,
        price: formData.price,
        color: formData.color,
        des: formData.des,
        badge: formData.badge,
        img: imgFilename || formData.img, // Dùng tên file ảnh mới (nếu có) hoặc ảnh cũ
      };

      // Gửi thông tin sản phẩm lên server
      await axios.put(`http://localhost:8000/api/v1/product/${productId}`, updatedProductData);
      alert("Product updated successfully!");
      navigate(`/tables/products`);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("An error occurred while updating the product.");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Edit Product</h3>
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
            />
            {/* Hiển thị ảnh nếu có */}
            {formData.img && !formData.img.startsWith("http") && (
              <img className="w-30 h-30" src={env + formData.img} alt="Product preview" />
            )}
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
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
