import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";

// Định nghĩa kiểu dữ liệu cho một đơn hàng
interface Order {
  _id: string;
  userId: { username: string };
  products: { quantity: number }[];
  amount: number;
  createdAt: string;
  paymentMethod?: string;
  status: string;
}

const TablesOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Trạng thái lưu trữ danh sách đơn hàng
  const [productDetails, setProductDetails] = useState<any>(null); // Trạng thái lưu thông tin chi tiết sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng popup

  //@ts-ignore
  const apiUrl = import.meta.env.VITE_URL_BACKEND;

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>(apiUrl + "/api/v1/orderr"); // Gọi API
        setOrders(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleEdit = async (orderId: string, currentStatus: string) => {
    try {
      let newStatus: string;

      // Kiểm tra trạng thái hiện tại và xác định trạng thái mới
      if (currentStatus === 'pending') {
        newStatus = 'delivery';
      } else if (currentStatus === 'delivery') {
        newStatus = 'paid';
      } else {
        alert('Đơn hàng đã được thanh toán, không thể thay đổi trạng thái nữa.');
        return;
      }

      // Gửi request PUT để cập nhật trạng thái đơn hàng
      await axios.put(apiUrl + `/api/v1/orderr/${orderId}`, {
        status: newStatus,
      });

      alert(`Đơn hàng đã được chuyển sang trạng thái ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    } catch (error) {
      console.error('Error updating order status', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };


  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        // Gửi request DELETE để xóa đơn hàng
        await axios.delete(apiUrl + `/api/v1/orderr/${orderId}`);

        alert('Đơn hàng đã được xóa thành công');
        // Sau khi xóa, có thể fetch lại danh sách đơn hàng để cập nhật giao diện
        setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
      } catch (error) {
        console.error('Error deleting order', error);
        alert('Có lỗi xảy ra khi xóa đơn hàng');
      }
    }
  };

  const handleViewDetails = async (productId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/orderr/${productId}`);
      setProductDetails(response.data);
      setIsModalOpen(true); // Mở popup khi có dữ liệu
    } catch (error) {
      console.error('Error fetching product details', error);
      alert('Có lỗi xảy ra khi tải thông tin chi tiết sản phẩm');
    }
  };

  // Hàm đóng popup
  const closeModal = () => {
    setIsModalOpen(false);
    setProductDetails(null); // Reset dữ liệu khi đóng modal
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Gửi request PUT để cập nhật trạng thái đơn hàng thành "cancel"
      await axios.put(apiUrl + `/api/v1/orderr/${orderId}`, {
        status: 'cancel',
      });
  
      alert('Đơn hàng đã được hủy');
      closeModal(); // Đóng modal sau khi hủy đơn
    } catch (error) {
      console.error('Error canceling order', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng');
    }
  };
  


  return (
    <>
      <Breadcrumb pageName="Orders Manager" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Orders
            </h4>
          </div>

          <div className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-1 flex items-center">
              <p className="font-medium">OrderID</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Username</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Quantity</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Total</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Date</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Paymethod</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Status</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Action</p>
            </div>
          </div>

          {orders.map((order) => (
            <div
              className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              key={order._id}
            >
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">
                  {order._id ? `ORD...${order._id.slice(-4)}` : 'N/A'}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">{order.userId.username}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">
                  {order.products.reduce((total, product) => total + product.quantity, 0)} items
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">${order.amount}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">
                  {new Date(order.createdAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false, // Sử dụng 24 giờ, bỏ qua nếu muốn 12 giờ
                  })}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">{order.paymentMethod || "N/A"}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p
                  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${order.status === "paid"
                    ? "bg-success text-success"
                    : order.status === "cancel"
                      ? "bg-danger text-danger"
                      : "bg-warning text-warning"
                    }`}
                >
                  {order.status}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="flex items-start space-x-3.5">
                  {order.status === 'paid' || "cancel" ? <></> :
                    <button onClick={() => handleEdit(order._id, order.status)} className="hover:text-primary">
                      <svg className="fill-current"
                        width="30"
                        height="30"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                      </svg>
                    </button>
                  }

                  {isModalOpen && productDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg max-w-4xl w-auto">
                        <h3 className="text-2xl font-semibold mb-4">Product Details</h3>
                        <h3 className="text-2xl font-semibold mb-4">Order Details (ID: ...{productDetails._id.slice(-4)})</h3>

                        {/* Bảng thông tin sản phẩm */}
                        <table className="table-auto w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-4 py-2">Product ID</th>
                              <th className="border px-4 py-2">Product Name</th>
                              <th className="border px-4 py-2">Product Color</th>
                              <th className="border px-4 py-2">Quantity</th>
                              <th className="border px-4 py-2">Total Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productDetails.products.map((product: any) => (
                              <tr key={product._id}>
                                <td className="border px-4 py-2">Pro...{product.productId._id.slice(-4)}</td>
                                <td className="border px-4 py-2">{product.productId.productName}</td>
                                <td className="border px-4 py-2">{product.productId.color}</td>
                                <td className="border px-4 py-2">{product.quantity}</td>
                                <td className="border px-4 py-2">${(parseFloat(product.productId.price) * product.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="mt-6 flex justify-end gap-5">
                          <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            onClick={closeModal}
                          >
                            Close
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => handleCancelOrder(productDetails._id)}
                          >
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button onClick={() => handleViewDetails(order._id)} className="hover:text-primary">
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                        fill=""
                      />
                      <path
                        d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                        fill=""
                      />
                    </svg>
                  </button>


                  <button onClick={() => handleDelete(order._id)} className="hover:text-primary">
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                        fill=""
                      />
                      <path
                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                        fill=""
                      />
                      <path
                        d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                        fill=""
                      />
                      <path
                        d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                        fill=""
                      />
                    </svg>
                  </button>


                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TablesOrder;
