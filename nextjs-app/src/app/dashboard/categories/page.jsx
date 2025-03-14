'use client';

import { Table, Button, Input, Modal, Form, Spin, Popconfirm } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import {addCategoryApi, deleteCategoryApi, getCategoriesApi, updateCategoryApi} from '../../../apis/apis.js'

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const router = useRouter();

  const [tableLoading, setTableLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setTableLoading(true);
    try {
      const response = await getCategoriesApi();
      const data = response.data;

      setCategories(data.map((category, index) => ({
        key: category._id,
        index: index + 1,
        ...category
      })));
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setTableLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      let response;
      if (editingCategory) {
        response = await updateCategoryApi(editingCategory._id, values);
        if (response.status === 200) {
          setCategories(prev => prev.map(cat => 
            cat._id === editingCategory._id 
              ? { ...cat, ...values, key: editingCategory._id } 
              : cat
          ));
          toast.success("Cập nhật danh mục thành công!");
        }
      } else {
        response = await addCategoryApi(values);
        if (response.status === 201) {
          const newCategory = { 
            ...response.data,
            index: categories.length + 1,
            key: response.data._id
          };
          setCategories(prev => [...prev, newCategory]);
          toast.success("Thêm danh mục thành công!");
        }
      }

      // Reset form
      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Đã có lỗi xảy ra khi lưu danh mục!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      const response = await deleteCategoryApi(id);
      
      if (response.status === 200) {
        setCategories(prev => prev.filter(cat => cat._id !== id));
        toast.success("Xóa danh mục thành công!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Đã có lỗi xảy ra khi xóa danh mục!");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSearch = async (value) => {
    setSearchLoading(true);
    if (!value) {
      await fetchCategories();
      setSearchLoading(false);
      return;
    }

    try {
      // Nếu API hỗ trợ tìm kiếm, bạn có thể gọi API ở đây thay vì lọc cục bộ
      // const response = await searchCategoriesApi(value);
      // const data = response.data;
      // setCategories(data.map(...));
      
      // Lọc cục bộ nếu API không hỗ trợ tìm kiếm
      setCategories(prevCategories => prevCategories.filter(category =>
        category.categoryName.toLowerCase().includes(value.toLowerCase())
      ));
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm danh mục");
    } finally {
      setSearchLoading(false);
    }
  };

  // Styles để tránh lỗi layout
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
    },
    content: {
      flexGrow: 1,
      padding: '20px',
      marginLeft: '250px',
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
          <h1>Quản lý danh mục</h1>
          <div style={styles.actionButtons}>
            <Button 
              type="primary" 
              onClick={() => {
                setIsModalOpen(true);
                form.resetFields();
              }}
              icon={<PlusOutlined />}
            >
              Thêm danh mục
            </Button>
            <Input.Search
              placeholder="Tìm kiếm danh mục..."
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
            { title: 'Tên danh mục', dataIndex: 'categoryName', key: 'categoryName' },
            { title: 'Mô tả', dataIndex: 'description', key: 'description' },
            { title: 'Slug', dataIndex: 'slug', key: 'slug' },
            { 
              title: 'Số sản phẩm', 
              dataIndex: 'productCount', 
              key: 'productCount',
              align: 'center',
              width: 120
            },
            {
              title: 'Hành động',
              key: 'action',
              align: 'center',
              width: 200,
              render: (_, record) => (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <Button
                    onClick={() => {
                      setEditingCategory(record);
                      form.setFieldsValue({
                        categoryName: record.categoryName,
                        description: record.description
                      });
                      setIsModalOpen(true);
                    }}
                    type="primary"
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xác nhận xóa"
                    description="Bạn có chắc chắn muốn xóa danh mục này?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleDelete(record._id)}
                  >
                    <Button
                      type="primary"
                      danger
                      loading={deleteLoading[record._id]}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              ),
            },
          ]}
          dataSource={categories}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          open={isModalOpen}
          onCancel={handleCancel}
          confirmLoading={submitLoading}
          onOk={handleOk}
        >
          <Form form={form} layout="vertical">
            <Form.Item 
              label="Tên danh mục" 
              name="categoryName" 
              rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>
            <Form.Item 
              label="Mô tả" 
              name="description"
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryTable;