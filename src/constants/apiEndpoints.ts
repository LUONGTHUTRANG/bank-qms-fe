export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    PROFILE: '/v1/auth/me',
    COUNTER_SESSIONS: {
      START: '/v1/auth/counter-sessions/start',
      ACTIVE: '/v1/auth/counter-sessions/active/me'
    }
  },
  COUNTER: {
    // Thêm các endpoint liên quan đến quầy ở đây
  },
  TICKET: {
    CREATE: '/v1/ticket/tickets/create',
  },
  MANAGEMENT: {
    REQUEST_GROUPS: '/v1/management/request-groups',
    CHECK_SEGMENT: '/v1/management/priority-customers/check-segment',
    SERVICE_COUNTERS_BY_BRANCH: '/v1/management/service-counters/by-branch',
  },
};