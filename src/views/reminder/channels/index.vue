<script setup lang="ts">
import { layer } from '@layui/layer-vue'

defineOptions({
  name: 'reminder_channels',
})

interface ChannelItem {
  id: string
  code: string
  name: string
  provider: string
  templateCode: string
  retryTimes: number
  enabled: boolean
  remark: string
}

const selectedKeys = ref([])
const defaultToolbar = ref<boolean | string[]>(['filter'])
const dataSource = ref<ChannelItem[]>([
  {
    id: 'C001',
    code: 'SITE_MESSAGE',
    name: '站内消息',
    provider: 'MintCloud',
    templateCode: 'TPL_REMINDER_SITE',
    retryTimes: 0,
    enabled: true,
    remark: '默认渠道，实时推送',
  },
  {
    id: 'C002',
    code: 'SMS',
    name: '短信',
    provider: '阿里云短信',
    templateCode: 'SMS_101001',
    retryTimes: 2,
    enabled: true,
    remark: '紧急通知优先',
  },
  {
    id: 'C003',
    code: 'EMAIL',
    name: '邮件',
    provider: '企业邮箱',
    templateCode: 'MAIL_REMINDER_COMMON',
    retryTimes: 1,
    enabled: false,
    remark: '营销类提醒关闭',
  },
])

const columns = [
  { title: '#', type: 'number', width: '50px', fixed: 'left' },
  { key: 'code', title: '渠道编码', width: '180px', align: 'center' },
  { key: 'name', title: '渠道名称', width: '140px', align: 'center' },
  { key: 'provider', title: '服务商', minWidth: '180px' },
  { key: 'templateCode', title: '模板编码', minWidth: '180px' },
  { key: 'retryTimes', title: '重试次数', width: '100px', align: 'center' },
  { key: 'enabled', title: '启用状态', width: '120px', align: 'center', customSlot: 'enabled' },
  { key: 'remark', title: '备注', minWidth: '200px' },
  { key: 'operator', title: '操作', width: '140px', align: 'center', fixed: 'right', customSlot: 'operator' },
]

function toggleChannel(row: ChannelItem, val: boolean | string | number) {
  row.enabled = !!val
  layer.msg(`已${row.enabled ? '启用' : '停用'}渠道：${row.name}`, { icon: 1 })
}
</script>

<template>
  <lay-container fluid="true" class="z-container">
    <lay-card>
      <div class="channel-tip">
        用于管理提醒发送渠道（站内消息/短信/邮件等），可按业务需要启停渠道并配置重试策略。
      </div>
    </lay-card>

    <div class="z-table-box">
      <lay-table
        id="id"
        v-model:selected-keys="selectedKeys"
        :columns="columns"
        :data-source="dataSource"
        :default-toolbar="defaultToolbar"
        :resize="true"
        :height="'100%'"
      >
        <template #enabled="{ row }">
          <lay-switch
            :model-value="row.enabled"
            ons-text="启用"
            uns-text="停用"
            @change="(val: boolean | string | number) => toggleChannel(row, val)"
          />
        </template>

        <template #operator="{ row }">
          <lay-button size="xs" @click="layer.msg(`模板：${row.templateCode}`, { icon: 1 })">
            查看模板
          </lay-button>
        </template>
      </lay-table>
    </div>
  </lay-container>
</template>

<style scoped>
.z-table-box {
  height: 720px;
}

.channel-tip {
  padding: 10px 12px;
  background: var(--global-primary-light-color);
  border-radius: 6px;
  color: var(--global-font-color);
}
</style>
