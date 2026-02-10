export const columns = [
  {
    title: '#',
    type: 'number',
    width: '50px',
    fixed: 'left',
  },
  {
    key: 'title',
    title: '提醒标题',
    minWidth: '180px',
    ellipsisTooltip: true,
  },
  {
    key: 'channel',
    title: '发送渠道',
    width: '140px',
    align: 'center',
  },
  {
    key: 'receiver',
    title: '接收人',
    minWidth: '160px',
  },
  {
    key: 'sentTime',
    title: '发送时间',
    width: '180px',
    sort: true,
    align: 'center',
  },
  {
    key: 'state',
    title: '发送结果',
    width: '120px',
    align: 'center',
    customSlot: 'state',
  },
  {
    key: 'message',
    title: '回执信息',
    minWidth: '220px',
  },
]
