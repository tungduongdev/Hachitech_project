'use client';

import { Table, Button, Image, Input, Upload, Modal, Form, InputNumber, Spin, Select } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getProductsApi, deleteProductApi, addProductApi, updateProductApi, getCategoriesApi } from '../../apis/apis';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const router = useRouter();

  const [tableLoading, setTableLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await getCategoriesApi();
      setCategories(response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    setTableLoading(true);
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
        colors: product.colors || [],
        categoryId: Array.isArray(product.categoryId) ? product.categoryId : product.categoryId ? [product.categoryId] : [] // Đảm bảo categoryId là mảng
      })));
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setTableLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.price = Number(values.price) || 0;

      setSubmitLoading(true);

      const formData = new FormData();

      formData.append("productName", values.productName);
      formData.append("price", values.price);
      formData.append("description", values.description || '');
      
      if (values.categoryId) {
        formData.append("categoryId", JSON.stringify(values.categoryId)); // Gửi mảng categoryId dưới dạng JSON
      }

      if (values.colors) {
        formData.append("colors", JSON.stringify(values.colors));
      }

      if (fileToUpload) {
        formData.append("imgUrl", fileToUpload);
      } else if (editingProduct && editingProduct.imgUrl) {
        formData.append("imgUrl", editingProduct.imgUrl);
      }

      console.log('Dữ liệu gửi đi:', Object.fromEntries(formData)); // Log dữ liệu để kiểm tra

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
    const isLt2M = file.size / 1024 / 1024 < 5;
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

  const handleUploadChange = (info) => {
    const file = info.file || info;
    
    if (!file.type || !file.type.startsWith('image/')) {
      toast.error('Chỉ được tải lên file hình ảnh!');
      return Upload.LIST_IGNORE;
    }

    const imageURL = URL.createObjectURL(file);
    setImageUrl(imageURL);
    setFileToUpload(file);
    return false;
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

    setTimeout(() => {
      setProducts(products.filter(product =>
        product.productName.toLowerCase().includes(value.toLowerCase())
      ));
      setSearchLoading(false);
    }, 300);
  };

  // Lấy tên danh mục từ mảng categoryId
  const getCategoryName = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return 'Không có';
    }
    const categoryNames = categoryIds.map(id => {
      const category = categories.find(cat => cat._id === id);
      return category ? category.categoryName : 'Không xác định';
    });
    return categoryNames.join(', '); // Hiển thị danh sách tên danh mục, cách nhau bởi dấu phẩy
  };

  // Styles để sửa lỗi layout
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
    },
    content: {
      flexGrow: 1,
      padding: '20px',
      marginLeft: '250px', // Giữ khoảng cách với sidebar
      width: 'calc(100% - 200px)',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }
  };

  return (
    <div style={styles.container}>
      <DashboardSidebar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1>Danh sách sản phẩm</h1>
          <div style={styles.actionButtons}>
            <Button 
              type="primary" 
              onClick={() => {
                setIsModalOpen(true);
                setImageUrl(null);
                setFileToUpload(null);
                form.resetFields();
              }}
            >
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
            { title: 'ID', dataIndex: 'index', key: 'id', align: 'center', width: 80 },
            {
              title: 'Ảnh',
              dataIndex: 'imgUrl',
              key: 'imgUrl',
              align: 'center',
              width: 100,
              render: (img) => img ? <Image width={50} src={img} alt="product" /> : <div>No image</div>,
            },
            { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
            {
              title: 'Giá (USD)',
              dataIndex: 'price',
              key: 'price',
              width: 120,
              render: (price) => (price || 0).toLocaleString() + ' USD',
            },
            { 
              title: 'Danh mục', 
              dataIndex: 'categoryId', 
              key: 'categoryId',
              render: (categoryIds) => getCategoryName(categoryIds) // Hiển thị tất cả danh mục
            },
            { title: 'Mô tả', dataIndex: 'description', key: 'description' },
            {
              title: 'Màu sắc',
              dataIndex: 'colors',
              key: 'colors',
              render: (colors) => {
                if (!colors || colors.length === 0) return 'Không có';
                return colors.join(', ');
              }
            },
            {
              title: 'Hành động',
              key: 'action',
              align: 'center',
              width: 180,
              render: (_, record) => (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <Button
                    onClick={() => {
                      setEditingProduct(record);
                      form.setFieldsValue({
                        productName: record.productName,
                        price: record.price,
                        description: record.description,
                        colors: record.colors,
                        categoryId: record.categoryId // Đảm bảo đây là mảng
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
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />

        <Modal
          title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
          open={isModalOpen}
          onCancel={handleCancel}
          confirmLoading={submitLoading}
          onOk={handleOk}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá sản phẩm" />
            </Form.Item>
            <Form.Item 
              label="Danh mục" 
              name="categoryId" 
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một danh mục!" }]}
            >
              <Select
                mode="multiple" // Cho phép chọn nhiều danh mục
                placeholder="Chọn danh mục"
                loading={categoriesLoading}
                allowClear
                showSearch // Cho phép tìm kiếm danh mục
                optionFilterProp="children" // Tìm kiếm theo nội dung hiển thị
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } // Lọc tùy chỉnh
              >
                {categories.map(category => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.categoryName}
                  </Select.Option>
                ))}
              </Select>
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
                          key={field.key}
                          name={field.name}
                          fieldKey={field.fieldKey}
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
              <Upload 
                beforeUpload={handleBeforeUpload} 
                listType="picture-card" 
                showUploadList={false} 
                customRequest={({ file }) => handleUploadChange(file)}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="sản phẩm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div>
                    {submitLoading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                      </div>
                    )}
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductTable;