import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feeApi } from '../api/feeApi';
import { studentApi } from '../api/studentApi';
import type { Fee } from '../types/fee.types';
import type { Student } from '../types/student.types';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiDollarSign, FiEdit2, FiPlus, FiX } from 'react-icons/fi';

const schema = yup.object().shape({
  studentId: yup.number().typeError('Please select a student').required('Student selection is required'),
  totalFee: yup.number().typeError('Total Fee must be a number').min(0, 'Minimum 0').required('Total Fee is required'),
  amountPaid: yup.number().typeError('Amount Paid must be a number').min(0, 'Minimum 0').required('Amount Paid is required'),
  dueDate: yup.string().required('Due Date is required'),
});

type FormData = yup.InferType<typeof schema>;

const FeesPage: React.FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Administrative list (for student selection dropdown)
  const [students, setStudents] = useState<Student[]>([]);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const loadFeeRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user?.role === 'ROLE_STUDENT' && user.studentId) {
        const response = await feeApi.getFeeByStudentId(user.studentId);
        if (response.success && response.data) {
          setFees([response.data]);
        } else {
          setFees([]);
        }
      } else if (isAdmin) {
        // Load all fees for Admin
        const response = await feeApi.getFees('');
        if (response.success) {
          setFees(response.data);
        }
        
        // Pre-load student list for dropdown selector
        const studentsRes = await studentApi.getStudents();
        if (studentsRes.success) setStudents(studentsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching fee records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeRecords();
  }, [user]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feeApi.getFees(query);
      if (response.success) {
        setFees(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingFee(null);
    reset({
      studentId: undefined,
      totalFee: 0,
      amountPaid: 0,
      dueDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (fee: Fee) => {
    setEditingFee(fee);
    setValue('studentId', fee.studentId);
    setValue('totalFee', fee.totalFee);
    setValue('amountPaid', fee.amountPaid);
    setValue('dueDate', fee.dueDate);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setApiLoading(true);
    try {
      const response = await feeApi.saveFee({
        studentId: data.studentId,
        totalFee: data.totalFee,
        amountPaid: data.amountPaid,
        dueDate: data.dueDate,
      });

      if (response.success) {
        setIsModalOpen(false);
        loadFeeRecords();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error saving fee record.');
    } finally {
      setApiLoading(false);
    }
  };

  const columns: Column<Fee>[] = [
    {
      header: 'Student Name',
      accessor: (fee) => <span style={{ fontWeight: 600, color: 'white' }}>{fee.studentName}</span>,
    },
    {
      header: 'Total Fee Assessment',
      accessor: (fee) => <span>${fee.totalFee.toLocaleString()}</span>,
    },
    {
      header: 'Amount Paid',
      accessor: (fee) => <span style={{ color: '#10b981', fontWeight: 600 }}>${fee.amountPaid.toLocaleString()}</span>,
    },
    {
      header: 'Balance Due',
      accessor: (fee) => (
        <span style={{ 
          color: fee.balanceDue > 0 ? 'var(--danger)' : 'var(--success)', 
          fontWeight: 700 
        }}>
          ${fee.balanceDue.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Payment Status',
      accessor: (fee) => (
        <span className={`pill ${fee.balanceDue <= 0 ? 'pill-success' : 'pill-danger'}`}>
          {fee.balanceDue <= 0 ? 'Fully Paid' : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessor: (fee) => <span>{fee.dueDate}</span>,
    },
  ];

  if (isAdmin) {
    columns.push({
      header: 'Actions',
      accessor: (fee) => (
        <button 
          onClick={() => openEditModal(fee)} 
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px' }}
        >
          <FiEdit2 /> Edit
        </button>
      ),
    });
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>Financial Accounts</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {isAdmin 
              ? 'Oversee tuition assessments, recorded payments, and outstanding college balances.'
              : 'Review your semester billing summary and payment transactions.'
            }
          </p>
        </div>
        
        {isAdmin && (
          <button onClick={openCreateModal} className="btn btn-primary">
            <FiPlus /> Record Payment
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search Bar for Admin */}
      {isAdmin && <SearchBar placeholder="Search student finances by name or ID..." onSearch={handleSearch} />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '60px 0', color: 'var(--primary)' }}>
          <h3>Fetching Billing Details...</h3>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={fees} 
          emptyMessage={isAdmin ? "No financial matches found." : "No billing records found."}
        />
      )}

      {/* RECORD PAYMENT MODAL OVERLAY */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 4, 10, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            animation: 'fadeIn 0.3s ease-out',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 25px rgba(139, 92, 246, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
                {editingFee ? 'Adjust Billing Record' : 'Record Student Payment'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Student Dropdown */}
              <div className="form-group">
                <label>Select Student</label>
                <select 
                  className={errors.studentId ? 'input-error' : ''} 
                  disabled={!!editingFee}
                  {...register('studentId')}
                >
                  <option value="">Choose Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (CMS-{s.id.toString().padStart(4, '0')})</option>
                  ))}
                </select>
                {errors.studentId && <span className="input-error-msg">{errors.studentId.message}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Total Fee */}
                <div className="form-group">
                  <label>Total Tuition ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    className={errors.totalFee ? 'input-error' : ''}
                    {...register('totalFee')}
                  />
                  {errors.totalFee && <span className="input-error-msg">{errors.totalFee.message}</span>}
                </div>

                {/* Amount Paid */}
                <div className="form-group">
                  <label>Amount Paid ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    className={errors.amountPaid ? 'input-error' : ''}
                    {...register('amountPaid')}
                  />
                  {errors.amountPaid && <span className="input-error-msg">{errors.amountPaid.message}</span>}
                </div>
              </div>

              {/* Due Date */}
              <div className="form-group">
                <label>Payment Due Date</label>
                <input
                  type="date"
                  className={errors.dueDate ? 'input-error' : ''}
                  {...register('dueDate')}
                />
                {errors.dueDate && <span className="input-error-msg">{errors.dueDate.message}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={apiLoading}
                >
                  {apiLoading ? 'Saving...' : 'Save Statement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesPage;
