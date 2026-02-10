<script setup lang="ts">
import { layer } from '@layui/layer-vue'
import { columns } from './columns'
import ReminderSearchForm from './components/reminder-search.vue'
import type { ReminderSearchModel } from './components/reminder-search.vue'

defineOptions({
  name: 'reminder_reminder',
})

interface ReminderItem {
  id: string
  title: string
  type: 'TASK' | 'MEETING' | 'BILL'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  channelNames: string[]
  dueTime: string
  state: 'TODO' | 'SNOOZED' | 'DONE'
}

const searchForm = ref()
const selectedKeys = ref([])
const defaultToolbar = ref<boolean | string[]>(['filter'])
const dataSource = ref<ReminderItem[]>([
  {
    id: 'R001',
    title: '合同续签提醒 - 华北分公司',
    type: 'TASK',
    priority: 'HIGH',
    channelNames: ['站内消息', '短信'],
    dueTime: '2026-02-12 09:00:00',
    state: 'TODO',
  },
  {
    id: 'R002',
    title: '产品评审会提醒',
    type: 'MEETING',
    priority: 'MEDIUM',
    channelNames: ['站内消息', '邮件'],
    dueTime: '2026-02-12 14:30:00',
    state: 'TODO',
  },
  {
    id: 'R003',
    title: '云主机账单支付提醒',
    type: 'BILL',
    priority: 'HIGH',
    channelNames: ['短信'],
    dueTime: '2026-02-13 10:00:00',
    state: 'SNOOZED',
  },
  {
    id: 'R004',
    title: '巡检周报提交提醒',
    type: 'TASK',
    priority: 'LOW',
    channelNames: ['站内消息'],
    dueTime: '2026-02-14 17:00:00',
    state: 'DONE',
  },
])

const filteredData = computed(() => {
  const formModel = (searchForm.value?.formModel || {}) as ReminderSearchModel
  return dataSource.value.filter((item) => {
    const matchTitle = !formModel.title || item.title.includes(formModel.title)
    const matchType = !formModel.type || item.type === formModel.type
    const matchState = !formModel.state || item.state === formModel.state
    const matchPriority = !formModel.priority || item.priority === formModel.priority
    return matchTitle && matchType && matchState && matchPriority
  })
})

function handleSearch() {
  selectedKeys.value = []
}

function doneReminder(row: ReminderItem) {
  row.state = 'DONE'
  layer.msg('已标记为完成', { icon: 1 })
}

function snoozeReminder(row: ReminderItem) {
  row.state = 'SNOOZED'
  layer.msg('已稍后提醒 30 分钟', { icon: 1 })
}
</script>

<template>
  <lay-container fluid="true" class="z-container">
    <lay-card>
      <ReminderSearchForm ref="searchForm" @on-search="handleSearch" />
    </lay-card>

    <div class="z-table-box">
      <lay-table
        id="id"
        v-model:selected-keys="selectedKeys"
        :columns="columns"
        :data-source="filteredData"
        :default-toolbar="defaultToolbar"
        :resize="true"
        :height="'100%'"
      >
        <template #type="{ row }">
          <lay-tag v-if="row.type === 'TASK'" variant="light">任务</lay-tag>
          <lay-tag v-else-if="row.type === 'MEETING'" type="normal" variant="light">会议</lay-tag>
          <lay-tag v-else type="warm" variant="light">账单</lay-tag>
        </template>

        <template #priority="{ row }">
          <lay-tag v-if="row.priority === 'HIGH'" type="danger" variant="light">高</lay-tag>
          <lay-tag v-else-if="row.priority === 'MEDIUM'" type="warm" variant="light">中</lay-tag>
          <lay-tag v-else variant="light">低</lay-tag>
        </template>

        <template #channelNames="{ row }">
          <lay-space>
            <lay-tag v-for="item in row.channelNames" :key="item" variant="light">
              {{ item }}
            </lay-tag>
          </lay-space>
        </template>

        <template #state="{ row }">
          <lay-tag v-if="row.state === 'TODO'" type="danger" variant="light">待处理</lay-tag>
          <lay-tag v-else-if="row.state === 'SNOOZED'" type="warm" variant="light">已稍后提醒</lay-tag>
          <lay-tag v-else type="normal" variant="light">已完成</lay-tag>
        </template>

        <template #operator="{ row }">
          <lay-space>
            <lay-button size="xs" @click="snoozeReminder(row)">稍后提醒</lay-button>
            <lay-button size="xs" type="primary" @click="doneReminder(row)">完成</lay-button>
          </lay-space>
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
