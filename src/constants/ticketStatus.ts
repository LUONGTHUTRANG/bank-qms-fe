export const ticketStatusMapper: Record<string, string> = {
  WAITING: 'Đang chờ',
  CALLED: 'Đang gọi',
  SERVING: 'Đang phục vụ',
  DONE: 'Đã hoàn thành',
  CANCELLED: 'Đã hủy',
  SKIPPED_HOLD: 'Lỡ lượt',
  SKIPPED: 'Lỡ lượt',
  SKIPPED_EXPIRED: 'Hết hạn lỡ lượt',
  TRANSFERRED: 'Chuyển quầy'
};

export const getTicketStatusName = (status: string): string => {
  return ticketStatusMapper[status] || status;
};
