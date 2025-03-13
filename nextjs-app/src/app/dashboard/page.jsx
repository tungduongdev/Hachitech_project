'use client';

import { Table, Button, Image, Input, Upload, Modal, Form, InputNumber, Spin } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
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
  const [colors, setColors] = useState([]);
  const router = useRouter();

  const [tableLoading, setTableLoading] = useState(true); // Bắt đầu với loading state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setTableLoading(true); // Hiển thị loading khi bắt đầu fetch
    try {
      const response = await getProductsApi();
      console.log('API response:', response.data);
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
        colors: product.colors || []
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

      setSubmitLoading(true);

      const formData = new FormData();

      // Luôn gửi tất cả các trường dữ liệu
      formData.append("productName", values.productName);
      formData.append("price", values.price);
      formData.append("description", values.description || '');

      // Xử lý mảng màu sắc - gửi dưới dạng JSON string
      if (values.colors) {
        formData.append("colors", JSON.stringify(values.colors));
      }
      // Xử lý ảnh
      if (fileToUpload) {
        formData.append("imgUrl", fileToUpload);
      } else if (editingProduct && editingProduct.imgUrl) {
        // Nếu không có file mới và đang chỉnh sửa sản phẩm, gửi URL ảnh cũ
        // Chú ý: Điều này phụ thuộc vào cách backend xử lý imgUrl
        formData.append("imgUrl", editingProduct.imgUrl);
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
      setSubmitLoading(false);
    }
  };
  const handleBeforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 5; // Giới hạn 2MB
    if (!isLt2M) {
      toast.error('Ảnh phải nhỏ hơn 5MB!');
    }
    return isLt2M;
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
          { title: 'Mô tả', dataIndex: 'description', key: 'description' }
          ,
          {
            title: 'Màu sắc',
            dataIndex: 'colors',
            key: 'colors',
            render: (colors) => {
              if (!colors || colors.length === 0) return 'Không có';
              return colors.join(', ');
            }
          },
          ,
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
                      imgUrl: record.imgUrl,
                      description: record.description
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
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
          <Form.Item label="Màu sắc">
            <Form.List name="colors" initialValue={[]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <div key={field.key} style={{ display: 'flex', marginBottom: 8, gap: 8 }}>
                      <Form.Item
                        {...field}
                        noStyle
                      >
                        <Input placeholder="Nhập màu sắc" style={{ width: '100%' }} />
                      </Form.Item>
                      <Button
                        type="dashed"
                        danger
                        onClick={() => remove(field.name)}
                        icon={<MinusCircleOutlined />}
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Thêm màu sắc
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label="Tải ảnh lên">
            <Upload handleBeforeUpload={handleBeforeUpload} listType="picture-card" showUploadList={false} beforeUpload={handleUploadChange}>
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