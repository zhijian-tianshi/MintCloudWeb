<script setup lang="ts">
import * as echarts from 'echarts'
import { historyColumns } from './columns'
import type {
  TelemetryHistoryItem,
  TelemetryQueryModel,
  TelemetryRealtimeItem,
  TelemetrySummaryData,
} from '~/api/iot/telemetry'
import {
  pageTelemetryHistoryApi,
  queryTelemetryDevicesApi,
  realtimeTelemetryApi,
  summaryTelemetryHistoryApi,
  trendTelemetryHistoryApi,
} from '~/api/iot/telemetry'
import type { PageParam } from '~/types/global'

defineOptions({
  name: 'iot_telemetry',
})

const { loading, setLoading } = useLoading(true)
const trendLoading = ref(false)
const realtimeLoading = ref(false)
const summaryLoading = ref(false)

const chartRef = ref()
let trendChart: echarts.ECharts | undefined

const searchFormRef = ref()
const formModel = reactive({
  deviceId: '',
  timeRange: [] as string[],
})

const page = ref({
  total: 0,
  limit: 10,
  current: 1,
  layout: ['count', 'prev', 'page', 'next', 'limits', 'refresh', 'skip'],
})

const dataSource = ref<TelemetryHistoryItem[]>([])
const devices = ref<string[]>([])
const realtimeList = ref<TelemetryRealtimeItem[]>([])
const summary = ref<Partial<TelemetrySummaryData>>({})

const metricOptions = [
  { key: 'tempAvg', label: '温度均值' },
  { key: 'humidityAvg', label: '湿度均值' },
  { key: 'pm25Avg', label: 'PM2.5均值' },
  { key: 'co2Avg', label: 'CO2均值' },
  { key: 'aqiAvg', label: 'AQI均值' },
  { key: 'motionCount', label: '人体次数' },
]

const summaryCards = computed(() => [
  { title: '窗口数', value: summary.value.windowCount, suffix: '个', icon: 'layui-icon-template-1', color: '#62a5ff' },
  { title: '总采样数', value: summary.value.sampleCountTotal, suffix: '条', icon: 'layui-icon-chart-screen', color: '#5ec9a5' },
  { title: '温度均值', value: formatNumber(summary.value.tempAvg), suffix: '℃', icon: 'layui-icon-fire', color: '#ff9f7f' },
  { title: '湿度均值', value: formatNumber(summary.value.humidityAvg), suffix: '%', icon: 'layui-icon-water', color: '#7fa8ff' },
  { title: 'CO2均值', value: formatNumber(summary.value.co2Avg), suffix: 'ppm', icon: 'layui-icon-dialogue', color: '#8f83ff' },
  { title: '人体触发', value: summary.value.motionCountTotal, suffix: '次', icon: 'layui-icon-user', color: '#ff7bc1' },
])

const searchModel = computed<TelemetryQueryModel>(() => {
  const [startTime, endTime] = formModel.timeRange || []
  return {
    deviceId: formModel.deviceId || undefined,
    startTime: startTime || undefined,
    endTime: endTime || undefined,
  }
})

function formatNumber(val?: number, digits = 2) {
  if (val === undefined || val === null || Number.isNaN(Number(val))) return '--'
  return Number(val).toFixed(digits)
}

function getPageParam(pageNo = 1, limit = page.value.limit): PageParam<TelemetryQueryModel> {
  return {
    page: pageNo,
    limit,
    sort: 'windowStart',
    order: 'desc',
    model: searchModel.value,
  }
}

async function fetchDeviceOptions() {
  const { success, data } = await queryTelemetryDevicesApi()
  if (success) {
    devices.value = data || []
    if (!formModel.deviceId && devices.value.length) formModel.deviceId = devices.value[0]
  }
}

async function fetchHistoryTable(param = getPageParam()) {
  setLoading(true)
  try {
    const { success, data } = await pageTelemetryHistoryApi(param)
    if (!success) return
    dataSource.value = data?.list || []
    page.value.total = Number(data?.count || 0)
    page.value.current = param.page || 1
    page.value.limit = param.limit || 10
  } finally {
    setLoading(false)
  }
}

