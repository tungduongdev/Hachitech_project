'use client';

import { Table, Button, Image, Input, Upload, Modal, Form, InputNumber, Spin } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getProductsApi, deleteProductApi, addProductApi, updateProductApi } from '../../apis/apis';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const router = useRouter();

  const [tableLoading, setTableLoading] = useState(true); // Bắt đầu với loading state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  // Icon loading cho Spin component
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setTableLoading(true); // Hiển thị loading khi bắt đầu fetch
    try {
      const response = await getProductsApi();
      if (response.status === 410) {
        toast.error("Vui lòng đăng nhập để tiếp tục!");
        router.push('/login');
        return;
      }
      setProducts(response.data.map((product, index) => ({
        key: product._id || `product-${index}`,
        index: index + 1,
        ...product,
        price: product.price || 0,
      })));
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setTableLoading(false); // Tắt loading sau khi hoàn thành
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.price = Number(values.price) || 0;
      
      setSubmitLoading(true); // Bật trạng thái loading khi submit
  
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("price", values.price);
  
      if (fileToUpload) {
        formData.append("imgUrl", fileToUpload);
      } else if (editingProduct && imageUrl) {
        formData.append("imgUrl", imageUrl);
      }
  
      let response;

      if (editingProduct) {
        response = await updateProductApi(editingProduct._id, formData);
      } else {
        response = await addProductApi(formData);
      }
  
      if (response.status === 201 || response.status === 200) {
        await fetchProducts();
        toast.success(editingProduct ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
        setIsModalOpen(false);
        form.resetFields();
        setEditingProduct(null);
        setImageUrl(null);
        setFileToUpload(null);
      } else {
        toast.error("Lưu sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Đã có lỗi xảy ra khi lưu sản phẩm!");
    } finally {
      setSubmitLoading(false); // Tắt trạng thái loading sau khi xử lý xong
    }
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingProduct(null);
    setImageUrl(null);
    setFileToUpload(null);
  };

  const handleUploadChange = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ được tải lên file hình ảnh!');
      return Upload.LIST_IGNORE;
    }
    
    const imageURL = URL.createObjectURL(file);
    setImageUrl(imageURL);
    setFileToUpload(file);
    return false; // Trả về false để component Upload không tự động upload
  };

  const handleDelete = async (id) => {
    try {
      // Đặt loading state cho nút xóa cụ thể
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      
      const response = await deleteProductApi(id);
      if (response.status === 200) {
        await fetchProducts();
        toast.success("Xóa sản phẩm thành công!");
      } else {
        toast.error("Xóa sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Đã có lỗi xảy ra khi xóa sản phẩm!");
    } finally {
      // Tắt loading state cho nút xóa cụ thể
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSearch = (value) => {
    setSearchLoading(true);
    if (!value) {
      fetchProducts();
      setSearchLoading(false);
      return;
    }
    
    // Giả lập thời gian tìm kiếm
    setTimeout(() => {
      setProducts(products.filter(product =>
        product.productName.toLowerCase().includes(value.toLowerCase())
      ));
      setSearchLoading(false);
    }, 300);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Danh sách sản phẩm</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button type="primary" onClick={() => { 
            setIsModalOpen(true); 
            setImageUrl(null); 
            setFileToUpload(null);
            form.resetFields(); 
          }}>
            Thêm sản phẩm
          </Button>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            style={{ width: 200 }}
            onSearch={handleSearch}
            loading={searchLoading}
            allowClear
          />
        </div>
      </div>

      <Table
        loading={{
          spinning: tableLoading,
          indicator: <Spin indicator={antIcon} />
        }}
        columns={[
          { title: 'ID', dataIndex: 'index', key: 'id', align: 'center' },
          {
            title: 'Ảnh',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            align: 'center',
            render: (img) => img ? <Image width={50} src={img} alt="product" /> : <div>No image</div>,
          },
          { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
          {
            title: 'Giá (USD)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (price || 0).toLocaleString() + ' USD',
          },
          {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Button
                  onClick={() => {
                    setEditingProduct(record);
                    form.setFieldsValue({
                      productName: record.productName,
                      price: record.price,
                      imgUrl: record.imgUrl
                    });
                    setImageUrl(record.imgUrl);
                    setFileToUpload(null);
                    setIsModalOpen(true);
                  }}
                  type="primary"
                >
                  Sửa
                </Button>
                <Button 
                  type="primary" 
                  danger 
                  loading={deleteLoading[record._id]} 
                  onClick={() => handleDelete(record._id)}
                >
                  Xóa
                </Button>
              </div>
            ),
          },
        ]}
        dataSource={products}
        rowKey="key"
      />

      <Modal 
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"} 
        open={isModalOpen} 
        onCancel={handleCancel}
        confirmLoading={submitLoading}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá sản phẩm" />
          </Form.Item>
          <Form.Item name="imgUrl" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Tải ảnh lên">
            <Upload listType="picture-card" showUploadList={false} beforeUpload={handleUploadChange}>
              {imageUrl ? (
                <img src={imageUrl} alt="sản phẩm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                submitLoading ? <Spin indicator={antIcon} /> : <UploadOutlined />
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;