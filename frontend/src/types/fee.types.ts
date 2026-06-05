export interface Fee {
  id: number;
  studentId: number;
  studentName: string;
  totalFee: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
}
export interface FeePaymentRequest {
  studentId: number;
  totalFee: number;
  amountPaid: number;
  dueDate: string;
}
