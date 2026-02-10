<script setup lang="ts">
import { columns } from './columns'
import HistorySearchForm from './components/history-search.vue'
import type { ReminderHistorySearchModel } from './components/history-search.vue'

defineOptions({
  name: 'reminder_history',
})

interface ReminderHistoryItem {
  id: string
  title: string
  channel: string
  receiver: string
  sentTime: string
  state: 'SUCCESS' | 'FAIL'
  message: string
}

const searchForm = ref()
const selectedKeys = ref([])
const dataSource = ref<ReminderHistoryItem[]>([
  {
    id: 'H001',
    title: '合同续签提醒 - 华北分公司',
    channel: '短信',
    receiver: 'zetaAdmin',
    sentTime: '2026-02-12 09:00:02',
    state: 'SUCCESS',
    message: '发送成功，回执ID: sms_98231',
  },
  {
    id: 'H002',
    title: '产品评审会提醒',
    channel: '邮件',
    receiver: 'product-team@mintcloud.com',
    sentTime: '2026-02-12 14:29:30',
    state: 'SUCCESS',
    message: '邮件已投递',
  },
  {
    id: 'H003',
    title: '云主机账单支付提醒',
    channel: '短信',
    receiver: 'ops_leader',
    sentTime: '2026-02-13 10:00:04',
    state: 'FAIL',
    message: '短信网关超时，已进入重试队列',
  },
  {
    id: 'H004',
    title: '巡检周报提交提醒',
    channel: '站内消息',
    receiver: 'dev_team',
    sentTime: '2026-02-14 17:00:00',
    state: 'SUCCESS',
    message: '消息已读',
  },
])

const filteredData = computed(() => {
  const formModel = (searchForm.value?.formModel || {}) as ReminderHistorySearchModel
  return dataSource.value.filter((item) => {
    const matchChannel = !formModel.channel || item.channel === formModel.channel
    const matchState = !formModel.state || item.state === formModel.state
    const matchReceiver = !formModel.receiver || item.receiver.includes(formModel.receiver)
    return matchChannel && matchState && matchReceiver
  })
})

function handleSearch() {
  selectedKeys.value = []
}
</script>

<template>
  <lay-container fluid="true" class="z-container">
    <lay-card>
      <HistorySearchForm ref="searchForm" @on-search="handleSearch" />
    </lay-card>

    <div class="z-table-box">
      <lay-table
        id="id"
        v-model:selected-keys="selectedKeys"
        :columns="columns"
        :data-source="filteredData"
        :resize="true"
        :height="'100%'"
      >
        <template #state="{ row }">
          <lay-tag v-if="row.state === 'SUCCESS'" type="normal" variant="light">
            成功
          </lay-tag>
          <lay-tag v-else type="danger" variant="light">
            失败
          </lay-tag>
        </template>
      </lay-table>
    </div>
  </lay-container>
</template>

<style scoped>
.z-table-box {
  height: 720px;
}
</style>