async function fetchRealtime() {
  realtimeLoading.value = true
  try {
    const { success, data } = await realtimeTelemetryApi(formModel.deviceId || undefined)
    if (!success) return
    realtimeList.value = data || []
  } finally {
    realtimeLoading.value = false
  }
}

async function fetchSummary() {
  summaryLoading.value = true
  try {
    const { success, data } = await summaryTelemetryHistoryApi(searchModel.value)
    if (!success) return
    summary.value = data || {}
  } finally {
    summaryLoading.value = false
  }
}

function ensureChart() {
  if (!chartRef.value) return
  if (!trendChart) {
    trendChart = echarts.init(chartRef.value)
    window.addEventListener('resize', () => trendChart?.resize())
  }
}

async function fetchTrend() {
  trendLoading.value = true
  try {
    if (!formModel.deviceId) {
      ensureChart()
      trendChart?.clear()
      return
    }
    const { success, data } = await trendTelemetryHistoryApi({
      ...searchModel.value,
      deviceId: formModel.deviceId,
      metrics: metricOptions.map(item => item.key),
    })
    if (!success) return
    renderTrend(data?.points || [])
  } finally {
    trendLoading.value = false
  }
}

function renderTrend(points: any[]) {
  ensureChart()
  const xAxis = points.map(item => item.windowStart?.slice(5, 16) || '--')
  const series = metricOptions.map((metric) => {
    return {
      name: metric.label,
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: points.map(item => item[metric.key]),
    }
  })
  trendChart?.setOption({
    color: ['#62a5ff', '#5ec9a5', '#ff9f7f', '#8f83ff', '#ff7bc1', '#f6bd16'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { left: 40, right: 24, top: 50, bottom: 30 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis,
      axisLabel: { color: '#6b7280' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f2f3f5' } },
    },
    series,
  })
}

async function fetchAll(pageNo = 1, limit = page.value.limit) {
  await Promise.all([
    fetchHistoryTable(getPageParam(pageNo, limit)),
    fetchRealtime(),
    fetchSummary(),
    fetchTrend(),
  ])
}

function onSearch() {
  fetchAll(1, page.value.limit)
}

function onReset() {
  searchFormRef.value?.reset()
  formModel.deviceId = devices.value[0] || ''
  formModel.timeRange = []
  fetchAll(1, page.value.limit)
}

function onPageChange(data: any) {
  fetchHistoryTable(getPageParam(data.current, data.limit))
}

onMounted(async () => {
  await fetchDeviceOptions()
  await fetchAll()
})

onBeforeUnmount(() => {
  trendChart?.dispose()
})
</script>

<template>
  <lay-container fluid="true" class="z-container telemetry-page">
    <lay-card class="cute-search-card">
      <div class="title-row">
        <div class="title-main">
          <span class="title-icon">🌥️</span>
          <span>IoT 遥测中心</span>
        </div>
        <lay-tag type="primary" variant="light">
          每10分钟窗口聚合
        </lay-tag>
      </div>
      <lay-form ref="searchFormRef" :model="formModel" class="z-search-layout">
        <lay-row space="8">
          <lay-col :md="8" :sm="12" :xs="24">
            <lay-form-item label="设备">
              <lay-select v-model="formModel.deviceId" placeholder="请选择设备" style="width: 100%" allow-clear>
                <lay-select-option v-for="device in devices" :key="device" :value="device" :label="device" />
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="10" :sm="12" :xs="24">
            <lay-form-item label="时间范围">
              <lay-date-picker
                v-model="formModel.timeRange"
                range
                type="datetime"
                :placeholder="['开始时间', '结束时间']"
                style="width: 100%"
              />
            </lay-form-item>
          </lay-col>
          <lay-col :md="6" :sm="24" :xs="24" class="search-actions">
            <lay-space>
              <lay-button type="primary" @click="onSearch">
                <lay-icon type="layui-icon-search" /> 查询
              </lay-button>
              <lay-button @click="onReset">
                <lay-icon type="layui-icon-refresh-three" /> 重置
              </lay-button>
            </lay-space>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>

    <lay-row :space="10" class="summary-row">
      <lay-col v-for="item in summaryCards" :key="item.title" :md="4" :sm="8" :xs="12">
        <lay-card class="cute-metric-card" :loading="summaryLoading">
          <div class="metric-icon" :style="{ backgroundColor: item.color }">
            <lay-icon :type="item.icon" />
          </div>
          <div class="metric-title">
            {{ item.title }}
          </div>
          <div class="metric-value">
            {{ item.value }}<span>{{ item.suffix }}</span>
          </div>
        </lay-card>
      </lay-col>
    </lay-row>

    <lay-row :space="10">
      <lay-col :md="10" :sm="24" :xs="24">
        <lay-card title="实时窗口（内存聚合中）" :loading="realtimeLoading">
          <div class="realtime-list">
            <div v-if="!realtimeList.length" class="empty-tip">
              暂无实时数据，稍后会自动有新窗口。
            </div>
            <div v-for="item in realtimeList" :key="`${item.deviceId}-${item.windowStart}`" class="realtime-item">
              <div class="item-header">
                <span class="device">{{ item.deviceId }}</span>
                <lay-tag :type="item.motionAny ? 'danger' : 'normal'" variant="light">
                  {{ item.motionAny ? '有人体活动' : '无人体活动' }}
                </lay-tag>
              </div>
              <div class="item-time">
                {{ item.windowStart }} ~ {{ item.windowEnd }}
              </div>
              <div class="item-grid">
                <span>🌡️ {{ formatNumber(item.tempAvg) }}℃</span>
                <span>💧 {{ formatNumber(item.humidityAvg) }}%</span>
                <span>🌫️ {{ formatNumber(item.pm25Avg) }}</span>
                <span>🍃 {{ formatNumber(item.aqiAvg) }}</span>
                <span>🫁 {{ formatNumber(item.co2Avg) }} ppm</span>
                <span>🚶 {{ item.motionCount }} 次</span>
              </div>
            </div>
          </div>
        </lay-card>
      </lay-col>
      <lay-col :md="14" :sm="24" :xs="24">
        <lay-card title="趋势图（历史窗口）" :loading="trendLoading">
          <div ref="chartRef" class="trend-chart" />
        </lay-card>
      </lay-col>
    </lay-row>

    <div class="z-table-box">
      <lay-table
        id="id"
        :loading="loading"
        :page="page"
        :columns="historyColumns"
        :data-source="dataSource"
        :default-toolbar="['filter']"
        :auto-cols-width="true"
        :resize="true"
        height="560px"
        @change="onPageChange"
      >
        <template #motionAny="{ row }">
          <lay-tag :type="row.motionAny ? 'danger' : 'normal'" variant="light">
            {{ row.motionAny ? '是' : '否' }}
          </lay-tag>
        </template>
      </lay-table>
    </div>
  </lay-container>
</template>

<style scoped>
.telemetry-page {
  .cute-search-card {
    margin-bottom: 12px;
    border-radius: 14px;
    background: linear-gradient(135deg, #fff7fd 0%, #f7faff 100%);
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .title-main {
    font-size: 18px;
    font-weight: 600;
    color: #3f3f46;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .title-icon {
    font-size: 20px;
  }

  .search-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .summary-row {
    margin-bottom: 10px;
  }

  .cute-metric-card {
    border-radius: 14px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .metric-icon {
    width: 30px;
    height: 30px;
    margin: 0 auto 10px;
    border-radius: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .metric-title {
    font-size: 13px;
    color: #6b7280;
  }

  .metric-value {
    margin-top: 4px;
    font-size: 24px;
    color: #111827;
    font-weight: 600;
    line-height: 1.2;
  }

  .metric-value span {
    margin-left: 2px;
    font-size: 12px;
    color: #9ca3af;
    font-weight: normal;
  }

  .realtime-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 360px;
    overflow: auto;
    padding-right: 4px;
  }

  .realtime-item {
    border: 1px solid #f3e8ff;
    border-radius: 12px;
    padding: 10px 12px;
    background: #fffdff;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .device {
    font-weight: 600;
    color: #374151;
  }

  .item-time {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
    color: #4b5563;
    font-size: 12px;
  }

  .trend-chart {
    height: 360px;
    width: 100%;
  }

  .empty-tip {
    color: #9ca3af;
    text-align: center;
    line-height: 120px;
  }

  .z-table-box {
    margin-top: 10px;
  }
}
</style>
