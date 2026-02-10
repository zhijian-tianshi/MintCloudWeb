<script setup lang="ts">
export interface ReminderSearchModel {
  title: string
  type?: string
  state?: string
  priority?: string
}

const emit = defineEmits<{
  (e: 'onSearch', formModel: ReminderSearchModel): void
}>()

const searchFormRef = ref()
const formModel = reactive<ReminderSearchModel>({
  title: '',
  type: undefined,
  state: undefined,
  priority: undefined,
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
              <lay-form-item label="提醒标题" prop="title">
                <lay-input v-model="formModel.title" placeholder="请输入标题关键词" allow-clear />
              </lay-form-item>
            </lay-col>
            <lay-col :md="8" :sm="12" :xs="24">
              <lay-form-item label="类型" prop="type">
                <lay-select v-model="formModel.type" placeholder="请选择" allow-clear style="width: 100%">
                  <lay-select-option value="TASK" label="任务" />
                  <lay-select-option value="MEETING" label="会议" />
                  <lay-select-option value="BILL" label="账单" />
                </lay-select>
              </lay-form-item>
            </lay-col>
            <lay-col :md="8" :sm="12" :xs="24">
              <lay-form-item label="状态" prop="state">
                <lay-select v-model="formModel.state" placeholder="请选择" allow-clear style="width: 100%">
                  <lay-select-option value="TODO" label="待处理" />
                  <lay-select-option value="SNOOZED" label="已稍后提醒" />
                  <lay-select-option value="DONE" label="已完成" />
                </lay-select>
              </lay-form-item>
            </lay-col>
            <lay-col :md="8" :sm="12" :xs="24">
              <lay-form-item label="优先级" prop="priority">
                <lay-select v-model="formModel.priority" placeholder="请选择" allow-clear style="width: 100%">
                  <lay-select-option value="HIGH" label="高" />
                  <lay-select-option value="MEDIUM" label="中" />
                  <lay-select-option value="LOW" label="低" />
                </lay-select>
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

<style scoped>
:deep(.layui-form-item) {
  margin-bottom: 10px;
}
</style>
