<script setup lang="ts">
export interface ReminderHistorySearchModel {
  channel?: string
  state?: string
  receiver: string
}

const emit = defineEmits<{
  (e: 'onSearch', formModel: ReminderHistorySearchModel): void
}>()

const searchFormRef = ref()
const formModel = reactive<ReminderHistorySearchModel>({
  channel: undefined,
  state: undefined,
  receiver: '',
})
defineExpose({ formModel })

function search() {
  emit('onSearch', formModel)
}

function reset() {
  searchFormRef.value?.reset()
}
</script>

<template>
  <div class="z-search-layout">
    <lay-row space="8">
      <lay-col :md="22" :sm="20" :xs="24">
        <lay-form ref="searchFormRef" :model="formModel">
          <lay-row>
            <lay-col :md="8" :sm="12" :xs="24">
              <lay-form-item label="发送渠道" prop="channel">
                <lay-select v-model="formModel.channel" placeholder="请选择" allow-clear style="width: 100%">
                  <lay-select-option value="站内消息" label="站内消息" />
                  <lay-select-option value="短信" label="短信" />
                  <lay-select-option value="邮件" label="邮件" />
                </lay-select>
              </lay-form-item>
            </lay-col>
            <lay-col :md="8" :sm="12" :xs="24">
              <lay-form-item label="发送结果" prop="state">
                <lay-select v-model="formModel.state" placeholder="请选择" allow-clear style="width: 100%">
                  <lay-select-option value="SUCCESS" label="成功" />
                  <lay-select-option value="FAIL" label="失败" />
                </lay-select>
              </lay-form-item>
            </lay-col>
            <lay-col :md="8" :sm="12" :xs="24">
              <lay-form-item label="接收人" prop="receiver">
                <lay-input v-model="formModel.receiver" placeholder="请输入账号或邮箱" allow-clear />
              </lay-form-item>
            </lay-col>
          </lay-row>
        </lay-form>
      </lay-col>
      <lay-col :md="2" :sm="4" :xs="24" class="z-text-center">
        <lay-space direction="vertical" wrap>
          <lay-button type="primary" @click="search">
            <lay-icon type="layui-icon-search" /> 查询
          </lay-button>
          <lay-button @click="reset">
            <lay-icon type="layui-icon-refresh-three" /> 重置
          </lay-button>
        </lay-space>
      </lay-col>
    </lay-row>
  </div>
</template>
